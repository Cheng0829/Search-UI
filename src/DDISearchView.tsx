// @author  : Junkai Cheng
// @time    : 2024/11/14 16:27
import React, { useState, useEffect } from 'react';
import { DDISearchBar } from './components/DDISearchBar';
import { DDISidebar } from './components/DDISidebar';
import { DDISearchResult, BatchDDISearchResult } from './types';
import { ddiSearch, batchDDISearch } from './service/dataService';
import {DrugSearchBar} from "./components/DrugSearchBar";

interface DDISearchViewProps {
    onNavigateHome: () => void;
}

export const DDISearchView: React.FC<DDISearchViewProps> = ({ onNavigateHome }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(20);
    const [totalPages] = useState<number>(Math.floor(2792008 / pageSize));
    const [inputPage, setInputPage] = useState<string>('');
    const [searchResult, setSearchResult] = useState<DDISearchResult | null>(null);
    const [batchSearchResult, setBatchSearchResult] = useState<BatchDDISearchResult | null>(null);

    const handleSearch = async (drugA: string, drugB: string) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!drugA) {
                throw new Error('请输入药物A！');
            }
            if (!drugB) {
                throw new Error('请输入药物B！');
            }
            if (drugA === drugB) {
                throw new Error('请输入两个不同的药物！');
            }

            const result = await ddiSearch(drugA, drugB);
            setSearchResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const searchExistingDDIs = async (page: number, limit: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await batchDDISearch(page - 1, limit);
            if (!Array.isArray(result)) {
                throw new Error('Unexpected data format from the backend. Expected an array.');
            }
            const items = result.map(item => ({
                drugAName: item['drugAName'],
                drugBName: item['drugBName'],
                ddiDescription: item['ddiDescription']
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
            searchExistingDDIs(newPage, pageSize);
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
        searchExistingDDIs(currentPage, pageSize);
    }, []);

    return (
        <>
            <div className="header-nav">
                <button className="home-button" onClick={onNavigateHome}>
                    Home
                </button>
                <div className="search-bar-container">
                    <DDISearchBar onSearch={handleSearch}/>
                </div>
            </div>
            {/*<button className="page-nav" onClick={onNavigateHome}>*/}
            {/*    Home*/}
            {/*</button>*/}
            {/*<header className="header">*/}
            {/*    <div className="search-bar-container">*/}
            {/*        <DDISearchBar onSearch={handleSearch}/>*/}
            {/*    </div>*/}
            {/*</header>*/}
            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
            {searchResult && (
                <>
                    <button className="page-nav" onClick={() => setSearchResult(null)}>
                        清除搜索结果
                    </button>
                    <div className="sidebar-container">
                        <DDISidebar ddiInfo={searchResult}/>
                    </div>
                </>
            )}
            {!searchResult && (
                <>
                    <div className="content-container">
                        <h2>已通过生物医学实验验证的DDI</h2>
                        {batchSearchResult && (
                            <ul className="result-list">
                                {batchSearchResult.items.map((item, idx) => (
                                    <li key={idx} className="result-item">
                                        <strong>Drug A:</strong> {item.drugAName}, <strong>Drug
                                        B:</strong> {item.drugBName}
                                        <p><strong>DDI:</strong> {item.ddiDescription}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="pagination">
                        <button className="page-nav" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                            首页
                        </button>
                        <button className="page-nav" onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}>
                            上一页
                        </button>
                        {renderPageNumbers()}
                        <button className="page-nav" onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}>
                            下一页
                        </button>
                        <button className="page-nav" onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}>
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