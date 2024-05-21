import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import SubmitButton from '../../../components/Buttons/SubmitButton';
import UrlResult from '../UrlResult/UrlResult';
import RequestService from '../../../services/RequestService';

const UrlInput = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [urlMapping, setUrlMapping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event, endpoint) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await RequestService.post(endpoint, {
        longUrl: inputUrl
      });
      console.log(response)
      setUrlMapping(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setInputUrl(event.target.value);
  };

  const resetUrlInput = () => {
    setInputUrl('');
    setUrlMapping(null);
    setError(null);
  };

  if (loading) return <p>Loading...</p>;
  if (urlMapping) return <UrlResult 
                        urlMapping={urlMapping}
                        resetUrlInput={resetUrlInput} 
                      /> 
  return (
    <Box sx={{ width: '70%', textAlign: 'center' }}>
      <form>
        <TextField 
          id="url-input" 
          label="Insert URL" 
          variant="outlined"
          fullWidth
          value={inputUrl}
          onChange={handleChange}
          error={!!error}
          helperText={error?.response?.data || ''}
          sx={{ mb: 2 }}
        />
        <SubmitButton onClick={(event => handleSubmit(event, '/shorten'))} title={'Shrink URL'}/>
        <SubmitButton onClick={(event) => handleSubmit(event, '/qr')} title={'Generate QR Code'}/>
      </form>
    </Box>
  );
};

export default UrlInput;