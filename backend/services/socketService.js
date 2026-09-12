let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // Join room for specific user ID
    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room user_${userId}`);
      }
    });

    // Join room for specific service request ID (for live timeline tracking)
    socket.on('join_request_room', (requestId) => {
      if (requestId) {
        socket.join(`request_${requestId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room request_${requestId}`);
      }
    });

    socket.on('leave_request_room', (requestId) => {
      if (requestId) {
        socket.leave(`request_${requestId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

export const emitToUser = (userId, event, payload) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId.toString()}`).emit(event, payload);
  }
};

export const emitToRequestRoom = (requestId, event, payload) => {
  if (ioInstance && requestId) {
    ioInstance.to(`request_${requestId.toString()}`).emit(event, payload);
  }
};

export const emitGlobal = (event, payload) => {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
};
