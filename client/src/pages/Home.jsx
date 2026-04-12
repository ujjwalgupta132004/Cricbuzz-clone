import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCricketMatches, getFootballMatches, getTennisMatches } from '../services/api';
import api from '../services/api';
import { FaChevronRight } from 'react-icons/fa';

const Dashboard = () => {
    const [cricket, setCricket] = useState({ live: [], completed: [], upcoming: [] });
    const [football, setFootball] = useState({ live: [], completed: [], upcoming: [] });
    const [tennis, setTennis] = useState({ live: [], completed: [], upcoming: [] });
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [cRes, fRes, tRes, nRes] = await Promise.allSettled([
                    getCricketMatches(),
                    getFootballMatches(),
                    getTennisMatches(),
                    api.get('/news')
                ]);

                if (cRes.status === 'fulfilled') setCricket(cRes.value.data);
                if (fRes.status === 'fulfilled') setFootball(fRes.value.data);
                if (tRes.status === 'fulfilled') setTennis(tRes.value.data);
                if (nRes.status === 'fulfilled') setNews(nRes.value.data?.items || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Pick featured match: first live cricket, or first live football, or first of any
    const featuredMatch = cricket.live?.[0] || football.live?.[0] || tennis.live?.[0] ||
        cricket.upcoming?.[0] || null;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Hero Featured Match */}
            {featuredMatch && <HeroCard match={featuredMatch} />}

            {/* Cricket Section */}
            <SportSection
                emoji="🏏"
                title="Cricket"
                sport="cricket"
                matches={[...(cricket.live || []), ...(cricket.upcoming || []), ...(cricket.completed || [])]}
                linkTo="/cricket"
                news={news.filter(n => n.sport === 'cricket')}
            />

            {/* Football Section */}
            <SportSection
                emoji="⚽"
                title="Football"
                sport="football"
                matches={[...(football.live || []), ...(football.upcoming || []), ...(football.completed || [])]}
                linkTo="/football"
                news={news.filter(n => n.sport === 'football')}
            />

            {/* Tennis Section */}
            <SportSection
                emoji="🎾"
                title="Tennis"
                sport="tennis"
                matches={[...(tennis.live || []), ...(tennis.upcoming || []), ...(tennis.completed || [])]}
                linkTo="/tennis"
                news={news.filter(n => n.sport === 'tennis')}
            />
        </div>
    );
};

