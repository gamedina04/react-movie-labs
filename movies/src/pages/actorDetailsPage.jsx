import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { getPersonDetails, getPersonMovieCredits } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import img from "../images/film-poster-placeholder.png";

const ActorDetailsPage = () => {
  const { id } = useParams();

  const { data: person, error, isPending, isError } = useQuery({
    queryKey: ["person", { id }],
    queryFn: getPersonDetails,
  });

  const { data: credits } = useQuery({
    queryKey: ["personCredits", { id }],
    queryFn: getPersonMovieCredits,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const filmography = (credits?.cast ?? [])
    .filter((m) => m.poster_path)
    .slice(0, 12);

  return (
    <>
      <Grid container spacing={4} sx={{ padding: "15px" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Avatar
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : undefined
            }
            alt={person.name}
            variant="rounded"
            sx={{ width: "100%", aspectRatio: "2/3", height: "auto" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" component="h1">
            {person.name}
          </Typography>
          <Paper
            component="ul"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              listStyle: "none",
              padding: 1.5,
              margin: "1rem 0",
            }}
          >
            {person.birthday && <Chip label={`Born: ${person.birthday}`} />}
            {person.deathday && <Chip label={`Died: ${person.deathday}`} />}
            {person.place_of_birth && (
              <Chip label={person.place_of_birth} />
            )}
            {person.known_for_department && (
              <Chip label={person.known_for_department} color="primary" />
            )}
          </Paper>
          <Typography variant="h5" component="h3">
            Biography
          </Typography>
          <Typography variant="body1" component="p" sx={{ whiteSpace: "pre-line" }}>
            {person.biography || "No biography available."}
          </Typography>
        </Grid>
      </Grid>

      {filmography.length > 0 && (
        <>
          <Typography variant="h5" component="h3" sx={{ padding: "0 15px" }}>
            Filmography
          </Typography>
          <Grid container spacing={2} sx={{ padding: "15px" }}>
            {filmography.map((m) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={m.id}>
                <Link
                  to={`/movies/${m.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card>
                    <CardMedia
                      sx={{ height: 300 }}
                      image={
                        m.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${m.poster_path}`
                          : img
                      }
                    />
                    <CardContent>
                      <Typography variant="subtitle2">{m.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {m.character}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default ActorDetailsPage;
