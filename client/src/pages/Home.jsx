
import useFetch from '../hooks/useFetch';
import { getCricketMatches } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
        
    const { data: matches, loading, error } = useFetch(getCricketMatches);

   
    

    if (loading) return <p className="text-center py-10">Loading matches...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🏏 Cricket Live</h1>

            {/* Live Matches Section */}
            <h2 className="text-xl font-semibold mb-3 text-red-600">🔴 Live Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {matches.live.length === 0 && <p>No live matches right now</p>}
                {matches.live.map((match) => (
                    <Link to={`/match/${match.id}`} key={match.id}>
                        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">● LIVE</span>
                            <h3 className="font-bold text-lg mt-2">{match.name}</h3>
                            {/* Show scores if available */}
                            {match.score?.map((inning, i) => (
                                <p key={i} className="text-sm text-gray-600">
                                    {inning.inning}: {inning.r}/{inning.w} ({inning.o} ov)
                                </p>
                            ))}
                            <p className="text-green-700 text-sm mt-2">{match.status}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Completed + Upcoming follow same pattern */}
            <h2 className="text-xl font-semibold mb-3 text-red-600">completed matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {matches.completed.length === 0 && <p>No completed matches right now</p>}
                {matches.completed.map((match) => (
                    <Link to={`/match/${match.id}`} key={match.id}>
                        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">● completed</span>
                            <h3 className="font-bold text-lg mt-2">{match.name}</h3>
                            {/* Show scores if available */}
                            {match.score?.map((inning, i) => (
                                <p key={i} className="text-sm text-gray-600">
                                    {inning.inning}: {inning.r}/{inning.w} ({inning.o} ov)
                                </p>
                            ))}
                            <p className="text-green-700 text-sm mt-2">{match.status}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">upcoming matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {matches.upcoming.length === 0 && <p>No upcoming matches right now</p>}
                {matches.upcoming.map((match) => (
                    <Link to={`/match/${match.id}`} key={match.id}>
                        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">● upcoming</span>
                            <h3 className="font-bold text-lg mt-2">{match.name}</h3>
                            {/* Show scores if available */}
                            {match.score?.map((inning, i) => (
                                <p key={i} className="text-sm text-gray-600">
                                    {inning.inning}: {inning.r}/{inning.w} ({inning.o} ov)
                                </p>
                            ))}
                            <p className="text-green-700 text-sm mt-2">{match.status}</p>
                        </div>
                    </Link>
                ))}
            </div>
            
        </div>
    );
};
export default Home;