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
                const { data } = await api.get(`/standings/${activeSport}`);
                setStandings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setStandings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, [activeSport]);

    const renderCricketTable = () => (
        <table className="standings-table">
            <thead>
                <tr>
                    <th style={{ width: 40, textAlign: 'center' }}>Pos</th>
                    <th>Team</th>
                    <th style={{ textAlign: 'center' }}>Pld</th>
                    <th style={{ width: 40, textAlign: 'center' }}>W</th>
                    <th style={{ width: 40, textAlign: 'center' }}>L</th>
                    <th style={{ textAlign: 'center' }}>NRR</th>
                    <th style={{ width: 50, textAlign: 'center' }}>Pts</th>
                </tr>
            </thead>
            <tbody>
                {standings.map((t, idx) => (
                    <tr key={idx}>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{t.rank}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.team}</td>
                        <td style={{ textAlign: 'center' }}>{t.pld}</td>
                        <td style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 600 }}>{t.w}</td>
                        <td style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{t.l}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>{t.nrr}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--accent-cyan)' }}>{t.pts}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderFootballTable = () => (
        <table className="standings-table">
            <thead>
                <tr>
                    <th style={{ width: 40, textAlign: 'center' }}>Pos</th>
                    <th>Team</th>
                    <th style={{ textAlign: 'center' }}>Pld</th>
                    <th style={{ width: 40, textAlign: 'center' }}>W</th>
                    <th style={{ width: 40, textAlign: 'center' }}>D</th>
                    <th style={{ width: 40, textAlign: 'center' }}>L</th>
                    <th style={{ textAlign: 'center' }}>GF</th>
                    <th style={{ textAlign: 'center' }}>GA</th>
                    <th style={{ textAlign: 'center' }}>GD</th>
                    <th style={{ width: 50, textAlign: 'center' }}>Pts</th>
                </tr>
            </thead>
            <tbody>
                {standings.map((t, idx) => (
                    <tr key={idx}>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{t.rank}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.team}</td>
                        <td style={{ textAlign: 'center' }}>{t.pld}</td>
                        <td style={{ textAlign: 'center', color: 'var(--accent-green)' }}>{t.w}</td>
                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{t.d}</td>
                        <td style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{t.l}</td>
                        <td style={{ textAlign: 'center' }}>{t.gf}</td>
                        <td style={{ textAlign: 'center' }}>{t.ga}</td>
                        <td style={{ textAlign: 'center' }}>{t.gd}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--accent-blue)' }}>{t.pts}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderTennisTable = () => (
        <table className="standings-table">
            <thead>
                <tr>
                    <th style={{ width: 60, textAlign: 'center' }}>Rank</th>
                    <th>Player</th>
                    <th style={{ textAlign: 'center' }}>Tournaments Played</th>
                    <th style={{ width: 80, textAlign: 'center' }}>Points</th>
                </tr>
            </thead>
            <tbody>
                {standings.map((t, idx) => (
                    <tr key={idx}>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-yellow)' }}>{t.rank}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.player}</td>
                        <td style={{ textAlign: 'center' }}>{t.tournaments}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800 }}>{t.points?.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="fade-in">
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
                📊 {activeSport === 'cricket' ? 'IPL Table 2026' : activeSport === 'football' ? 'Premier League Table 2025/26' : 'ATP Rankings (Live)'}
            </h1>
            <SportSelector />

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : standings.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>No standings data available for {activeSport}.</p>
                </div>
            ) : (
                <div className="card" style={{ overflow: 'x-auto', padding: 0 }}>
                    {activeSport === 'cricket' && renderCricketTable()}
                    {activeSport === 'football' && renderFootballTable()}
                    {activeSport === 'tennis' && renderTennisTable()}
                </div>
            )}
        </div>
    );
};

export default Standings;
