import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const getSharedSocket = () => {
    if (typeof window === 'undefined') return null;

    if (!window.__SPORTSBUZZ_SOCKET__) {
        window.__SPORTSBUZZ_SOCKET__ = io(SOCKET_URL, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
    }

    return window.__SPORTSBUZZ_SOCKET__;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = getSharedSocket();
        if (!newSocket) return undefined;

        const handleConnect = () => {
            console.log('✅ Socket connected:', newSocket.id);
            setIsConnected(true);
        };

        const handleDisconnect = (reason) => {
            console.log('❌ Socket disconnected:', reason);
            setIsConnected(false);
        };

        const handleConnectError = (error) => {
            console.error('Socket connection error:', error.message);
        };

        const handleReconnectAttempt = (attempt) => {
            console.log('🔄 Socket reconnect attempt:', attempt);
        };

        newSocket.on('connect', handleConnect);
        newSocket.on('disconnect', handleDisconnect);
        newSocket.on('connect_error', handleConnectError);
        newSocket.on('reconnect_attempt', handleReconnectAttempt);

        setSocket(newSocket);
        setIsConnected(newSocket.connected);

        return () => {
            newSocket.off('connect', handleConnect);
            newSocket.off('disconnect', handleDisconnect);
            newSocket.off('connect_error', handleConnectError);
            newSocket.off('reconnect_attempt', handleReconnectAttempt);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
