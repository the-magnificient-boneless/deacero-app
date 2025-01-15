import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";

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

export { classifyContent };
