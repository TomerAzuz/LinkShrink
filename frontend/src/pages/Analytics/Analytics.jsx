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

const mockedData = [
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-01T19:00:00", browser: "Chrome" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-01T19:03:00", browser: "Chrome" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-01T19:05:00", browser: "Chrome" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-01T19:07:00", browser: "Chrome" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-01T19:08:00", browser: "Chrome" },
  { country: "China", deviceType: "Mobile", accessTime: "2024-06-01T12:00:00", browser: "Safari" },
  { country: "India", deviceType: "Tablet", accessTime: "2024-06-02T15:00:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Desktop", accessTime: "2024-06-02T15:00:00", browser: "Edge" },
  { country: "Germany", deviceType: "Mobile", accessTime: "2024-06-03T21:00:00", browser: "Opera" },
  { country: "Japan", deviceType: "Mobile", accessTime: "2024-06-04T10:00:00", browser: "Safari" },
  { country: "France", deviceType: "Desktop", accessTime: "2024-06-04T13:00:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Tablet", accessTime: "2024-06-05T16:00:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Mobile", accessTime: "2024-06-05T19:00:00", browser: "Edge" },
  { country: "Canada", deviceType: "Desktop", accessTime: "2024-06-06T22:00:00", browser: "Opera" },
  { country: "USA", deviceType: "Mobile", accessTime: "2024-06-07T09:30:00", browser: "Chrome" },
  { country: "China", deviceType: "Desktop", accessTime: "2024-06-07T12:45:00", browser: "Safari" },
  { country: "India", deviceType: "Mobile", accessTime: "2024-06-08T15:20:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Tablet", accessTime: "2024-06-08T18:10:00", browser: "Edge" },
  { country: "Germany", deviceType: "Desktop", accessTime: "2024-06-09T21:55:00", browser: "Opera" },
  { country: "Japan", deviceType: "Tablet", accessTime: "2024-06-10T10:35:00", browser: "Safari" },
  { country: "France", deviceType: "Mobile", accessTime: "2024-06-10T14:25:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Desktop", accessTime: "2024-06-11T16:15:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Mobile", accessTime: "2024-06-11T13:50:00", browser: "Edge" },
  { country: "Canada", deviceType: "Tablet", accessTime: "2024-06-12T22:20:00", browser: "Opera" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-01-13T09:20:00", browser: "Chrome" },
  { country: "China", deviceType: "Mobile", accessTime: "2024-01-15T12:35:00", browser: "Safari" },
  { country: "India", deviceType: "Tablet", accessTime: "2024-04-18T15:10:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Desktop", accessTime: "2024-01-14T18:25:00", browser: "Edge" },
  { country: "Germany", deviceType: "Mobile", accessTime: "2024-02-15T21:40:00", browser: "Opera" },
  { country: "Japan", deviceType: "Mobile", accessTime: "2023-08-16T10:15:00", browser: "Safari" },
  { country: "France", deviceType: "Desktop", accessTime: "2024-05-16T13:30:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Tablet", accessTime: "2024-02-17T16:45:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Mobile", accessTime: "2024-06-17T19:55:00", browser: "Edge" },
  { country: "Canada", deviceType: "Desktop", accessTime: "2023-06-18T22:05:00", browser: "Opera" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-12T08:00:00", browser: "Chrome" },
  { country: "USA", deviceType: "Mobile", accessTime: "2024-06-12T10:30:00", browser: "Chrome" },
  { country: "China", deviceType: "Tablet", accessTime: "2024-06-12T14:45:00", browser: "Safari" },
  { country: "India", deviceType: "Desktop", accessTime: "2024-06-12T18:00:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Mobile", accessTime: "2024-06-13T08:00:00", browser: "Edge" },
  { country: "Germany", deviceType: "Tablet", accessTime: "2024-06-13T12:00:00", browser: "Opera" },
  { country: "Japan", deviceType: "Desktop", accessTime: "2024-06-13T16:00:00", browser: "Safari" },
  { country: "France", deviceType: "Mobile", accessTime: "2024-06-14T09:00:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Tablet", accessTime: "2024-06-14T13:00:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Desktop", accessTime: "2024-06-14T17:00:00", browser: "Edge" },
  { country: "Canada", deviceType: "Mobile", accessTime: "2024-06-15T08:00:00", browser: "Opera" },
  { country: "USA", deviceType: "Tablet", accessTime: "2024-06-15T12:00:00", browser: "Chrome" },
  { country: "China", deviceType: "Desktop", accessTime: "2024-06-15T16:00:00", browser: "Safari" },
  { country: "India", deviceType: "Mobile", accessTime: "2024-06-16T09:00:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Tablet", accessTime: "2024-06-16T13:00:00", browser: "Edge" },
  { country: "Germany", deviceType: "Desktop", accessTime: "2024-06-17T17:00:00", browser: "Opera" },
  { country: "Japan", deviceType: "Mobile", accessTime: "2024-06-17T08:00:00", browser: "Safari" },
  { country: "France", deviceType: "Tablet", accessTime: "2024-06-17T12:00:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Desktop", accessTime: "2024-06-17T16:00:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Mobile", accessTime: "2024-06-18T09:00:00", browser: "Edge" },
  { country: "Canada", deviceType: "Tablet", accessTime: "2024-06-18T13:00:00", browser: "Opera" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-18T17:00:00", browser: "Chrome" },
  { country: "China", deviceType: "Mobile", accessTime: "2024-06-18T10:00:00", browser: "Safari" },
  { country: "India", deviceType: "Tablet", accessTime: "2024-06-18T14:00:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Desktop", accessTime: "2024-06-18T18:00:00", browser: "Edge" },
  { country: "Germany", deviceType: "Mobile", accessTime: "2024-06-19T09:00:00", browser: "Opera" },
  { country: "Japan", deviceType: "Tablet", accessTime: "2024-06-19T13:00:00", browser: "Safari" },
  { country: "France", deviceType: "Desktop", accessTime: "2024-06-19T17:00:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Mobile", accessTime: "2024-06-20T08:00:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Tablet", accessTime: "2024-06-20T12:00:00", browser: "Edge" },
  { country: "Canada", deviceType: "Desktop", accessTime: "2024-06-20T16:00:00", browser: "Opera" },
  { country: "USA", deviceType: "Mobile", accessTime: "2024-06-20T20:00:00", browser: "Chrome" },
  { country: "China", deviceType: "Tablet", accessTime: "2024-06-21T09:00:00", browser: "Safari" },
  { country: "India", deviceType: "Desktop", accessTime: "2024-06-21T13:00:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Mobile", accessTime: "2024-06-21T17:00:00", browser: "Edge" },
  { country: "Germany", deviceType: "Tablet", accessTime: "2024-06-22T08:00:00", browser: "Opera" },
  { country: "Japan", deviceType: "Desktop", accessTime: "2024-06-22T12:00:00", browser: "Safari" },
  { country: "France", deviceType: "Mobile", accessTime: "2024-06-22T16:00:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Tablet", accessTime: "2024-06-23T09:00:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Desktop", accessTime: "2024-06-23T13:00:00", browser: "Edge" },
  { country: "Canada", deviceType: "Mobile", accessTime: "2024-06-23T17:00:00", browser: "Opera" },
  { country: "USA", deviceType: "Tablet", accessTime: "2024-06-24T08:00:00", browser: "Chrome" },
  { country: "China", deviceType: "Desktop", accessTime: "2024-06-24T12:00:00", browser: "Safari" },
  { country: "India", deviceType: "Mobile", accessTime: "2024-06-24T16:00:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Tablet", accessTime: "2024-06-25T09:00:00", browser: "Edge" },
  { country: "Germany", deviceType: "Desktop", accessTime: "2024-06-25T13:00:00", browser: "Opera" },
  { country: "Japan", deviceType: "Mobile", accessTime: "2024-06-25T17:00:00", browser: "Safari" },
  { country: "France", deviceType: "Tablet", accessTime: "2024-06-26T08:00:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Desktop", accessTime: "2024-06-26T12:00:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Mobile", accessTime: "2024-06-26T16:00:00", browser: "Edge" },
  { country: "Canada", deviceType: "Tablet", accessTime: "2024-06-27T09:00:00", browser: "Opera" },
  { country: "USA", deviceType: "Desktop", accessTime: "2024-06-27T13:00:00", browser: "Chrome" },
  { country: "China", deviceType: "Mobile", accessTime: "2024-06-27T17:00:00", browser: "Safari" },
  { country: "India", deviceType: "Tablet", accessTime: "2024-06-28T08:00:00", browser: "Firefox" },
  { country: "Brazil", deviceType: "Desktop", accessTime: "2024-06-28T12:00:00", browser: "Edge" },
  { country: "Germany", deviceType: "Mobile", accessTime: "2024-06-28T16:00:00", browser: "Opera" },
  { country: "Japan", deviceType: "Tablet", accessTime: "2024-06-29T09:00:00", browser: "Safari" },
  { country: "France", deviceType: "Desktop", accessTime: "2024-06-29T13:00:00", browser: "Chrome" },
  { country: "Mexico", deviceType: "Mobile", accessTime: "2024-06-29T17:00:00", browser: "Firefox" },
  { country: "Australia", deviceType: "Tablet", accessTime: "2024-06-30T08:00:00", browser: "Edge" },
  { country: "Canada", deviceType: "Desktop", accessTime: "2024-06-30T12:00:00", browser: "Opera" },
  { country: "USA", deviceType: "Mobile", accessTime: "2024-06-30T16:00:00", browser: "Chrome" },
];



const Analytics = () => {
  const [metric, setMetric] = useState("country");
  const [data, setData] = useState(mockedData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAnalyticsData = async () => {
      setLoading(true);
      try {
        const response = await RequestService.get("/analytics", true);
        setData(response.data);
      } catch (error) {
        toast.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    //getAnalyticsData();
  }, []);

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

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
      </Grid>
      <Box mt={4}>
        <ChartComponent data={data} metric={metric} />
      </Box>
    </Container>
  );
};

export default Analytics;
