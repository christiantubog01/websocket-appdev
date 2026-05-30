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

// ========================
// SOCKET CONNECTION
// ========================
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ========================
// HEALTH CHECK
// ========================
app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

// ========================
// ORDER STATUS UPDATE
// ========================
app.post('/order-update', (req, res) => {
  try {
    const { orderId, status } = req.body;

    console.log('ORDER UPDATE:', orderId, status);

    io.emit('orderStatusUpdated', {
      orderId,
      status,
    });

    return res.json({
      success: true,
    });

  } catch (error) {
    console.log('SOCKET ERROR:', error);

    return res.status(500).json({
      success: false,
    });
  }
});

// ========================
// NEW ORDER EVENT (🔥 ADD THIS)
// ========================
app.post('/new-order', (req, res) => {
  try {
    const { id, total, status } = req.body;

    console.log('NEW ORDER:', id, total, status);

    // 🔥 send to ALL clients (admin + mobile)
    io.emit('newOrderCreated', {
      id,
      total,
      status,
    });

    return res.json({ success: true });

  } catch (error) {
    console.log('NEW ORDER ERROR:', error);

    return res.status(500).json({ success: false });
  }
});

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});