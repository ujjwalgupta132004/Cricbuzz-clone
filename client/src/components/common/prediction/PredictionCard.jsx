import { useState } from 'react';
import api from '../../../services/api';

const PredictionCard = ({ sport, matchId, matchName }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const fetchPrediction = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const { data } = await api.post(`/predictions/${sport}/${matchId}`);
            setPrediction(data.prediction);
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.error || 'Failed to fetch prediction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🤖 AI Match Prediction</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{matchName}</p>

            {errorMsg && (
                <div style={{ padding: 12, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 16, color: '#dc2626', fontSize: 13, fontWeight: 500 }}>
                    ⚠️ {errorMsg.includes('API key') ? 'Your Google Gemini API Key is invalid or expired. Please update it in your backend .env file.' : errorMsg}
                </div>
            )}

            {!prediction ? (
                <button onClick={fetchPrediction} disabled={loading} className="btn btn-primary">
                    {loading ? '🔮 Analyzing match data...' : '✨ Get AI Prediction'}
                </button>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Win probability bar */}
                    <div>
                        <div className="flex items-center justify-between" style={{ fontSize: 13, marginBottom: 6 }}>
                            <span style={{ fontWeight: 600 }}>{prediction.team1?.name}</span>
                            <span style={{ fontWeight: 600 }}>{prediction.team2?.name}</span>
                        </div>
                        <div className="prediction-bar">
                            <div className="bar-fill-green" style={{ width: `${prediction.team1?.winProbability}%` }} />
                            <div className="bar-fill-blue" style={{ width: `${prediction.team2?.winProbability}%` }} />
                        </div>
                        <div className="flex items-center justify-between" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                            <span>{prediction.team1?.winProbability}%</span>
                            <span>{prediction.team2?.winProbability}%</span>
                        </div>
                    </div>

                    {/* Key Factors */}
                    {prediction.keyFactors?.length > 0 && (
                        <div>
                            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Key Factors</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {prediction.keyFactors.map((f, i) => (
                                    <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>• {f}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Prediction text */}
                    <div className="card" style={{ background: 'var(--bg-secondary)' }}>
                        <p style={{ fontSize: 13, lineHeight: 1.6 }}>{prediction.prediction}</p>
                    </div>

                    {/* Confidence */}
                    <span className={`confidence-badge confidence-${prediction.confidence}`}>
                        Confidence: {prediction.confidence}
                    </span>
                </div>
            )}
        </div>
    );
};

export default PredictionCard;
