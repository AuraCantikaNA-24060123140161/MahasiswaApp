import { Platform } from "react-native";

let storage;

if (Platform.OS === "web") {
  storage = {
    set: (key, value) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    },
    getString: (key) => {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
      }
      return null;
    },
    delete: (key) => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    },
  };
} else {
  const { MMKV } = require("react-native-mmkv");
  storage = new MMKV();
}

export const saveUser = (user) => {
  storage.set("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = storage.getString("user");
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  storage.delete("user");
};
