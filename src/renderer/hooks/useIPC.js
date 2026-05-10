import { useState, useEffect } from 'react';

export function useIPC(moduleName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await window.electronAPI[moduleName].getAll();
      setData(result || []);
    } catch (error) {
      console.error(`Error loading ${moduleName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const create = async (item) => {
    const result = await window.electronAPI[moduleName].create(item);
    await loadData();
    return result;
  };

  const update = async (id, item) => {
    const result = await window.electronAPI[moduleName].update(id, item);
    await loadData();
    return result;
  };

  const remove = async (id) => {
    await window.electronAPI[moduleName].delete(id);
    await loadData();
  };

  return { data, loading, refresh: loadData, create, update, remove };
}