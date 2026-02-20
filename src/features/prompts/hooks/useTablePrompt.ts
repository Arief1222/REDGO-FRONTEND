import { useMemo, useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { promptApi } from '@/app/api/prompt';

export const useTablePrompt = () => {
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await promptApi.getAll();
      const payload = (res as any)?.data;
      const list = payload?.data ?? payload ?? [];
      setData(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e);
      toast.error(e?.response?.data?.message || 'Failed to load prompts');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filtered = useMemo(() => {
    if (!search) return data;
    const s = search.toLowerCase();
    return data.filter((d) => String(d?.topic || '').toLowerCase().includes(s));
  }, [data, search]);

  return {
    prompts: filtered,
    isLoading: loading,
    isError: !!error,
    error,
    search,
    handleSearch: (value: string) => setSearch(value),
    handleReset: () => setSearch(''),
    refetch: fetchList,
  };
};