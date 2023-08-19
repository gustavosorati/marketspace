import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_STORAGE } from './StorageConfig';

const getAuthTokenStorage = async () => {
  const storage = await AsyncStorage.getItem(TOKEN_STORAGE);

  const { token, refresh_token } = storage ? JSON.parse(storage) : "";
	return { token, refresh_token };
};

const saveAuthTokenStorage = async (token: string, refresh_token: string) => {
  await AsyncStorage.setItem(TOKEN_STORAGE, JSON.stringify({
    token, refresh_token
  }));
};

const removeAuthTokenStorage = async () => {
  await AsyncStorage.removeItem(TOKEN_STORAGE);
};

export const TokenStorage = {
  getAuthTokenStorage,
  saveAuthTokenStorage,
  removeAuthTokenStorage
}