/* ─── Hero Card ─── */
const HeroCard = ({ match }) => {
    const isLive = (match.matchStarted && !match.matchEnded) || match.isLive;
    const matchSport = match.sport || (match.league ? 'football' : match.tournament ? 'tennis' : 'cricket');
    const team1 = match.teamInfo?.[0]
        || match.homeTeam
        || { shortname: match.teams?.[0] || match.name?.split(' vs ')?.[0] || 'TM1', name: match.teams?.[0] || match.name?.split(' vs ')?.[0] || 'Team 1' };
    const team2 = match.teamInfo?.[1]
        || match.awayTeam
        || { shortname: match.teams?.[1] || match.name?.split(' vs ')?.[1] || 'TM2', name: match.teams?.[1] || match.name?.split(' vs ')?.[1] || 'Team 2' };
    const score1 = matchSport === 'cricket' ? match.score?.[0] : null;
    const score2 = matchSport === 'cricket' ? match.score?.[1] : null;

    const headline = match.status || `${team1.shortname || team1.name} vs ${team2.shortname || team2.name}`;
    const matchType = match.matchType?.toUpperCase() || match.league || '';
    const description = matchSport === 'cricket' && score1
        ? `${team1.name} ${score1.r}/${score1.w} (${score1.o} ov) vs ${team2.name} ${score2 ? `${score2.r}/${score2.w} (${score2.o} ov)` : 'yet to bat'}`
        : `${match.venue || ''} • ${matchType || match.tournament || 'Match'}`;
    const parts = typeof match.score === 'string' ? match.score.split(' - ') : [];

    return (
        <div className="hero-card slide-up">
            <div className="hero-content">
                <div className="live-badge">
                    {isLive && <span className="pulse-dot" />}
                    {isLive ? 'LIVE' : 'UPCOMING'} • {matchType || 'MATCH'}
                </div>
                <h1 className="hero-headline">{headline}</h1>
                <p className="hero-description">{description}</p>
                <div className="hero-actions">
                    <Link to={`/match/${match.id}?sport=${matchSport}`} className="btn btn-primary">
                        {isLive ? '📺 Watch Live' : '📋 View Details'}
                    </Link>
                    <Link to={`/match/${match.id}?sport=${matchSport}`} className="btn btn-secondary">
                        Full Scorecard
                    </Link>
                </div>
            </div>

            <div className="hero-scores">
                <div className="score-row">
                    <div className="team-info">
                        {team1.img && <img src={team1.img} alt="" className="team-flag" />}
                        <span className="team-name">{team1.shortname || team1.name}</span>
                    </div>
                    <div>
                        {matchSport === 'cricket' && score1 ? (
                            <>
                                <span className="team-score">{score1.r}/{score1.w}</span>
                                <span className="team-overs">{score1.o} ov</span>
                            </>
                        ) : parts[0] ? (
                            <span className="team-score">{parts[0]}</span>
                        ) : (
                            <span className="team-score dimmed">-</span>
                        )}
                    </div>
                </div>
                <div className="score-row">
                    <div className="team-info">
                        {team2.img && <img src={team2.img} alt="" className="team-flag" />}
                        <span className="team-name">{team2.shortname || team2.name}</span>
                    </div>
                    <div>
                        {matchSport === 'cricket' && score2 ? (
                            <>
                                <span className="team-score">{score2.r}/{score2.w}</span>
                                <span className="team-overs">{score2.o} ov</span>
                            </>
                        ) : parts[1] ? (
                            <span className="team-score">{parts[1]}</span>
                        ) : (
                            <span className="team-score dimmed">-</span>
                        )}
                    </div>
                </div>
                {matchSport === 'cricket' && score1 && (
                    <div className="player-highlight">
                        <span className="player-stat">V. Kohli 82* (74)</span>
                        <span className="player-stat">M. Starc 2/45 (9)</span>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Sport Section ─── */
const SportSection = ({ emoji, title, sport, matches, linkTo, news }) => {
    const displayMatches = matches.slice(0, 3);
    const displayNews = (news || []).slice(0, 1);

    if (displayMatches.length === 0 && displayNews.length === 0) return null;

    return (
        <div className="sport-section fade-in">
            <div className="section-header">
                <h2 className="section-title">
                    <span className="sport-emoji">{emoji}</span>
                    {title}
                </h2>
                <Link to={linkTo} className="view-all-link">View All</Link>
            </div>

            <div className="match-cards-row">
                {displayMatches.map((match, idx) => (
                    <MatchCard key={match.id || idx} match={match} sport={sport} />
                ))}
                {displayNews.map(item => (
                    <div key={item.id} className="news-card">
                        <div className="news-tag">News</div>
                        <div className="news-title">{item.title}</div>
                        <div className="news-time">{item.timestamp}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── Match Card ─── */
const MatchCard = ({ match, sport }) => {
    const isLive = (match.matchStarted && !match.matchEnded) || match.isLive;
    const isFinished = match.matchEnded || match.isFinished;

    // Handle different data structures (cricket vs football/tennis)
    const team1Name = match.teamInfo?.[0]?.shortname || match.teamInfo?.[0]?.name || match.homeTeam?.name || match.teams?.[0] || 'Team 1';
    const team2Name = match.teamInfo?.[1]?.shortname || match.teamInfo?.[1]?.name || match.awayTeam?.name || match.teams?.[1] || 'Team 2';

    const score1 = match.score?.[0] ? `${match.score[0].r}/${match.score[0].w}` : (match.score && typeof match.score === 'string' ? match.score.split(' - ')[0] : '');
    const score2 = match.score?.[1] ? `${match.score[1].r}/${match.score[1].w}` : (match.score && typeof match.score === 'string' ? match.score.split(' - ')[1] : '');

    const matchLabel = match.matchType?.toUpperCase() || match.league || match.tournament || '';
    const venue = match.venue || '';
    const matchSport = sport || match.sport || 'cricket';

    return (
        <Link to={`/match/${match.id}?sport=${matchSport}`} className="match-card" style={{ textDecoration: 'none' }}>
            <div className="match-header">
                <span className="match-league">
                    {isLive && <span className="live-dot" />}
                    {isLive ? `• ${matchLabel}` : isFinished ? `${matchLabel} • Final` : `${matchLabel} • ${venue}`}
                </span>
                <FaChevronRight className="match-arrow" />
            </div>

            <div className="match-teams">
                <div className="match-team-row">
                    <span className="match-team-name">{team1Name}</span>
                    <span className="match-team-score">{score1 || '-'}</span>
                </div>
                <div className="match-team-row">
                    <span className="match-team-name">{team2Name}</span>
                    <span className="match-team-score">{score2 || 'Yet to bat'}</span>
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

export default Dashboard;
