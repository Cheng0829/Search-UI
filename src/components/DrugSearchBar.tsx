// src/components/DDISearchBar.tsx

import React, { useState } from 'react';
import '../App.css';

interface SearchBarProps {
    onSearch: (drug: string) => void;
}

export const DrugSearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [drug, setDrug] = useState('');

    const handleSearch = () => {
        onSearch(drug);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Enter Drug"
                value={drug}
                onChange={(e) => setDrug(e.target.value)}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
        </div>
    );
};