// src/App.tsx
import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { SearchResult, BatchSearchResult } from './types';
import { cjkSearch, batchCjkSearch } from './service/dataService';
import './App.css';

const App: React.FC = () => {
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [batchSearchResult, setBatchSearchResult] = useState<BatchSearchResult | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(100); // 假设总页数为100
    const [inputPage, setInputPage] = useState<string>('');

    const handleSearch = async (drugA: string, drugB: string) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!drugA) {
                throw new Error('请输入药物A！');
            }
            if (drugA === drugB) {
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

    const searchAlreadyExistDDI = async (page: number, limit: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await batchCjkSearch(page - 1, limit);
            if (!Array.isArray(result)) {
                throw new Error('Unexpected data format from the backend. Expected an array.');
            }
            const items = result.map(item => ({
                drugAName: item['drugAName'],
                drugBName: item['drugBName'],
                ddiDescription: item['ddiDescription']
            }));

            setBatchSearchResult({ items });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setBatchSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            searchAlreadyExistDDI(newPage, pageSize);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPage(e.target.value);
    };

    const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pageNumber = parseInt(inputPage);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            handlePageChange(pageNumber);
        }
        setInputPage('');
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const range = 2;

        pageNumbers.push(1);
        if (currentPage > 3) pageNumbers.push('...');

        for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) pageNumbers.push('...');
        pageNumbers.push(totalPages);

        return pageNumbers.map((number, index) => (
            <button
                key={index}
                onClick={() => typeof number === 'number' && handlePageChange(number)}
                disabled={number === currentPage || number === '...'}
                className={number === currentPage ? 'current-page' : ''}
            >
                {number}
            </button>
        ));
    };

    useEffect(() => {
        searchAlreadyExistDDI(currentPage, pageSize);
    }, []);

    return (
        <div className="app-container">
            <SearchBar onSearch={handleSearch} />

            {/* 分页控件 */}
            <div className="pagination">
                <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>首页</button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>上一页</button>
                {renderPageNumbers()}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>下一页</button>
                <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>末页</button>
                <form onSubmit={handleInputSubmit}>
                    <input
                        type="number"
                        value={inputPage}
                        onChange={handleInputChange}
                        min={1}
                        max={totalPages}
                        placeholder="跳转到"
                    />
                    <button type="submit">跳转</button>
                </form>
            </div>

            {batchSearchResult && (
                <div className="content-container">
                    <ul>
                        {batchSearchResult.items.map((item, idx) => (
                            <li key={idx}>
                                <strong>Drug A:</strong> {item.drugAName}, <strong>Drug B:</strong> {item.drugBName}, <strong>DDI:</strong> {item.ddiDescription}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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