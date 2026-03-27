import { useState, useEffect } from 'react';
import { useSport } from '../context/SportsContext';
import SportSelector from '../components/common/SportSelector';
import api from '../services/api';

const Standings = () => {
    const { activeSport } = useSport();
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            setLoading(true);
            try {
                const endpoint = activeSport === 'football'
                    ? '/football/standings?league=39&season=2025'
                    : activeSport === 'tennis'
                        ? '/tennis/rankings'
                        : '/cricket/series';
                const { data } = await api.get(endpoint);
                setStandings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, [activeSport]);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">📊 Standings & Rankings</h1>
            <SportSelector />

            {loading ? <p>Loading...</p> : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">#</th>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-center">
                                    {activeSport === 'football' ? 'Points' : activeSport === 'tennis' ? 'Rank Points' : 'Matches'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((item, idx) => (
                                <tr key={idx} className="border-b hover:bg-green-50 transition">
                                    <td className="py-3 px-4 font-bold">{idx + 1}</td>
                                    <td className="py-3 px-4">{item.name || item.team?.name}</td>
                                    <td className="py-3 px-4 text-center font-semibold">
                                        {item.points || item.rankPoints || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
export default Standings;
