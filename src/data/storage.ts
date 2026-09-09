import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData<T>(key: string, data: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log('Error saving data:', error);
  }
}

export async function getData<T>(key: string): Promise<T | null> {
  try {
    const data = await AsyncStorage.getItem(key);

    if (data) {
      return JSON.parse(data) as T;
    }

    return null;
  } catch (error) {
    console.log('Error getting data:', error);
    return null;
  }
}

export async function removeData(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing data:', error);
  }
}