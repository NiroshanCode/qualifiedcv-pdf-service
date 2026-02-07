const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/", (req, res) => {
  res.send("QualifiedCV PDF service running");
});

// Test endpoint
app.get("/generate-pdf", (req, res) => {
  res.send("PDF endpoint ready. Use POST.");
});

// PDF generation
app.post("/generate-pdf", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: "No HTML provided" });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

const page = await browser.newPage();

page.setDefaultNavigationTimeout(0);
page.setDefaultTimeout(0);

await page.setContent(html, {
  waitUntil: "domcontentloaded",
  timeout: 0
});

await page.waitForTimeout(800);


    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=QualifiedCV.pdf",
    });

    res.send(pdf);
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("PDF service running on port", PORT);
});
