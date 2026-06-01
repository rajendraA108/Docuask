const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.askAI = async (documentText, question) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `Answer this question based on the document below.
        
Document:
${documentText.slice(0, 50000)}

Question: ${question}

Answer clearly and concisely based only on the document.`
      }
    ],
    max_tokens: 1024
  });

  const answer = response.choices[0].message.content;
  return { answer, tokensUsed: 0 };
};


// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.askAI = async (documentText, question) => {
//   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

//   const prompt = `You are a helpful assistant that answers questions about documents.

// Here is the document content:
// <document>
// ${documentText.slice(0, 50000)}
// </document>

// User question: ${question}

// Answer clearly and concisely based only on the document content. 
// If the answer is not in the document, say so.`;

//   const result = await model.generateContent(prompt);
//   const answer = result.response.text();

//   return { answer, tokensUsed: 0 };
// };








// // const Anthropic = require('@anthropic-ai/sdk');

// // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// // /**
// //  * Sends PDF text + user question to Claude and returns an AI answer.
// //  * This is the core AI integration — the heart of the whole project.
// //  *
// //  * @param {string} documentText - Extracted text from the PDF
// //  * @param {string} question - User's question about the document
// //  * @returns {{ answer: string, tokensUsed: number }}
// //  */
// // exports.askAI = async (documentText, question) => {
// //   // Truncate document if too long (Claude has a context limit)
// //   const truncatedText = documentText.slice(0, 50000);

// //   const message = await client.messages.create({
// //     model: 'claude-sonnet-4-20250514',
// //     max_tokens: 1024,
// //     messages: [
// //       {
// //         role: 'user',
// //         content: `You are a helpful assistant that answers questions about documents.

// // Here is the document content:
// // <document>
// // ${truncatedText}
// // </document>

// // User question: ${question}

// // Answer clearly and concisely based only on the document content. If the answer isn't in the document, say so.`
// //       }
// //     ]
// //   });

// //   const answer = message.content[0].text;
// //   const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

// //   return { answer, tokensUsed };
// // };




