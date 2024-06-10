import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinkIcon from '@mui/icons-material/Link';
import QRCodeIcon from '@mui/icons-material/QrCode';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const FeaturesSection = () => (
  <Box m={2} p={2}>
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12} md={4}>
        <Box textAlign="center">
          <LinkIcon style={{ fontSize: 56, color: '#1e88e5' }} />
          <Typography variant="h6">URL Shortening</Typography>
          <Typography variant="body2">
            Simplify your links to make them more shareable and manageable.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box textAlign="center">
          <QRCodeIcon style={{ fontSize: 56, color: '#4caf50' }} />
          <Typography variant="h6">QR Code Generation</Typography>
          <Typography variant="body2">
            Instantly generate QR codes for your URLs to make them accessible on the go.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box textAlign="center">
          <AnalyticsIcon style={{ fontSize: 56, color: '#f57c00' }} />
          <Typography variant="h6">Link Tracking</Typography>
          <Typography variant="body2">
            Track the performance of your links with detailed analytics.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default FeaturesSection;