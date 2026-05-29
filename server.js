const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// ✅ SOCKET CONNECTION
io.on('connection', socket => {

  console.log(
    'User connected:',
    socket.id
  );

  socket.on('disconnect', () => {

    console.log(
      'User disconnected:',
      socket.id
    );

  });
});

// ✅ HEALTH CHECK
app.get('/', (req, res) => {

  res.send(
    'Socket.IO server is running'
  );

});

// ✅ API ROUTE FROM SYMFONY
app.post('/order-update', (req, res) => {

  try {

    const { orderId, status } = req.body;

    console.log(
      'ORDER UPDATE:',
      orderId,
      status
    );

    // ✅ SEND TO ALL CONNECTED CLIENTS
    io.emit('orderStatusUpdated', {
      orderId,
      status,
    });

    return res.json({
      success: true,
      message:
        'Order update emitted successfully',
    });

  } catch (error) {

    console.log(
      'SOCKET ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to emit socket event',
    });

  }
});

// ✅ RAILWAY / RENDER PORT
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {

  console.log(
    `Socket server running on port ${PORT}`
  );

});