// client/src/pages/Home.jsx — Updated for multi-sport
import { useState, useEffect } from 'react';
import { getCricketMatches, getFootballMatches, getTennisMatches } from '../services/api';
import { useSport } from '../context/SportsContext';
import SportSelector from '../components/common/SportSelector';


const API_MAP = {
    cricket: getCricketMatches,
    football: getFootballMatches,
    tennis: getTennisMatches,
};

const Home = () => {
    const { activeSport } = useSport();
    const [matches, setMatches] = useState({ live: [], completed: [], upcoming: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const apiFn = API_MAP[activeSport]; 
                const { data } = await apiFn();
                setMatches(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeSport]);  

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">🏆 SportsPulse</h1>
            <p className="text-gray-500 mb-6">Live scores across Cricket, Football & Tennis</p>

            <SportSelector />

            {loading ? (
                <p>Loading {activeSport} matches...</p>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-3 text-red-600">
                        🔴 Live {activeSport.charAt(0).toUpperCase() + activeSport.slice(1)}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.live.map(match => (
                            <div key={match.id} className="bg-white rounded-xl shadow p-4">
                                <h3 className="font-bold">{match.name}</h3>
                                <p className="text-green-700">{match.status}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
export default Home;
