import { useState, useEffect } from "react";

const MAX_RECENT_SEARCHES = 5;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const addRecentSearch = (search: string) => {
    setRecentSearches((prev) => {
      const updatedSearches = [search, ...prev.filter((s) => s !== search)].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return { recentSearches, addRecentSearch, clearRecentSearches };
}
