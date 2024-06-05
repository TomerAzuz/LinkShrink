import React, { useEffect, useState } from "react";
import ChartComponent from "../../components/ChartComponent/ChartComponent";
import RequestService from "../../services/RequestService";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";

import Loader from "../../components/Loader/Loader";
import Title from "../../components/Title/Title";

const Analytics = () => {
  const [metric, setMetric] = useState("country");
  const [timeScale, setTimeScale] = useState("hour");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnalyticsData = async () => {
      setLoading(true);
      try {
        const response = await RequestService.get("/analytics", true);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getAnalyticsData();
  }, []);

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

  const handleTimeScaleChange = (event) => {
    setTimeScale(event.target.value);
  };

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg">
      <Box m={4}>
      <Title text={"Analytics Dashboard"} variant={"h2"} textAlign="center" />
        <Typography variant="body1" align="center" paragraph>
          Welcome to the analytics dashboard. Here you can explore various metrics
          related to user interactions with your service. Use the dropdown below to
          select different metrics such as country, device type, access time, and
          browser.
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="h6" align="center" gutterBottom>
          Total clicks: {data.length}
        </Typography>
      </Box>
      <Grid container spacing={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="select-metric-label">Metric</InputLabel>
            <Select
              labelId="select-metric-label"
              id="select-metric"
              value={metric}
              label="Metric"
              onChange={handleMetricChange}
              style={{ minWidth: "150px" }}
            >
              <MenuItem value="country">Country</MenuItem>
              <MenuItem value="deviceType">Device type</MenuItem>
              <MenuItem value="accessTime">Access time</MenuItem>
              <MenuItem value="browser">Browser</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {metric === 'accessTime' && (
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="select-time-scale-label">Time Scale</InputLabel>
              <Select
                labelId="select-time-scale-label"
                id="select-time-scale"
                value={timeScale}
                label="Time Scale"
                onChange={handleTimeScaleChange}
                style={{ minWidth: "150px" }}
              >
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      <Box mt={4}>
        <ChartComponent data={data} metric={metric} timeScale={timeScale} />
      </Box>
    </Container>
  );
};

export default Analytics;
