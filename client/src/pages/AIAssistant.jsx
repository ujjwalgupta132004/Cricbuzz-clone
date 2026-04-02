import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import { FaPaperPlane } from 'react-icons/fa';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
    PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const renderMessageContent = (content) => {
    // Regex to find ```json_chart ... ```
    const chartRegex = /```json_chart([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = chartRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }
        try {
            const chartData = JSON.parse(match[1].trim());
            parts.push({ type: 'chart', config: chartData });
        } catch (e) {
            parts.push({ type: 'text', content: `[Error parsing chart data: ${e.message}]` });
        }
        lastIndex = chartRegex.lastIndex;
    }

    if (lastIndex < content.length) {
        parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    return parts.map((part, idx) => {
        if (part.type === 'text') {
            return <ReactMarkdown key={idx}>{part.content}</ReactMarkdown>;
        }

        const options = { responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } } };
        if (part.config.type === 'bar') return <div key={idx} style={{ maxWidth: 400, marginTop: 12 }}><Bar data={part.config} options={options} /></div>;
        if (part.config.type === 'doughnut') return <div key={idx} style={{ maxWidth: 300, marginTop: 12, margin: '0 auto' }}><Doughnut data={part.config} options={options} /></div>;
        if (part.config.type === 'line') return <div key={idx} style={{ maxWidth: 400, marginTop: 12 }}><Line data={part.config} options={options} /></div>;
        return <div key={idx}>Unsupported chart type</div>;
    });
};

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: '⚡ Hi! I\'m **SportsBuzz AI**. I can help you with:\n- 🏏 Cricket stats, rules, predictions\n- ⚽ Football tactics, transfers, analysis\n- 🎾 Tennis rankings, Grand Slams\n\nAsk me anything!' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isThinking) return;

        const question = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setIsThinking(true);

        try {
            const history = messages.slice(-10);
            const { data } = await api.post('/ai/chat', { question, history });
            setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'ai', content: '❌ Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    const quickActions = [
        'Explain DLS Method',
        'Top run scorers in ODI',
        'Compare Messi vs Ronaldo',
        'What is DRS?',
        'IPL 2026 predictions',
        'Best tennis serve ever?'
    ];

    return (
        <div className="chat-container fade-in">
            <div style={{ marginBottom: 12 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>🤖 AI Sports Assistant</h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Powered by Gemini AI — Ask about Cricket, Football, or Tennis</p>
            </div>

            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role}`}>
                        {renderMessageContent(msg.content)}
                    </div>
                ))}
                {isThinking && (
                    <div className="chat-bubble ai" style={{ opacity: 0.7 }}>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <span>⚡ Thinking</span>
                            <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="chat-quick-actions">
                {quickActions.map(q => (
                    <button key={q} onClick={() => setInput(q)} className="quick-btn">
                        {q}
                    </button>
                ))}
            </div>

            <div className="chat-input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about cricket, football, or tennis..."
                    className="form-input"
                    style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
                />
                <button onClick={sendMessage} disabled={isThinking} className="btn btn-primary">
                    <FaPaperPlane />
                    Send
                </button>
            </div>
        </div>
    );
};

export default AIAssistant;
