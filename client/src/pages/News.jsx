import { useState, useEffect } from 'react';
import api from '../services/api';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const url = filter === 'all' ? '/news' : `/news?sport=${filter}`;
                const { data } = await api.get(url);
                setNews(data);
            } catch (err) {
                console.error(err);
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
            ) : (
                <div className="match-cards-row">
                    {news.map(item => (
                        <div key={item.id} className="news-card">
                            <div className="news-tag">{item.sport}</div>
                            <div className="news-title">{item.title}</div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
                                {item.summary}
                            </p>
                            <div className="news-time">{item.timestamp} • {item.source}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default News;
