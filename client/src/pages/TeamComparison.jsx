import { useState, useEffect, useRef } from 'react';
import { useSport } from '../context/SportsContext';
import SportSelector from '../components/common/SportSelector';
import api from '../services/api';
import { Radar, Doughnut } from 'react-chartjs-2';

const compareOptions = {
    cricket: [
        { id: 'c_t_ind', name: 'India', type: 'Team' },
        { id: 'c_t_aus', name: 'Australia', type: 'Team' },
        { id: 'c_p_vk', name: 'Virat Kohli', type: 'Player' },
        { id: 'c_p_jb', name: 'Jasprit Bumrah', type: 'Player' }
    ],
    football: [
        { id: 'f_t_mun', name: 'Man Utd', type: 'Team' },
        { id: 'f_t_liv', name: 'Liverpool', type: 'Team' },
        { id: 'f_p_lm', name: 'Lionel Messi', type: 'Player' },
        { id: 'f_p_cr', name: 'C. Ronaldo', type: 'Player' }
    ],
    tennis: [
        { id: 't_p_ca', name: 'Carlos Alcaraz', type: 'Player' },
        { id: 't_p_js', name: 'Jannik Sinner', type: 'Player' },
        { id: 't_p_nd', name: 'Novak Djokovic', type: 'Player' },
        { id: 't_p_rn', name: 'Rafael Nadal', type: 'Player' }
    ]
};

const TeamComparison = () => {
    const { activeSport } = useSport();
    const [loading, setLoading] = useState(false);
    const [entity1, setEntity1] = useState('');
    const [entity2, setEntity2] = useState('');
    const [comparisonData, setComparisonData] = useState(null);

    const options = compareOptions[activeSport] || [];

    useEffect(() => {
        setEntity1('');
        setEntity2('');
        setComparisonData(null);
    }, [activeSport]);

    const handleCompare = async () => {
        if (!entity1 || !entity2) return;
        setLoading(true);
        try {
            // Passing the IDs exactly. If they mix player vs team, our backend must handle it.
            const res = await api.get(`/compare/${activeSport}?e1=${entity1}&e2=${entity2}`);
            setComparisonData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
                📊 Dynamic Comparison Studio
            </h1>
            <SportSelector />

            <div className="card mb-6" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                    Select any two entities (Player vs Player, Team vs Team, or Player vs Team) to compare their performance.
                </p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <EntitySearch activeSport={activeSport} value={entity1} onSelect={setEntity1} placeholder="Search first player or team..." />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-muted)' }}>VS</span>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <EntitySearch activeSport={activeSport} value={entity2} onSelect={setEntity2} placeholder="Search second player or team..." />
                    </div>
                    <button className="btn btn-primary" onClick={handleCompare} disabled={!entity1 || !entity2 || loading}>
                        {loading ? 'Comparing...' : 'Compare Insights'}
                    </button>
                </div>
            </div>

            {comparisonData && (
                <ComparisonResults data={comparisonData} activeSport={activeSport} />
            )}
        </div>
    );
};

const ComparisonResults = ({ data, activeSport }) => {
    const { e1, e2, h2h } = data;

    if (!e1 || !e2) return null;

    const chartColors = {
        bg1: 'rgba(34, 197, 94, 0.3)', border1: '#22c55e',
        bg2: 'rgba(59, 130, 246, 0.3)', border2: '#3b82f6',
    };

    return (
        <div className="fade-in mt-6">
            <div className="hero-card" style={{ marginBottom: 24, textAlign: 'center' }}>
                <div className="hero-content">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-green)' }}>{e1.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e1.type}</div>
                        </div>
                        <span style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 700 }}>VS</span>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-blue)' }}>{e2.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e2.type}</div>
                        </div>
                    </div>
                    {h2h && (
                        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 14 }}>
                            Direct Matchups: <strong>{h2h.total}</strong> •{' '}
                            <span style={{ color: 'var(--accent-green)' }}>{e1.name} won {h2h.e1Wins}</span> •{' '}
                            <span style={{ color: 'var(--accent-blue)' }}>{e2.name} won {h2h.e2Wins}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* General Stats Comparison Component */}
            <div className="grid-2">
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="standings-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center', color: 'var(--accent-green)' }}>{e1.shortname || e1.name}</th>
                                <th style={{ textAlign: 'center' }}>Key Stat</th>
                                <th style={{ textAlign: 'center', color: 'var(--accent-blue)' }}>{e2.shortname || e2.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getStatsRows(e1, e2).map(([v1, label, v2], idx) => (
                                <tr key={idx}>
                                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{v1}</td>
                                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>{label}</td>
                                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{v2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="chart-card">
                    <h3 className="chart-title">Radar Profile</h3>
                    {e1.radar && e2.radar ? (
                        <Radar data={{
                            labels: e1.radar.labels,
                            datasets: [
                                { label: e1.name, data: e1.radar.data, backgroundColor: chartColors.bg1, borderColor: chartColors.border1, borderWidth: 2 },
                                { label: e2.name, data: e2.radar.data, backgroundColor: chartColors.bg2, borderColor: chartColors.border2, borderWidth: 2 }
                            ]
                        }} options={{
                            scales: { r: { ticks: { display: false }, grid: { color: '#1e293b' }, pointLabels: { color: '#94a3b8' } } },
                            plugins: { legend: { labels: { color: '#94a3b8' } } }
                        }} />
                    ) : <p style={{ color: 'var(--text-muted)', padding: 20 }}>Radar stats incompatible between these two entity types.</p>}
                </div>
            </div>
        </div>
    );
};

function getStatsRows(e1, e2) {
    const extractKeys = (stats) => Object.keys(stats || {}).filter(k => !['radar'].includes(k));
    const allKeys = [...new Set([...extractKeys(e1.stats), ...extractKeys(e2.stats)])];
    
    return allKeys.map(key => [
        e1.stats?.[key] || '-',
        key.replace(/([A-Z])/g, ' $1').trim(), // format camelCase to Words
        e2.stats?.[key] || '-'
    ]);
}

const EntitySearch = ({ activeSport, value, onSelect, placeholder }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (val) => {
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            return;
        }

        try {
            const res = await api.get(`/search?q=${val}`);
            // Filter by active sport so we only pair same-sport entities
            const filtered = res.data.filter(i => i.sport === activeSport);
            setResults(filtered);
            setShowDropdown(true);
        } catch {
            setResults([]);
        }
    };

    return (
        <div style={{ position: 'relative' }} ref={wrapperRef}>
            <input
                type="text"
                className="form-input"
                placeholder={value ? 'Selected. Type to change...' : placeholder}
                value={query}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            />
            {value && !query && (
                <div style={{ position: 'absolute', right: 10, top: 12, fontSize: 13, color: 'var(--accent-green)', fontWeight: 800 }}>✓ Selected</div>
            )}
            
            {showDropdown && results.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                    zIndex: 200, maxHeight: 200, overflowY: 'auto', borderRadius: '4px', marginTop: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    {results.map((r, i) => (
                        <div
                            key={i}
                            style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--bg-card)' }}
                            onClick={() => {
                                onSelect(r.name);
                                setQuery(r.name);
                                setShowDropdown(false);
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.type}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamComparison;
