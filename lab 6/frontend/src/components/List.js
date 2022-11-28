import {
  Pagination,
  Stack,
  Grid,
  Card,
  Button,
  CardMedia,
  CardHeader,
  CardActions,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import TrainersContext from "../context/TrainersContext";

export default function List() {
  const navigate = useNavigate();
  const [page, setPage] = useState(parseInt(useParams().pagenum));
  const { loading, error, data } = useQuery(queries.GET_BY_PAGE, {
    variables: { page },
    fetchPolicy: "network-only",
  });
  const { cur, tras, setTras } = useContext(TrainersContext);

  const handlePageChange = (_event, value) => {
    setPage(value - 1);
    navigate(`/pokemon/page/${value - 1}`);
  };

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

  if (loading) return "Loading...";
  if (error) return `404 not found!`;

  return (
    <Stack justifyContent="center" alignItems="center" spacing={2}>
      <Pagination
        sx={{ mt: 3 }}
        count={Math.ceil(1154 / 20)}
        page={page + 1}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
      />
      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {data.getByPage.map((item) => {
          return (
            <Grid item key={item.id} xs={6} sm={4} md={3}>
              <Card sx={{ textDecoration: "none" }}>
                <CardHeader
                  title={item.name}
                  titleTypographyProps={{
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
                <NavLink to={`/pokemon/${item.id}`}>
                  <CardMedia component="img" image={item.image} alt={item.id} />
                </NavLink>

                {cur ? (
                  <CardActions>
                    {tras[cur].map((ele) => ele.id).includes(item.id) ? (
                      <Button
                        variant="contained"
                        onClick={() => releasePoke(item)}
                      >
                        Relese
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => catchPoke(item)}
                      >
                        Catch
                      </Button>
                    )}
                  </CardActions>
                ) : (
                  <CardActions>
                    <Button variant="contained" disabled>
                      Catch / Relese
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
