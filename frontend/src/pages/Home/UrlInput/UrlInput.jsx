import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import UrlResult from "../UrlResult/UrlResult";
import RequestService from "../../../services/RequestService";
import { validateUrl } from "../../../utils/UrlValidator";
import Loader from "../../../components/Loader/Loader";
import { URL_SHORTEN, URL_UNSHORTEN, URL_REPORT } from "../../../constants/urlConstants";
import UrlForm from "../../../components/UrlForm/UrlForm";
import TabPanel from "../../../components/TabPanel/TabPanel";

const UrlInput = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const handleSubmit = async (values, { setSubmitting }, endpoint) => {
    setSubmitting(true);
    setLoading(true);
    try {
      const sanitizedUrl = validateUrl(values.url);
      const response = await RequestService.post(
        endpoint, { url: sanitizedUrl }, true);
        setResult(response);
    } catch (error) {
      toast.error("Error")
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const resetUrlInput = () => {
    setResult(null);
  };

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const tabVariants = {
    offscreen: {
      y: 300
    },
    onscreen: {
      y: 50,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  if (loading) return <Loader />;
  
  if (result) return (
    <UrlResult 
      result={result}
      resetUrlInput={resetUrlInput} 
      loading={loading}
    />
  ); 

  return (
    <Box
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        textAlign: "center",
        width: {
          xs: "90%",
          sm: "70%", 
          md: "60%", 
          lg: "50%", 
          xl: "40%",
        }
      }}
    >
      <Box variants={tabVariants}>
        <Tabs 
          value={currentTab} 
          onChange={handleChange}
        >
          <Tab label="Shrink URL" value={0} />
          <Tab label="Unsrhink URL" value={1} />
          <Tab label="Report malicious URL" value={2} />
        </Tabs>
        <TabPanel value={currentTab} index={0}>
          <UrlForm handleSubmit={handleSubmit} buttonLabel={"Shrink URL"} endpoint={URL_SHORTEN} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <UrlForm handleSubmit={handleSubmit} buttonLabel={"Unsrhink URL"} endpoint={URL_UNSHORTEN} />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <UrlForm handleSubmit={handleSubmit} buttonLabel={"Report malicious URL"} endpoint={URL_REPORT} />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default UrlInput;