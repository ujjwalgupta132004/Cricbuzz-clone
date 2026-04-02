import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Radar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    RadialLinearScale, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    RadialLinearScale, Title, Tooltip, Legend, Filler
);

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

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading player...</p></div>;
    if (!player) return <div className="empty-state"><div className="empty-icon">👤</div><p>Player not found</p></div>;

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#94a3b8' } },
        },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
            y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' }, beginAtZero: true }
        }
    };

    const radarOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#94a3b8' } },
        },
        scales: {
            r: {
                ticks: { color: '#64748b', backdropColor: 'transparent' },
                grid: { color: '#1e293b' },
                pointLabels: { color: '#94a3b8', font: { size: 12 } }
            }
        }
    };

    return (
        <div className="fade-in">
            {/* Hero */}
            <div className="player-hero">
                <img
                    src={player.playerImg || 'https://via.placeholder.com/90'}
                    alt={player.name}
                    className="player-avatar"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/90'; }}
                />
                <div>
                    <h1 className="player-name">{player.name}</h1>
                    <p className="player-country">{player.country || player.nationality}</p>
                    <p className="player-meta">
                        {sport === 'cricket' && `${player.role} • ${player.battingStyle}`}
                        {sport === 'football' && `${player.position} • Age: ${player.age}`}
                        {sport === 'tennis' && `Rank: #${player.ranking}`}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stat-grid mb-6">
                {sport === 'cricket' && (
                    <>
                        <StatBox label="Matches" value={player.stats?.matches || '-'} />
                        <StatBox label="Runs" value={player.stats?.runs || '-'} />
                        <StatBox label="Wickets" value={player.stats?.wickets || '-'} />
                        <StatBox label="Average" value={player.stats?.average || '-'} />
                        <StatBox label="Strike Rate" value={player.stats?.strikeRate || '-'} />
                        <StatBox label="Hundreds" value={player.stats?.hundreds || '-'} />
                        <StatBox label="Fifties" value={player.stats?.fifties || '-'} />
                        <StatBox label="Best Score" value={player.stats?.bestScore || '-'} />
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

            {/* Charts */}
            <div className="grid-2 mb-6">
                {/* Career Runs/Goals by Year */}
                {player.careerByYear && (
                    <div className="chart-card">
                        <h3 className="chart-title">📊 Career Performance by Year</h3>
                        <Bar
                            data={{
                                labels: player.careerByYear.labels,
                                datasets: [{
                                    label: sport === 'cricket' ? 'Runs' : 'Goals',
                                    data: player.careerByYear.runs || player.careerByYear.goals,
                                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                                    borderColor: '#06b6d4',
                                    borderWidth: 2,
                                    borderRadius: 6,
                                }]
                            }}
                            options={chartOptions}
                        />
                    </div>
                )}

                {/* Average Trend */}
                {player.careerByYear?.average && (
                    <div className="chart-card">
                        <h3 className="chart-title">📈 Average Trend</h3>
                        <Line
                            data={{
                                labels: player.careerByYear.labels,
                                datasets: [{
                                    label: 'Average',
                                    data: player.careerByYear.average,
                                    borderColor: '#22c55e',
                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 4,
                                    pointBackgroundColor: '#22c55e',
                                }]
                            }}
                            options={chartOptions}
                        />
                    </div>
                )}
            </div>

            {/* Recent Form */}
            {player.recentForm && (
                <div className="chart-card mb-6">
                    <h3 className="chart-title">🔥 Recent Form (Last 8 Innings)</h3>
                    <Bar
                        data={{
                            labels: player.recentForm.map((_, i) => `Inn ${i + 1}`),
                            datasets: [{
                                label: 'Runs',
                                data: player.recentForm,
                                backgroundColor: player.recentForm.map(v =>
                                    v >= 100 ? 'rgba(34, 197, 94, 0.6)' :
                                    v >= 50 ? 'rgba(59, 130, 246, 0.6)' :
                                    v >= 30 ? 'rgba(234, 179, 8, 0.4)' :
                                    'rgba(239, 68, 68, 0.4)'
                                ),
                                borderColor: player.recentForm.map(v =>
                                    v >= 100 ? '#22c55e' :
                                    v >= 50 ? '#3b82f6' :
                                    v >= 30 ? '#eab308' :
                                    '#ef4444'
                                ),
                                borderWidth: 2,
                                borderRadius: 6,
                            }]
                        }}
                        options={chartOptions}
                    />
                </div>
            )}

            {/* Skill Radar */}
            {sport === 'cricket' && player.stats && (
                <div className="chart-card">
                    <h3 className="chart-title">🎯 Player Skills Radar</h3>
                    <Radar
                        data={{
                            labels: ['Batting', 'Bowling', 'Fielding', 'Fitness', 'Experience', 'Consistency'],
                            datasets: [{
                                label: player.name,
                                data: [
                                    Math.min(100, (player.stats.average || 30) * 2),
                                    Math.min(100, (player.stats.wickets || 0) * 5),
                                    75,
                                    85,
                                    Math.min(100, (player.stats.matches || 50) / 3),
                                    Math.min(100, (player.stats.average || 30) * 1.5)
                                ],
                                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                borderColor: '#a855f7',
                                borderWidth: 2,
                                pointBackgroundColor: '#a855f7',
                            }]
                        }}
                        options={radarOptions}
                    />
                </div>
            )}
        </div>
    );
};

const StatBox = ({ label, value }) => (
    <div className="stat-box">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

export default PlayerProfile;
