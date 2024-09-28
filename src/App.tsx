// src/App.tsx
import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { SearchResult, } from './types';
import { cjkSearch } from './service/dataService';
import './App.css';

const App: React.FC = () => {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (drugA: string, drugB: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!drugA) {
        throw new Error('请输入药物A！');
      }
      if(drugA === drugB){
        throw new Error('请输入两个不同的药物！');
      }

      const result = await cjkSearch(drugA, drugB);
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  return (
      <div className="app-container">
        <SearchBar onSearch={handleSearch} />
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {searchResult && (
            <div className="content-container">
              <Sidebar ddiInfo={searchResult} />
            </div>
        )}
      </div>
  );
};

export default App;