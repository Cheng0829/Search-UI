// src/components/Sidebar.tsx

import React, {useEffect, useState} from 'react';
import {DDIResult, DrugInfo} from '../types';
import {cjkSearch, searchLLM} from "../service/dataService";


interface SidebarProps {
    ddiInfo: {
        "drugA": DrugInfo;
        "drugB"?: DrugInfo;
        "ddi": { [key: string]: DDIResult }; // 使用索引签名来表示任意键的 DDIResult 对象
    }
}


export const Sidebar: React.FC<SidebarProps> = ({ ddiInfo }) => {
    // 状态变量用于存储结果
    const [result, setResult] = useState('');
    const [showResult, setShowResult] = useState(false);
    // 处理按钮点击事件
    const handleButtonClick = async () => {
        setResult('');
        setShowResult(false);

        const data = searchLLM(ddiInfo.drugA.name, ddiInfo.drugB?.name)
        setResult(await data);
        setShowResult(true); // 设置为 true 以显示结果
    };

    // 重置状态的 useEffect 钩子
    useEffect(() => {
        // 每次 ddiInfo 变化时重置状态
        setResult('');
        setShowResult(false);
    }, [ddiInfo]);

    if (!ddiInfo) return null;
    // console.log(ddiInfo);

    const hasDrugBKey = 'drugB' in ddiInfo;

    // 正常的只查单个药物的情况：药物A不存在，药物B为空
    if(!ddiInfo.drugA && !hasDrugBKey)
        return (
            <div className="error-Drug-null">
                <div>
                    <p>药物A不存在！</p>
                </div>
            </div>
        );

    if(!ddiInfo.drugA || (!ddiInfo.drugB && hasDrugBKey))
        return (
            <div className="error-Drug-null">
                {!ddiInfo.drugA && (
                    <div>
                        <p>药物A不存在！</p>
                    </div>
                )}
                {ddiInfo.drugA && (
                    <div>
                        <h3>Drug A: {ddiInfo.drugA.name}</h3>
                        <p>DrugbankID: {ddiInfo.drugA.drugbankId}</p>
                        <p>Category: {ddiInfo.drugA.category}</p>
                        <p>Chemical Formula: {ddiInfo.drugA.chemicalFormula}</p>
                        <p>SMILES: {ddiInfo.drugA.smiles}</p>
                        <p>Description: {ddiInfo.drugA.description}</p>
                        <p>Related Drugs: {ddiInfo.drugA.relatedDrugs}</p>
                        <img src={`/drugImage/${ddiInfo.drugA.name}.png`} alt=""/>
                    </div>
                )}
                {hasDrugBKey && !ddiInfo.drugB && (
                    <div>
                        <p>药物B不存在！</p>
                    </div>
                )}
                {hasDrugBKey && ddiInfo.drugB && (
                    <div>
                        <h3>Drug B: {ddiInfo.drugB.name}</h3>
                        <p>DrugbankID: {ddiInfo.drugB.drugbankId}</p>
                        <p>Category: {ddiInfo.drugB.category}</p>
                        <p>Chemical Formula: {ddiInfo.drugB.chemicalFormula}</p>
                        <p>SMILES: {ddiInfo.drugB.smiles}</p>
                        <p>Description: {ddiInfo.drugB.description}</p>
                        <p>Related Drugs: {ddiInfo.drugB.relatedDrugs}</p>
                        <img src={`/drugImage/${ddiInfo.drugB.name}.png`} alt=""/>
                    </div>
                )}
            </div>
        );

    return (
        <div className="sidebar">
            <div>
                <h3>Drug A: {ddiInfo.drugA.name}</h3>
                <p>DrugbankID: {ddiInfo.drugA.drugbankId}</p>
                <p>Category: {ddiInfo.drugA.category}</p>
                <p>Chemical Formula: {ddiInfo.drugA.chemicalFormula}</p>
                <p>SMILES: {ddiInfo.drugA.smiles}</p>
                <p>Description: {ddiInfo.drugA.description}</p>
                <p>Related Drugs: {ddiInfo.drugA.relatedDrugs}</p>
                <img src={`/drugImage/${ddiInfo.drugA.name}.png`} alt=""/>
            </div>

            {ddiInfo.drugB && (
                <div>
                    <h3>Drug B: {ddiInfo.drugB.name}</h3>
                    <p>DrugbankID: {ddiInfo.drugB.drugbankId}</p>
                    <p>Category: {ddiInfo.drugB.category}</p>
                    <p>Chemical Formula: {ddiInfo.drugB.chemicalFormula}</p>
                    <p>SMILES: {ddiInfo.drugB.smiles}</p>
                    <p>Description: {ddiInfo.drugB.description}</p>
                    <p>Related Drugs: {ddiInfo.drugB.relatedDrugs}</p>
                    <img src={`/drugImage/${ddiInfo.drugB.name}.png`} alt=""/>
                </div>
            )}

            {(Object.keys(ddiInfo.ddi).length !== 0) && ddiInfo.ddi && (
                <div>
                    <h3>DDI Information</h3>
                    {/* 输出所有的 DDI 类型和描述 */}
                    {Object.keys(ddiInfo.ddi).map((ddiType, index) => (
                        <div key={index}>
                            <p>DDI Type: {ddiType}</p>
                            <p>Description: {ddiInfo.ddi[ddiType].description}</p>
                            <p>Confidence: {ddiInfo.ddi[ddiType].confidence}</p>
                        </div>
                    ))}
                </div>
            )}
            {/*Trioxsalen         Aminolevulinic acid        Verteporfin*/}
            {(Object.keys(ddiInfo.ddi).length === 0) && ddiInfo.ddi && (
                <div>
                    <h3>未查找到DDI信息！</h3>
                    <button onClick={handleButtonClick}>点击查询LLM</button>
                    {/* 只有当 showResult 为 true 时才显示查询结果 */}
                    {showResult && <div>{result}</div>}
                </div>
            )}
        </div>
    );
};

