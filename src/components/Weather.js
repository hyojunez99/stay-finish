import { useEffect, useState } from "react";
import axios from "axios";
import "./Weather.scss";

const Weather = () => {
  const KEY = "3a9340324a223326c5a3ab260bbc3496";
  const [weather, setWeather] = useState(null);
  const [iconUrl, setIconUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 날씨 API 호출
  const fetchWeather = async (lat, lon) => {
    try {
      setError("");
      setLoading(true);
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=kr`;
      const res = await axios.get(URL);
      setWeather(res.data);
      const iconCode = res.data.weather[0].icon;
      const ICON = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      setIconUrl(ICON);
    } catch (err) {
      setError("날씨 정보를 가져올 수 없습니다: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const fetchDefaultWeather = () => {
      // 위치 못 가져올 때 fallback 좌표 ( 서울)
      const defaultLat = 37.5665;
      const defaultLon = 126.978;
      setError("위치 정보를 가져올 수 없어 기본 위치(서울)로 표시합니다");
      fetchWeather(defaultLat, defaultLon);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          // 사용자가 위치 허용 안했거나 오류 발생 시 기본 좌표 사용
          fetchDefaultWeather();
        },
        options
      );
    } else {
      fetchDefaultWeather();
    }
  }, []);

  return (
    <div id="weather-page">
      {loading && <p className="loading">날씨 정보를 가져오는 중...</p>}
      {error && <p className="error">{error}</p>}
      {!weather && !loading && !error && <p>위치 정보를 기다리는 중...</p>}
      {weather && (
        <div className="weather">
          {iconUrl && (
            <img src={iconUrl} alt={weather.weather[0].description} /> // 날씨 이미지
          )}
          <div className="top">
            {/* 날씨 정보 */}
            <p>{weather.weather[0].description}</p>
            <div className="title">
              {/* 날씨 온도 */}
              <p>최고: {weather.main.temp_max.toFixed(1)}℃</p>
              <p>최저: {weather.main.temp_min.toFixed(1)}℃</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
