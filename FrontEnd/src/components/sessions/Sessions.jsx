import { useState, useEffect } from "react";
import "./sessions.css";

function Sessions() {
  const [videos, setVideos] = useState([]);
  const channelId = "UCpW5EP9iw_OuH-giT5xe4vQ"; // Reemplaza con el canal ID obtenido
  const apiKey = "AIzaSyDjhGVdNtfgGksKGOZ_9WU4iJaSOVbICWU"; // Asegúrate de usar tu clave de API válida

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=3&order=date&type=video&key=${apiKey}`
        );
        const data = await response.json();
        const videoData = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
        }));
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      }
    };

    fetchVideos();
  }, [channelId, apiKey]);

  return (
    <div className="news-container">
      <div className="title-news">
        <p>Sesiones</p>
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
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sessions;
