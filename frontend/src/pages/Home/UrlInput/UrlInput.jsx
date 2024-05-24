import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import UrlResult from '../UrlResult/UrlResult';
import RequestService from '../../../services/RequestService';
import { validateUrl } from '../../../utils/UrlValidator';
import Loader from '../../../components/Loader/Loader';
import { URL_SHORTEN, URL_QRCODE } from '../../../constants/urlConstants';
import UrlForm from '../../../components/UrlForm/UrlForm';
import TabPanel from '../../../components/TabPanel/TabPanel';

const UrlInput = () => {
  const [urlMapping, setUrlMapping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const handleSubmit = async (values, { setSubmitting, setErrors }, endpoint) => {
    setSubmitting(true);
    setLoading(true);
    try {
      const sanitizedUrl = validateUrl(values.url);
      const response = await RequestService.post(
        endpoint, 
        { longUrl: sanitizedUrl }, 
        true
      );
      setUrlMapping(response);
    } catch (error) {
      if (error.response) {
        setErrors({ url: error.response.data });
      } else {
        setErrors({ url: error.message });
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const resetUrlInput = () => {
    setUrlMapping(null);
  };

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) return <Loader />;
  if (urlMapping) return (
    <UrlResult 
      urlMapping={urlMapping}
      resetUrlInput={resetUrlInput} 
      loading={loading}
    />
  ); 

  return (
    <Box sx={{ width: '70%', textAlign: 'center' }}>
      <Tabs value={currentTab} onChange={handleChange}>
        <Tab label="Shrink URL" value={0} />
        <Tab label="QR Code" value={1} />
      </Tabs>
      <TabPanel value={currentTab} index={0}>
        <UrlForm handleSubmit={handleSubmit} buttonLabel={'Shrink URL'} endpoint={URL_SHORTEN} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <UrlForm handleSubmit={handleSubmit} buttonLabel={'Generate QR code'} endpoint={URL_QRCODE} />
      </TabPanel>
    </Box>
  );
};

export default UrlInput;