import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

export default function Home() {
  return (
    <Stack my={7} spacing={3}>
      <Typography component="h1" variant="h4" align="center">
        Welcome, this is a miniature Pokémon catching application.
      </Typography>
      <Typography variant="body1" align="center">
        Use "Pokemons" to catch a pokemon
      </Typography>
      <Typography variant="body1" align="center">
        Use "Trainers" to select a trainer
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        {new Date().getFullYear()}
        {". SIT @ Junjie Chen"}
      </Typography>
    </Stack>
  );
}
