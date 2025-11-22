import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Firebase Config (Hardcoded from .env for script usage)
const firebaseConfig = {
    apiKey: "AIzaSyA4kjoSW3AMLpSYN-rAtY2ZiZNvGWsBrIc",
    authDomain: "meetgoing-2be36.firebaseapp.com",
    projectId: "meetgoing-2be36",
    storageBucket: "meetgoing-2be36.firebasestorage.app",
    messagingSenderId: "782823622124",
    appId: "1:782823622124:web:0aa6c4f83319885c426cc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = 'https://www.contestkorea.com/sub';
const LIST_URL = 'https://www.contestkorea.com/sub/list.php?int_gbn=1';

async function fetchPage(pageNumber) {
    try {
        console.log(`Fetching page ${pageNumber}...`);
        const response = await axios.get(`${LIST_URL}&page=${pageNumber}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            responseType: 'arraybuffer'
        });
        const html = iconv.decode(response.data, 'utf-8');
        return html;
    } catch (error) {
        console.error(`Error fetching page ${pageNumber}:`, error.message);
        return null;
    }
}

async function fetchDetail(detailUrl) {
    try {
        // console.log(`Fetching detail: ${detailUrl}`);
        const response = await axios.get(detailUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            responseType: 'arraybuffer'
        });
        const html = iconv.decode(response.data, 'utf-8');
        const $ = cheerio.load(html);

        // Extract Poster
        // Selector based on probe: .view_detail_area .img_area img
        let posterUrl = $('.view_detail_area .img_area img').attr('src');
        if (!posterUrl) {
            // Fallback: check .view_top_area .img_area img
            posterUrl = $('.view_top_area .img_area img').attr('src');
        }

        if (posterUrl && !posterUrl.startsWith('http')) {
            posterUrl = `https://www.contestkorea.com${posterUrl}`;
        }

        // Extract Full Content
        // Selector: .view_detail_area .txt
        // We might want to clean this up or just store the HTML
        const contentHtml = $('.view_detail_area .txt').html();

        // Extract Info Table
        const infoTable = {};
        $('.view_top_area .txt_area table tr').each((i, el) => {
            const key = $(el).find('th').text().trim();
            const value = $(el).find('td').text().trim();
            if (key) infoTable[key] = value;
        });

        return { posterUrl, contentHtml, infoTable };

    } catch (error) {
        console.error(`Error fetching detail ${detailUrl}:`, error.message);
        return null;
    }
}

async function scrape() {
    console.log('Starting scrape job...');
    let totalCount = 0;

    for (let page = 1; page <= 8; page++) {
        const html = await fetchPage(page);
        if (!html) continue;

        const $ = cheerio.load(html);
        const contestItems = $('.list_style_2 ul li'); // Selector based on probe

        for (const element of contestItems) {
            const $el = $(element);
            const titleLink = $el.find('.title a');
            const title = titleLink.find('.txt').text().trim();
            const linkHref = titleLink.attr('href');

            if (!title || !linkHref) continue;

            const fullLink = `https://www.contestkorea.com/sub/${linkHref}`;

            // Extract ID from link (str_no)
            const urlParams = new URLSearchParams(linkHref.split('?')[1]);
            const id = urlParams.get('str_no');

            if (!id) continue;

            // Extract other list info
            const category = titleLink.find('.category').text().trim();
            const host = $el.find('.host .icon_1').text().replace('주최 .', '').trim();
            const target = $el.find('.host .icon_2').text().replace('대상 .', '').trim();
            const dDay = $el.find('.d-day .day').text().trim();
            const condition = $el.find('.d-day .condition').text().trim();

            // Fetch Detail
            const detailData = await fetchDetail(fullLink);

            // Construct Contest Object
            const contestData = {
                id,
                title,
                category,
                host,
                target,
                dDay,
                condition,
                originalLink: fullLink,
                posterUrl: detailData?.posterUrl || '',
                contentHtml: detailData?.contentHtml || '',
                infoTable: detailData?.infoTable || {},
                scrapedAt: serverTimestamp()
            };

            // Save to Firestore
            try {
                await setDoc(doc(db, "contests", id), contestData, { merge: true });
                // console.log(`Saved contest: ${title}`);
                totalCount++;
            } catch (error) {
                console.error(`Error saving contest ${id}:`, error.message);
            }

            // Be nice to the server
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    console.log(`Scrape job finished. Processed ${totalCount} contests.`);
}

// Run immediately
scrape();

// Schedule every 1 hour (3600000 ms)
setInterval(scrape, 3600000);
