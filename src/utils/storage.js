export const saveDB = (key, data) => localStorage.setItem(`school_pk_${key}`, JSON.stringify(data));
export const loadDB = (key) => {
  const data = localStorage.getItem(`school_pk_${key}`);
  return data ? JSON.parse(data) : null;
};