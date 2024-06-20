import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import AudioPlayer from "./AudioPlayer"; // Import the AudioPlayer component
import "./Favorite.css";

const Favorite = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [playingEpisode, setPlayingEpisode] = useState(null); // State to manage the currently playing episode

  const favoriteEpisodes = Object.values(favorites); // Convert the favorites object to an array

  const playEpisode = (episodeId) => {
    setPlayingEpisode(episodeId);
  };

  const pauseEpisode = () => {
    setPlayingEpisode(null);
  };

  if (favoriteEpisodes.length === 0) {
    return <div>No favorite episodes yet!</div>;
  }

  return (
    <div className="favorites-container">
      <h1>Your Favorite Episodes</h1>
      <ul className="favorites-list">
        {favoriteEpisodes.map((episode) => (
          <li key={episode.id} className="favorite-item">
            <h3>{episode.title}</h3>
            <p>
              Show:{" "}
              <Link to={`/show/${episode.showId}`}>{episode.showTitle}</Link>
            </p>
            <p>Season: {episode.seasonNumber}</p>
            <button onClick={() => removeFavorite(episode.id)}>
              Remove from Favorites
            </button>
            <AudioPlayer
              key={episode.id}
              src={episode.audioSrc}
              isPlaying={playingEpisode === episode.id}
              onPlay={() => playEpisode(episode.id)}
              onPause={pauseEpisode}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorite;
