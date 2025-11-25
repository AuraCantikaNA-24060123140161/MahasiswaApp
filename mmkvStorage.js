import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGIN_KEY = "login";

export const saveLogin = async (user) => {
  if (!user) return;

  const data = {
    uid: user.uid,
    email: user.email,
  };

  try {
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(data));
  } catch (e) {
    console.log("Failed to save login:", e);
  }
};

export const getLogin = async () => {
  try {
    const json = await AsyncStorage.getItem(LOGIN_KEY);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.log("Failed to read login:", e);
    return null;
  }
};

export const clearLogin = async () => {
  try {
    await AsyncStorage.removeItem(LOGIN_KEY);
  } catch (e) {
    console.log("Failed to clear login:", e);
  }
};
