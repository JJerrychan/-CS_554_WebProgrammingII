import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardMedia } from "@mui/material";
import noimage from "../noimage.jpeg";
const axios = require("axios");

export default function Character() {
  const navigate = useNavigate();

  const id = useParams().id;
  const category = useParams().category;
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/${category}/${id}`
        );
        if (res.status === 200 && res.data) setDetail(res.data);
        else navigate("/error");
      } catch (e) {
        console.log(e);
        navigate("/error");
      }
    }

    fetchData();
  }, [category, id, navigate]);

  return (
    <div style={{ textAlign: "center" }}>
      <Button href="/" variant="contained">
        Back to Home
      </Button>
      <h1 className="detail_title">{category} Details</h1>
      <Card sx={{ maxWidth: 1000, margin: "auto" }}>
        <CardMedia
          sx={{ maxHeight: 800, minWidth: "100%" }}
          component="img"
          image={
            !detail
              ? null
              : detail.thumbnail
              ? `${detail.thumbnail.path}.${detail.thumbnail.extension}`
              : noimage
          }
          title="image"
          alt="img"
        />
        <CardContent>
          <div>
            {!detail
              ? null
              : detail.name
              ? " Name: " + detail.name
              : " Title: " + detail.title}
          </div>
          <div>
            Description: <br />
            {!detail ? null : detail.description ? detail.description : "n/a"}
          </div>
          <div>
            {category} ID: <br />
            {id}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
