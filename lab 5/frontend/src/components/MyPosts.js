import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import PostList from "./PostList";
import { Container } from "@mui/system";
import { Button } from "@mui/material";

export default function MyPosts() {
  const { loading, error, data } = useQuery(queries.GET_POSTS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Container>
      <Button href="/new-post" fullWidth variant="contained" sx={{ my: 2 }}>
        Upload a Post
      </Button>
      {data.userPostedImages && <PostList dataList={data.userPostedImages} />}
    </Container>
  );
}
