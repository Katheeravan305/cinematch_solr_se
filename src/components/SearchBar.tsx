import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Button from "@mui/material/Button";
import axios from "axios";
import SearchResult from "../components/SearchResult";
import Grid from "@mui/material/Grid";
import {
  Snackbar,
  Alert,
  Box,
  InputBase,
  Typography,
  TextField,
  Checkbox,
  Card,
  CardContent,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Slider,
} from "@mui/material";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [spellings, setSpellings] = useState([]);
  const [genreOptions, setGenreOptions] = useState([{ genre: "", count: "" }]);
  const [updateQuery, setUpdateQuery] = useState(0);
  const [errorOpen, setErrorOpen] = useState(false);
  const [genreFilters, setGenreFilters] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [suggestedWordsOpen, setSuggestedWordsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterType, setFilterType] = useState("Series_Title");
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);

  // Add this useEffect hook to log the query after it's updated
  useEffect(() => {
    if (updateQuery === 1) {
      handleSearch();
    }
  }, [updateQuery]);

  const handleSearch = async () => {
    if (query === "") {
      setErrorOpen(true);
      setResults([]);
      return;
    }

    try {
      let solrQuery = query;
      if (genreFilters.length > 0) {
        solrQuery += `&fq=Genre:(${genreFilters
          .map((genre) => `"${genre}"`)
          .join(" AND ")})`;
      }
      if (ratingFilter !== 0) {
        solrQuery += `&fq=IMDB_Rating:[${ratingFilter} TO *]`;
      }

      let link = "";

      if (filterType === "Series_Title") {
        link = `http://localhost:8983/solr/movies/select?facet.field=Genre&facet.mincount=1&facet.sort=count&facet=true&indent=true&q.op=OR&q=${solrQuery}&rq={!ltr%20model=EfiModelv1%20efi.whole="${query}"%20efi.separate=${query}}&fq=-Movie_Cast:(${query})AND -Overview:movies AND -Director:(${query})&fl=*,score,[features]&start=${
          (currentPage - 1) * 5
        }&rows=5&useParams=`;
      } else {
        link = `http://localhost:8983/solr/movies/select?facet.field=Genre&facet.mincount=1&facet.sort=count&facet=true&indent=true&q.op=OR&q=Movie_Cast:${solrQuery}&sort=score%20desc&fl=*,score&start=${
          (currentPage - 1) * 5
        }&rows=5&useParams=`;
      }

      const response = await axios.get(link);

      if (response.data.response.docs <= 0) {
        setGenreFilters([]);
        setErrorOpen(true);
      }

      setResults(response.data.response.docs);

      const spelling = await axios.get(
        `http://localhost:8983/solr/movies/spell?spellcheck.q=${query}&spellcheck=true&spellcheck.build=true&spellcheck.accuracy=0.2`
      );

      if (spelling.data.spellcheck.suggestions.length > 0) {
        // spelling.data.spellcheck.suggestions.map((suggest: any) =>
        //   console.log(suggest.suggestion)
        //   //setSpellings(suggest.suggestion)
        // );

        setSpellings(spelling.data.spellcheck.suggestions[1].suggestion);
        setSuggestedWordsOpen(true);
      }

      const genreFacet = response.data.facet_counts.facet_fields.Genre;

      const options = [];
      for (let i = 0; i < genreFacet.length; i += 2) {
        const genre = genreFacet[i];
        const count = genreFacet[i + 1];
        const formattedGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
        options.push({ genre: formattedGenre, count: count });
      }
      options.sort((a, b) => a.genre.localeCompare(b.genre));
      setGenreOptions(options);

      const numFound = response.data.response.numFound;
      const totalPages = Math.ceil(numFound / 5);
      setTotalPages(totalPages);
      setUpdateQuery(0);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSnackbarClose = () => {
    setErrorOpen(false);
  };

  const handleGenreFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    if (checked) {
      setGenreFilters((prevFilters) => [...prevFilters, value]);
    } else {
      setGenreFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== value)
      );
    }

    setCurrentPage(1);
    setUpdateQuery(1);
  };

  const handleRatingFilterChange = (event: any, newValue: any) => {
    setRatingFilter(newValue);
  };

  const handleSuggestedWordClick = (suggestedWord: string) => {
    setQuery(suggestedWord);
    setSuggestedWordsOpen(false);
    setGenreFilters([]);
    setCurrentPage(1);
    setUpdateQuery(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setUpdateQuery(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setUpdateQuery(1);
    }
  };

  const handleFilterButtonClick = () => {
    setFilterPopupOpen(true);
  };

  const handleFilterPopupClose = () => {
    setFilterPopupOpen(false);
  };

  const handleFilterTypeChange = (event: any) => {
    setFilterType(event.target.value);
  };

  const handleFilterApply = () => {
    setFilterPopupOpen(false);
    setSuggestedWordsOpen(false);
    setCurrentPage(1);
    setGenreFilters([]);
    setUpdateQuery(1);
  };

  const handleSearchButton = () => {
    setCurrentPage(1);
    setGenreFilters([]);
    setUpdateQuery(1);
  };

  const filterPopupId = "filter-popup";

  const filterPopup = (
    <Popover
      id={filterPopupId}
      open={filterPopupOpen}
      onClose={handleFilterPopupClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      style={{ marginTop: "50px" }}
    >
      <Box sx={{ padding: "1rem" }}>
        <RadioGroup
          aria-label="filter-type"
          name="filter-type"
          value={filterType}
          onChange={handleFilterTypeChange}
        >
          <FormControlLabel
            value="Series_Title"
            control={<Radio style={{ color: "#354649" }} />}
            label="Series Title & Overview"
          />
          <FormControlLabel
            value="Movie_Cast"
            control={<Radio style={{ color: "#354649" }} />}
            label="Movie Cast"
          />
        </RadioGroup>
      </Box>
    </Popover>
  );

  return (
    <>
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {query === "" ? (
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity="warning"
          >
            Please enter a search query.
          </Alert>
        ) : (
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity="error"
          >
            No Results Found.
          </Alert>
        )}
      </Snackbar>

      <Snackbar
        open={suggestedWordsOpen}
        onClose={() => setSuggestedWordsOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          onClose={() => setSuggestedWordsOpen(false)}
          severity="info"
        >
          Did you mean?
          {spellings.map((word, index) => (
            <Button
              key={index}
              color="inherit"
              onClick={() => handleSuggestedWordClick(word["word"])}
            >
              {word["word"]}
            </Button>
          ))}
        </Alert>
      </Snackbar>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: "50px",
          }}
        >
          <img src="popcorn.png" alt="logo" width={80} />
          <div style={{ marginLeft: "10px" }}>
            <Typography style={{ fontWeight: "bold", fontSize: "30px" }}>
              CineMatch
            </Typography>
            <Typography variant="body2" color="grey">
              Solr Apache Enabled
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: 600,
            marginRight: "50px",
          }}
        >
          <InputBase
            type="text"
            placeholder="Enter Search Query..."
            value={query}
            onChange={handleQueryChange}
            style={{
              flex: 1,
              padding: "8px",
              border: "2px black solid",
              borderRadius: "5px",
              borderBottom: "2px black solid",
              outline: "none",
              marginRight: "8px",
              width: "100%",
              fontSize: "16px",
              backgroundColor: "#ffffff",
            }}
          />
          <Button
            variant="contained"
            size="large"
            style={{
              borderRadius: "4px",
              minWidth: "auto",
              backgroundColor: "#354649",
            }}
            startIcon={<SearchIcon />}
            onClick={handleSearchButton}
          >
            Search
          </Button>
          <Button
            id="filter-button"
            variant="contained"
            color="primary"
            size="large"
            style={{
              borderRadius: "4px",
              marginLeft: "8px",
              backgroundColor: "#A3C6C4",
            }}
            startIcon={<TuneIcon />}
            onClick={handleFilterButtonClick}
          >
            Filter
          </Button>
          {filterPopup}
        </div>
      </div>

      <hr
        style={{
          margin: "20px 0",
          borderColor: "#000000",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Card
          variant="outlined"
          sx={{
            width: "10%",
            backgroundColor: "#E0E7E9",
            padding: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            height: "100%",
          }}
        >
          <CardContent>
            <div>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                IMDB Rating
              </Typography>
              {/* <TextField
                label="Min Rating"
                variant="outlined"
                fullWidth
                value={ratingFilter}
                onChange={handleRatingFilterChange}
                style={{ backgroundColor: "#ffffff" }}
              /> */}
              <Slider
                onChange={(event, newValue) =>
                  handleRatingFilterChange(event, newValue)
                }
                value={ratingFilter}
                step={1}
                min={0}
                max={10}
                marks
                valueLabelDisplay="auto"
                sx={{
                  color: "rgba(0,0,0,0.87)",
                  "& .MuiSlider-track": {
                    border: "none",
                  },
                  "& .MuiSlider-thumb": {
                    width: 24,
                    height: 24,
                    backgroundColor: "#fff",
                    "&:before": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                    },
                    "&:hover, &.Mui-focusVisible, &.Mui-active": {
                      boxShadow: "none",
                    },
                  },
                }}
              />
            </div>
            <br />
            <div>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Genre
              </Typography>
              <Grid container>
                {genreOptions.length > 1 &&
                  genreOptions.map((genre, index) => (
                    <Grid item key={index} md={12} xs={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={genreFilters.includes(genre.genre)}
                              onChange={handleGenreFilterChange}
                              value={genre.genre}
                              style={{ color: "#354649" }}
                            />
                          }
                          label={genre.genre}
                        />
                        <Chip
                          label={genre.count}
                          style={{
                            borderRadius: "5px",
                            backgroundColor: "#354649",
                            color: "#E0E7E9",
                            width: "40px",
                          }}
                        />
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </div>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
          }}
        >
          {results.map((result, index) => (
            <SearchResult key={index} result={result} />
          ))}

          {results.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Button
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                variant="contained"
                color="inherit"
              >
                Previous
              </Button>
              <Button
                disabled={totalPages - currentPage <= 0}
                onClick={handleNextPage}
                style={{
                  marginLeft: "10px",
                }}
                variant="contained"
                color="inherit"
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </div>
    </>
  );
};

export default SearchBar;
