import { useState, useEffect } from "react";
import "./sessions.css";

function Sessions() {
  const [videos, setVideos] = useState([]);
  const channelId = "UCpW5EP9iw_OuH-giT5xe4vQ"; // Reemplaza con el canal ID obtenido
  const apiKey = "AIzaSyDjhGVdNtfgGksKGOZ_9WU4iJaSOVbICWU"; // Asegúrate de usar tu clave de API válida

  const CACHE_KEY = "youtubeVideos";
  const CACHE_TIME_KEY = "youtubeVideosTime";
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos
  let lastFetchTime = 0;
  const FETCH_INTERVAL = 5000; // 5 segundos

  useEffect(() => {
    const fetchVideos = async () => {
      const now = Date.now();

      // Verificar caché
      const cachedData = localStorage.getItem(CACHE_KEY);
      const lastCacheTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && lastCacheTime && now - lastCacheTime < CACHE_DURATION) {
        console.log("Usando datos en caché...");
        setVideos(JSON.parse(cachedData));
        return;
      }

      // Evitar llamadas seguidas en menos de 5 segundos
      if (now - lastFetchTime < FETCH_INTERVAL) {
        console.warn("Esperando antes de hacer otra solicitud...");
        return;
      }

      lastFetchTime = now;

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=date&type=video&key=${apiKey}`
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.items) throw new Error("No se encontraron videos.");

        const videoData = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
        }));

        setVideos(videoData);

        // Guardar en caché
        localStorage.setItem(CACHE_KEY, JSON.stringify(videoData));
        localStorage.setItem(CACHE_TIME_KEY, Date.now());

      } catch (error) {
        console.error("Error fetching videos: ", error);
      }
    };

    fetchVideos();
  }, [channelId, apiKey]);

  return (
    <div className="news-container home-container">
      <div className="title-news home-title-container">
        <p className="home-title">Sesiones</p>
      </div>
      <div className="videos-container-list">
        {videos.map((video) => (
          <div key={video.id} className="video-item">
            <iframe
              width="300"
              height="200"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="video-title-container">
              <p className="video-title">{video.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sessions;
