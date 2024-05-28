import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BarChartIcon from '@mui/icons-material/BarChart';

import { URL_MYLINKS } from '../../constants/urlConstants';
import RequestService from '../../services/RequestService';
import Loader from '../../components/Loader/Loader';
import LinkDetailsItem from '../../components/LinkDetailsItem/LinkDetailsItem';

const MyLinks = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteLink = async (id) => {
    setLoading(true);
    try {
      const response = await RequestService.delete(`/url/${id}`);
      if (response.status === 204) {
        const filteredLinks = links.filter(link => link.id !== id);
        setLinks(filteredLinks);
      }
    } catch (error) {
      console.log('failed to delete link');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLinks = async () => {
      try {
        const response = await RequestService.get(URL_MYLINKS, true);
        setLinks(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getLinks();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        Failed to load links. Please try again.
      </Typography>
    );
  }

  if (links.length === 0) {
    return (
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h3" gutterBottom>No Links yet</Typography>
        <Typography variant="subtitle1">
          Go to homepage and generate your shortened link or QR code
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth='md'>
      <Box textAlign="center" m={4}>
      <Typography 
        variant='h2' 
        align='center' 
        m={6}
        color='#333'
        fontWeight='bold'
        textTransform='uppercase'
        letterSpacing='2px'
        sx={{ userSelect: 'none' }}
        >
          My Links
        </Typography>
        <Button 
          variant="outlined"
          startIcon={<BarChartIcon />}
          sx={{ color: 'black', border: '1px solid black' }}
          onClick={() => navigate('/analytics')}
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
    </Container>
  );
};

export default MyLinks;
