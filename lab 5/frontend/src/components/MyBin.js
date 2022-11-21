import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import PostList from "./PostList";
import { Container } from "@mui/system";

export default function MyBin() {
  const { loading, error, data } = useQuery(queries.GET_BIN);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const delData = (idx) => {
    data.binnedImages.splice(idx, 1);
  };

  return (
    <Container>
      {data.binnedImages && (
        <PostList dataList={data.binnedImages} delFunction={delData} />
      )}
    </Container>
  );
}
