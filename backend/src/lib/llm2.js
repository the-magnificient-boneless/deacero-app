const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} = require("@langchain/core/prompts");
const {
  RunnablePassthrough,
  RunnableSequence,
} = require("@langchain/core/runnables");
const { StructuredOutputParser } = require("langchain/output_parsers");

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const SYSTEM_TEMPLATE = `
You are an expert at classifying various forms of text. You can identify key themes, topics, and sentiments expressed within the text.

Respond with a JSON object containing the following information:

* **classification:** The classification you've assigned to the text.
* **rationale:** A concise explanation justifying your classification.

Take into account the following:
* Make sure to return unique answers, avoid redundant answers.
* Make sure to return an object and not an array.

Question: 
{question}
`;

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  classification: "The classification assigned to the text.",
  rationale: "A concise explanation justifying the classification.",
});

async function classifyContent(text) {
  const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);

  const chain = RunnableSequence.from([
    {
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    parser,
  ]);

  const answer = await chain.invoke(`Classify the following text:

    ${text}
    `);

  return answer;
}

// This function classifies text using the AI Platform's text-bison model
const classifyText = async (content) => {
  try {
    const result = await classifyContent(content);
    return result;
  } catch (error) {
    console.error("Error classifying text:", error);
    // Handle the error appropriately, e.g., return an error response
    return { error: "Failed to classify text." };
  }
};

module.exports = {
  classifyText,
};
