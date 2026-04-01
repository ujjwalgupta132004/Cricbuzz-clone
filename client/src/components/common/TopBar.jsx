import { useState } from 'react';
import { FaSearch, FaBell, FaCog, FaBars } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ onMenuToggle }) => {
    const { isConnected } = useSocket();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <header className="topbar">
            <button className="hamburger-btn" onClick={onMenuToggle}>
                <FaBars />
            </button>

            <div className="topbar-search">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search teams, matches, news..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="topbar-actions">
                <span className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                    <span className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`} />
                    {isConnected ? 'Live' : 'Offline'}
                </span>
                <button className="topbar-btn">
                    <FaBell />
                </button>
                <button className="topbar-btn">
                    <FaCog />
                </button>
            </div>
        </header>
    );
};

export default TopBar;
