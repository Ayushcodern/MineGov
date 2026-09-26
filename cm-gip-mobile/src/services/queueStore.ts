import AsyncStorage from '@react-native-async-storage/async-storage';

export const SYNC_QUEUE_KEY = '@minegov_sync_queue';

export interface QueueItem {
  id: string;
  action: string;
  payload: any;
  timestamp: string;
}

export const getQueue = async (): Promise<QueueItem[]> => {
  try {
    const queueStr = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return queueStr ? JSON.parse(queueStr) : [];
  } catch (error) {
    console.error('Error getting queue:', error);
    return [];
  }
};

export const addToQueue = async (action: string, payload: any): Promise<boolean> => {
  try {
    const queue = await getQueue();
    const newItem: QueueItem = {
      id: Date.now().toString(),
      action,
      payload,
      timestamp: new Date().toISOString(),
    };
    queue.push(newItem);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    return true;
  } catch (error) {
    console.error('Error adding to queue:', error);
    return false;
  }
};

export const removeFromQueue = async (id: string): Promise<void> => {
  try {
    const queue = await getQueue();
    const updatedQueue = queue.filter(item => item.id !== id);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
  } catch (error) {
    console.error('Error removing from queue:', error);
  }
};
