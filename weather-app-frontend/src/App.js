import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WeatherDashboard from "./pages/WeatherDashboard";
import WeatherUI from "./pages/WeatherUI";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/details/:id" element={<WeatherUI />} />
      </Routes>
    </Router>
  );
}
