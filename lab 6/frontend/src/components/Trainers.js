import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  CardHeader,
  CardActions,
  CardMedia,
} from "@mui/material";
import React, { useContext } from "react";
import TrainersContext from "../context/TrainersContext";

export default function Trainers() {
  const { cur, setCur, tras, setTras } = useContext(TrainersContext);

  function creatTrainer() {
    const newTrainer = document.getElementById("new_trainer").value.trim();
    if (newTrainer === "") {
      alert("input should not be empty!");
      return;
    }
    if (tras[newTrainer]) {
      alert(newTrainer + " has exist, please input another name!");
      document.getElementById("trainer").value = "";
    } else {
      setTras({ ...tras, [newTrainer]: [] });
    }
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
    <Stack justifyContent="center" alignItems="center" spacing={2}>
      <Grid container my={2} justifyContent="center" alignItems="center">
        <Grid item xs={3}>
          <TextField id="new_trainer" label="new trainer" />
        </Grid>
        <Grid item xs={3}>
          <Button onClick={creatTrainer} variant="contained" size="large">
            Creat a new trainer
          </Button>
        </Grid>
      </Grid>
      {Object.keys(tras).map((trainer) => {
        return (
          <Stack key={trainer} p={2}>
            <Box>
              <Typography variant="h5">Trainer: {trainer}</Typography>
              {cur === trainer ? (
                <ButtonGroup variant="text">
                  <Button disabled color="secondary">
                    Select
                  </Button>
                  <Button disabled color="error">
                    Delete
                  </Button>
                </ButtonGroup>
              ) : (
                <ButtonGroup variant="text">
                  <Button
                    color="secondary"
                    onClick={() => {
                      setCur(trainer);
                    }}
                  >
                    Select
                  </Button>
                  <Button
                    color="error"
                    onClick={() => {
                      const temp = { ...tras };
                      delete temp[trainer];
                      setTras(temp);
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              )}
            </Box>
            <Grid container alignItems="center" spacing={2}>
              {tras[trainer].map((poke) => {
                return (
                  <Grid item key={poke.id} xs={6} sm={4} md={3}>
                    <Card>
                      <CardHeader
                        title={poke.name}
                        titleTypographyProps={{
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      />
                      <CardMedia
                        component="img"
                        image={poke.image}
                        alt={poke.id}
                      />
                      <CardActions>
                        <Button
                          variant="contained"
                          onClick={() => releasePoke(poke)}
                        >
                          Relese
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        );
      })}
    </Stack>
  );
}
