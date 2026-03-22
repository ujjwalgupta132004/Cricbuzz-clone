import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-green-700 text-white px-6 py-3 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
                🏏 CricClone
            </Link>
            <div className="flex gap-6">
                <Link to="/" className="hover:text-green-200">Home</Link>
                <Link to="/live" className="hover:text-green-200">Live Scores</Link>
                <Link to="/news" className="hover:text-green-200">News</Link>
                <Link to="/ai" className="hover:text-green-200">AI Assistant</Link>
            </div>
        </nav>
    );
};
export default Navbar;
