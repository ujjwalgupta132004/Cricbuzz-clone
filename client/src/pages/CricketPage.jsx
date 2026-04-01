import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCricketMatches } from '../services/api';
import api from '../services/api';
import { FaChevronRight } from 'react-icons/fa';

const CricketPage = () => {
    const [matches, setMatches] = useState({ live: [], completed: [], upcoming: [] });
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('matches');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [mRes, sRes] = await Promise.allSettled([
                    getCricketMatches(),
                    api.get('/cricket/series')
                ]);
                if (mRes.status === 'fulfilled') setMatches(mRes.value.data);
                if (sRes.status === 'fulfilled') setSeries(sRes.value.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const tabs = [
        { key: 'matches', label: '🏏 Matches' },
        { key: 'series', label: '📋 Series' },
    ];

    if (loading) return (
        <div className="loading-container"><div className="spinner" /><p>Loading cricket...</p></div>
    );

    const allMatches = [...(matches.live || []), ...(matches.upcoming || []), ...(matches.completed || [])];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>🏏 Cricket</h1>
                <Link to="/series/cricket/stats" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    View Tournament Stats
                </Link>
            </div>

            <div className="tab-bar">
                {tabs.map(t => (
                    <button key={t.key} className={`tab-item ${activeTab === t.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.key)}>{t.label}</button>
                ))}
            </div>

            {activeTab === 'matches' && (
                <div className="match-cards-row">
                    {allMatches.map((m, i) => (
                        <Link key={m.id || i} to={`/match/${m.id}`} className="match-card" style={{ textDecoration: 'none' }}>
                            <div className="match-header">
                                <span className="match-league">
                                    {m.matchStarted && !m.matchEnded && <span className="live-dot" />}
                                    {m.matchType?.toUpperCase()}
                                </span>
                                <FaChevronRight className="match-arrow" />
                            </div>
                            <div className="match-teams">
                                <div className="match-team-row">
                                    <span className="match-team-name">{m.teamInfo?.[0]?.shortname || m.teams?.[0]}</span>
                                    <span className="match-team-score">
                                        {m.score?.[0] ? `${m.score[0].r}/${m.score[0].w}` : '-'}
                                    </span>
                                </div>
                                <div className="match-team-row">
                                    <span className="match-team-name">{m.teamInfo?.[1]?.shortname || m.teams?.[1]}</span>
                                    <span className="match-team-score">
                                        {m.score?.[1] ? `${m.score[1].r}/${m.score[1].w}` : '-'}
                                    </span>
                                </div>
                            </div>
                            {m.status && <div className="match-footer">{m.status}</div>}
                        </Link>
                    ))}
                </div>
            )}

            {activeTab === 'series' && (
                <div className="match-cards-row">
                    {series.map((s, i) => (
                        <div key={s.id || i} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.name || s.seriesName}</h3>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {s.startDate && `${new Date(s.startDate).toLocaleDateString()} — ${new Date(s.endDate).toLocaleDateString()}`}
                                    </p>
                                </div>
                                <Link to={`/series/cricket/stats`} className="btn btn-sm btn-primary" style={{ fontSize: 12, textDecoration: 'none' }}>
                                    View Stats
                                </Link>
                            </div>
                            {(s.odi || s.t20 || s.test) && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                    {s.odi > 0 && <span className="btn btn-sm btn-ghost">ODI: {s.odi}</span>}
                                    {s.t20 > 0 && <span className="btn btn-sm btn-ghost">T20: {s.t20}</span>}
                                    {s.test > 0 && <span className="btn btn-sm btn-ghost">Test: {s.test}</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CricketPage;
