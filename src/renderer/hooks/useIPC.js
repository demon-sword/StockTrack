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
    try {
      const result = await window.electronAPI[moduleName].create(item);
      await loadData();
      return result;
    } catch (error) {
      console.error(`Error creating ${moduleName}:`, error);
      throw error;
    }
  };

  const update = async (id, item) => {
    try {
      const result = await window.electronAPI[moduleName].update(id, item);
      await loadData();
      return result;
    } catch (error) {
      console.error(`Error updating ${moduleName}:`, error);
      throw error;
    }
  };

  const remove = async (id) => {
    try {
      await window.electronAPI[moduleName].delete(id);
      await loadData();
    } catch (error) {
      console.error(`Error deleting ${moduleName}:`, error);
      throw error;
    }
  };

  return { data, loading, refresh: loadData, create, update, remove };
}