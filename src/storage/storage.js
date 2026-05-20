
export function createStorage(namespace) {
  function getRoot() {
    const data = localStorage.getItem(namespace);
    if (!data) return {};

    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn(`[storage:${namespace}] parse error`, e);
      return {};
    }
  }

  function setRoot(root) {
    localStorage.setItem(namespace, JSON.stringify(root));
  }

  return {
    getItem(key) {
      const root = getRoot();
      return root[key] ?? null;
    },

    setItem(key, value) {
      const root = getRoot();
      root[key] = value;
      setRoot(root);
    },

    removeItem(key) {
      const root = getRoot();
      delete root[key];
      setRoot(root);
    },

    clear() {
      localStorage.removeItem(namespace);
    },

    getAll() {
      return getRoot();
    },

    setAll(obj) {
      setRoot(obj);
    },
    
  };
} 