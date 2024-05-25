import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinkIcon from '@mui/icons-material/Link';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CodeIcon from '@mui/icons-material/Code';
import ClearIcon from '@mui/icons-material/Clear';

import { qrCodeToBase64 } from '../../utils/qrCodeToBase64';

const LinkDetailsItem = ({ link, deleteLink }) => {
  const { id, longUrl, shortUrl, qrCodeData, createdAt } = link;

  return (
    <Grid item xs={12} mb={2}>
      <Grid container alignItems='center' spacing={2} sx={{ border: 1, borderRadius: 4, borderColor: 'grey.300', p: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <LinkIcon />
          <Typography variant='body1' component={RouterLink} to={longUrl} color="inherit" underline="always">
            {longUrl}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {qrCodeData ? (
            <img src={qrCodeToBase64(qrCodeData)} alt='QR Code' width={60} height={60} />
          ) : (
            <>
              <CodeIcon />
              <Typography variant='body1' component={RouterLink} to={shortUrl} color='inherit' underline='always'>
                {shortUrl}
              </Typography>
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DateRangeIcon />
          <Typography variant='body1' component='span' ml={1}>
            {new Date(createdAt).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Tooltip title='Remove link'>
            <IconButton onClick={() => deleteLink(id)}>
              <ClearIcon sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LinkDetailsItem;
