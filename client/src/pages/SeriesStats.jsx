import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const SeriesStats = () => {
    const { id, sport } = useParams();
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('mostRuns');

    const categories = {
        cricket: [
            { id: 'mostRuns', label: 'Most Runs', group: 'Batting' },
            { id: 'highestScores', label: 'Highest Scores', group: 'Batting' },
            { id: 'bestBattingAvg', label: 'Best Batting Average', group: 'Batting' },
            { id: 'bestBattingSR', label: 'Best Batting Strike Rate', group: 'Batting' },
            { id: 'mostHundreds', label: 'Most Hundreds', group: 'Batting' },
            { id: 'mostFifties', label: 'Most Fifties', group: 'Batting' },
            { id: 'mostFours', label: 'Most Fours', group: 'Batting' },
            { id: 'mostSixes', label: 'Most Sixes', group: 'Batting' },
            { id: 'mostNineties', label: 'Most Nineties', group: 'Batting' },
            { id: 'mostWickets', label: 'Most Wickets', group: 'Bowling' },
            { id: 'bestBowlingAvg', label: 'Best Bowling Average', group: 'Bowling' },
            { id: 'bestBowling', label: 'Best Bowling', group: 'Bowling' },
            { id: 'most5Wickets', label: 'Most 5 Wickets Haul', group: 'Bowling' },
            { id: 'bestEconomy', label: 'Best Economy', group: 'Bowling' },
            { id: 'bestBowlingSR', label: 'Best Bowling Strike Rate', group: 'Bowling' }
        ],
        football: [
            { id: 'mostGoals', label: 'Most Goals', group: 'Attacking' },
            { id: 'mostAssists', label: 'Most Assists', group: 'Attacking' },
            { id: 'shotsOnTarget', label: 'Shots on Target', group: 'Attacking' },
            { id: 'cleanSheets', label: 'Clean Sheets', group: 'Defending' },
            { id: 'mostTackles', label: 'Most Tackles', group: 'Defending' },
            { id: 'interceptions', label: 'Interceptions', group: 'Defending' },
            { id: 'yellowCards', label: 'Yellow Cards', group: 'Discipline' },
            { id: 'redCards', label: 'Red Cards', group: 'Discipline' }
        ],
        tennis: [
            { id: 'mostAces', label: 'Most Aces', group: 'Serving' },
            { id: '1stServeWinPerc', label: '1st Serve Win %', group: 'Serving' },
            { id: 'fastestServe', label: 'Fastest Serve', group: 'Serving' },
            { id: 'breakPointsWon', label: 'Break Points Won', group: 'Returning' },
            { id: 'returnWinners', label: 'Return Winners', group: 'Returning' },
            { id: 'bestWinPerc', label: 'Best Win %', group: 'Overall' }
        ]
    };

    const currentSport = sport || 'cricket';
    const activeCategories = categories[currentSport] || [];

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/search/series-stats/${currentSport}`);
                setStatsData(data);
                if (activeCategories.length > 0) setActiveCategory(activeCategories[0].id);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [currentSport]);

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading Statistics Dashboard...</p></div>;
    if (!statsData) return <div className="empty-state"><p>Stats unavailable for this tournament.</p></div>;

    // Grouping for sidebar
    const grouped = activeCategories.reduce((acc, curr) => {
        if (!acc[curr.group]) acc[curr.group] = [];
        acc[curr.group].push(curr);
        return acc;
    }, {});

    const renderTable = () => {
        const list = statsData[activeCategory] || [];
        if (list.length === 0) return <div className="empty-state"><p>No statistical records found for this category.</p></div>;

        const categoryConfigs = {
            cricket: {
                mostRuns: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', 'AVG', 'SR', '4s', '6s'], map: p => [p.player, p.matches, p.inns, p.runs, p.avg, p.sr, p.fours, p.sixes] },
                highestScores: { headers: ['PLAYER', 'MATCHES', 'INNS', 'SCORE', 'SR', '4s', '6s'], map: p => [p.player, p.matches, p.inns, p.score, p.sr, p.fours, p.sixes] },
                bestBattingAvg: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', 'AVG', 'SR'], map: p => [p.player, p.matches, p.inns, p.runs, p.avg, p.sr] },
                bestBattingSR: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', 'AVG', 'SR'], map: p => [p.player, p.matches, p.inns, p.runs, p.avg, p.sr] },
                mostHundreds: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', '100s', '50s'], map: p => [p.player, p.matches, p.inns, p.runs, p.hundreds, p.fifties] },
                mostFifties: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', '100s', '50s'], map: p => [p.player, p.matches, p.inns, p.runs, p.hundreds, p.fifties] },
                mostFours: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', '4s'], map: p => [p.player, p.matches, p.inns, p.runs, p.fours] },
                mostSixes: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', '6s'], map: p => [p.player, p.matches, p.inns, p.runs, p.sixes] },
                mostNineties: { headers: ['PLAYER', 'MATCHES', 'INNS', 'RUNS', '90s'], map: p => [p.player, p.matches, p.inns, p.runs, p.nineties] },
                
                mostWickets: { headers: ['PLAYER', 'MATCHES', 'INNS', 'WKTS', 'AVG', 'ECON', 'BB'], map: p => [p.player, p.matches, p.inns, p.wkts, p.avg, p.econ, p.bb] },
                bestBowlingAvg: { headers: ['PLAYER', 'MATCHES', 'INNS', 'WKTS', 'AVG', 'ECON', 'BB'], map: p => [p.player, p.matches, p.inns, p.wkts, p.avg, p.econ, p.bb] },
                bestBowling: { headers: ['PLAYER', 'MATCHES', 'INNS', 'OVERS', 'BB', 'ECON'], map: p => [p.player, p.matches, p.inns, p.overs, p.bb, p.econ] },
                most5Wickets: { headers: ['PLAYER', 'MATCHES', 'INNS', 'WKTS', '5W'], map: p => [p.player, p.matches, p.inns, p.wkts, p.fiveW] },
                bestEconomy: { headers: ['PLAYER', 'MATCHES', 'INNS', 'OVERS', 'WKTS', 'ECON'], map: p => [p.player, p.matches, p.inns, p.overs, p.wkts, p.econ] },
                bestBowlingSR: { headers: ['PLAYER', 'MATCHES', 'INNS', 'OVERS', 'WKTS', 'SR'], map: p => [p.player, p.matches, p.inns, p.overs, p.wkts, p.sr] }
            },
            football: {
                mostGoals: { headers: ['PLAYER', 'MATCHES', 'GOALS', 'ASSISTS', 'SHOTS'], map: p => [p.player, p.matches, p.goals, p.assists, p.shots] },
                mostAssists: { headers: ['PLAYER', 'MATCHES', 'ASSISTS', 'CHANCES', 'PASSES'], map: p => [p.player, p.matches, p.assists, p.chances, p.passes] },
                shotsOnTarget: { headers: ['PLAYER', 'MATCHES', 'SHOTS', 'ON TARGET', 'GOALS'], map: p => [p.player, p.matches, p.shots, p.onTarget, p.goals] },
                cleanSheets: { headers: ['PLAYER', 'MATCHES', 'CLEAN SHEETS', 'SAVES'], map: p => [p.player, p.matches, p.cleanSheets, p.saves] },
                mostTackles: { headers: ['PLAYER', 'MATCHES', 'TACKLES', 'WON %'], map: p => [p.player, p.matches, p.tackles, p.tacklesWon] },
                interceptions: { headers: ['PLAYER', 'MATCHES', 'INTERCEPTIONS', 'CLEARANCES'], map: p => [p.player, p.matches, p.interceptions, p.clearances] },
                yellowCards: { headers: ['PLAYER', 'MATCHES', 'YELLOW', 'FOULS'], map: p => [p.player, p.matches, p.yellow, p.fouls] },
                redCards: { headers: ['PLAYER', 'MATCHES', 'RED', 'FOULS'], map: p => [p.player, p.matches, p.red, p.fouls] }
            },
            tennis: {
                mostAces: { headers: ['PLAYER', 'MATCHES', 'SETS', 'ACES', 'DOUBLE FAULTS'], map: p => [p.player, p.matches, p.sets, p.aces, p.doubleFaults] },
                '1stServeWinPerc': { headers: ['PLAYER', 'MATCHES', '1ST SERVE %', '1ST SERVE PTS WON %'], map: p => [p.player, p.matches, p.firstServePerc, p.firstServeWinPerc] },
                fastestServe: { headers: ['PLAYER', 'MATCHES', 'FASTEST (KM/H)', 'AVG 1ST (KM/H)'], map: p => [p.player, p.matches, p.fastestServe, p.avgServe] },
                breakPointsWon: { headers: ['PLAYER', 'MATCHES', 'BP WON', 'BP OPORTUNITIES', 'CONVERSION %'], map: p => [p.player, p.matches, p.bpWon, p.bpTotal, p.bpConv] },
                returnWinners: { headers: ['PLAYER', 'MATCHES', 'RETURN WINNERS', 'TOTAL RETURN PTS'], map: p => [p.player, p.matches, p.returnWinners, p.returnPts] },
                bestWinPerc: { headers: ['PLAYER', 'MATCHES', 'SETS PLAYED', 'WIN %'], map: p => [p.player, p.matches, p.sets, p.winPerc] }
            }
        };

        const activeConfig = categoryConfigs[currentSport]?.[activeCategory] || {
            headers: ['PLAYER', 'STAT 1', 'STAT 2'],
            map: p => [p.player, '-', '-']
        };

        const headers = activeConfig.headers;
        const rowMapper = activeConfig.map;

        return (
            <table className="standings-table">
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list.map((row, i) => {
                        const cols = rowMapper(row);
                        return (
                            <tr key={i}>
                                {cols.map((col, j) => (
                                    <td key={j} style={j === 0 ? { color: 'var(--accent-blue)', fontWeight: 600 } : { fontWeight: 500 }}>
                                        {col}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div className="fade-in">
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
                {statsData.seriesName}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Official Tournament Statistics Directory</p>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 24, alignItems: 'start' }}>
                {/* Visual Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {Object.entries(grouped).map(([groupName, categories]) => (
                        <div key={groupName} className="card" style={{ padding: '0px', overflow: 'hidden' }}>
                            <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)', fontWeight: 800, color: 'var(--text-muted)' }}>
                                {groupName}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {categories.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setActiveCategory(c.id)}
                                        style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            background: activeCategory === c.id ? 'var(--accent-green)' : 'transparent',
                                            color: activeCategory === c.id ? 'var(--bg-card)' : 'var(--text-primary)',
                                            fontWeight: activeCategory === c.id ? 700 : 500,
                                            borderBottom: '1px solid var(--border-color)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Table Panel */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-elevated)', borderBottom: '2px solid var(--accent-green)', color: 'var(--text-primary)', fontWeight: 800, fontSize: 18 }}>
                        {activeCategories.find(c => c.id === activeCategory)?.label || 'Statistics'}
                    </div>
                    {renderTable()}
                </div>
            </div>
        </div>
    );
};

export default SeriesStats;
