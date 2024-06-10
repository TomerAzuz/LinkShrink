import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
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
import ChartComponent from "./ChartComponent/ChartComponent";
import RequestService from "../../services/RequestService";

const Analytics = () => {
  const [metric, setMetric] = useState("country");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalyticsData = async () => {
      try {
        const response = await RequestService.get("/analytics", true);
        setData(response.data);
      } catch (error) {
        toast.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    getAnalyticsData();
  }, []);

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

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
      </Grid>
      {loading && <Loader />}
      <Box mt={4}>
        <ChartComponent data={data} metric={metric} />
      </Box>
    </Container>
  );
};

export default Analytics;
