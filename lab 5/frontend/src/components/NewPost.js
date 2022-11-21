import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

export default function MyPosts() {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [posterName, setPosterName] = useState("");

  const [upload, { loading, error }] = useMutation(queries.UPLOAD_IMAGE);

  if (loading) return "Submitting...";
  if (error) return `Error! ${error.message}`;

  const create = (e) => {
    e.preventDefault();

    const args = {
      url: url,
      description: description,
      posterName: posterName,
    };
    try {
      upload({ variables: args });
    } catch (error) {
      alert(error);
    }
    alert("create successfully! You can go to My posts page!");
  };

  return (
    <Container sx={{ p: 5 }} maxWidth="sm">
      <Stack paddingX={10} spacing={2} component="form" onSubmit={create}>
        <Typography
          variant="h5"
          noWrap
          sx={{
            m: "auto",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "underline",
          }}
        >
          Create a Post
        </Typography>
        <TextField
          required
          id="description"
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          required
          id="url"
          label="Image URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <TextField
          required
          id="posterName"
          label="Author Name"
          variant="outlined"
          value={posterName}
          onChange={(e) => setPosterName(e.target.value)}
        />
        <Button variant="contained" color="error" type="submit">
          Submit
        </Button>
      </Stack>
    </Container>
  );
}
