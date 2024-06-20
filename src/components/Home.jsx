import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPreviews } from "../services/PodcastService";
import { useFavorites } from "../contexts/FavoritesContext";
import AudioPlayer from "./AudioPlayer";
import "./Home.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Home = ({ searchQuery, onSearchChange }) => {
  const [previews, setPreviews] = useState([]);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const genres = {
    1: "Personal Growth",
    2: "Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPreviews();
        setPreviews(data);
        setFilteredPreviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching previews:", error);
        setError("Failed to fetch podcast previews.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sortData = (criteria, data) => {
      let sortedData = [...data];
      switch (criteria) {
        case "A-Z":
          sortedData.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "Z-A":
          sortedData.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "Newest":
          sortedData.sort((a, b) => new Date(b.updated) - new Date(a.updated));
          break;
        case "Oldest":
          sortedData.sort((a, b) => new Date(a.updated) - new Date(b.updated));
          break;
        default:
          sortedData = [...data];
      }
      return sortedData;
    };

    const filterData = (data, query) => {
      return data.filter((podcast) =>
        podcast.title.toLowerCase().includes(query.toLowerCase())
      );
    };

    const genreFilterData = (data, genre) => {
      if (genre === "All") {
        return data;
      }
      return data.filter((podcast) => podcast.genres.includes(parseInt(genre)));
    };

    let sortedData = sortData(sortCriteria, previews);
    let filteredData = filterData(sortedData, searchQuery);
    let genreFilteredData = genreFilterData(filteredData, selectedGenre);

    setFilteredPreviews(genreFilteredData);
  }, [sortCriteria, previews, searchQuery, selectedGenre]);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleFavoriteToggle = (podcast) => {
    if (isFavorite(podcast.id)) {
      removeFavorite(podcast.id);
    } else {
      addFavorite(podcast);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home">
      <h1 className="tittle">PodParadise</h1>
      <div className="filter-dropdown">
        <select
          value={sortCriteria}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="All">All</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
        <select
          value={selectedGenre}
          onChange={(e) => handleGenreChange(e.target.value)}
        >
          <option value="All">All Genres</option>
          {Object.entries(genres).map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
      </div>
      <ul className="podcast-list">
        {filteredPreviews.map((podcast) => (
          <li key={podcast.id} className="podcast-item">
            <Link to={`/show/${podcast.id}`} className="podcast-link">
              <div className="podcast-image">
                <img src={podcast.image} alt={podcast.title} />
              </div>
              <div className="podcast-details">
                <h3>{podcast.title}</h3>
                <p>Season: {podcast.seasons}</p>
                <p>
                  Genre:{" "}
                  {podcast.genres.map((genreId) => genres[genreId]).join(", ")}
                </p>
                <p>Last Updated: {formatDate(podcast.updated)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
