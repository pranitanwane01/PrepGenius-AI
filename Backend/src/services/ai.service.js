const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callAI(prompt, schema, retries = 3) {
    try {
        console.log("🤖 Calling Groq API...");
        
        const message = await groq.messages.create({
            model: "mixtral-8x7b-32768",
            max_tokens: 2000,
            messages: [
                {
                    role: "user",
                    content: prompt + "\n\nRespond ONLY with valid JSON."
                }
            ]
        });

        console.log("✅ Groq API response received");
        return {
            text: message.content[0].text
        };

    } catch (err) {
        console.log("❌ AI ERROR:", err.message);

        if (retries > 0) {
            console.log(`🔁 Retrying... (${retries} left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return callAI(prompt, schema, retries - 1);
        }

        throw new Error("AI failed: " + err.message);
    }
}

const interviewReportSchema = z.object({
  matchScore: z.number(),
  technicalQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string(),
  })),
  behavioralQuestions: z.array(z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string(),
  })),
  skillGaps: z.array(z.object({
    skill: z.string(),
    severity: z.enum(["low", "medium", "high"]),
  })),
  preparationPlan: z.array(z.object({
    day: z.number(),
    focus: z.string(),
    tasks: z.array(z.string()),
  })),
  title: z.string(),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate a comprehensive interview report JSON for:
Resume: ${resume}
Self Description: ${selfDescription}
Job: ${jobDescription}

Return ONLY valid JSON with: matchScore (0-100), title, technicalQuestions (5-7), behavioralQuestions (3-5), skillGaps (3-5), preparationPlan (7 days).`;

  try {
    const response = await callAI(prompt, interviewReportSchema);
    const rawText = response?.text;

    if (!rawText) throw new Error("Invalid response");

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/`/g, "")
      .trim();

    return JSON.parse(cleanText);

  } catch (err) {
    console.log("❌ Error:", err.message);
    throw err;
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate ATS-friendly resume HTML from:
Resume: ${resume}
Self Description: ${selfDescription}
Job: ${jobDescription}

Return ONLY valid JSON with "html" field containing the complete HTML.`;

  try {
    const response = await callAI(prompt, z.object({ html: z.string() }));
    const rawText = response?.text;

    if (!rawText) throw new Error("Invalid response");

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/`/g, "")
      .trim();

    const jsonContent = JSON.parse(cleanText);

    if (!jsonContent.html || jsonContent.html.length < 50) {
      throw new Error("HTML too short");
    }

    return await generatePdfFromHtml(jsonContent.html);

  } catch (err) {
    console.log("⚠️ Using fallback resume");

    const fallbackHtml = `<html><head><style>body { font-family: Arial; padding: 20px; } h1 { color: #2c3e50; border-bottom: 2px solid #3498db; } h2 { margin-top: 15px; }</style></head><body><h1>Resume</h1><h2>Summary</h2><p>${selfDescription || "N/A"}</p><h2>Experience</h2><p>${resume?.slice(0, 1500) || "N/A"}</p><h2>Target Role</h2><p>${jobDescription?.slice(0, 500) || "N/A"}</p></body></html>`;

    return await generatePdfFromHtml(fallbackHtml);
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callAI(prompt, schema, retries = 3) {
    try {
        console.log("🤖 Calling Groq API with prompt...");
        
        const message = await groq.messages.create({
            model: "mixtral-8x7b-32768",
            max_tokens: 2000,
            messages: [
                {
                    role: "user",
                    content: prompt + "\n\nRespond ONLY with valid JSON, no markdown, no extra text."
                }
            ]
        });

        console.log("✅ Groq API response received");
        return {
            text: message.content[0].text
        };

    } catch (err) {
        console.log("❌ AI ERROR:", err.message);

        if (retries > 0) {
            console.log(`🔁 Retrying... (${retries} left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return callAI(prompt, schema, retries - 1);
        }

        throw new Error("AI failed after retries: " + err.message);
    }
}

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question that can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question that can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an expert interview coach and career advisor. Generate a comprehensive interview report for a candidate.

Resume Content:
${resume}

Candidate's Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Analyze the candidate's profile against the job requirements and provide:
1. A match score (0-100) with the job
2. 5-7 technical questions they might face with answers
3. 3-5 behavioral questions with answers
4. 3-5 key skill gaps and their severity
5. A 7-day preparation plan
6. The job title

Return ONLY valid JSON matching this schema exactly:
{
  "matchScore": number,
  "title": "string",
  "technicalQuestions": [{"question": "string", "intention": "string", "answer": "string"}],
  "behavioralQuestions": [{"question": "string", "intention": "string", "answer": "string"}],
  "skillGaps": [{"skill": "string", "severity": "low|medium|high"}],
  "preparationPlan": [{"day": number, "focus": "string", "tasks": ["string"]}]
}`;

  try {
    const response = await callAI(prompt, interviewReportSchema);

    const rawText = response?.text;

    if (!rawText) {
      console.log("❌ FULL AI RESPONSE:", response);
      throw new Error("Invalid AI response");
    }

    try {
      const cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/`/g, "")
        .trim();

      console.log("📄 Parsing AI response...");
      const parsedData = JSON.parse(cleanText);
      console.log("✅ Successfully generated interview report");
      return parsedData;

    } catch (err) {
      console.log("❌ PARSE ERROR:", rawText);
      throw new Error("Invalid JSON format: " + err.message);
    }
  } catch (err) {
    console.log("🔥 Generate Report Error:", err.message);
    throw err;
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `You are a professional resume writer. Generate a tailored resume in HTML format for a candidate based on:

Resume Content:
${resume}

Self Description:
${selfDescription}

Target Job:
${jobDescription}

Create professional, ATS-friendly HTML resume that:
- Highlights relevant experience for the job
- Uses proper structure and formatting
- Keeps content to 1-2 pages length equivalent
- Uses clean styling with professional colors
- Is optimized for Applicant Tracking Systems

Return ONLY valid JSON:
{
  "html": "<complete html resume here>"
}`;

  try {
    const response = await callAI(prompt, z.object({
      html: z.string()
    }));

    const rawText = response?.text;

    if (!rawText) {
      console.log("❌ FULL AI RESPONSE:", response);
      throw new Error("Invalid AI response structure");
    }

    let jsonContent;

    try {
      const cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/`/g, "")
        .trim();

      jsonContent = JSON.parse(cleanText);

    } catch (err) {
      console.log("❌ AI RESPONSE RAW:", rawText);
      throw new Error("Invalid AI response format");
    }

    if (!jsonContent.html || jsonContent.html.length < 50) {
      console.log("❌ HTML INVALID:", jsonContent.html);
      throw new Error("HTML not generated properly");
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;

  } catch (err) {
    console.log("🔥 PDF Generation Error:", err.message);
    console.log("⚠️ Using fallback resume...");

    const fallbackHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            h2 { color: #2c3e50; margin-top: 20px; margin-bottom: 10px; }
            p { line-height: 1.6; margin: 5px 0; }
            .container { max-width: 800px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Resume</h1>

            <h2>Professional Summary</h2>
            <p>${selfDescription || "Experienced professional seeking to contribute skills and expertise to the target role."}</p>

            <h2>Professional Experience</h2>
            <p>${resume?.slice(0, 1500) || "Experienced professional with a strong background in relevant technologies and methodologies."}</p>

            <h2>Target Role</h2>
            <p>${jobDescription?.slice(0, 500) || "Seeking a position that leverages technical expertise and professional experience."}</p>
          </div>
        </body>
      </html>
    `;

    const pdfBuffer = await generatePdfFromHtml(fallbackHtml);
    return pdfBuffer;
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function callAI(prompt, schema, retries = 3) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(schema),
            }
        })

        return response

    } catch (err) {

        console.log("❌ AI ERROR:", err.message)

        if (retries > 0) {
            console.log(`🔁 Retrying... (${retries} left)`)

            // wait 2 seconds
            await new Promise(resolve => setTimeout(resolve, 3000))

            return callAI(prompt, schema, retries - 1)
        }

        throw new Error("AI failed after retries")
    }
}

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

  const response = await callAI(prompt, interviewReportSchema)

//   return JSON.parse(response.text);
const rawText =
    response?.text ||
    response?.candidates?.[0]?.content?.parts?.[0]?.text

if (!rawText) {
    console.log("❌ FULL AI RESPONSE:", response)
    throw new Error("Invalid AI response")
}

try {
    const cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

    return JSON.parse(cleanText)

} catch (err) {
    console.log("❌ PARSE ERROR:", rawText)
    throw new Error("Invalid JSON format")
}
}

// async function generatePdfFromHtml(htmlContent) {
//  const browser = await puppeteer.launch({
//   args: [
//     ...chromium.args,
//     "--no-sandbox",
//     "--disable-setuid-sandbox"
//   ],
//   executablePath: await chromium.executablePath(),
//   headless: true,
//   defaultViewport: chromium.defaultViewport,
// });

//   const page = await browser.newPage();

//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     margin: {
//       top: "20mm",
//       bottom: "20mm",
//       left: "15mm",
//       right: "15mm",
//     },
//   });

//   await browser.close();

//   return pdfBuffer;
// }


async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  try {
    const response = await callAI(prompt, resumePdfSchema);

    
    const rawText =
    response?.text ||
    response?.candidates?.[0]?.content?.parts?.[0]?.text

if (!rawText) {
    console.log("❌ FULL AI RESPONSE:", response)
    throw new Error("Invalid AI response structure")
}

let jsonContent

try {
    const cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

    jsonContent = JSON.parse(cleanText)

} catch (err) {
    console.log("❌ AI RESPONSE RAW:", rawText)
    throw new Error("Invalid AI response format")
}
   
    if (!jsonContent.html || jsonContent.html.length < 50) {
      console.log("❌ HTML INVALID:", jsonContent.html);
      throw new Error("HTML not generated properly");
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
  } catch (err) {
  console.log("🔥 AI ERROR:", err.message);
  console.log("⚠️ Using fallback resume...");

  const fallbackHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #333; }
          h2 { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Resume</h1>

        <h2>Summary</h2>
        <p>${selfDescription || "N/A"}</p>

        <h2>Experience</h2>
        <p>${resume?.slice(0, 1500) || "N/A"}</p>

        <h2>Target Role</h2>
        <p>${jobDescription || "N/A"}</p>
      </body>
    </html>
  `;

  const pdfBuffer = await generatePdfFromHtml(fallbackHtml);

  return pdfBuffer;
}
}

module.exports = { generateInterviewReport, generateResumePdf };
