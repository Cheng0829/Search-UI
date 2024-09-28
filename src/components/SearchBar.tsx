// src/components/SearchBar.tsx

import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (drugA: string, drugB: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [drugA, setDrugA] = useState('');
    const [drugB, setDrugB] = useState('');

    const handleSearch = () => {
        onSearch(drugA, drugB);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Enter Drug A"
                value={drugA}
                onChange={(e) => setDrugA(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Drug B (optional)"
                value={drugB}
                onChange={(e) => setDrugB(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};