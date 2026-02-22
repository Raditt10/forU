import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const dir = path.join(path.dirname(__dirname), 'docs');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 }); 
    
    await page.goto('http://localhost:5173/?target=Ayang');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(dir, 'start.png') });
    
    // click start
    await page.click('.start-btn');
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(dir, 'gombalan.png') });
    
    // click yes
    await page.click('.yes-btn');
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(dir, 'success.png') });
    
    await browser.close();
    console.log("Screenshots captured successfully.");
    process.exit(0);
})();
