// client/src/components/prediction/PredictionCard.jsx
import { useState } from 'react';
import api from '../../services/api';

const PredictionCard = ({ sport, matchId, matchName }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(`/predictions/${sport}/${matchId}`);
            setPrediction(data.prediction);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-3">🤖 AI Prediction</h3>
            <p className="text-gray-500 text-sm mb-4">{matchName}</p>

            {!prediction ? (
                <button
                    onClick={fetchPrediction}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full
                     hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
                >
                    {loading ? '🔮 Analyzing...' : '✨ Get AI Prediction'}
                </button>
            ) : (
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>{prediction.team1?.name}</span>
                            <span>{prediction.team2?.name}</span>
                        </div>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
                            <div
                                className="bg-green-500 h-full transition-all duration-1000"
                                style={{ width: `${prediction.team1?.winProbability}%` }}
                            />
                            <div
                                className="bg-blue-500 h-full transition-all duration-1000"
                                style={{ width: `${prediction.team2?.winProbability}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{prediction.team1?.winProbability}%</span>
                            <span>{prediction.team2?.winProbability}%</span>
                        </div>
                    </div>

                    
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Key Factors:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            {prediction.keyFactors?.map((f, i) => (
                                <li key={i}>• {f}</li>
                            ))}
                        </ul>
                    </div>

                   
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{prediction.prediction}</p>

                    <span className={`text-xs px-2 py-1 rounded-full ${prediction.confidence === 'high' ? 'bg-green-100 text-green-700' :
                            prediction.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                        }`}>
                        Confidence: {prediction.confidence}
                    </span>
                </div>
            )}
        </div>
    );
};
export default PredictionCard;
