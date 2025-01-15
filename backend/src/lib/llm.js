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

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const SYSTEM_TEMPLATE = `
Eres un experto en clasificar preguntas relacionadas con la búsqueda de empleo y el reclutamiento.

Clasifica la siguiente pregunta en una de estas categorías:
* "Empleo y Punto - Información de este sitio"
* "Infraestructura tecnológica"
* "Proceso de reclutamiento"
* "Sugerencia de empleo"
* "Servicios sobre vacantes"

Responde con el *nombre de la categoría*|*rationale* con la justificación de clasificación|*question_category_id* con el id correspondiente. Si la pregunta no se puede clasificar, responde "No se puede clasificar".

Pregunta: 
{question}
`;

async function classifyQuestion(question) {
  question = question?.trim();
  if (!question) {
    throw new Error("Question cannot be empty or null");
  }

  const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);

  const chain = RunnableSequence.from([
    { question: new RunnablePassthrough() },
    prompt,
    model,
  ]);

  const answer = await chain.invoke(question);
  const answerText = answer.content;

  if (!answerText.includes("|") || answerText.split("|").length !== 3) {
    return {
      id_category: null,
      category: "Invalid",
      rationale: "Model response did not match expected format",
    };
  }

  const [category, rationale, id] = answerText
    .split("|")
    .map((part) => part.trim());

  if (category === "No se puede clasificar") {
    return {
      id_category: null,
      category,
      rationale,
    };
  }

  return {
    id_category: parseInt(id) || null,
    category,
    rationale,
  };
}

module.exports = { classifyQuestion };
