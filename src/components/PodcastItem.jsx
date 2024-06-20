
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShow } from '../services/podcastService';
import AudioPlayer from './AudioPlayer';
import './Home.css';

const genreMap = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family'
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PodcastItem = ({ podcast }) => {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const data = await fetchShow(podcast.id);
        setShow(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching show details:', error);
        setError('Failed to fetch show details.');
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [podcast.id]);

  useEffect(() => {
    if (show && show.seasons && show.seasons.length > 0) {
      const firstEpisode = show.seasons[0]?.episodes[0];
      if (firstEpisode) {
        setAudioSrc(firstEpisode.audioSrc);
      }
    }
  }, [show]);

  const handlePlay = (episodeIndex) => {
    const selectedEpisode = show.seasons[0]?.episodes[episodeIndex];
    if (selectedEpisode) {
      setAudioSrc(selectedEpisode.audioSrc);
      setIsPlaying(true);
      setCurrentEpisodeIndex(episodeIndex);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <li className="podcast-item">
        <div className="podcast-image">
          <img src={podcast.image} alt={podcast.title} />
        </div>
        <div className="podcast-details">
          <h3>{podcast.title}</h3>
          <p>Loading show details...</p>
        </div>
      </li>
    );
  }

  if (error) {
    return (
      <li className="podcast-item">
        <div className="podcast-image">
          <img src={podcast.image} alt={podcast.title} />
        </div>
        <div className="podcast-details">
          <h3>{podcast.title}</h3>
          <p>{error}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="podcast-item">
      <div className="podcast-image">
        <img src={podcast.image} alt={podcast.title} />
      </div>
      <div className="podcast-details">
        <h3>
          <Link to={`/show/${podcast.id}`} className="podcast-link">
            {podcast.title}
          </Link>
        </h3>
        <p>Author: {podcast.author}</p>
        <p>Season: {podcast.season}</p>
        <p>Genre: {genreMap[podcast.genre]}</p>
        <p>Last Updated: {formatDate(podcast.lastUpdated)}</p>
        <div className="action-buttons">
          {show.seasons[0]?.episodes.map((episode, index) => (
            <button
              key={index}
              onClick={() => handlePlay(index)}
              className={currentEpisodeIndex === index ? 'active' : ''}
            >
              Episode {index + 1}
            </button>
          ))}
          {audioSrc ? (
            <AudioPlayer
              src={audioSrc}
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <p>No episodes available</p>
          )}
        </div>
      </div>
    </li>
  );
};

export default PodcastItem;
