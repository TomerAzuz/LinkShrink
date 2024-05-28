import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

const Loader = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <React.Fragment>
          <svg width={0} height={200}>
            <defs>
              <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff7e5f" />
                <stop offset="100%" stopColor="#feb47b" />
              </linearGradient>
            </defs>
          </svg>
          <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </React.Fragment>
      </Grid>
    </Grid>
  );
};

export default Loader;
