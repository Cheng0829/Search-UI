// @author  : Junkai Cheng
// @time    : 2024/11/14 16:27
import React, { useState, useEffect } from 'react';
import { DrugSearchBar } from './components/DrugSearchBar';
import { DrugSidebar } from './components/DrugSidebar';
import { DrugSearchResult, BatchDrugSearchResult } from './types';
import { drugSearch, batchDrugSearch } from './service/dataService';

interface DrugSearchViewProps {
    onNavigateHome: () => void;
}

export const DrugSearchView: React.FC<DrugSearchViewProps> = ({ onNavigateHome }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalPages] = useState<number>(1658);
    const [inputPage, setInputPage] = useState<string>('');
    const [searchResult, setSearchResult] = useState<DrugSearchResult | null>(null);
    const [batchSearchResult, setBatchSearchResult] = useState<BatchDrugSearchResult | null>(null);

    const handleSearch = async (drug: string) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!drug) {
                throw new Error('请输入药物！');
            }
            const result = await drugSearch(drug);
            setSearchResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const searchExistingDrugs = async (page: number, limit: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await batchDrugSearch(page - 1, limit);
            if (!Array.isArray(result)) {
                throw new Error('Unexpected data format from the backend. Expected an array.');
            }
            const items = result.map(item => ({
                name: item['name'],
                description: item['description']
            }));
            setBatchSearchResult({items});
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
            searchExistingDrugs(newPage, pageSize);
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

        if (currentPage > 3) pageNumbers.push('...');

        for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) pageNumbers.push('...');

        return pageNumbers.map((number, index) => (
            <button
                key={index}
                onClick={() => typeof number === 'number' && handlePageChange(number)}
                disabled={number === currentPage || number === '...'}
                className={`page-number ${number === currentPage ? 'current-page' : ''}`}
            >
                {number}
            </button>
        ));
    };

    useEffect(() => {
        searchExistingDrugs(currentPage, pageSize);
    }, []);

    return (
        <>
            <button className="page-nav" onClick={onNavigateHome}>
                Home
            </button>
            <header className="header">
                <div className="search-bar-container">
                    <DrugSearchBar onSearch={handleSearch}/>
                </div>
            </header>
            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
            {searchResult && (
                <>
                    <button className="page-nav" onClick={() => setSearchResult(null)}>
                        清除搜索结果
                    </button>
                    <div className="sidebar-container">
                        <DrugSidebar drugInfo={searchResult}/>
                    </div>
                </>
            )}
            {!searchResult && (
                <>
                    <div className="content-container">
                        <h2>Drug List</h2>
                        {batchSearchResult && (
                            <ul className="result-list">
                                {batchSearchResult.items.map((item, idx) => (
                                    <li key={idx} className="result-item">
                                        <strong>Drug:</strong> {item.name}
                                        <p><strong>Description:</strong> {item.description}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="pagination">
                        <button className="page-nav" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                            首页
                        </button>
                        <button className="page-nav" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            上一页
                        </button>
                        {renderPageNumbers()}
                        <button className="page-nav" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            下一页
                        </button>
                        <button className="page-nav" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                            末页
                        </button>
                        <form onSubmit={handleInputSubmit} className="page-jump">
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
                </>
            )}
        </>
    );
};