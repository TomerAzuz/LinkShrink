import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';

import { URL_MYLINKS } from '../../constants/urlConstants';
import RequestService from '../../services/RequestService';
import Loader from '../../components/Loader/Loader';

const MyLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const response = await RequestService.get(URL_MYLINKS, true);
        console.log(response)
        setLinks(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getLinks();
  }, []);

  if (loading)
    return <Loader />;

  if (error) 
    return <>Failed to load links. Please try again.</>;

  return (
    <Grid container spacing={2}>
      {links && links.map((link, index) => (
        <Grid item xs={12} key={index}>
          {JSON.stringify(link)}
        </Grid>
      ))}
    </Grid>
  );
};

export default MyLinks;