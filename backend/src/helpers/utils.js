export const respond = ({ receivedMessage, responseMessage }) => {
  let response;
  switch (true) {
    case receivedMessage.text: // Basic text message
      response = {
        text: responseMessage,
      };
      break;
    case receivedMessage.attachments: // Attachment message
      let attachmentUrl = receivedMessage.attachments[0].payload.url;
      response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "estas segura que son tus chichotas?",
                subtitle: "Contesta cochinita.",
                image_url: attachmentUrl,
                buttons: [
                  {
                    type: "postback",
                    title: "Si!",
                    payload: "yes",
                  },
                  {
                    type: "postback",
                    title: "No!",
                    payload: "no",
                  },
                ],
              },
            ],
          },
        },
      };
      break;
    default:
      break;
  }
};
