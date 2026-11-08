import Typography from "@mui/material/Typography";
import MovieList from "../movieList";
import { getMovieRecommendations } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from '../spinner'
import AddToFavouritesIcon from '../cardIcons/addToFavourites'

const MovieRecommendations = ({ movie }) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['recommendations', { id: movie.id }],
    queryFn: getMovieRecommendations,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const movies = data.results;

  if (movies.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" component="h3" sx={{ marginTop: 4 }}>
        Recommended Movies
      </Typography>
      <MovieList
        movies={movies}
        action={(m) => <AddToFavouritesIcon movie={m} />}
      />
    </>
  );
};

export default MovieRecommendations;
