import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const tokenRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      tokenRef.current = token;
      
      if (!token) {
        console.info('ℹ️ No authentication token found - Socket.IO will not connect');
        setSocket(null);
        return;
      }

      const base = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const origin = base.replace(/\/?api\/?$/, '');

      console.log(`🔌 Attempting Socket.IO connection to: ${origin}`);

      const s = io(origin, {
        auth: { token },
        transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5, // Limit reconnection attempts
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        timeout: 10000,
      });

      // Connection event handlers
      s.on('connect', () => {
        console.log('✅ Socket.IO connected');
      });

      s.on('connect_error', (error) => {
        // Only log authentication errors, not repeated connection attempts
        if (error.message.includes('Authentication') || error.message.includes('authentication')) {
          console.warn('⚠️ Socket.IO authentication failed:', error.message);
          console.info('💡 The app will continue to work without real-time notifications');
          // Stop trying to reconnect if it's an auth error
          s.disconnect();
        }
      });

      s.on('disconnect', (reason) => {
        if (reason !== 'io client disconnect') {
          console.log('Socket.IO disconnected:', reason);
        }
      });

      s.on('error', (error) => {
        console.error('Socket.IO error:', error);
      });

      setSocket(s);

      return () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        try { 
          s.removeAllListeners();
          s.disconnect(); 
        } catch (_) {}
        setSocket(null);
      };
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setSocket(null);
    }
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
