import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './PodcastCarousel.css'; // Import the CSS file

const PodcastCarousel = ({ podcasts }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Get a random subset of 7 podcasts
  const getRandomPodcasts = (podcasts) => {
    const shuffled = [...podcasts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  };

  const randomPodcasts = getRandomPodcasts(podcasts);

  return (
    <div className="featured-podcasts">
      <h2>Featured Podcasts</h2>
      <div className="carousel-container">
        <button onClick={scrollLeft} className="scroll-button scroll-button-left">
          &lt;
        </button>
        <div ref={carouselRef} className="carousel-content">
          {randomPodcasts.map((podcast) => (
            <div key={podcast.id} className="podcast-item">
              <Link to={`/podcast/${podcast.id}`}>
                <img src={podcast.image} alt="podcast" />
              </Link>
              <div className="podcast-info">
                <h3>{podcast.title}</h3>
                <p>{podcast.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="scroll-button scroll-button-right">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PodcastCarousel;
