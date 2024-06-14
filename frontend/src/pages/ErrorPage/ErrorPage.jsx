import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import errorMessages from '../../constants/errorMessages';

const ErrorPage = () => {
  const { status } = useParams();
  const { title, description } = errorMessages[status] || errorMessages['404'];

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {title}
      </Typography>
      <Typography variant="body1" gutterBottom align="center">
        {description}
      </Typography>
    </Container>
  );
};

export default ErrorPage;
