const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Spotify credentials
const clientId = '77e733a36daf4cc282b55d8a96befbeb';
const clientSecret = '0ac9efff4e314706b041da0b70a0023f';
const redirectUri = 'tearify://callback'; // This should match your app

// Middlewares
app.use(cors());
app.use(express.json());

app.post('/api/token', async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.status(200).json({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

app.listen(PORT, () => {
  console.log(`Spotify auth backend running on http://localhost:${PORT}`);
});
