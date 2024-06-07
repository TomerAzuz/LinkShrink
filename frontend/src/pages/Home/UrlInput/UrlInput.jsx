import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ContentCutIcon from '@mui/icons-material/ContentCut';
import UndoIcon from '@mui/icons-material/Undo';
import ReportIcon from '@mui/icons-material/Report';
import { useTheme } from '@mui/material/styles';

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

  const actionTypes = ["shorten", "unshorten", "report"];
  const theme = useTheme();

  const handleSubmitUrl = async (values, { setSubmitting }, endpoint) => {
    setSubmitting(true);
    setLoading(true);
    try {
      const sanitizedUrl = validateUrl(values.url);
      const response = await RequestService.post(
        endpoint, { url: sanitizedUrl }, true);

      setResult(response);
    } catch (error) {
      toast.error("Unexpected Error")
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

  if (loading) return <Loader />;
  
  if (result) return (
    <UrlResult 
      actionType={actionTypes[currentTab]}
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
        mt: 2,
        width: { xs: "100%", sm: "70%", md: "60%", lg: "50%", xl: "40%" },
        bgcolor: theme.palette.background.paper,
        p: 3,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
      }}
    >
      <Tabs 
        value={currentTab} 
        variant="scrollable" 
        scrollButtons
        onChange={handleChange} 
        textColor="primary" 
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab icon={<ContentCutIcon />}label="Shrink URL" value={0} aria-label="shrink" />
        <Tab icon={<UndoIcon />}label="Unshrink URL" value={1} aria-label="unshrink" />
        <Tab icon={<ReportIcon />} label="Report URL" value={2} aria-label="report" />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <UrlForm handleSubmit={handleSubmitUrl} buttonLabel={"Shrink URL"} endpoint={URL_SHORTEN} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <UrlForm handleSubmit={handleSubmitUrl} buttonLabel={"Unshrink URL"} endpoint={URL_UNSHORTEN} />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <UrlForm handleSubmit={handleSubmitUrl} buttonLabel={"Report URL"} endpoint={URL_REPORT} />
      </TabPanel>
    </Box>
  );
};

export default UrlInput;
