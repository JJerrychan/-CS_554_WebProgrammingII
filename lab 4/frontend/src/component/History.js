import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";

const axios = require("axios");

export default function Character() {
  const navigate = useNavigate();

  const [history, setHistory] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/characters/history`
        );
        if (res.status === 200 && res.data) setHistory(res.data);
        else navigate("/error");
      } catch (e) {
        console.log(e);
        navigate("/error");
      }
    }

    fetchData();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center" }}>
      <Button href="/" variant="contained">
        Back to Home
      </Button>
      <h1>Characters Accessed History</h1>
      <div>
        {!history ? null : (
          <div>
            <Grid>
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
                    {history.map((item, idx) => {
                      return (
                        <ListItem disablePadding key={idx}>
                          <ListItemButton
                            divider
                            component="a"
                            href={`/characters/` + item.id}
                          >
                            <ListItemText primary={item.name} />
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
    </div>
  );
}
