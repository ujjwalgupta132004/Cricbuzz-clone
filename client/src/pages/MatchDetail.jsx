import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useSport } from '../context/SportsContext';

const MatchDetail = () => {
    const { id } = useParams();
    const { activeSport } = useSport();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get(`/${activeSport}/matches/${id}`);
                setMatch(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (activeSport && id) fetch();
    }, [id, activeSport]); 

    if (loading) return <p className="text-center py-20">Loading match details...</p>;
    if (!match) return <p className="text-center py-20">Match not found</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Match Header */}
            <div className="bg-green-700 text-white rounded-xl p-6 mb-6">
                <h1 className="text-2xl font-bold">{match.name}</h1>
                <p className="text-green-200 mt-1">📍 {match.venue}</p>
                <p className="text-yellow-300 font-medium mt-2">{match.status}</p>
            </div>

            {/* Scorecard */}
            {match.score && match.score.map((inning, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow p-5 mb-4">
                    <h3 className="font-bold text-lg mb-3 text-green-700">{inning.inning}</h3>
                    <div className="text-3xl font-bold">
                        {inning.r}/{inning.w}
                        <span className="text-lg text-gray-500 ml-2">({inning.o} overs)</span>
                    </div>
                </div>
            ))}

            {/* Match Info */}
            <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-bold text-lg mb-3">Match Info</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><span className="text-gray-500">Format:</span> {match.matchType?.toUpperCase()}</p>
                    <p><span className="text-gray-500">Date:</span> {match.date}</p>
                    <p><span className="text-gray-500">Teams:</span> {match.teams?.join(' vs ')}</p>
                </div>
            </div>
        </div>
    );
};
export default MatchDetail;
