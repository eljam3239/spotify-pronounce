import React, { useState } from "react";

function App() {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#C8A2C8",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
    transition: "background-color 0.3s"
  };

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
      const response = await fetch(`https://spotify-pronounce.onrender.com/spotify/${parsed.type}/${parsed.id}`);
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

  const generateGoogleTranslateUrl = (text) => {
    const processedText = text
      .replace(/^How to pronounce ['"](.+?)['"] by (.+)/, "$1 by $2")
      .replace(/^How to pronounce ['"](.+?)['"]$/, "$1");
    return `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(processedText)}&op=translate`;
  };

  const resetApp = () => {
    setSpotifyUrl("");
    setResult("");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#E6E6FA"
    }}>
      <div style={{
        backgroundColor: "#F3EFFE",
        padding: "2rem",
        maxWidth: "700px",
        height: "auto",
        width: "90%",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}>
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#856b85",
            cursor: "pointer",
            transition: "color 0.3s"
          }}
          onClick={resetApp}
          onMouseEnter={(e) => e.target.style.color = "#a77aa7"}
          onMouseLeave={(e) => e.target.style.color = "#856b85"}
        >
          Pronouncify
        </h2>

        <input
          type="text"
          placeholder="Paste Spotify track or artist link here"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "4rem",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            backgroundColor: "#F8F5FF"
          }}
        />
        <button
          onClick={fetchSpotifyData}
          disabled={loading}
          style={buttonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#a77aa7"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#C8A2C8"}
        >
          {loading ? "Loading..." : "Get Pronunciation Phrase"}
        </button>

        {result && (
          <>
            <a
              href={generateGoogleTranslateUrl(result)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "1.5rem",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                color: "#333",
                textDecoration: "underline",
                fontSize: "1.1rem"
              }}
            >
              {result}
            </a>

            
          </>
        )}
      </div>

      <footer style={{
        marginTop: "2rem",
        fontSize: "0.9rem",
        color: "#555"
      }}>
        <a
          href="https://github.com/eljam3239"
          style={{
            color: "#555",
            textDecoration: "none",
            transition: "color 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.color = "#B39DDB"}
          onMouseLeave={(e) => e.target.style.color = "#555"}
        >
          by Eli James
        </a>
      </footer>
    </div>
  );
}

export default App;
