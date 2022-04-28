import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(termState) {
    this.props.onSearch(termState);
  }

  handleTermChange(e) {
    this.search(e.target.value);
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          value={this.props.searchBar}
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
        />
        <button className="SearchButton">SEARCH</button>
      </div>
    );
  }
}
