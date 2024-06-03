import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BarChartIcon from "@mui/icons-material/BarChart";

import { URL_MYLINKS } from "../../constants/urlConstants";
import RequestService from "../../services/RequestService";
import Loader from "../../components/Loader/Loader";
import LinkDetailsItem from "../../components/LinkDetailsItem/LinkDetailsItem";

const PAGE_SIZE = 10;

const MyLinks = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const response = await RequestService.get(`${URL_MYLINKS}?page=${currentPage}`, true);
        if (!response || !response.data || response.data.length === 0) {
          setReachedEnd(true);
          return;
        }
        if (links.length === 0) {
          setLinks(response.data);
        } else if (links.length < PAGE_SIZE) {
          setReachedEnd(true);
        } else {
          setLinks((prevLinks) => [...prevLinks, ...response.data]);
        }
      } catch (error) {
        toast.error("Error: Failed to load links");
      } finally {
        setLoading(false);
      }
    };
    if (!reachedEnd && !loading) {
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

  if (loading && currentPage === 0) {
    return <Loader />;
  }

  if (links.length === 0) {
    return (
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" m={8} p={2}>
        <Typography variant="h3" gutterBottom>No Links yet</Typography>
        <Typography variant="subtitle1">
          Go to <Link to="/">Home</Link> and generate your shortened link or QR code
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box textAlign="center" m={4}>
      <Typography 
        variant="h2" 
        align="center" 
        m={6}
        color="#333"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="2px"
        sx={{ userSelect: "none" }}
        >
          My Links
        </Typography>
        <Button 
          variant="outlined"
          startIcon={<BarChartIcon />}
          sx={{ color: "black", border: "1px solid black" }}
          onClick={() => navigate("/analytics")}
        >
          View Analytics 
        </Button>
      </Box>
      <Grid container spacing={2}>
        {links.slice().reverse().map((link) => (
          <LinkDetailsItem 
            key={link.id} 
            link={link} 
            deleteLink={deleteLink}
          />
        ))}
      </Grid>
      <Box textAlign="center" mt={4}>
        {loading && <Loader />}
      </Box>
    </Container>
  );
};

export default MyLinks;
