import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFootballMatches } from '../services/api';
import { FaChevronRight } from 'react-icons/fa';

const FootballPage = () => {
    const [matches, setMatches] = useState({ live: [], completed: [], upcoming: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getFootballMatches();
                setMatches(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="loading-container"><div className="spinner" /><p>Loading football...</p></div>
    );

    const allMatches = [...(matches.live || []), ...(matches.upcoming || []), ...(matches.completed || [])];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>⚽ Football</h1>
                <Link to="/series/football/stats" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    View League Stats
                </Link>
            </div>
            <div className="match-cards-row">
                {allMatches.map((m, i) => (
                    <Link key={m.id || i} to={`/match/${m.id}`} className="match-card" style={{ textDecoration: 'none' }}>
                        <div className="match-header">
                            <span className="match-league">
                                {m.isLive && <span className="live-dot" />}
                                {m.league || 'Football'}
                            </span>
                            <FaChevronRight className="match-arrow" />
                        </div>
                        <div className="match-teams">
                            <div className="match-team-row">
                                <span className="match-team-name">{m.homeTeam?.name || 'Home'}</span>
                                <span className="match-team-score">{m.score?.split(' - ')?.[0] || '-'}</span>
                            </div>
                            <div className="match-team-row">
                                <span className="match-team-name">{m.awayTeam?.name || 'Away'}</span>
                                <span className="match-team-score">{m.score?.split(' - ')?.[1] || '-'}</span>
                            </div>
                        </div>
                        {m.status && <div className="match-footer">{m.status}</div>}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FootballPage;
