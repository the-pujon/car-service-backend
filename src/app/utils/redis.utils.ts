/* eslint-disable no-console */
import redisClient from "../config/redis.config"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cacheData = async (key: string, data: any, expirationTime: number) => {
    try{
        await redisClient.setEx(key, expirationTime, JSON.stringify(data));
        console.log('Cached data set successfully');
         
    } catch (error) {
        console.error('Error caching data:', error);
    }
}

export const getCachedData = async (key: string) => {
    try{
        const data = await redisClient.get(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error getting cached data:', error);
        return null;
    }
}

export const deleteCachedData = async (pattern: string) => {
    // try{
    //     await redisClient.del(key);
    //     console.log('Cached data deleted successfully');
    // } catch (error) {
    //     console.error('Error deleting cached data:', error);
    // }
    try {
        // console.log(`Looking for keys matching: ${pattern}`);
        const keys = await redisClient.keys(pattern);
        // console.log('Keys found:', keys);
        if (keys.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   await redisClient.del(...keys as any);
        keys.forEach(async (key) => {
            await redisClient.del(key);
          });
          console.log('Cached data deleted successfully');
        }
        return true;
      } catch (error) {
        console.error('Redis delete error:', error);
        return false;
      }
}

export const clearAllCachedData = async () => {
    await redisClient.flushAll();
}

