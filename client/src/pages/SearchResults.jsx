import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
                setResults(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Search failed', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Searching for '{query}'...</p></div>;

    return (
        <div className="fade-in">
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
                🔍 Search Results for &quot;{query}&quot;
            </h1>

            {results.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">❌</div>
                    <p>No results found for &quot;{query}&quot; across any sport.</p>
                </div>
            ) : (
                <div className="grid-2">
                    {results.map((item, idx) => (
                        <div key={idx} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 24, background: 'var(--bg-input)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                            }}>
                                {item.sport === 'cricket' ? '🏏' : item.sport === 'football' ? '⚽' : '🎾'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                                    {item.type} • {item.sport}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{item.name}</h3>
                                {item.subtitle && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{item.subtitle}</p>}
                            </div>
                            <Link to={item.link} className="btn" style={{ padding: '8px 16px', background: 'var(--bg-input)' }}>
                                View
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
