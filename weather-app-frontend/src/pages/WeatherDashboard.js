import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/WeatherDashboard.css";

// ==================== WEATHER DASHBOARD COMPONENT ====================
export default function WeatherDashboard() {
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // Fetch weather from API
  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const accessToken = await getAccessTokenSilently({
        audience: "https://dev-e0bqatp4k12ypv17.us.auth0.com/api/v2/",
        scope: "read:weather",
      });

      const response = await axios.get("http://localhost:8090/api/weather", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const apiCities = response.data.map((c) =>
        makeCity({
          id: c.id,
          name: c.cityName,
          Country: c.country,
          condition: c.description,
          tempC: c.temp,
          tempMin: c.tempMin,
          tempMax: c.tempMax,
          pressure: c.pressure,
          humidity: c.humidity,
          visibility: c.visibilityKm,
          windSpeed: c.windSpeed,
          windDeg: c.windDegree,
          sunrise: c.sunrise,
          sunset: c.sunset,
          time: c.time,
        })
      );

      setCities(apiCities);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Failed to fetch weather. Make sure backend is running and CORS is configured.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchWeather();
  }, [isAuthenticated]);

  const addCity = () => {
    if (!query.trim()) return;
    const rnd = (min, max) => Math.round(min + Math.random() * (max - min));
    const conditions = ["Few Clouds", "Clear Sky", "Mist", "Light Rain"];
    const condition = conditions[rnd(0, conditions.length - 1)];

    setCities((prev) => [
      makeCity({
        id: query.toLowerCase().replace(/\s+/g, "-"),
        name: capitalizeWords(query) + ", Demo",
        condition: condition,
        tempC: rnd(-5, 35),
        tempMin: rnd(-8, 20),
        tempMax: rnd(15, 38),
      }),
      ...prev,
    ]);
    setQuery("");
  };

  const removeCity = (id) => setCities((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="app">
      <CloudsBackground />

      {!isAuthenticated ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
            gap: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "24px" }}>Welcome to Weather App</h2>
          <button
            onClick={() => loginWithRedirect()}
            style={{
              padding: "14px 28px",
              fontSize: "18px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: "#2E8CF2",
              color: "#fff",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#1B6EDC")}
            onMouseLeave={(e) => (e.target.style.background = "#2E8CF2")}
          >
            Log In
          </button>
          <p style={{ color: "#ccc" }}>Please Click login button to access the weather dashboard</p>
        </div>
      ) : (
        <>
          <header className="header">
            <h1 className="title">
              <span style={{ marginRight: 8 }}>🌤️</span>Weather App
            </h1>
            <div className="searchRow">
              <input
                placeholder="Enter a city"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search"
              />
              <button onClick={addCity} className="addBtn">
                Add City
              </button>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="addBtn"
              >
                Log Out
              </button>
            </div>
          </header>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {loading ? (
            <p style={{ textAlign: "center", marginTop: 20 }}>Loading.....</p>
          ) : (
            <main className="grid">
              {cities.map((c) => (
                <WeatherCard key={c.id} city={c} onClose={() => removeCity(c.id)} />
              ))}
            </main>
          )}

          <footer className="footer">Developed by Kasun 2025</footer>
        </>
      )}
    </div>
  );
}

