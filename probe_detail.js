import axios from 'axios';
import fs from 'fs';
import iconv from 'iconv-lite';

async function probeDetail() {
    try {
        const response = await axios.get('https://www.contestkorea.com/sub/view.php?int_gbn=1&Txt_bcode=030910001&str_no=202511210004', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            responseType: 'arraybuffer'
        });

        const html = iconv.decode(response.data, 'utf-8');
        fs.writeFileSync('temp_detail.txt', html);
        console.log('Saved Detail HTML to temp_detail.txt');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

probeDetail();
