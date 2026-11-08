import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MovieCard from "../movieCard";
import { getMovieRecommendations } from "../../api/tmdb-api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Spinner from '../spinner'
import AddToFavouritesIcon from '../cardIcons/addToFavourites'

const CARD_WIDTH = 240;
const SCROLL_THRESHOLD = 400;

const MovieRecommendations = ({ movie }) => {
  const scrollRef = useRef(null);
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['recommendations', { id: movie.id }],
    queryFn: getMovieRecommendations,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const movies = [...new Map(
    (data?.pages ?? []).flatMap((page) => page.results).map((m) => [m.id, m])
  ).values()];

  const maybeLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleScroll = (e) => {
    const el = e.currentTarget;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - SCROLL_THRESHOLD) {
      maybeLoadMore();
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollWidth <= el.clientWidth + SCROLL_THRESHOLD) {
      maybeLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" component="h3" sx={{ marginTop: 4 }}>
        Recommended Movies
      </Typography>
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          py: 1,
          "&::-webkit-scrollbar": { height: 8 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "max-content",
            px: 1,
          }}
        >
          {movies.map((m) => (
            <Box key={m.id} sx={{ width: CARD_WIDTH, flexShrink: 0 }}>
              <MovieCard movie={m} action={(movie) => <AddToFavouritesIcon movie={movie} />} />
            </Box>
          ))}
          {(hasNextPage || isFetchingNextPage) && (
            <Box
              sx={{
                width: CARD_WIDTH,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={maybeLoadMore}
                disabled={isFetchingNextPage || !hasNextPage}
              >
                {isFetchingNextPage ? (
                  <CircularProgress size={24} />
                ) : (
                  "Load more"
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MovieRecommendations;
