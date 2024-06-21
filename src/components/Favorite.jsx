import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import AudioPlayer from "./AudioPlayer"; // Import the AudioPlayer component
import "./Favorite.css";

const Favorite = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [playingEpisode, setPlayingEpisode] = useState(null); // State to manage the currently playing episode
  const [sortCriteria, setSortCriteria] = useState("A-Z");

  const favoriteEpisodes = Object.values(favorites); // Convert the favorites object to an array

  const playEpisode = (episodeId) => {
    setPlayingEpisode(episodeId);
  };

  const pauseEpisode = () => {
    setPlayingEpisode(null);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const sortEpisodes = (episodes, criteria) => {
    let sortedEpisodes = [...episodes];
    switch (criteria) {
      case "A-Z":
        sortedEpisodes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        sortedEpisodes.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Newest":
        sortedEpisodes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case "Oldest":
        sortedEpisodes.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        break;
      default:
        break;
    }
    return sortedEpisodes;
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const sortedFavoriteEpisodes = sortEpisodes(favoriteEpisodes, sortCriteria);

  if (favoriteEpisodes.length === 0) {
    return <div>No favorite episodes yet!</div>;
  }

  return (
    <div className="favorites-container">
      <h1>Your Favorite Episodes</h1>
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortCriteria} onChange={handleSortChange}>
          <option value="A-Z">Title: A-Z</option>
          <option value="Z-A">Title: Z-A</option>
          <option value="Newest">Most Recently Updated</option>
          <option value="Oldest">Least Recently Updated</option>
        </select>
      </div>
      <ul className="favorites-list">
        {sortedFavoriteEpisodes.map((episode) => (
          <li key={episode.id} className="favorite-item">
            <h3>{episode.title}</h3>
            <p>
              Show:{" "}
              <Link to={`/show/${episode.showId}`}>{episode.showTitle}</Link>
            </p>
            <p>Season: {episode.seasonNumber}</p>
            <p>Added on: {formatDate(episode.addedAt)}</p>
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
