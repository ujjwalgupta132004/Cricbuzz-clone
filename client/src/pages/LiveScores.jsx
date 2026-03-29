import { useSocket } from '../context/SocketContext';
import { useSport } from '../context/SportsContext';
import { useState, useEffect } from 'react';

const LiveScores = () => {
    const { socket, isConnected } = useSocket();
    const { activeSport } = useSport();
    const [matches, setMatches] = useState({ live: [], completed: [], upcoming: [] });

    useEffect(() => {
        if (!socket) return;

        socket.emit('subscribeSport', activeSport);

        socket.on('liveScoreUpdate', (data) => {
            if (data.sport === activeSport) {
                setMatches(data);
            }
        });

        return () => {
            socket.off('liveScoreUpdate');
        };
    }, [socket, activeSport]);

    return (
        <div>
            <span className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`} />
                {isConnected ? 'Live' : 'Disconnected'}
            </span>
        </div>
    );
};

export default LiveScores;
