import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchShow } from "../services/PodcastService";
import AudioPlayer from "./AudioPlayer";
import "./Show.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useFavorites } from "../contexts/FavoritesContext";

const Show = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchShow(showId);
        setShow(data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching show with ID ${showId}:`, error);
        setLoading(false);
      }
    };

    fetchData();
  }, [showId]);

  const handleEpisodeDropdown = (seasonNumber) => {
    setOpenDropdown(openDropdown === seasonNumber ? null : seasonNumber);
    setPlayingEpisode(null);
  };

  const playEpisode = (episodeId) => {
    setPlayingEpisode(episodeId);
  };

  const pauseEpisode = () => {
    setPlayingEpisode(null);
  };

  const toggleFavorite = (episode, seasonNumber) => {
    if (isFavorite(episode.id)) {
      removeFavorite(episode.id);
    } else {
      addFavorite({ ...episode, seasonNumber, showTitle: show.title, showId });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div className="show-container">
      <Link to="/" className="back-button">
        Home
      </Link>
      <div className="show-header">
        <h1 className="show-title">{show.title}</h1>
        <img src={show.image} alt={show.title} className="show-image" />
        <p className="show-description">{show.description}</p>
      </div>

      <div className="season-selector">
        <h2 className="seasons-title">Seasons</h2>
        <ul className="seasons-list">
          {show.seasons.map((season) => (
            <li key={season.number} className="season-item">
              <div className="season-header">
                <img
                  src={season.image}
                  alt={`Season ${season.number}`}
                  className="season-image"
                />
                <div className="season-info">
                  <h3 className="season-title">Season {season.number}</h3>
                  <button
                    onClick={() => handleEpisodeDropdown(season.number)}
                    className="episode-dropdown-button"
                  >
                    {openDropdown === season.number
                      ? "Hide Episodes"
                      : "Show Episodes"}
                  </button>
                </div>
              </div>
              {openDropdown === season.number && (
                <div className="dropdown-content">
                  <ul className="episodes-list">
                    {season.episodes.map((episode) => (
                      <li key={episode.id} className="episode-item">
                        <div className="episode-details">
                          <h3 className="episode-title">
                            Episode {episode.id}: {episode.title}
                          </h3>
                          <p className="episode-description">
                            Description: {episode.description}
                            
                          </p>
                          <div
                            className="favorite-icon"
                            onClick={() =>
                              toggleFavorite(episode, season.number)
                            }
                          >
                            <FontAwesomeIcon
                              icon={
                                isFavorite(episode.id)
                                  ? solidHeart
                                  : regularHeart
                              }
                              className={
                                isFavorite(episode.id)
                                  ? "heart-solid"
                                  : "heart-regular"
                              }
                            />
                          </div>
                          <AudioPlayer
                            key={episode.id}
                            src={episode.audioSrc}
                            isPlaying={playingEpisode === episode.id}
                            onPlay={() => playEpisode(episode.id)}
                            onPause={pauseEpisode}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Show;
