const redis = require("redis");

const client = redis.createClient({
  url: "redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@redis-server:6379",
  port: 6379,
});

// Connect the client to Redis server
client.on("error", (err) => console.log("Redis Client Error", err));

client
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection error", err));

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
      console.log(`Data set in Redis under key: ${key}`);
    } catch (err) {
      console.error(`Error setting key "${key}": ${err}`);
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
        console.log(`No data found for key: ${key}`);
        return null;
      }
      try {
        // Try to parse as JSON object, return string if it's not JSON
        return JSON.parse(data);
      } catch (err) {
        return data; // Return as string if parsing fails
      }
    } catch (err) {
      console.error(`Error getting key "${key}": ${err}`);
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
        console.log(`Successfully deleted key: ${key}`);
        return true;
      } else {
        console.log(`Key "${key}" does not exist.`);
        return false;
      }
    } catch (err) {
      console.error(`Error deleting key "${key}": ${err}`);
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
    // Use the set method to update since it overwrites existing keys
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
      console.error(`Error flushing all data from Redis: ${err}`);
    }
  }
}

module.exports = RedisHelper;