// ==================== Weather Card ====================
function WeatherCard({ city, onClose }) {
  const navigate = useNavigate();
  const topStyle = { background: gradient(getColorByCondition(city.condition)) };

  return (
    <section className="card" onClick={() => navigate(`/details/${city.id}`, { state: { city } })}>
      <div className="cardTop" style={topStyle}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
          className="closeBtn"
        >
          ×
        </button>

        <div className="cardTopRow">
          <div>
            <div className="cityName">
              {city.name}, {city.Country}
            </div>
            <div className="subText">{city.time}</div>
          </div>
          <div className="tempBig">
            {city.tempC}
            <span className="degBig">°C</span>
          </div>
        </div>

        <div className="cardMidRow">
          <div className="condition">
            <span>{city.icon}</span> <span>{city.condition}</span>
          </div>
          <div className="minmax">
            <div>Temp Min: {city.tempMin}°C</div>
            <div>Temp Max: {city.tempMax}°C</div>
          </div>
        </div>
      </div>

      <div className="cardBottom">
        <Info label="Pressure" value={`${city.pressure} hPa`} />
        <Info label="Humidity" value={`${city.humidity} %`} />
        <Info label="Visibility" value={`${city.visibility} km`} />
        <Info label={<span>💨 Wind</span>} value={`${city.windSpeed} m/s ${city.windDeg}°`} />
        <Info label="Sunrise" value={city.sunrise} />
        <Info label="Sunset" value={city.sunset} />
      </div>
    </section>
  );
}

function Info({ label, value, right, center }) {
  return (
    <div
      className="info"
      style={{ textAlign: right ? "right" : center ? "center" : "left" }}
    >
      <div className="infoLabel">{label}:</div>
      <div className="infoValue">{value}</div>
    </div>
  );
}

// ==================== HELPERS ====================
function makeCity(partial) {
  return {
    id: "id",
    name: "City",
    color: getColorByCondition(partial.condition || "Clear Sky"),
    time: "9.19am, Feb 8",
    condition: partial.condition || "Few Clouds",
    icon: getIconByCondition(partial.condition || "Few Clouds"),
    tempC: 27,
    tempMin: 25,
    tempMax: 28,
    pressure: "1018hPa",
    humidity: "78%",
    visibility: "8.0",
    windSpeed: "4.0",
    windDeg: 120,
    sunrise: "6:05am",
    sunset: "6:05am",
    ...partial,
  };
}

function getIconByCondition(condition) {
  switch (condition.toLowerCase()) {
    case "clear sky":
      return "☀️";
    case "few clouds":
      return "🌤️";
    case "scattered clouds":
      return "⛅";
    case "overcast clouds":
      return "☁️";
    case "mist":
      return "🌫️";
    case "light rain":
      return "🌦️";
    case "broken clouds":
      return "🌥️";
    default:
      return "☁️";
  }
}

function getColorByCondition(condition) {
  switch (condition.toLowerCase()) {
    case "clear sky":
      return "#2E8CF2"; 
    case "overcast clouds":
      return "#24B37E"; 
    case "scattered clouds":
      return "#5DADE2"; 
    case "few clouds":
      return "#85C1E9";
    case "mist":
      return "#AAB7B8"; 
    case "light rain":
      return "#3498DB";
    case "broken clouds":
      return "#F39A44";  
    default:
      return "#2E8CF2"; 
  }
}

function gradient(hex) {
  return `linear-gradient(135deg, ${hex} 0%, ${shade(hex, -10)} 60%), radial-gradient(120px 60px at 20% 70%, rgba(255,255,255,0.12), rgba(255,255,255,0)), radial-gradient(120px 60px at 60% 60%, rgba(255,255,255,0.12), rgba(255,255,255,0))`;
}

function shade(hex, percent) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  return (
    "#" +
    (0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B))
      .toString(16)
      .slice(1)
  );
}

function capitalizeWords(s) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// ==================== CLOUDS BACKGROUND ====================
function CloudsBackground() {
  const layer = { position: "absolute", inset: 0, pointerEvents: "none" };
  return (
    <div aria-hidden style={{ ...layer, zIndex: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "36%", background: "rgba(0,0,0,0.55)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.28 }}>
        {[[20, 30, 320], [80, 18, 380], [70, 55, 280], [75, 62, 240]].map(([l, t, s], i) => (
          <div key={i} style={{ position: "absolute", left: `${l}%`, top: `${t}%`, width: s, height: s, borderRadius: "9999px", background: "rgba(255,255,255,0.12)", filter: "blur(28px)" }} />
        ))}
      </div>
      
    </div>
  );
}
