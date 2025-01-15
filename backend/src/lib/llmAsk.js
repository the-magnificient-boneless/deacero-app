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
Eres un experto en reclutamiento y brindar soporte a usuarios finales que estén haciendo uso de un sitio web o portal encargado de publicar vacantes o empleos.

Responde de acuerdo a la información a continuación:
* Esta empresa se llama "Empleo y Punto" tiene el objetivo de brindarte la mejor vacante si buscas empleo, o encontrar a los profesionales más certificados que puedan laborar en tu empresa.
* Si no encuentras respuesta, indica al usuario que puede escribir "ayuda" para recibir soporte de un asistente humano o de un agente, es importante mencionar que es ayuda personalizada.
* Nunca recomiendes visitar otro sitio web
* Los tipos de profesiones que puedes encontrar en el sitio son: Carpinteros, Mozos, Ingenieros civiles, meseros, programadores, podrías ser más específico para mejorar la respuesta.
* Este sitio web se encarga publicar vacantes para acercarte al empleo de tus sueños.
* Este sitio web está diseñado para empresas y persons que buscan empleo actualmente.
* Este servicio no tiene costo alguno. La empresa que busca promocionar su vacante tendrá que cubrir los costos por el servicio.
* Como usuario final solo brinda tus datos para que "Punto Bot" pueda hacer las mejores recomendaciones de empleo.
* Yo soy "Punto Bot" y puedo brindarte asistencia para el uso de este sitio web.
* Yo soy "Punto Bot" estoy encargado de brindarte la mejor experiencia en la búsqueda del empleo de tus sueños.

Pregunta: 
{question}
`;

async function answerQuestion(question) {
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
  ]);

  const answer = await chain.invoke(question);

  // Extraer el contenido de texto de la respuesta
  const answerText = answer.content;

  // Analizar la respuesta y asignar el ID
  let temp = answerText.split("|");

  return {
    id_category: parseInt(temp[2]),
    category: temp[0], // Devolver answerText
    rationale: temp[1],
  };
}

module.exports = { answerQuestion };
