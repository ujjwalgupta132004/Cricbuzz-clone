import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import PredictionCard from '../components/common/prediction/PredictionCard';
import { getCricketMatchDetails, getFootballMatchDetails, getTennisMatchDetails } from '../services/api';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    },
    scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
        y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' }, beginAtZero: true }
    }
};

const MatchDetail = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const sportParam = searchParams.get('sport') || 'cricket';
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('scorecard');

    useEffect(() => {
        const fetchMatch = async () => {
            setLoading(true);
            try {
                // Determine sport from ID prefix or query param
                let sport = sportParam;
                if (id.startsWith('mock_f')) sport = 'football';
                else if (id.startsWith('mock_t')) sport = 'tennis';
                else if (id.startsWith('mock_c')) sport = 'cricket';
                const request = sport === 'cricket'
                    ? getCricketMatchDetails(id)
                    : sport === 'football'
                        ? getFootballMatchDetails(id)
                        : getTennisMatchDetails(id);

                const { data } = await request;
                setMatch({ ...data, _sport: sport });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchMatch();
    }, [id, sportParam]);


    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading match...</p></div>;
    if (!match) return <div className="empty-state"><div className="empty-icon">🏟️</div><p>Match not found</p></div>;

    const sport = match._sport || 'cricket';

    const tabs = [
        { key: 'scorecard', label: '📊 Scorecard' },
        { key: 'squads', label: '👥 Squads' },
        { key: 'stats', label: '📈 Stats' },
        { key: 'prediction', label: '🤖 AI Prediction' },
    ];

    return (
        <div className="fade-in">
            {/* Match Header — works for all sports */}
            <MatchHeader match={match} sport={sport} />

            <div className="tab-bar">
                {tabs.map(tab => (
                    <button key={tab.key}
                        className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.key); }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'scorecard' && <ScorecardTab match={match} sport={sport} />}
            {activeTab === 'squads' && <SquadsTab sport={sport} matchId={id} />}
            {activeTab === 'stats' && <StatsTab match={match} sport={sport} />}
            {activeTab === 'prediction' && (
                <PredictionCard sport={sport} matchId={match.id} matchName={match.name} />
            )}
        </div>
    );
};

/* ═══════════════════════════
   Match Header — All Sports
   ═══════════════════════════ */
const MatchHeader = ({ match, sport }) => {
    const isLive = (match.matchStarted && !match.matchEnded) || match.isLive;
    const isCompleted = match.matchEnded || match.isFinished;

    return (
        <div className="hero-card" style={{ marginBottom: 20 }}>
            <div className="hero-content">
                <div className="live-badge">
                    {isLive && <span className="pulse-dot" />}
                    {isLive ? 'LIVE' : isCompleted ? 'COMPLETED' : 'UPCOMING'}
                    {' • '}
                    {sport === 'cricket' ? match.matchType?.toUpperCase() : sport === 'football' ? match.league : match.tournament}
                </div>
                <h1 className="hero-headline">{match.name}</h1>
                <p className="hero-description">
                    {match.venue && `📍 ${match.venue}`}
                    {match.round && ` • ${match.round}`}
                </p>
                <p style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: 14 }}>{match.status}</p>
            </div>
            <div className="hero-scores">
                {sport === 'cricket' && <CricketScoreBox match={match} />}
                {sport === 'football' && <FootballScoreBox match={match} />}
                {sport === 'tennis' && <TennisScoreBox match={match} />}
            </div>
        </div>
    );
};

const CricketScoreBox = ({ match }) => (
    <>
        {match.score?.length > 0 ? match.score.map((inning, idx) => (
            <div key={idx} className="score-row">
                <span className="team-name">{inning.inning?.split(' ')[0] || `Team ${idx + 1}`}</span>
                <div>
                    <span className="team-score">{inning.r}/{inning.w}</span>
                    <span className="team-overs">{inning.o} ov</span>
                </div>
            </div>
        )) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Scores appear when match starts</p>}
    </>
);

const FootballScoreBox = ({ match }) => {
    const parts = match.score?.split(' - ') || [];
    return (
        <div style={{ textAlign: 'center', padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{match.homeTeam?.name}</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-green)' }}>{parts[0] || '-'}</p>
                </div>
                <span style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 700 }}>vs</span>
                <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{match.awayTeam?.name}</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-blue)' }}>{parts[1] || '-'}</p>
                </div>
            </div>
        </div>
    );
};

