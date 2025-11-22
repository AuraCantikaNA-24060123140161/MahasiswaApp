export const storage = new MMKV();

export const saveLogin = (user) => {
  // simpan info seperlunya aja, jangan password
  storage.set(
    "user",
    JSON.stringify({
      uid: user.uid,
      email: user.email,
    })
  );
};

export const getLogin = () => {
  const json = storage.getString("user");
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const clearLogin = () => {
  storage.delete("user");
};
