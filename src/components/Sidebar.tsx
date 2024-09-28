// src/components/Sidebar.tsx

import React from 'react';
import {DDIResult, DrugInfo} from '../types';

interface SidebarProps {
    ddiInfo: {
        "drugA": DrugInfo;
        "drugB"?: DrugInfo;
        "ddi": { [key: string]: DDIResult }; // 使用索引签名来表示任意键的 DDIResult 对象
    }
}

export const Sidebar: React.FC<SidebarProps> = ({ ddiInfo }) => {
    if (!ddiInfo) return null;

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
                </div>
            )}

            {ddiInfo.ddi && (
                <div>
                    <h3>DDI Information</h3>
                    <p>Drug A: {ddiInfo.drugA.name}</p>
                    <p>Drug B: {ddiInfo.drugB?.name || 'N/A'}</p>

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
        </div>
    );
};
