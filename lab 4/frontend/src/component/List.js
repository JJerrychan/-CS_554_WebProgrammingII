import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Pagination,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";

const axios = require("axios");

export default function ListComponent() {
  const navigate = useNavigate();

  const category = useParams().category;
  const [page, setPage] = useState(parseInt(useParams().page));
  const [dataR, setDataR] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/${category}/page/${page}`
        );
        if (res.status === 200 && res.data.count !== 0) {
          setDataR(res.data);
        } else {
          navigate("/error");
        }
      } catch (e) {
        console.log(e);
        navigate("/error");
      }
    }

    fetchData();
  }, [page, category, navigate]);

  const handlePageChange = (_event, value) => {
    setPage(value);
    navigate(`/${category}/page/${value}`);
  };

  return (
    <div>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Button href="/" variant="contained">
          Back to Home
        </Button>
        <h1>{category} list</h1>
      </div>
      {!dataR ? null : (
        <div>
          <Grid>
            <Grid container justifyContent="center">
              <Pagination
                count={Math.ceil(dataR.total / dataR.limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Grid>
            <Grid container justifyContent="center">
              <Box
                sx={{
                  width: "50%",
                  minWidth: 400,
                  my: 2,
                  border: 3,
                  boxShadow: 5,
                }}
              >
                <List>
                  {dataR.results.map((item) => {
                    return (
                      <ListItem disablePadding key={item.id}>
                        <ListItemButton
                          divider
                          component="a"
                          href={`/${category}/` + item.id}
                        >
                          <ListItemText primary={item.name || item.title} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
