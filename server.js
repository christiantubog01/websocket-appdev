const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// ✅ API route from Symfony
app.post('/order-update', (req, res) => {

  const { orderId, status } = req.body;

  console.log('ORDER UPDATE:', orderId, status);

  io.emit('orderStatusUpdated', {
    orderId,
    status,
  });

  res.json({
    success: true,
  });
});

server.listen(3001, () => {
  console.log(
    'Socket server running on port 3001'
  );
});