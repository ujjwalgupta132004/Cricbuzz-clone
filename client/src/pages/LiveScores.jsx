import { useSocket } from '../context/SocketContext';
import { useSport } from '../context/SportsContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCricketMatches, getFootballMatches, getTennisMatches } from '../services/api';
import SportSelector from '../components/common/SportSelector';
import { FaChevronRight } from 'react-icons/fa';

const API_MAP = {
    cricket: getCricketMatches,
    football: getFootballMatches,
    tennis: getTennisMatches,
};

const LiveScores = () => {
    const { socket, isConnected } = useSocket();
    const { activeSport } = useSport();
    const [matches, setMatches] = useState({ live: [], completed: [], upcoming: [] });
    const [loading, setLoading] = useState(true);

    // Initial fetch
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

    // Socket updates
    useEffect(() => {
        if (!socket) return;

        socket.emit('subscribeSport', activeSport);

        socket.on('liveScoreUpdate', (data) => {
            if (data.sport === activeSport) {
                setMatches(prev => ({
                    live: data.live || prev.live,
                    completed: data.completed || prev.completed,
                    upcoming: data.upcoming || prev.upcoming
                }));
            }
        });

        return () => {
            socket.off('liveScoreUpdate');
        };
    }, [socket, activeSport]);

    return (
        <div className="fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>📡 Live Scores</h1>
                <span className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                    <span className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`} />
                    {isConnected ? 'Real-time updates' : 'Disconnected'}
                </span>
            </div>

            <SportSelector />

            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                    <p>Loading {activeSport} matches...</p>
                </div>
            ) : (
                <>
                    {/* Live Matches */}
                    {matches.live?.length > 0 && (
                        <section className="mb-6">
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-red)', marginBottom: 14 }}>
                                🔴 Live Now ({matches.live.length})
                            </h2>
                            <div className="match-cards-row">
                                {matches.live.map((match, idx) => (
                                    <LiveMatchCard key={match.id || idx} match={match} sport={activeSport} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Upcoming */}
                    {matches.upcoming?.length > 0 && (
                        <section className="mb-6">
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 14 }}>
                                📅 Upcoming ({matches.upcoming.length})
                            </h2>
                            <div className="match-cards-row">
                                {matches.upcoming.map((match, idx) => (
                                    <LiveMatchCard key={match.id || idx} match={match} sport={activeSport} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Completed */}
                    {matches.completed?.length > 0 && (
                        <section className="mb-6">
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14 }}>
                                ✅ Completed ({matches.completed.length})
                            </h2>
                            <div className="match-cards-row">
                                {matches.completed.map((match, idx) => (
                                    <LiveMatchCard key={match.id || idx} match={match} sport={activeSport} />
                                ))}
                            </div>
                        </section>
                    )}

                    {matches.live?.length === 0 && matches.upcoming?.length === 0 && matches.completed?.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🏟️</div>
                            <p>No {activeSport} matches found right now.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const LiveMatchCard = ({ match, sport }) => {
    const isLive = match.matchStarted && !match.matchEnded || match.isLive;
    const isFinished = match.matchEnded || match.isFinished;

    const team1Name = match.teamInfo?.[0]?.shortname || match.homeTeam?.name || match.teams?.[0] || 'Team 1';
    const team2Name = match.teamInfo?.[1]?.shortname || match.awayTeam?.name || match.teams?.[1] || 'Team 2';

    let score1 = '-', score2 = '-';
    if (sport === 'cricket' && match.score?.length > 0) {
        score1 = `${match.score[0].r}/${match.score[0].w}`;
        score2 = match.score[1] ? `${match.score[1].r}/${match.score[1].w}` : 'Yet to bat';
    } else if (match.score && typeof match.score === 'string') {
        const parts = match.score.split(' - ');
        score1 = parts[0] || '-';
        score2 = parts[1] || '-';
    }

    return (
        <Link to={`/match/${match.id}?sport=${sport}`} className="match-card" style={{ textDecoration: 'none' }}>
            <div className="match-header">
                <span className="match-league">
                    {isLive && <span className="live-dot" />}
                    {match.matchType?.toUpperCase() || match.league || match.tournament || sport}
                </span>
                <FaChevronRight className="match-arrow" />
            </div>

            <div className="match-teams">
                <div className="match-team-row">
                    <span className="match-team-name">{team1Name}</span>
                    <span className="match-team-score">{score1}</span>
                </div>
                <div className="match-team-row">
                    <span className="match-team-name">{team2Name}</span>
                    <span className="match-team-score">{score2}</span>
                </div>
            </div>

            {match.status && (
                <div className={`match-footer ${!isLive && !isFinished ? 'match-status-upcoming' : ''}`}>
                    {match.status}
                </div>
            )}
        </Link>
    );
};

export default LiveScores;
