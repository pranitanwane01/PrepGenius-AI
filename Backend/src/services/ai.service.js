const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callAI(prompt, retries = 3) {
    try {
        console.log("🤖 Calling Groq API...");
        const message = await groq.messages.create({
            model: "mixtral-8x7b-32768",
            max_tokens: 2000,
            messages: [{ role: "user", content: prompt + "\n\nRespond ONLY with valid JSON." }]
        });
        console.log("✅ Groq API response received");
        return message.content[0].text;
    } catch (err) {
        console.log("❌ AI ERROR:", err.message);
        if (retries > 0) {
            console.log(`🔁 Retrying... (${retries} left)`);
            await new Promise(r => setTimeout(r, 2000));
            return callAI(prompt, retries - 1);
        }
        throw new Error("AI failed: " + err.message);
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate JSON interview report: {"matchScore": 0-100, "title": "...", "technicalQuestions": [...], "behavioralQuestions": [...], "skillGaps": [...], "preparationPlan": [...]}\nResume: ${resume}\nSelf: ${selfDescription}\nJob: ${jobDescription}`;
  try {
    const rawText = await callAI(prompt);
    if (!rawText) throw new Error("Invalid response");
    const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").replace(/`/g, "").trim();
    const result = JSON.parse(cleanText);
    console.log("✅ Interview report generated successfully");
    return result;
  } catch (err) {
    console.log("❌ Generate Report Error:", err.message);
    throw err;
  }
}

async function generatePdfFromHtml(htmlContent) {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return pdfBuffer;
  } catch (err) {
    console.log("❌ PDF Generation Error:", err.message);
    throw err;
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate ATS-friendly resume HTML. JSON: {"html": "<html>...</html>"}\nResume: ${resume}\nSelf: ${selfDescription}\nJob: ${jobDescription}`;
  try {
    const rawText = await callAI(prompt);
    if (!rawText) throw new Error("Invalid response");
    const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").replace(/`/g, "").trim();
    const jsonContent = JSON.parse(cleanText);
    if (!jsonContent.html || jsonContent.html.length < 50) throw new Error("HTML too short");
    return await generatePdfFromHtml(jsonContent.html);
  } catch (err) {
    console.log("⚠️ Using fallback resume");
    const fallbackHtml = `<!DOCTYPE html><html><head><style>body{font-family:Arial;padding:20px}h1{color:#2c3e50;border-bottom:2px solid #3498db}h2{margin-top:20px}</style></head><body><h1>Resume</h1><h2>Summary</h2><p>${selfDescription || "Professional"}</p><h2>Experience</h2><p>${resume?.slice(0,1500) || "Experience"}</p></body></html>`;
    return await generatePdfFromHtml(fallbackHtml);
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
