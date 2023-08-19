import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_STORAGE } from './StorageConfig';
import { User } from '../dtos/SessionsDTO';

const getAuthUserStorage = async () => {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  const { user } = storage ? JSON.parse(storage) : "";
	return user;
};

const saveAuthUserStorage = async (user: User) => {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify({
    user
  }));
};

const removeAuthUserStorage = async () => {
  await AsyncStorage.removeItem(USER_STORAGE);
};


export const UserStorage = {
  getAuthUserStorage,
  saveAuthUserStorage,
  removeAuthUserStorage
}
