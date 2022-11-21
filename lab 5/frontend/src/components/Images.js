import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { Button } from "@mui/material";
import PostList from "./PostList";
import { Container } from "@mui/system";

export default function Images() {
  const [pageNum, setPageNum] = useState(1);
  const { loading, error, data, fetchMore } = useQuery(queries.GET_IMAGES, {
    variables: { pageNum },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Container>
      <PostList dataList={data.unsplashImages} />
      <Button
        sx={{ display: "block", mx: "auto", my: 2 }}
        size="large"
        onClick={() => {
          fetchMore({
            variables: { pageNum: pageNum + 1 },
          });
          setPageNum(pageNum + 1);
        }}
      >
        Get More
      </Button>
    </Container>
  );
}
