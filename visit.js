const puppeteer = require("puppeteer");

// Rotate different browsers/devices
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
];

// Pages you want to visit on your friend’s site
const PAGES = [
  "https://rohitpotato.xyz/",
  "https://rohitpotato.xyz/thoughts/no-more-oncall-jitters",
  "https://rohitpotato.xyz/thoughts/the-journey-of-a-packet",
  "https://rohitpotato.xyz/thoughts/you-dont-need-vercel",
  "https://rohitpotato.xyz/thoughts/the-quest-for-control"
];

// Random delay helper
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  });

  const page = await browser.newPage();

  // Pick random user agent
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  await page.setUserAgent(ua);

  // Pick random page
  const url = PAGES[Math.floor(Math.random() * PAGES.length)];
  console.log(`Visiting: ${url} with UA: ${ua}`);

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  // Stay 5–15 sec
  await new Promise(res => setTimeout(res, randomDelay(5000, 15000)));
  // Scroll randomly 1–3 times
  const scrolls = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < scrolls; i++) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await new Promise(res => setTimeout(res, randomDelay(5000, 15000)));
  }

  // 50% chance: click a random internal link
  const links = await page.$$eval("a", as => as.map(a => a.href).filter(h => h.includes("rohitpotato.xyz")));
  if (links.length > 0 && Math.random() > 0.5) {
    const next = links[Math.floor(Math.random() * links.length)];
    console.log(`Clicking: ${next}`);
    await page.goto(next, { waitUntil: "networkidle2", timeout: 60000 });
   await new Promise(res => setTimeout(res, randomDelay(5000, 15000)));
  }

  await browser.close();
})();
