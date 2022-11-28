import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { Button, Chip, Grid, Typography } from "@mui/material";
import TrainersContext from "../context/TrainersContext";

export default function Detail() {
  const id = useParams().id;
  const { loading, error, data } = useQuery(queries.GET_BY_ID, {
    variables: { id },
    fetchPolicy: 'network-only'
  });
  const { cur, tras, setTras } = useContext(TrainersContext);

  if (loading) return "Loading...";
  if (error) return `404 not found!`;

  function catchPoke(poke) {
    if (tras[cur].length >= 6) {
      alert("A trainer has up to 6 pokemons!");
      return;
    }
    setTras({ ...tras, [cur]: [...tras[cur], poke] });
  }

  function releasePoke(poke) {
    setTras({
      ...tras,
      [cur]: [...tras[cur]].filter((ele) => {
        return ele.id !== poke.id;
      }),
    });
  }

  return (
    <Grid
      direction="column"
      container
      spacing={5}
      justifyContent="center"
      alignItems="center"
      my={2}
    >
      <Grid item>
        <Typography
          letterSpacing="3"
          textTransform="uppercase"
          textAlign="center"
          fontWeight="bold"
        >
          {data.getById.name}
        </Typography>
      </Grid>
      <Grid item>
        <img src={data.getById.image} alt={`${data.getById.id}img`} />
      </Grid>
      <Grid item>
        <Typography fontWeight="bold" fontFamily="monospace" textAlign="center">
          Height:{data.getById.height}
        </Typography>
        <Typography fontWeight="bold" fontFamily="monospace" textAlign="center">
          Weight:{data.getById.weight}
        </Typography>
      </Grid>
      <Grid item>
        {data.getById.types.map((type) => {
          return (
            <Chip
              sx={{ mx: 1 }}
              color="success"
              key={type}
              label={type}
              variant="outlined"
            />
          );
        })}
      </Grid>
      <Grid item>
        {cur ? (
          tras[cur].map(ele => ele.id).includes(data.getById.id) ? (
            <Button variant="contained" onClick={() => releasePoke(data.getById)}>
              Relese
            </Button>
          ) : (
            <Button variant="contained" onClick={() => catchPoke(data.getById)}>
              Catch
            </Button>
          )
        ) : (
          <Button sx={{ mx: 1 }} variant="contained" disabled>
            Catch / Relese
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
