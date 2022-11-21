import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Images from "./components/Images";
import MyBin from "./components/MyBin";
import MyPosts from "./components/MyPosts";
import NewPost from "./components/NewPost";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          unsplashImages: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: [],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <DeleteIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Binterest
            </Typography>
            <Button size="large" color="inherit" sx={{ mx: 5 }} href="/my-bin">
              my bin
            </Button>
            <Button size="large" color="inherit" sx={{ mx: 5 }} href="/">
              images
            </Button>
            <Button
              size="large"
              color="inherit"
              sx={{ mx: 5 }}
              href="/my-posts"
            >
              my posts
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Images />} />
          <Route path="/my-bin" element={<MyBin />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/new-post" element={<NewPost />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
