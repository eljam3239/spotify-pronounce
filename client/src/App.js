import React, { useState } from "react";

function App() {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const extractIdAndType = (url) => {
    const regex = /open\.spotify\.com\/(track|artist)\/([a-zA-Z0-9]+)/;

    const match = url.match(regex);
    return match ? { type: match[1], id: match[2] } : null;
  };

  const fetchSpotifyData = async () => {
    setLoading(true);
    const parsed = extractIdAndType(spotifyUrl);
    if (!parsed) {
      setResult("Invalid Spotify URL");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/spotify/${parsed.type}/${parsed.id}`);
      const data = await response.json();

      let output;
      if (parsed.type === "track") {
        output = `How to pronounce '${data.name}' by ${data.artists[0].name}`;
      } else {
        output = `How to pronounce '${data.name}'`;
      }

      setResult(output);
    } catch (err) {
      setResult("Error fetching data");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", fontFamily: "sans-serif"}}>
      <h2>Spotify Pronunciation Helper</h2>
      <input
        type="text"
        placeholder="Paste Spotify track or artist link here"
        value={spotifyUrl}
        onChange={(e) => setSpotifyUrl(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button
        onClick={fetchSpotifyData}
        disabled={loading}
        style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        {loading ? "Loading..." : "Get Pronunciation Phrase"}
      </button>
      {result && <p style={{ marginTop: "1rem", fontFamily: "monospace" }}>{result}</p>}
    </div>
  );
}

export default App;
