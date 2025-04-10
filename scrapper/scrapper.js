const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs").promises;

const BASE_URL = "https://docs.capillarytech.com";
const DELAY_MS = 2000; 
let processedCount = 0;

const documentation = { sections: [] };

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { 
        timeout: 10000 
      });
      if (res.ok) return res.text();
      await delay(3000 * (i + 1));
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getArticleContent(url) {
  await delay(DELAY_MS);
  try {
    const page = await fetchWithRetry(url);
    const $ = cheerio.load(page);
    return $("article").text()
      .replace(/Suggest Edits|Updated.+ago/gi, "")
      .trim();
  } catch (error) {
    console.error(`Skipped ${url}`);
    return "";
  }
}

async function processNavigation($, container, sectionTitle) {
  const items = [];
  const listItems = container.find("li").toArray();
  
  for (const item of listItems) {
    processedCount++;
    if (processedCount % 10 === 0) {
      console.log(`Processed ${processedCount} items`);
    }

    const $item = $(item);
    const $link = $item.find("a").first();
    if (!$link.length) continue;

    const node = {
      title: $link.text().trim(),
      url: new URL($link.attr("href"), BASE_URL).toString(),
      content: "",
      subsections: []
    };

    if ($item.find("ul").length === 0) {
      node.content = await getArticleContent(node.url);
      console.log(`${sectionTitle} > ${node.title}`);
    }

    const $childList = $item.find("> ul").first();
    if ($childList.length) {
      node.subsections = await processNavigation(
        $, $childList, `${sectionTitle} > ${node.title}`
      );
    }

    items.push(node);
  }
  
  return items;
}

async function main() {
  try {
    console.log("Starting scrape...");
    const $ = cheerio.load(await fetchWithRetry(`${BASE_URL}/docs/introduction`));
    
    const sidebar = $("#hub-sidebar > div").first();
    const sections = sidebar.find("section").toArray();

    for (const section of sections) {
      const $section = $(section);
      const sectionTitle = $section.find("h2").text().trim();
      
      console.log(`\n Processing ${sectionTitle}...`);
      const sectionData = {
        title: sectionTitle,
        articles: await processNavigation($, $section.find("> ul").first(), sectionTitle)
      };
      
      documentation.sections.push(sectionData);
      await fs.writeFile("docs-partial.json", JSON.stringify(documentation));
    }

    await fs.writeFile("documentation.json", JSON.stringify(documentation, null, 2));
    console.log(`\n Done! Processed ${processedCount} total items`);
    
  } catch (error) {
    console.error("Critical error:", error);
    process.exit(1);
  }
}

main();