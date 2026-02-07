const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/generate-pdf", async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: "HTML content required" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=QualifiedCV.pdf",
    });

    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("PDF service running on port " + PORT);
});
