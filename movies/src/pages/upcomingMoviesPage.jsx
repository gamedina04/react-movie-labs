import React from 'react';
import { getUpcomingMovies } from '../api/tmdb-api';
import { Container, Typography, Grid } from '@mui/material';
import MovieDetails from '../components/movieDetails';
import { useState, useEffect } from 'react';

const UpcomingMoviesPage = () => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        getUpcomingMovies().then(setMovies);
    }, []); 
    return (
        <Container>
            <Typography variant="h4">Upcoming Movies</Typography>
            <Grid container spacing={2}>
                {movies.map((movie) => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                        <MovieDetails movie={movie} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UpcomingMoviesPage;