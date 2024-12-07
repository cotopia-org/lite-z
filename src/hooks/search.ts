import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";

type SearchType = {
  id: number;
  title: string;
  type: string;
};

const useSearch = () => {
  const [q, setQ] = useState<string>("");
  const [result, setResult] = useState<SearchType[]>([]);
  const [selected, setSelected] = useState<SearchType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    const data = await axiosInstance.get("/search?q=" + q);

    setResult(data.data.data);
    setLoading(false);
  };

  const handleRemoveSelect = (item: SearchType) => {
    setSelected(
      selected.filter((s) => {
        if (s.type === item.type) {
          return item.id !== s.id;
        } else {
          return s;
        }
      }),
    );
  };

  const handleAddSelect = (item: SearchType) => {
    setSelected([...selected, item]);
  };
  useEffect(() => {
    if (q.length >= 3) {
      handleSearch();
    } else {
      setResult([]);
    }
  }, [q]);

  return {
    q,
    setQ,
    handleSearch,
    result,
    handleRemoveSelect,
    selected,
    handleAddSelect,
    loading,
  };
};
export default useSearch;
