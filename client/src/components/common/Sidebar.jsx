import { NavLink, Link } from 'react-router-dom';
import { FaHome, FaBaseballBall, FaFutbol, FaTableTennis, FaRobot, FaTimes } from 'react-icons/fa';
import { MdLeaderboard, MdNewspaper, MdCompareArrows } from 'react-icons/md';

const Sidebar = ({ isOpen, onClose, user }) => {
    const navItems = [
        { to: '/', icon: <FaHome />, label: 'Dashboard' },
        { to: '/cricket', icon: <FaBaseballBall />, label: 'Cricket' },
        { to: '/football', icon: <FaFutbol />, label: 'Football' },
        { to: '/tennis', icon: <FaTableTennis />, label: 'Tennis' },
    ];

    const extraItems = [
        { to: '/live', icon: <MdLeaderboard />, label: 'Live Scores' },
        { to: '/compare', icon: <MdCompareArrows />, label: 'Compare' },
        { to: '/standings', icon: <MdLeaderboard />, label: 'Standings' },
        { to: '/news', icon: <MdNewspaper />, label: 'News' },
        { to: '/ai', icon: <FaRobot />, label: 'AI Assistant' },
    ];

    const teams = [
        { name: 'India', color: '#22c55e', sport: 'cricket' },
        { name: 'Man Utd', color: '#ef4444', sport: 'football' },
    ];

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Logo */}
                <Link to="/" className="sidebar-logo" onClick={onClose}>
                    <div className="logo-icon">⚡</div>
                    <span className="logo-text">SportsBuzz</span>
                </Link>

                {/* Close button for mobile */}
                <button
                    className="hamburger-btn"
                    onClick={onClose}
                    style={{ position: 'absolute', top: 20, right: 12, display: isOpen ? 'flex' : undefined }}
                >
                    <FaTimes />
                </button>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="link-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="sidebar-section-title">More</div>

                    {extraItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="link-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="sidebar-section-title">Your Teams</div>

                    {teams.map(team => (
                        <NavLink
                            key={team.name}
                            to={`/${team.sport}`}
                            className="sidebar-link"
                            onClick={onClose}
                        >
                            <span
                                className="link-dot"
                                style={{ background: team.color }}
                            />
                            {team.name}
                        </NavLink>
                    ))}
                </nav>

                {/* User section */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user ? user.name?.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user?.name || 'Guest User'}</div>
                        <div className="user-role">{user ? 'Pro Subscriber' : 'Sign in'}</div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