const TennisScoreBox = ({ match }) => {
    const players = match.name?.split(' vs ') || ['Player 1', 'Player 2'];
    const sets = match.score?.split(', ') || [];
    return (
        <div style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{players[0]}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{players[1]}</span>
            </div>
            {sets.length > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {sets.map((s, i) => (
                        <span key={i} style={{
                            padding: '6px 12px', background: 'var(--bg-input)', borderRadius: 8,
                            fontWeight: 700, color: 'var(--accent-yellow)', fontSize: 16
                        }}>{s}</span>
                    ))}
                </div>
            ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Scores appear when match starts</p>}
        </div>
    );
};

/* ═══════════════════════════
   Squads Tab — All Sports
   ═══════════════════════════ */
const SquadsTab = ({ sport }) => {
    const [squadData, setSquadData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        const fetchSquads = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/search/squads/${sport}?matchId=${id}`);
                setSquadData(data);
            } catch (err) {
                console.error('Failed to load squads', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSquads();
    }, [sport]);

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading squads...</p></div>;
    if (!squadData || !squadData.team1) return <div className="empty-state"><p>Squad information unavailable.</p></div>;

    const { team1Name, team2Name, team1, team2, source } = squadData;

    return (
        <div className="fade-in mt-4">
            <div className="card" style={{ padding: '0px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)' }}>
                {/* Header Banner */}
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, backgroundColor: '#ef4444', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{team1Name.substring(0, 1)}</div>
                        <span style={{ fontSize: 18, fontWeight: 800 }}>{team1Name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 18, fontWeight: 800 }}>{team2Name}</span>
                        <div style={{ width: 32, height: 32, backgroundColor: '#3b82f6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{team2Name.substring(0, 1)}</div>
                    </div>
                </div>

                <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 20, fontWeight: 800, color: 'var(--text-secondary)' }}>
                    {source === 'live-derived' ? 'Live Playing Data' : source === 'live-lineups' ? 'Official Lineups' : 'Squad'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1px', backgroundColor: 'var(--border-color)' }}>
                    {Array.from({ length: Math.max(team1.length, team2.length) }).map((_, i) => (
                        <div key={i} style={{ display: 'contents' }}>
                            {/* Team 1 Player */}
                            <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                {team1[i] ? (
                                    <>
                                        <div style={{ minWidth: 50, height: 50, borderRadius: 25, backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                {team1[i].name} {team1[i].isCaptain && <span style={{ color: 'var(--accent-yellow)' }}>(C)</span>}
                                            </div>
                                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{team1[i].role}</div>
                                        </div>
                                    </>
                                ) : <div />}
                            </div>

                            {/* Team 2 Player */}
                            <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end', textAlign: 'right' }}>
                                {team2[i] ? (
                                    <>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                {team2[i].name} {team2[i].isCaptain && <span style={{ color: 'var(--accent-yellow)' }}>(C)</span>}
                                            </div>
                                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{team2[i].role}</div>
                                        </div>
                                        <div style={{ minWidth: 50, height: 50, borderRadius: 25, backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
                                    </>
                                ) : <div />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════
   Scorecard Tab — All Sports
   ═══════════════════════════ */
const ScorecardTab = ({ match, sport }) => (
    <div>
        {sport === 'cricket' && (
            match.scorecard ? match.scorecard.map((inning, idx) => (
                <div key={idx} className="card mb-4" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-cyan)' }}>{inning.inning}</h3>
                        {match.score && match.score[idx] && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                <span style={{ fontSize: 24, fontWeight: 800 }}>{match.score[idx].r}/{match.score[idx].w}</span>
                                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>({match.score[idx].o} ov)</span>
                            </div>
                        )}
                    </div>
                    {/* Batting table */}
                    <table className="standings-table">
                        <thead>
                            <tr>
                                <th>Batter</th>
                                <th>R</th>
                                <th>B</th>
                                <th>4s</th>
                                <th>6s</th>
                                <th style={{ textAlign: 'right' }}>SR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inning.batting?.map((batter, i) => (
                                <tr key={`bat-${i}`}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{batter.name || batter.batsman?.name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{batter.dismissal || batter['dismissal-text']}</div>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>{batter.r}</td>
                                    <td>{batter.b}</td>
                                    <td>{batter['4s'] || batter['4']}</td>
                                    <td>{batter['6s'] || batter['6']}</td>
                                    <td style={{ textAlign: 'right' }}>{batter.sr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Bowling table */}
                    <table className="standings-table" style={{ borderTop: '2px solid var(--border-color)' }}>
                        <thead>
                            <tr>
                                <th>Bowler</th>
                                <th>O</th>
                                <th>M</th>
                                <th>R</th>
                                <th>W</th>
                                <th style={{ textAlign: 'right' }}>ECO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inning.bowling?.map((bowler, i) => (
                                <tr key={`bowl-${i}`}>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{bowler.name || bowler.bowler?.name}</td>
                                    <td>{bowler.o ?? bowler.overs ?? '-'}</td>
                                    <td>{bowler.m ?? bowler.maidens ?? '-'}</td>
                                    <td>{bowler.r ?? bowler.runs ?? bowler.runsConceded ?? '-'}</td>
                                    <td style={{ fontWeight: 700 }}>{bowler.w ?? bowler.wickets ?? '-'}</td>
                                    <td style={{ textAlign: 'right' }}>{bowler.eco ?? bowler.economy ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )) : match.score?.map((inning, idx) => (
                <div key={idx} className="card mb-4">
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 12 }}>{inning.inning}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontSize: 36, fontWeight: 800 }}>{inning.r}/{inning.w}</span>
                        <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>({inning.o} overs)</span>
                    </div>
                </div>
            ))
        )}

        {sport === 'football' && (
            <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Match Summary</h3>
                <table className="standings-table">
                    <thead>
                        <tr><th>Stat</th><th style={{ textAlign: 'center' }}>{match.homeTeam?.name}</th><th style={{ textAlign: 'center' }}>{match.awayTeam?.name}</th></tr>
                    </thead>
                    <tbody>
                        {getFootballStatRows(match).map(([stat, h, a], i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 500 }}>{stat}</td>
                                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-green)' }}>{h}</td>
                                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-blue)' }}>{a}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {sport === 'tennis' && (
            <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Match Statistics</h3>
                <table className="standings-table">
                    <thead>
                        <tr><th>Stat</th><th style={{ textAlign: 'center' }}>{match.name?.split(' vs ')?.[0]}</th><th style={{ textAlign: 'center' }}>{match.name?.split(' vs ')?.[1]}</th></tr>
                    </thead>
                    <tbody>
                        {[
                            ['Sets Won', '1', '1'],
                            ['Aces', '8', '5'],
                            ['Double Faults', '2', '3'],
                            ['1st Serve %', '68%', '72%'],
                            ['1st Serve Win %', '76%', '71%'],
                            ['Break Points Won', '2/4', '1/3'],
                            ['Winners', '24', '19'],
                            ['Unforced Errors', '15', '21'],
                            ['Total Points', '82', '76'],
                        ].map(([stat, p1, p2], i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 500 }}>{stat}</td>
                                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-green)' }}>{p1}</td>
                                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-yellow)' }}>{p2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* Match Info for all sports */}
        <div className="card mt-4">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Match Info</h3>
            <div className="grid-2">
                <InfoRow label="Sport" value={sport.charAt(0).toUpperCase() + sport.slice(1)} />
                <InfoRow label="Date" value={new Date(match.date || match.dateTimeGMT).toLocaleDateString()} />
                <InfoRow label="Venue" value={match.venue} />
                {sport === 'cricket' && <InfoRow label="Format" value={match.matchType?.toUpperCase()} />}
                {sport === 'football' && <InfoRow label="League" value={match.league} />}
                {sport === 'tennis' && <InfoRow label="Tournament" value={match.tournament} />}
                {sport === 'tennis' && <InfoRow label="Round" value={match.round} />}
            </div>
        </div>
    </div>
);

const getFootballStatRows = (match) => {
    const scoreParts = match.score?.split(' - ') || ['-', '-'];
    const stats = Array.isArray(match.statistics) ? match.statistics : [];
    const homeStats = stats[0]?.statistics || [];
    const awayStats = stats[1]?.statistics || [];

    const statMap = new Map();
    homeStats.forEach((entry) => statMap.set(entry.type, [entry.value ?? '-', '-']));
    awayStats.forEach((entry) => {
        const current = statMap.get(entry.type) || ['-', '-'];
        current[1] = entry.value ?? '-';
        statMap.set(entry.type, current);
    });

    const rows = [['Score', scoreParts[0] || '-', scoreParts[1] || '-']];
    statMap.forEach((value, key) => rows.push([key, value[0], value[1]]));

    return rows.length > 1 ? rows : [
        ['Score', scoreParts[0] || '-', scoreParts[1] || '-'],
        ['Possession', '52%', '48%'],
        ['Shots', '14', '11'],
    ];
};

const InfoRow = ({ label, value }) => (
    <div style={{ padding: '8px 0' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{label}</span>
        <p style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{value || '-'}</p>
    </div>
);


/* ═══════════════════════════
   Stats Tab — All Sports
   ═══════════════════════════ */
const StatsTab = ({ match, sport }) => {
    if (sport === 'cricket') return <CricketStats match={match} />;
    if (sport === 'football') return <FootballStats match={match} />;
    if (sport === 'tennis') return <TennisStats match={match} />;
    return null;
};

const CricketStats = ({ match }) => {
    const score = match.score || [];
    const wormLabels = Array.from({ length: 50 }, (_, i) => `${i + 1}`);

    return (
        <div className="grid-2">
            <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                <h3 className="chart-title">📈 Run Progression (Worm)</h3>
                {score.length > 0 ? (
                    <Line data={{
                        labels: wormLabels,
                        datasets: score.map((s, idx) => ({
                            label: s.inning || `Inning ${idx + 1}`,
                            data: wormLabels.map((_, i) => Math.round(s.r * ((i + 1) / 50 + (Math.random() - 0.5) * 0.08))),
                            borderColor: idx === 0 ? '#22c55e' : '#3b82f6',
                            backgroundColor: idx === 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(59, 130, 246, 0.05)',
                            fill: true, tension: 0.3, pointRadius: 0,
                        }))
                    }} options={chartOptions} />
                ) : <p style={{ color: 'var(--text-muted)' }}>Stats appear when the match starts.</p>}
            </div>
        </div>
    );
};

const FootballStats = ({ match }) => {
    const home = match.homeTeam?.name || 'Home';
    const away = match.awayTeam?.name || 'Away';

    return (
        <div className="grid-2">
            <div className="chart-card">
                <h3 className="chart-title">⚽ Match Stats Comparison</h3>
                <Bar data={{
                    labels: ['Possession %', 'Shots', 'Shots on Target', 'Corners', 'Fouls'],
                    datasets: [
                        { label: home, data: [52, 14, 6, 7, 12], backgroundColor: 'rgba(34, 197, 94, 0.3)', borderColor: '#22c55e', borderWidth: 2, borderRadius: 6 },
                        { label: away, data: [48, 11, 4, 5, 14], backgroundColor: 'rgba(59, 130, 246, 0.3)', borderColor: '#3b82f6', borderWidth: 2, borderRadius: 6 },
                    ]
                }} options={chartOptions} />
            </div>
            <div className="chart-card">
                <h3 className="chart-title">🥅 Possession Split</h3>
                <Doughnut data={{
                    labels: [home, away],
                    datasets: [{
                        data: [52, 48],
                        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(59, 130, 246, 0.6)'],
                        borderColor: ['#22c55e', '#3b82f6'],
                        borderWidth: 2,
                    }]
                }} options={{
                    responsive: true,
                    plugins: { legend: { labels: { color: '#94a3b8' } } }
                }} />
            </div>
        </div>
    );
};

const TennisStats = ({ match }) => {
    const players = match.name?.split(' vs ') || ['Player 1', 'Player 2'];

    return (
        <div className="grid-2">
            <div className="chart-card">
                <h3 className="chart-title">🎾 Serve & Return Stats</h3>
                <Bar data={{
                    labels: ['1st Serve %', 'Aces', 'Winners', 'Unforced Errors', 'Break Points'],
                    datasets: [
                        { label: players[0], data: [68, 8, 24, 15, 2], backgroundColor: 'rgba(34, 197, 94, 0.3)', borderColor: '#22c55e', borderWidth: 2, borderRadius: 6 },
                        { label: players[1], data: [72, 5, 19, 21, 1], backgroundColor: 'rgba(234, 179, 8, 0.3)', borderColor: '#eab308', borderWidth: 2, borderRadius: 6 },
                    ]
                }} options={chartOptions} />
            </div>
            <div className="chart-card">
                <h3 className="chart-title">📊 Points Won</h3>
                <Doughnut data={{
                    labels: [players[0], players[1]],
                    datasets: [{
                        data: [82, 76],
                        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(234, 179, 8, 0.6)'],
                        borderColor: ['#22c55e', '#eab308'],
                        borderWidth: 2,
                    }]
                }} options={{
                    responsive: true,
                    plugins: { legend: { labels: { color: '#94a3b8' } } }
                }} />
            </div>
        </div>
    );
};

export default MatchDetail;
