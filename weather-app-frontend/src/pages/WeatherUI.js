import { useLocation, useParams, useNavigate } from "react-router-dom";
import "../css/WeatherUI.css";


function getColorByCondition(condition) {
  switch (condition.toLowerCase()) {
    case "clear sky": return "#2E8CF2"; 
    case "overcast clouds": return "#24B37E"; 
    case "scattered clouds": return "#5DADE2"; 
    case "few clouds": return "#85C1E9";
    case "mist": return "#AAB7B8"; 
    case "light rain": return "#3498DB";
    case "broken clouds": return "#F39A44";  
    default: return "#2E8CF2"; 
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

export default function WeatherUI() {
  const { state } = useLocation();
  const { city } = state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  if (!city) {
    return <div className="no-city">No city data found for ID: {id}</div>;
  }

  const topBgStyle = { background: gradient(getColorByCondition(city.condition)) };

  return (
    <div className="weather-ui">
      <header className="weather-header">
        <h1 className="weather-title">
          <span className="weather-icon">🌤️</span> Weather App
        </h1>
      </header>

      <main className="weather-main">
        <section className="weather-card">
          <div className="weather-top-bg" style={topBgStyle}>
             <span className="back-arrow" onClick={() => navigate(-1)}>←</span>
            <h2>{city.name},{city.Country}</h2>
            <p>{city.time}</p>

            <div className="weather-info">
              <div className="weather-condition">
                <div className="weather-icon-large">{city.icon}</div>
                <span>{city.condition}</span>
              </div>

              <div className="weather-temp">
                <div>
                  {city.tempC}<span>°C</span>
                </div>
                <div className="temp-min-max">
                  <div>Temp Min: {city.tempMin}°c</div>
                  <div>Temp Max: {city.tempMax}°c</div>
                </div>
              </div>
            </div>
          </div>

          <div className="weather-metrics">
            <div>
              <Metric label="Pressure" value={`${city.pressure} hpa`} />
              <Metric label="Humidity" value={`${city.humidity} %`} />
              <Metric label="Visibility" value={`${city.visibility} km`} />
            </div>

            <div className="wind-info">
              <span>💨</span>
              <span>{city.windSpeed} m/s</span>
              <span>{city.windDeg}°</span>Degree
            </div>

            <div className="sun-info">
              <Metric label="Sunrise" value={city.sunrise} />
              <Metric label="Sunset" value={city.sunset} />
            </div>
          </div>
        </section>

        <footer className="weather-footer">Developed by Kasun 2025</footer>
      </main>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <strong>{label}:</strong> {value}
    </div>
  );
}
