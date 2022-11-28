import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import Home from "./components/Home";
import List from "./components/List";
import Detail from "./components/Detail";
import Trainers from "./components/Trainers";
import TrainersContext from "./context/TrainersContext";
import React, { useState } from "react";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

function App() {
  const [cur, setCur] = useState("");
  const [tras, setTras] = useState({});

  return (
    <ApolloProvider client={client}>
      <TrainersContext.Provider value={{ cur, setCur, tras, setTras }}>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Button
                size="large"
                component={NavLink}
                to="/"
                sx={{
                  mx: 2,
                  letterSpacing: ".2rem",
                  color: "inherit",
                }}
              >
                Home
              </Button>
              <Button
                size="large"
                component={NavLink}
                to="/pokemon/page/0"
                sx={{
                  mx: 2,
                  letterSpacing: ".2rem",
                  color: "inherit",
                }}
              >
                Pokemons
              </Button>
              <Button
                size="large"
                component={NavLink}
                to="/trainers"
                sx={{
                  mx: 2,
                  letterSpacing: ".2rem",
                  color: "inherit",
                }}
              >
                Trainers
              </Button>
              <Typography align="right" flexGrow="1" variant="body1">
                current trainer: {cur ? cur : "none"}
              </Typography>
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/page/:pagenum" element={<List />} />
            <Route path="/pokemon/:id" element={<Detail />} />
            <Route path="/trainers" element={<Trainers />} />
          </Routes>
        </Router>
      </TrainersContext.Provider>
    </ApolloProvider>
  );
}

export default App;
