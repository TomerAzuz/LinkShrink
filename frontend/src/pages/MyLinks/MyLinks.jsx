import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BarChartIcon from "@mui/icons-material/BarChart";

import { URL_MYLINKS } from "../../constants/urlConstants";
import RequestService from "../../services/RequestService";
import Loader from "../../components/Loader/Loader";
import Title from "../../components/Title/Title";
import LinkDetailsItem from "../../components/LinkDetailsItem/LinkDetailsItem";
import EmptyLinks from "./EmptyLinks/EmptyLinks";

const PAGE_SIZE = 10;

const MyLinks = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [loading, setLoading] = useState(true);

  const deleteLink = async (id) => {
    try {
      const response = await RequestService.delete(`/url/${id}`);
      if (response && response.status === 204) {
        const filteredLinks = links.filter(link => link.id !== id);
        setLinks(filteredLinks);
        toast.success("Link deleted");
      }
    } catch (error) {
      toast.error("Error: failed to delete link");
    }
  };

  useEffect(() => {
    const getLinks = async () => {
      try {
        const response = await RequestService.get(`${URL_MYLINKS}?page=${currentPage}`, true);
        if (!response?.data?.length === 0) {
          setReachedEnd(true);
          return;
        }
        if (response.data.length < PAGE_SIZE) {
          setReachedEnd(true);
        } 
        links.length === 0 ? 
          setLinks(response.data) :       
          setLinks((prevLinks) => [...prevLinks, ...response.data]);
        
      } catch (error) {
        toast.error("Error: Failed to load links");
      } finally {
        setLoading(false);
      }
    };
    if (!reachedEnd) {
      getLinks(currentPage);
    }

  }, [currentPage]);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight && !loading && !reachedEnd) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <Container maxWidth="md">
      <Box textAlign="center" m={4}>
        <Box mt={8} mb={4}>
          <Title text={"My Links"} variant={"h2"} />
        </Box>
        <Button 
          component={Link}
          to="/analytics"
          variant="outlined"
          startIcon={<BarChartIcon />}
          sx={{ color: "black", border: "1px solid black" }}
        >
          <Typography variant="button">View Analytics</Typography> 
        </Button>
      </Box>
      {reachedEnd && links.length === 0 ? <EmptyLinks /> : (
        <Grid container spacing={2}>
          {links.map((link) => (
            <LinkDetailsItem 
              key={link.id} 
              link={link} 
              deleteLink={deleteLink}
            />
          ))}
        </Grid>
      )}
      <Box textAlign="center" mt={4}>
        {loading && <Loader />}
      </Box>
    </Container>
  );
};

export default MyLinks;