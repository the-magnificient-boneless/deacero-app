// Template for a text response
function getTextResponse(text) {
  return {
    text: `You sent this message: '${text}'`,
  };
}

// Template for an attachment response
function getAttachmentResponse(attachmentUrl) {
  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Is this the correct image?",
            subtitle: "Choose an option.",
            image_url: attachmentUrl,
            buttons: [
              {
                type: "postback",
                title: "Yes",
                payload: "yes",
              },
              {
                type: "postback",
                title: "No",
                payload: "no",
              },
            ],
          },
        ],
      },
    },
  };
}

// Template for a postback response
function getPostbackResponse(payload) {
  if (payload === "yes") {
    return { text: "Great!" };
  } else if (payload === "no") {
    return { text: "Oops, try again!" };
  }
}

module.exports = {
  getTextResponse,
  getAttachmentResponse,
  getPostbackResponse,
};
