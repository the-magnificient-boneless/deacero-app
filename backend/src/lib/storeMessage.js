const RedisHelper = require("./RedisHelper");

const storeCacheMessages = async (messageData) => {
  try {
    // Construct a key for the message, for example, using chat room or user ID
    const key = `chat:${messageData + new Date().toDateString}`; // Assuming messageData contains a chatId

    // Retrieve existing messages from Redis
    let existingMessages = await RedisHelper.get(key);

    // If no messages exist, initialize it as an empty array
    if (!existingMessages) {
      existingMessages = [];
    } else {
      existingMessages = JSON.parse(existingMessages);
    }

    // Add the new message to the messages array
    existingMessages.push({
      username: messageData.username,
      text: messageData.text,
      date: messageData.date,
    });

    // Store the updated messages array in Redis (with expiration time of 1 hour)
    await RedisHelper.set(key, JSON.stringify(existingMessages), 3600);

    console.log("Message successfully stored in Redis:", existingMessages);
  } catch (error) {
    console.error("Error while storing message:", error);
  }
};
module.exports = {
  storeCacheMessages,
};
