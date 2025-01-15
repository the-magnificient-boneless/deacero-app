const redis = require("redis");

const client = redis.createClient({
  url: "redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379",
  // Estrategia de reconexión en caso de error
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Reconnecting to Redis (${retries} retries)...`);
      return Math.min(retries * 100, 3000); // Esperar entre reconexiones
    },
  },
});

// Manejo de eventos de Redis
client.on("error", (err) => console.error("Redis Client Error:", err));
client.on("connect", () => console.log("Connected to Redis server."));
client.on("ready", () => console.log("Redis client is ready."));
client.on("end", () => console.log("Redis client disconnected."));

(async () => {
  try {
    await client.connect();
    console.log("Successfully connected to Redis.");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

class RedisHelper {
  /**
   * Create or update data in Redis (SET command)
   * @param {string} key - The key under which the data is stored
   * @param {string|Object} value - The value to store (can be a string or object)
   * @param {number} [expiration] - Optional expiration time in seconds
   */
  static async set(key, value, expiration = 0) {
    try {
      const data = typeof value === "object" ? JSON.stringify(value) : value;
      if (expiration > 0) {
        await client.set(key, data, { EX: expiration }); // EX sets expiration time
      } else {
        await client.set(key, data);
      }
      console.log(`Data set in Redis under key: "${key}"`);
    } catch (err) {
      console.error(`Error setting key "${key}":`, err);
    }
  }

  /**
   * Read data from Redis (GET command)
   * @param {string} key - The key to retrieve the data for
   * @returns {string|Object|null} - The value stored in Redis, parsed as an object if possible
   */
  static async get(key) {
    try {
      const data = await client.get(key);
      if (!data) {
        console.log(`No data found for key: "${key}"`);
        return null;
      }
      try {
        return JSON.parse(data); // Try to parse as JSON
      } catch {
        return data; // Return as string if JSON parse fails
      }
    } catch (err) {
      console.error(`Error getting key "${key}":`, err);
      return null;
    }
  }

  /**
   * Delete data from Redis (DEL command)
   * @param {string} key - The key to delete
   * @returns {boolean} - Returns true if the key was deleted, false otherwise
   */
  static async delete(key) {
    try {
      const result = await client.del(key);
      if (result === 1) {
        console.log(`Successfully deleted key: "${key}"`);
        return true;
      } else {
        console.log(`Key "${key}" does not exist.`);
        return false;
      }
    } catch (err) {
      console.error(`Error deleting key "${key}":`, err);
      return false;
    }
  }

  /**
   * Update data in Redis by overwriting an existing key (alias for set)
   * @param {string} key - The key to update
   * @param {string|Object} value - The new value to store
   * @param {number} [expiration] - Optional expiration time in seconds
   */
  static async update(key, value, expiration = 0) {
    await RedisHelper.set(key, value, expiration);
  }

  /**
   * Remove all data from all Redis databases
   */
  static async flushAll() {
    try {
      await client.flushAll();
      console.log("All data removed from all Redis databases.");
    } catch (err) {
      console.error(`Error flushing all data from Redis:`, err);
    }
  }
}

module.exports = RedisHelper;
