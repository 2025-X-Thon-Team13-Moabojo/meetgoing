import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.contestkorea.com/sub/list.php?int_gbn=1&Txt_moduleid=030000000';
const BASE_URL = 'https://www.contestkorea.com';
const DATA_FILE = path.join(__dirname, '../src/data/contests.js');

async function fetchContestList() {
    const allContests = [];
    const maxPages = 8;

    for (let page = 1; page <= maxPages; page++) {
        try {
            console.log(`Fetching contest list page ${page}/${maxPages}...`);
            const pageUrl = `${TARGET_URL}&page=${page}`;
            const response = await axios.get(pageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const html = iconv.decode(response.data, 'utf-8');
            const $ = cheerio.load(html);

            const listItems = $('.list_style_2 > ul > li');
            console.log(`Found ${listItems.length} contests on page ${page}.`);

            for (let i = 0; i < listItems.length; i++) {
                const el = listItems[i];
                const titleEl = $(el).find('.title .txt');
                if (!titleEl.length) continue;

                const title = titleEl.text().trim();
                const link = $(el).find('.title a').attr('href');
                const fullLink = link ? (link.startsWith('http') ? link : BASE_URL + '/sub/' + link) : '#';

                // Extract ID from link (str_no)
                const urlParams = new URLSearchParams(fullLink.split('?')[1]);
                const str_no = urlParams.get('str_no');
                const id = str_no ? parseInt(str_no) : Date.now() + i + (page * 100);

                const rawCategory = $(el).find('.title .category').text().trim();
                const category = mapCategory(rawCategory);

                const host = $(el).find('.host .icon_1').text().replace('주최 .', '').trim();
                const target = $(el).find('.host .icon_2').text().replace('대상 .', '').trim();
                const period = $(el).find('.date .step-1').text().replace('접수', '').trim();
                const dday = $(el).find('.d-day .day').text().trim();
                const status = $(el).find('.d-day .condition').text().trim();

                // We need to fetch the detail page to get the image and other details
                const detailData = await fetchContestDetail(fullLink);

                allContests.push({
                    id: id,
                    title: title,
                    host: host,
                    dday: dday,
                    status: status,
                    period: period,
                    category: category,
                    target: target,
                    image: detailData.image || 'https://via.placeholder.com/400x300?text=No+Image',
                    description: detailData.description || title,
                    details: detailData.details || '상세 정보가 없습니다.',
                    views: detailData.views || 0,
                    prize: detailData.prize || '홈페이지 참조',
                    participants: 0, // Not available
                    deadline: period.split('~')[1] ? `2025년 ${period.split('~')[1].trim()}` : '별도 공지',
                    tags: [category, ...target.split(',').map(t => t.trim()).filter(t => t)],
                    originalUrl: fullLink
                });

                // Be nice to the server
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error.message);
        }
    }

    return allContests;
}

function mapCategory(rawCategory) {
    // App Categories: '요리/아이디어', '과학/IT', '문학/시나리오', '음악/예술', '영상/UCC'

    if (rawCategory.includes('요리') || rawCategory.includes('아이디어') || rawCategory.includes('창업') || rawCategory.includes('마케팅')) {
        return '요리/아이디어';
    }
    if (rawCategory.includes('과학') || rawCategory.includes('IT') || rawCategory.includes('소프트웨어') || rawCategory.includes('게임') || rawCategory.includes('학문')) {
        return '과학/IT';
    }
    if (rawCategory.includes('문학') || rawCategory.includes('시나리오') || rawCategory.includes('네이밍') || rawCategory.includes('슬로건')) {
        return '문학/시나리오';
    }
    if (rawCategory.includes('음악') || rawCategory.includes('예술') || rawCategory.includes('미술') || rawCategory.includes('디자인') || rawCategory.includes('댄스') || rawCategory.includes('사진')) {
        return '음악/예술';
    }
    if (rawCategory.includes('영상') || rawCategory.includes('UCC') || rawCategory.includes('영화') || rawCategory.includes('콘텐츠')) {
        return '영상/UCC';
    }

    // Default fallback based on common keywords if exact match fails
    if (rawCategory.includes('광고') || rawCategory.includes('기획')) return '요리/아이디어';
    if (rawCategory.includes('웹툰') || rawCategory.includes('만화')) return '음악/예술'; // Art related

    return '요리/아이디어'; // Default catch-all
}

async function fetchContestDetail(url) {
    try {
        // console.log(`Fetching details for: ${url}`);
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = iconv.decode(response.data, 'utf-8');
        const $ = cheerio.load(html);

        // Image
        let image = $('.view_top_area .img_area img').attr('src');
        if (image && !image.startsWith('http')) {
            image = BASE_URL + image;
        }

        // Views
        const viewsText = $('.view_top_area .btn_area .icon_view').text().trim();
        const views = parseInt(viewsText.replace(/,/g, '')) || 0;

        // Prize (from table)
        let prize = '';
        $('.view_top_area .txt_area table tr').each((i, row) => {
            const th = $(row).find('th').text().trim();
            if (th.includes('시상내역') || th.includes('1등상금')) {
                prize = $(row).find('td').text().trim();
            }
        });

        // Details (HTML content)
        // We want to preserve some formatting but make it clean
        let details = '';
        const detailContainer = $('.view_detail_area .txt');

        // Convert simple HTML to text/markdown-ish
        detailContainer.find('h2').each((i, el) => {
            details += `\n### [${$(el).text().trim()}]\n`;
            let next = $(el).next();
            while (next.length && next[0].tagName !== 'h2') {
                if (next[0].tagName === 'p' || next[0].tagName === 'div') {
                    details += next.text().trim() + '\n';
                }
                next = next.next();
            }
        });

        // Fallback description if details are empty
        const description = detailContainer.text().substring(0, 100).trim() + '...';

        return {
            image,
            views,
            prize,
            details: details.trim(),
            description
        };

    } catch (error) {
        console.error(`Error fetching details for ${url}:`, error.message);
        return {};
    }
}

function saveContests(contests) {
    const fileContent = `export const contests = ${JSON.stringify(contests, null, 4)};`;
    fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
    console.log(`Successfully saved ${contests.length} contests to ${DATA_FILE}`);
}

async function run() {
    console.log(`[${new Date().toLocaleString()}] Starting contest update...`);
    const contests = await fetchContestList();
    if (contests.length > 0) {
        saveContests(contests);
    } else {
        console.log('No contests found or error occurred.');
    }
    console.log(`[${new Date().toLocaleString()}] Update finished.`);
}

// Run immediately
run();

// Schedule every hour (3600000 ms)
setInterval(run, 3600000);
