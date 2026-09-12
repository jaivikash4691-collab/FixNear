import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [socket, setSocket] = useState(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: true,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('[Socket.IO] Connected to server:', socketInstance.id);
      if (user?._id) {
        socketInstance.emit('join_user_room', user._id);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket.IO] Disconnected from server');
    });

    // Real-time Event Handlers
    socketInstance.on('new_service_request', (data) => {
      showToast(`⚡ New Service Request from ${data.customerName} for ${data.vehicle}!`, 'info', 6000);
      setUnreadNotifsCount((prev) => prev + 1);
    });

    socketInstance.on('service_status_updated', (data) => {
      showToast(`🔧 Repair Status Updated: ${data.status} ${data.note ? `("${data.note}")` : ''}`, 'info', 6000);
      setUnreadNotifsCount((prev) => prev + 1);
    });

    socketInstance.on('new_review', (data) => {
      showToast(`⭐ New ${data.rating}-star review received from ${data.customerName}!`, 'success', 6000);
      setUnreadNotifsCount((prev) => prev + 1);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Re-join user room whenever active user changes
  useEffect(() => {
    if (socketRef.current && user?._id) {
      socketRef.current.emit('join_user_room', user._id);
    }
  }, [user]);

  const joinRequestRoom = (requestId) => {
    if (socketRef.current && requestId) {
      socketRef.current.emit('join_request_room', requestId);
    }
  };

  const leaveRequestRoom = (requestId) => {
    if (socketRef.current && requestId) {
      socketRef.current.emit('leave_request_room', requestId);
    }
  };

  const value = {
    socket,
    joinRequestRoom,
    leaveRequestRoom,
    unreadNotifsCount,
    setUnreadNotifsCount,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
