import React, { Component } from 'react';
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE}
from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import './Home.css';

class Home extends Component {
  state = {
    movies: [],
    HeroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: '',
  }

//Calling fetchItems when components are rendered
  componentDidMount(){
    this.setState({ loading: true })
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    this.fetchItems(endpoint);
  }
//Fetch method to update state with movie results from API
  fetchItems = (endpoint) => {
    const { movies, heroImage, searchTerm } = this.state;

    fetch(endpoint)
    .then(result => result.json())
    .then(result => {
      this.setState({
        movies: [...this.state.movies, ...result.results],
        heroImage: this.state.HeroImage || result.results[0],
        loading: false,
        currentPage: result.page,
        totalPages: result.total_pages,

      })
    })
  }
  //Search-function for the SearchBar
  searchItems = (searchTerm) => {
    let endpoint = '';
    this.setState({
      movies: [],
      loading: true,
      searchTerm,
    })
    if(searchTerm === '') {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}`
    }
    this.fetchItems(endpoint);
  }

//Load more-function for Load More-Button
  loadMoreItems = () => {
    // ES6 Destructuring the state
    const { searchTerm, currentPage } = this.state;

    let endpoint = '';
    this.setState({ loading: true });

    if (searchTerm === '') {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage + 1}`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${currentPage}`;
    }
    this.fetchItems(endpoint);
  }


  render() {
    const { movies, heroImage, loading, currentPage, totalPages, searchTerm } = this.state;

    return(
      <div className="rmdb-home">
      {this.state.heroImage ?
        <div>
            <HeroImage
            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
            title={this.state.heroImage.original_title}
            text={this.state.heroImage.overview }        />
            <SearchBar callback={this.searchItems}/>
        </div> : null }
          <div className="rmdb-home-grid">
          <FourColGrid
            header={searchTerm ? `Search Result: ${searchTerm}` : 'Popular Movies'}
            loading={loading}
          >
          {movies.map( (element, i) => (
            <MovieThumb
              key={i}
              clickable={true}
              image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
              movieId={element.id}
              movieName={element.original_title}
            />
          ))}
          </FourColGrid>
          {loading ? <Spinner /> : null}
          {(currentPage <= totalPages && !loading) ?
            <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />
            : null
          }
          </div>
      </div>
    )
  }
}

export default Home;
