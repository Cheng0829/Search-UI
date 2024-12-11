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
        abstract: 'Predicting drug-drug interaction (DDI) plays a crucial role in drug recommendation and discovery. However, wet-lab methods are prohibitively expensive and time-consuming due to drug interactions. In recent years, deep learning methods have gained widespread use in drug reasoning. Although these methods have demonstrated effectiveness, they can only predict the interaction between a drug pair and do not contain any other information. However, in fact, DDI is greatly affected by a variety of other biomedical factors (such as the dose of drug). As a result, it is challenging to apply them to more complex and meaningful reasoning tasks. Therefore, this study regards DDI as a link prediction problem on knowledge graphs and proposes a DDI prediction model based on Cross-Transformer and GCN in first-order logical query form, TransFOL. In the model, a biomedical query graph is first built to learn the embedding representation. Subsequently, an enhancement module is designed to aggregate the semantics of entities and relations. Cross-Transformer is used for encoding to obtain semantic information between nodes, and GCN is used to gather neighbor information further and predict inference results. To evaluate the performance of TransFOL on common DDI tasks, we conducted experiments on two benchmark datasets. The experimental results indicate that our model outperforms state-of-the-art methods on traditional DDI tasks. Additionally, we introduced different biomedical information in the other two experiments to make the task more realistic. Experimental results verify the strong drug reasoning ability and generalization of TransFOL in complex settings.',
        codeLink: 'https://github.com/Cheng0829/TransFOL',
        url: 'https://ieeexplore.ieee.org/document/10530338'
    },
    {
        title: 'An Interpretable Complex Knowledge Multi-hop Reasoning Model for Predicting Synthetic Lethality in Human Cancers',
        abstract: 'Synthetic lethality (SL) has emerged as a promising strategy in cancer medicine. However, complex biomolecular interactions make wet lab methods time-consuming and expensive. Machine learning methods have gained widespread adoption for SL prediction in recent years. Although these methods have demonstrated particular effectiveness, they suffer from weak interpretability, making it difficult for users to understand the specific reasoning processes of the models. Also, they typically focus on a simple gene pair, thus struggling with more meaningful reasoning tasks involving other medical factors as in real life. To address these gaps, we propose an explainable multi-hop reasoning model EFOL-SL based on first-order logic queries. We first construct query graphs with triplet transformations for different tasks. Node embeddings are then fed into a sparse Transformer encoder and a visualized graph attention decoder to generate comprehensive multi-hop logical reasoning chains. By masking nodes in intermediate reasoning steps, our model can explicitly predict each node, allowing observation of its exact reasoning process. Additionally, we conduct extensive experiments on two widely used benchmarks with complex SL prediction tasks involving diverse medical entities. Evaluations demonstrate superior performance of our model over state-of-the-art methods on various tasks. Notably, EFOL-SL provides specific multi-hop logical reasoning chains behind its predictions, offering meaningful insights into reasoning process.',
        codeLink: 'https://github.com/Cheng0829/EFOL-SL',
        url: 'https://github.com/Cheng0829/EFOL-SL'
    },
    {
        title: 'Fuzzy-DDI: A Robust Model for Complex Drug-Drug Interaction Prediction',
        abstract: 'Drug-drug interactions (DDI) refer to the compound effects that occur when patients take multiple drugs simultaneously, which may reduce the drug efficacy and even harm the patient. Therefore, DDI prediction is significant for drug development and safe medication. Despite the great efforts of researchers, existing methods mainly focus on predicting interactions between drug pairs, cannot contain more biomedical information, and have poor robustness, limiting their application in real-world scenarios. Therefore, we propose a new robust fuzzy logic query model, Fuzzy-DDI, to predict DDI under various complex conditions. Specifically, Fuzzy-DDI decomposes DDI predictions into relational projections and logical operations on rough sets during inference. Fuzzy logic makes it more fault-tolerant than binary logic models. We explore the reasoning ability of the model in a more realistic and meaningful DDI prediction task with target cell type information and explore the robustness of Fuzzy-DDI in noisy environments and missing sample environments. Experiments on three benchmark datasets show that Fuzzy-DDI significantly outperforms state-of-the-art methods on various DDI prediction tasks, demonstrating its capabilities in inference and robustness.',
        codeLink: 'https://github.com/Cheng0829/Fuzzy-DDI',
        url: 'https://github.com/Cheng0829/Fuzzy-DDI'
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
                                药物搜索引擎
                            </button>
                            <button className="nav-btn" onClick={chooseDDISearch}>
                                DDI搜索引擎
                            </button>
                        </div>
                        <div className="header-info">
                            <p>Author: <a href="https://github.com/Cheng0829" target="_blank" rel="noopener noreferrer">Junkai Cheng</a></p>
                            <p>数据更新日期: {getPreviousDay()}</p>
                        </div>
                    </div>

                    <div className="papers-container">
                        <h2>研究成果</h2>
                        <div className="papers-grid">
                            {papers.map((paper, index) => (
                                <div key={index} className="paper-card">
                                    <h3>
                                        <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                            {paper.title}
                                        </a>
                                    </h3>
                                    <p>
                                        {paper.abstract}
                                        {paper.codeLink && (
                                            <>
                                                {' Data and code are available at '}
                                                <a href={paper.codeLink} target="_blank" rel="noopener noreferrer">
                                                    {paper.codeLink}
                                                </a>
                                                .
                                            </>
                                        )}
                                    </p>
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

