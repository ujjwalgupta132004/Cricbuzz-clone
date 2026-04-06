import { useState, useEffect } from 'react';
import api from '../services/api';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [meta, setMeta] = useState({ source: 'mock', updatedAt: null });

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const url = filter === 'all' ? '/news' : `/news?sport=${filter}`;
                const { data } = await api.get(url);
                setNews(data.items || []);
                setMeta({ source: data.source, updatedAt: data.updatedAt });
            } catch (err) {
                console.error(err);
                setNews([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [filter]);

    const filters = [
        { key: 'all', label: '📰 All' },
        { key: 'cricket', label: '🏏 Cricket' },
        { key: 'football', label: '⚽ Football' },
        { key: 'tennis', label: '🎾 Tennis' },
    ];

    return (
        <div className="fade-in">
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>📰 Sports News</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
                {meta.source === 'gnews' ? 'Live provider connected' : 'Showing fallback feed'}
                {meta.updatedAt ? ` • Updated ${new Date(meta.updatedAt).toLocaleString()}` : ''}
            </p>

            <div className="sport-tabs">
                {filters.map(f => (
                    <button
                        key={f.key}
                        className={`sport-tab ${filter === f.key ? 'active-cricket' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : news.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📰</div>
                    <p>No news articles available right now.</p>
                </div>
            ) : (
                <div className="match-cards-row">
                    {news.map(item => (
                        <div key={item.id} className="news-card">
                            <div className="news-tag">{item.sport}</div>
                            <div className="news-title">{item.title}</div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
                                {item.summary}
                            </p>
                            <div className="news-time">
                                {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recently'} • {item.source}
                            </div>
                            {item.url && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ display: 'inline-block', marginTop: 10, fontSize: 13, color: 'var(--accent-cyan)' }}
                                >
                                    Read full story
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default News;
