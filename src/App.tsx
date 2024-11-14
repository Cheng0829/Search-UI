// src/App.tsx
import React, {useState, useEffect} from 'react';
import {DDISearchBar} from './components/DDISearchBar';
import {DrugSearchBar} from './components/DrugSearchBar';
import {DDISidebar} from './components/DDISidebar';
import {DrugSidebar} from './components/DrugSidebar';
import {Login} from './components/Login';
import {DDISearchResult, BatchDDISearchResult, DrugSearchResult, BatchDrugSearchResult} from './types';
import {ddiSearch, batchDDISearch, drugSearch, batchDrugSearch, loginVerify} from './service/dataService';
import './App.css';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [DDISearchResult, setDDISearchResult] = useState<DDISearchResult | null>(null);
    const [batchDDISearchResult, setBatchDDISearchResult] = useState<BatchDDISearchResult | null>(null);
    const [currentDDIPage, setCurrentDDIPage] = useState<number>(1);
    const [currentDrugPage, setCurrentDrugPage] = useState<number>(1);
    const [ddiPageSize] = useState<number>(10);
    const [drugPageSize] = useState<number>(10);
    const [totalDDIPages] = useState<number>(279200); // 总共2792008条DDI（排除药物名开头不是字母的特殊药物）
    const [totalDrugPages] = useState<number>(1658);
    const [inputDDIPage, setDDIInputPage] = useState<string>('');
    const [inputDrugPage, setDrugInputPage] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [isChoosing, setIsChoosing] = useState<boolean>(true);
    const [isDrugSearching, setIsDrugSearching] = useState<boolean>(false);
    const [isDDISearching, setIsDDISearching] = useState<boolean>(false);
    const [DrugSearchResult, setDrugSearchResult] = useState<DrugSearchResult | null>(null);
    const [batchDrugSearchResult, setBatchDrugSearchResult] = useState<BatchDrugSearchResult | null>(null);

    const handleDDISearch = async (drugA: string, drugB: string) => {
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
            setDDISearchResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setDDISearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrugSearch = async (drug: string) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!drug) {
                throw new Error('请输入药物！');
            }
            const result = await drugSearch(drug);
            setDrugSearchResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setDrugSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const searchAlreadyExistDDI = async (page: number, limit: number) => {
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
            setBatchDDISearchResult({items});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setBatchDDISearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const searchAlreadyExistDrug = async (page: number, limit: number) => {
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

            setBatchDrugSearchResult({items});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setBatchDrugSearchResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDDIPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalDDIPages) {
            setCurrentDDIPage(newPage);
            searchAlreadyExistDDI(newPage, ddiPageSize);
        }
    };

    const handleDrugPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalDrugPages) {
            setCurrentDrugPage(newPage);
            searchAlreadyExistDrug(newPage, drugPageSize);
        }
    };

    const handleDDIInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDDIInputPage(e.target.value);
    };
    const handleDrugInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDrugInputPage(e.target.value);
    };

    const handleDDIInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pageNumber = parseInt(inputDDIPage);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalDDIPages) {
            handleDDIPageChange(pageNumber);
        }
        setDDIInputPage('');
    };
    const handleDrugInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pageNumber = parseInt(inputDrugPage);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalDrugPages) {
            handleDrugPageChange(pageNumber);
        }
        setDrugInputPage('');
    };

    const renderDDIPageNumbers = () => {
        const pageNumbers = [];
        const range = 2;

        // pageNumbers.push(1);
        if (currentDDIPage > 3) pageNumbers.push('...');

        for (let i = Math.max(1, currentDDIPage - range); i <= Math.min(totalDDIPages, currentDDIPage + range); i++) {
            pageNumbers.push(i);
        }

        if (currentDDIPage < totalDDIPages - 2) pageNumbers.push('...');
        // pageNumbers.push(totalPages);

        return pageNumbers.map((number, index) => (
            <button
                key={index}
                onClick={() => typeof number === 'number' && handleDDIPageChange(number)}
                disabled={number === currentDDIPage || number === '...'}
                className={`page-number ${number === currentDDIPage ? 'current-page' : ''}`}
            >
                {number}
            </button>
        ));
    };
    const renderDrugPageNumbers = () => {
        const pageNumbers = [];
        const range = 2;

        // pageNumbers.push(1);
        if (currentDrugPage > 3) pageNumbers.push('...');

        for (let i = Math.max(1, currentDrugPage - range); i <= Math.min(totalDrugPages, currentDrugPage + range); i++) {
            pageNumbers.push(i);
        }

        if (currentDrugPage < totalDrugPages - 2) pageNumbers.push('...');
        // pageNumbers.push(totalPages);

        return pageNumbers.map((number, index) => (
            <button
                key={index}
                onClick={() => typeof number === 'number' && handleDrugPageChange(number)}
                disabled={number === currentDrugPage || number === '...'}
                className={`page-number ${number === currentDrugPage ? 'current-page' : ''}`}
            >
                {number}
            </button>
        ));
    };

    useEffect(() => {
        searchAlreadyExistDDI(currentDDIPage, ddiPageSize);
    }, []);

    useEffect(() => {
        searchAlreadyExistDrug(currentDrugPage, drugPageSize);
    }, []);

    const handleLogin = async (username: string, password: string) => {
        try {
            const result = await loginVerify(username, password);
            if (result === "yes") {
                setUsername(username)
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
                setLoginError(null);
            } else {
                setLoginError('用户名或密码错误');
            }
        } catch (err) {
            setLoginError('登录过程中发生错误');
        }
    };

    const handleLogout = () => {
        setUsername('')
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    const cleanDDISearchResult = () => {
        setDDISearchResult(null);
    };
    const cleanDrugSearchResult = () => {
        setDrugSearchResult(null);
    };

    const chooseDDISearch = () => {
        setIsChoosing(false);
        setIsDDISearching(true);
    };
    const chooseDrugSearch = () => {
        setIsChoosing(false);
        setIsDrugSearching(true);
    };

    const home = () => {
        setIsChoosing(true);
        setIsDrugSearching(false);
        setIsDDISearching(false);
        setIsLoading(false);
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    // 屏蔽登录功能
    if (!isLoggedIn && isLoggedIn) {
        return <Login onLogin={handleLogin} error={loginError}/>;
    }

    return (
        <div className="app-container">
            {isChoosing && (
                <>
                    <button className="page-nav" onClick={() => chooseDrugSearch()}>
                        drug
                    </button>
                    <button className="page-nav" onClick={() => chooseDDISearch()}>
                        ddi
                    </button>
                </>
            )}
            {!isChoosing && isDrugSearching && (
                <>
                    <button className="page-nav" onClick={() => home()}>
                        Home
                    </button>
                    <header className="header">
                        <div className="search-bar-container">
                            <DrugSearchBar onSearch={handleDrugSearch}/>
                        </div>
                    </header>
                    {isLoading && <p className="loading">Loading...</p>}
                    {error && <p className="error">{error}</p>}
                    {DrugSearchResult && (
                        <>
                            <button className="page-nav" onClick={() => cleanDrugSearchResult()}>
                                清除搜索结果
                            </button>
                            <div className="sidebar-container">
                                <DrugSidebar drugInfo={DrugSearchResult}/>
                            </div>
                        </>
                    )}
                    {!DrugSearchResult && (
                        <>
                            <div className="content-container">
                                <h2>Drug List</h2>
                                {/*<br></br>*/}
                                {batchDrugSearchResult && (
                                    <ul className="result-list">
                                        {batchDrugSearchResult.items.map((item, idx) => (
                                            <li key={idx} className="result-item">
                                                <strong>Drug:</strong> {item.name}
                                                <p><strong>Description:</strong> {item.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="pagination">
                                <button className="page-nav" onClick={() => handleDrugPageChange(1)}
                                        disabled={currentDrugPage === 1}>首页
                                </button>
                                <button className="page-nav" onClick={() => handleDrugPageChange(currentDrugPage - 1)}
                                        disabled={currentDrugPage === 1}>上一页
                                </button>
                                {renderDrugPageNumbers()}
                                <button className="page-nav" onClick={() => handleDrugPageChange(currentDrugPage + 1)}
                                        disabled={currentDrugPage === totalDrugPages}>下一页
                                </button>
                                <button className="page-nav" onClick={() => handleDrugPageChange(totalDrugPages)}
                                        disabled={currentDrugPage === totalDrugPages}>末页
                                </button>
                                <form onSubmit={handleDrugInputSubmit} className="page-jump">
                                    <input
                                        type="number"
                                        value={inputDrugPage}
                                        onChange={handleDrugInputChange}
                                        min={1}
                                        max={totalDrugPages}
                                        placeholder="跳转到"
                                    />
                                    <button type="submit">跳转</button>
                                </form>
                            </div>
                        </>
                    )}
                </>
            )}


            {!isChoosing && isDDISearching && (
                <>
                    <button className="page-nav" onClick={() => home()}>
                        Home
                    </button>
                    <header className="header">
                        <div className="search-bar-container">
                            <DDISearchBar onSearch={handleDDISearch}/>
                        </div>
                        {/*<div className="user-info-container">*/}
                        {/*    <div className="user-info">*/}
                        {/*        <span className="login-status">用户</span>*/}
                        {/*        <span className="username">{username}</span>*/}
                        {/*        <span className="login-status">已登录</span>*/}
                        {/*    </div>*/}
                        {/*    <button onClick={handleLogout} className="logout-button">登出</button>*/}
                        {/*</div>*/}
                    </header>

                    {isLoading && <p className="loading">Loading...</p>}
                    {error && <p className="error">{error}</p>}

                    {DDISearchResult && (
                        <>
                            <button className="page-nav" onClick={() => cleanDDISearchResult()}>
                                清除搜索结果
                            </button>
                            <div className="sidebar-container">
                                <DDISidebar ddiInfo={DDISearchResult}/>
                            </div>
                        </>
                    )}
                    {!DDISearchResult && (
                        <>
                            <div className="content-container">
                                <h2>已通过生物医学实验验证的DDI</h2>
                                {/*<br></br>*/}
                                {batchDDISearchResult && (
                                    <ul className="result-list">
                                        {batchDDISearchResult.items.map((item, idx) => (
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
                                <button className="page-nav" onClick={() => handleDDIPageChange(1)}
                                        disabled={currentDDIPage === 1}>首页
                                </button>
                                <button className="page-nav" onClick={() => handleDDIPageChange(currentDDIPage - 1)}
                                        disabled={currentDDIPage === 1}>上一页
                                </button>
                                {renderDDIPageNumbers()}
                                <button className="page-nav" onClick={() => handleDDIPageChange(currentDDIPage + 1)}
                                        disabled={currentDDIPage === totalDDIPages}>下一页
                                </button>
                                <button className="page-nav" onClick={() => handleDDIPageChange(totalDDIPages)}
                                        disabled={currentDDIPage === totalDDIPages}>末页
                                </button>
                                <form onSubmit={handleDDIInputSubmit} className="page-jump">
                                    <input
                                        type="number"
                                        value={inputDDIPage}
                                        onChange={handleDDIInputChange}
                                        min={1}
                                        max={totalDDIPages}
                                        placeholder="跳转到"
                                    />
                                    <button type="submit">跳转</button>
                                </form>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default App;


