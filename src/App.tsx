import React, {useState, useEffect} from 'react';
import {DrugSearchView} from './DrugSearchView';
import {DDISearchView} from './DDISearchView';
import {Login} from './components/Login';
import {loginVerify} from './service/dataService';
import './App.css';
// 论文数据
const papers = [
    {
        title: 'TransFOL: A Logical Query Model for Complex Relational Reasoning in Drug-Drug Interaction',
        abstract: 'Predicting drug-drug interaction (DDI) plays a crucial role in drug recommendation and discovery. However, wet lab methods are prohibitively expensive and time-consuming due to drug interactions. '
    },
    {
        title: 'TransFOL: A Logical Query Model for Complex Relational Reasoning in Drug-Drug Interaction',
        abstract: 'Predicting drug-drug interaction (DDI) plays a crucial role in drug recommendation and discovery. However, wet lab methods are prohibitively expensive and time-consuming due to drug interactions. '
    },
    {
        title: 'TransFOL: A Logical Query Model for Complex Relational Reasoning in Drug-Drug Interaction',
        abstract: 'Predicting drug-drug interaction (DDI) plays a crucial role in drug recommendation and discovery. However, wet lab methods are prohibitively expensive and time-consuming due to drug interactions. '
    },
    {
        title: 'TransFOL: A Logical Query Model for Complex Relational Reasoning in Drug-Drug Interaction',
        abstract: 'Predicting drug-drug interaction (DDI) plays a crucial role in drug recommendation and discovery. However, wet lab methods are prohibitively expensive and time-consuming due to drug interactions. '
    },
    {
        title: 'TransFOL: A Logical Query Model for Complex Relational Reasoning in Drug-Drug Interaction',
        abstract: 'Predicting drug-drug interaction (DDI) plays a crucial role in drug recommendation and discovery. However, wet lab methods are prohibitively expensive and time-consuming due to drug interactions. '
    }
];


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');
    const [isChoosing, setIsChoosing] = useState<boolean>(true);
    const [isDrugSearching, setIsDrugSearching] = useState<boolean>(false);
    const [isDDISearching, setIsDDISearching] = useState<boolean>(false);

    const handleLogin = async (username: string, password: string) => {
        try {
            const result = await loginVerify(username, password);
            if (result === "yes") {
                setUsername(username);
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
        setUsername('');
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    const chooseDDISearch = () => {
        setIsChoosing(false);
        setIsDDISearching(true);
    };

    const chooseDrugSearch = () => {
        setIsChoosing(false);
        setIsDrugSearching(true);
    };

    const navigateHome = () => {
        setIsChoosing(true);
        setIsDrugSearching(false);
        setIsDDISearching(false);
    };

    const getPreviousDay = (): string => {
        const today = new Date();
        const previousDay = new Date(today);
        previousDay.setDate(today.getDate() - 1);

        const year = previousDay.getFullYear();
        const month = String(previousDay.getMonth() + 1).padStart(2, '0');
        const day = String(previousDay.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    // 登录功能已被注释，保持与原代码一致
    if (!isLoggedIn && isLoggedIn) {
        return <Login onLogin={handleLogin} error={loginError}/>;
    }

    return (
        <div className="app-container">
            {/*<div className="user-info-container">*/
            }
            {/*    <div className="user-info">*/
            }
            {/*        <span className="login-status">用户</span>*/
            }
            {/*        <span className="username">{username}</span>*/
            }
            {/*        <span className="login-status">已登录</span>*/
            }
            {/*    </div>*/
            }
            {/*    <button onClick={handleLogout} className="logout-button">登出</button>*/
            }
            {/*</div>*/
            }
            {isChoosing && (
                <div className="home-content">
                    <div className="header">
                        <div className="nav-buttons">
                            <button className="nav-btn" onClick={chooseDrugSearch}>
                                Drug
                            </button>
                            <button className="nav-btn" onClick={chooseDDISearch}>
                                DDI
                            </button>
                        </div>
                        <div className="header-info">
                            <p>Author: <a href="https://github.com/Cheng0829" target="_blank" rel="noopener noreferrer">Junkai
                                Cheng</a></p>
                            <p>数据更新日期: {getPreviousDay()}</p>
                        </div>
                    </div>

                    <div className="papers-container">
                        <h2>研究成果</h2>
                        <div className="papers-grid">
                            {papers.map((paper, index) => (
                                <div key={index} className="paper-card">
                                    <h3>{paper.title}</h3>
                                    <p>{paper.abstract}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isDrugSearching && (
                <DrugSearchView onNavigateHome={navigateHome}/>
            )}

            {isDDISearching && (
                <DDISearchView onNavigateHome={navigateHome}/>
            )}
        </div>
    );
};

export default App;

