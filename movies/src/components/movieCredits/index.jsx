import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { getMovieCredits } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from '../spinner'
import Button from "@mui/material/Button";
import { useState } from "react";

const MAX_CAST = 12;

const MovieCredits = ({ movie }) => {
  const [showAll, setShowAll] = useState(false);
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['credits', { id: movie.id }],
    queryFn: getMovieCredits,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const allCast = data?.cast ?? [];
  const hasMore = allCast.length > MAX_CAST;
  const cast = showAll ? allCast : allCast.slice(0, MAX_CAST);

  if (allCast.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" component="h3" sx={{ marginTop: 4 }}>
        Cast
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          py: 1,
        }}
      >
        {cast.map((c) => (
          <Box
            key={c.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 110,
              textAlign: "center",
            }}
          >
            <Avatar
              src={
                c.profile_path
                  ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                  : undefined
              }
              alt={c.name}
              sx={{ width: 80, height: 80, mb: 1 }}
            />
            <Typography variant="subtitle2">{c.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {c.character}
            </Typography>
          </Box>
        ))}
      </Box>
      {hasMore && (
        <Button
          size="small"
          onClick={() => setShowAll((prev) => !prev)}
          sx={{ mt: 1 }}
        >
          {showAll ? "Show less" : `Show more (${allCast.length - MAX_CAST})`}
        </Button>
      )}
    </>
  );
};

export default MovieCredits;
