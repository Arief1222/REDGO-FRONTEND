import { useMemo, useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { ragApi } from '@/app/api/rag';

export const useTableRag = () => {
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ragApi.listDocuments({ limit: 100, page: 1 });
      const payload = (res as any)?.data;
      const list = payload?.data ?? payload ?? [];
      setData(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e);
      toast.error(e?.response?.data?.message || 'Failed load RAG documents');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleDelete = useCallback(
    async (row: any) => {
      if (!row?.id) return;

      setIsDeleting(true);
      try {
        await ragApi.deleteDocument(Number(row.id));
        toast.success('Document deleted');
        await fetchList();
      } catch (e: any) {
        toast.error(e?.response?.data?.message || 'Failed delete document');
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchList, toast],
  );

  const filtered = useMemo(() => {
    if (!search) return data;
    const s = search.toLowerCase();
    return data.filter((d) => String(d?.title || '').toLowerCase().includes(s));
  }, [data, search]);

  return {
    documents: filtered,
    isLoading: loading,
    isDeleting,
    isError: !!error,
    error,
    search,
    handleSearch: (value: string) => setSearch(value),
    handleReset: () => setSearch(''),
    refetch: fetchList,
    handleDelete,
  };
};
