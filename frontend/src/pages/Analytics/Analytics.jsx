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

import Loader from "../../components/Loader/Loader";

const Analytics = () => {
  const [metric, setMetric] = useState("country");
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

  if (error) {
    return <>{error.message}</>
  }

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <Container>
      <Box component="section" p={2} mt={4}>
        <Typography variant="h2" align="center">
          Analytics
        </Typography>
        <Box component="section" mt={2}>
          <Typography variant="h6" gutterBottom>
            Total clicks: {data.length}
          </Typography>
        </Box>
      </Box>
      <Box component="section" p={2} mt={2}>
        <FormControl>
          <InputLabel id="select-metric-label">Metric</InputLabel>
          <Select
            labelId="select-metric-label"
            id="select-metric"
            value={metric}
            label="Metric"
            onChange={handleMetricChange}
          >
            <MenuItem value="country">Country</MenuItem>
            <MenuItem value="deviceType">Device type</MenuItem>
            <MenuItem value="accessTime">Access time</MenuItem>
            <MenuItem value="browser">Browser</MenuItem>
          </Select>
        </FormControl>
        <ChartComponent data={data} metric={metric} />
      </Box>
    </Container>
  );
};

export default Analytics;