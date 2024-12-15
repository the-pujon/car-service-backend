import redisClient from "../config/redis.config"

export const cacheData = async (key: string, data: any, expirationTime: number) => {
    try{
        await redisClient.setEx(key, expirationTime, JSON.stringify(data));
        console.log('Data cached successfully');
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

export const deleteCachedData = async (key: string) => {
    try{
        await redisClient.del(key);
        console.log('Cached data deleted successfully');
    } catch (error) {
        console.error('Error deleting cached data:', error);
    }
}

export const clearAllCachedData = async () => {
    await redisClient.flushAll();
    console.log('All cached data cleared');
}

