import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

const PlayerProfile = () => {
    const { sport, id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const { data } = await api.get(`/players/${sport}/${id}`);
                setPlayer(data.player);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayer();
    }, [sport, id]);

    if (loading) return <p className="text-center py-20">Loading player...</p>;
    if (!player) return <p className="text-center py-20">Player not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Player Hero Card */}
            <div className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-6">
                    <img
                        src={player.playerImg || '/fallback-avatar.png'}
                        alt={player.name}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                        onError={(e) => { e.target.src = '/fallback-avatar.png'; }}
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{player.name}</h1>
                        <p className="text-green-200">{player.country || player.nationality}</p>
                        <p className="text-sm mt-1 opacity-80">
                            {sport === 'cricket' && `${player.role} • ${player.battingStyle}`}
                            {sport === 'football' && `${player.position} • Age: ${player.age}`}
                            {sport === 'tennis' && `Rank: #${player.ranking}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sport === 'cricket' && (
                    <>
                        <StatBox label="Matches" value={player.stats?.matches || '-'} />
                        <StatBox label="Runs" value={player.stats?.runs || '-'} />
                        <StatBox label="Wickets" value={player.stats?.wickets || '-'} />
                        <StatBox label="Average" value={player.stats?.average || '-'} />
                    </>
                )}
                {sport === 'football' && (
                    <>
                        <StatBox label="Appearances" value={player.statistics?.[0]?.games?.appearences || '-'} />
                        <StatBox label="Goals" value={player.statistics?.[0]?.goals?.total || 0} />
                        <StatBox label="Assists" value={player.statistics?.[0]?.goals?.assists || 0} />
                        <StatBox label="Rating" value={player.statistics?.[0]?.games?.rating?.slice(0, 4) || '-'} />
                    </>
                )}
                {sport === 'tennis' && (
                    <>
                        <StatBox label="World Rank" value={`#${player.ranking}`} />
                        <StatBox label="Wins" value={player.wins || '-'} />
                        <StatBox label="Losses" value={player.losses || '-'} />
                        <StatBox label="Titles" value={player.titles || '-'} />
                    </>
                )}
            </div>
        </div>
    );
};

const StatBox = ({ label, value }) => (
    <div className="bg-white rounded-xl shadow p-4 text-center">
        <p className="text-3xl font-bold text-green-700">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
);

export default PlayerProfile;
