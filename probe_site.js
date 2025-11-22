import axios from 'axios';
import fs from 'fs';
import iconv from 'iconv-lite';

async function probe() {
    try {
        const response = await axios.get('https://www.contestkorea.com/sub/list.php?int_gbn=1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            responseType: 'arraybuffer'
        });

        // Try to detect encoding or assume EUC-KR if it looks like garbage, but let's try UTF-8 first, then EUC-KR.
        // ContestKorea is likely UTF-8 or EUC-KR.
        // Let's save two versions or just try to decode as EUC-KR which is common for older KR sites.
        // Actually, let's check the content type header if possible, but for now let's just save decoded.

        const html = iconv.decode(response.data, 'utf-8');
        // If it contains "charset=euc-kr" or similar, we might need to re-decode.

        if (html.includes('charset=euc-kr') || html.includes('charset=EUC-KR')) {
            console.log('Detected EUC-KR');
            const htmlEuc = iconv.decode(response.data, 'euc-kr');
            fs.writeFileSync('temp_html.txt', htmlEuc);
        } else {
            console.log('Assuming UTF-8');
            fs.writeFileSync('temp_html.txt', html);
        }

        console.log('Saved HTML to temp_html.txt');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

probe();
