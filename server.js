const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let users = {};
let invites = {};
let messages = {};

app.post('/register', (req, res) => {
  const { code } = req.body;
  if (!users[code]) {
    users[code] = [];
    invites[code] = [];
    console.log(`✅ Zarejestrowano użytkownika: ${code}`);
  }
  res.json({ success: true });
});

app.post('/add-friend', (req, res) => {
  const { from, to } = req.body;
  if (!users[to]) {
    return res.json({ success: false, message: 'Użytkownik nie istnieje.' });
  }
  if (!invites[to]) invites[to] = [];
  if (!invites[to].includes(from)) {
    invites[to].push(from);
  }
  res.json({ success: true });
});

app.post('/accept-invite', (req, res) => {
  const { from, to } = req.body;
  if (!users[to]) users[to] = [];
  if (!users[from]) users[from] = [];
  if (!users[to].includes(from)) users[to].push(from);
  if (!users[from].includes(to)) users[from].push(to);

  if (invites[to]) {
    invites[to] = invites[to].filter(code => code !== from);
  }
  res.json({ success: true });
});

app.post('/reject-invite', (req, res) => {
  const { from, to } = req.body;
  if (invites[to]) {
    invites[to] = invites[to].filter(code => code !== from);
  }
  res.json({ success: true });
});

app.post('/send-message', (req, res) => {
  const { chatId, from, message } = req.body;
  if (!messages[chatId]) messages[chatId] = [];
  messages[chatId].push({ from, message });
  res.json({ success: true });
});

app.get('/get-messages', (req, res) => {
  const { chatId } = req.query;
  res.json(messages[chatId] || []);
});

app.get('/get-data', (req, res) => {
  const { code } = req.query;
  if (!users[code]) {
    users[code] = [];
  }
  if (!invites[code]) {
    invites[code] = [];
  }
  res.json({
    invites: invites[code],
    friends: users[code],
  });
});

app.get('/', (req, res) => {
  res.send('✅ Backend działa!');
});

app.listen(port, () => {
  console.log(`✅ Server działa na porcie ${port}`);
});
