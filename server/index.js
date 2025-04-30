const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = 3001;

let accessToken = "";
let tokenExpiresAt = 0;

// Function to refresh token
async function getAccessToken() {
  if (Date.now() < tokenExpiresAt) return accessToken;

  const authOptions = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  };

  try {
    const res = await axios(authOptions);
    accessToken = res.data.access_token;
    tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
    return accessToken;
  } catch (err) {
    console.error("Error fetching Spotify access token:", err.response?.data || err.message);
    throw err;
  }
}


// API route to fetch track or artist data
app.get("/spotify/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  const token = await getAccessToken();

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/${type}s/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Spotify API error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
