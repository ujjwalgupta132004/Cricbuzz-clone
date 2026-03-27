import { createContext, useContext, useState } from 'react';

const SportContext = createContext();

export const SportProvider = ({ children }) => {
    const [activeSport, setActiveSport] = useState('cricket');

    const sports = [
        { key: 'cricket', label: '🏏 Cricket', color: 'green' },
        { key: 'football', label: '⚽ Football', color: 'blue' },
        { key: 'tennis', label: '🎾 Tennis', color: 'yellow' },
    ];

    return (
        <SportContext.Provider value={{ activeSport, setActiveSport, sports }}>
            {children}
        </SportContext.Provider>
    );
};

export const useSport = () => useContext(SportContext);
