import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    // NavLink gives "active" class automatically when on that page
    const linkClass = ({ isActive }) =>
        `hover:text-green-200 transition ${isActive ? 'text-white font-bold border-b-2 border-white' : 'text-green-100'}`;

    return (
        <nav className="bg-green-700 text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold">🏏 CricClone</Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 text-sm">
                    <NavLink to="/" className={linkClass}>Home</NavLink>
                    <NavLink to="/live" className={linkClass}>Live Scores</NavLink>
                    <NavLink to="/series" className={linkClass}>Series</NavLink>
                    <NavLink to="/news" className={linkClass}>News</NavLink>
                    <NavLink to="/ai" className={linkClass}>🤖 AI Assistant</NavLink>
                </div>

                {/* Mobile Hamburger */}
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-green-800 px-4 py-3 flex flex-col gap-3">
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/live" onClick={() => setMenuOpen(false)}>Live Scores</NavLink>
                    <NavLink to="/series" onClick={() => setMenuOpen(false)}>Series</NavLink>
                    <NavLink to="/news" onClick={() => setMenuOpen(false)}>News</NavLink>
                    <NavLink to="/ai" onClick={() => setMenuOpen(false)}>🤖 AI Assistant</NavLink>
                </div>
            )}
        </nav>
    );
};
export default Navbar;
