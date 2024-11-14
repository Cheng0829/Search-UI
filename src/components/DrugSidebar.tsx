// src/components/DDISidebar.tsx

import React from 'react';


interface SidebarProps {
    drugInfo: {
        orderId: string;
        chemicalFormula: string;
        drugbankId: string;
        smiles: string;
        name: string;
        description: string;
        category: string;
        relatedDrugs: string;
        pharmacodynamics: string;
        actionMechanism: string;
        proteinBinding: string;
        metabolism: string;
    };
}

export const DrugSidebar: React.FC<SidebarProps> = ({drugInfo}) => {

    if (!drugInfo) return null;
    // console.log(ddiInfo);

    if (!drugInfo) {
        return (
            <div className="error-Drug-null">
                <div>
                    <h2>Search Result</h2>
                    <p>暂无药物A信息</p>
                </div>
            </div>
        )
    }

    return (
        <div className="sidebar">
            <h2>Search Result</h2>
            <div>
                {<h3>Drug: {drugInfo.name}</h3>}
                {drugInfo.category && <p><strong>Category:</strong><br/> {drugInfo.category} etc.</p>}
                {drugInfo.chemicalFormula &&
                    <p><strong>Chemical Formula:</strong><br/> {drugInfo.chemicalFormula}</p>}
                {drugInfo.smiles && <p><strong>SMILES:</strong><br/> {drugInfo.smiles}</p>}
                {drugInfo.description && <p><strong>Description:</strong><br/> {drugInfo.description}</p>}
                {drugInfo.relatedDrugs &&
                    <p><strong>Related Drugs:</strong><br/> {drugInfo.relatedDrugs} etc.</p>}
                {drugInfo.pharmacodynamics &&
                    <p><strong>Pharmacodynamics:</strong><br/> {drugInfo.pharmacodynamics}</p>}
                {drugInfo.actionMechanism &&
                    <p><strong>Action Mechanism:</strong><br/> {drugInfo.actionMechanism}</p>}
                {drugInfo.proteinBinding &&
                    <p><strong>Protein Binding:</strong><br/> {drugInfo.proteinBinding}</p>}
                {drugInfo.metabolism && <p><strong>Metabolism:</strong><br/> {drugInfo.metabolism}</p>}
                <img src={`drugImage/${drugInfo.name}.png`} alt=""/>
            </div>

        </div>
    );
};

