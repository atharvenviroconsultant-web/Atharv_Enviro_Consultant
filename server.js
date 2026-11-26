const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const messagesFile = path.join(__dirname, 'messages.json');

function readMessages() {
  if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, '[]', 'utf8');
    return [];
  }
  const raw = fs.readFileSync(messagesFile, 'utf8').trim();
  if (!raw) {
    fs.writeFileSync(messagesFile, '[]', 'utf8');
    return [];
  }
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

try {
  readMessages();
} catch (err) {
  console.error('Invalid JSON in messages.json, resetting to []:', err.message);
  fs.writeFileSync(messagesFile, '[]', 'utf8');
}

app.post('/api/contact', (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body || {};

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields.'
      });
    }

    const messages = readMessages();

    const inquiry = {
      id: Date.now(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      service: service ? String(service).trim() : '',
      message: String(message).trim(),
      createdAt: new Date().toISOString()
    };

    messages.unshift(inquiry);
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully!'
    });
  } catch (err) {
    console.error('Error saving inquiry:', err);
    return res.status(500).json({
      success: false,
      error: 'Could not save inquiry.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});