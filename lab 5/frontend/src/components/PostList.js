import React from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
import {
  Stack,
  Card,
  CardActions,
  Button,
  CardHeader,
  CardMedia,
} from "@mui/material";

export default function PostList(props) {
  let data = props.dataList;

  const [bin] = useMutation(queries.UPDATE_IMAGE);
  const [del] = useMutation(queries.DELETE_IMAGE, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          userPostedImages(_, { DELETE }) {
            return DELETE;
          },
          binnedImages(_, { DELETE }) {
            return DELETE;
          },
        },
      });
    },
  });

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      {data &&
        data.map((post) => {
          return (
            <Card key={post.id} sx={{ my: 2, minWidth: 275, maxWidth: 525 }}>
              <CardHeader
                subheader={"by: " + post.posterName}
                title={post.description}
              />
              <CardMedia component="img" image={post.url} alt={post.id} />
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    bin({
                      variables: {
                        updateImageId: post.id,
                        url: post.url,
                        posterName: post.posterName,
                        description: post.description ? post.description : "",
                        userPosted: post.userPosted,
                        binned: !post.binned,
                      },
                    });
                  }}
                >
                  {post.binned ? "Remove from bin" : "Add to Bin"}
                </Button>
                {!post.userPosted ? (
                  ""
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                      del({
                        variables: { deleteImageId: post.id },
                      });
                    }}
                  >
                    Delete Post
                  </Button>
                )}
              </CardActions>
            </Card>
          );
        })}
    </Stack>
  );
}
