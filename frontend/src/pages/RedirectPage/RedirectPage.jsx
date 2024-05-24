import  React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import RequestService from '../../services/RequestService';
import { validateUrl } from '../../utils/UrlValidator';
import ErrorPage from '../ErrorPage/ErrorPage';

const RedirectPage = () => {
  const [error, setError] = useState(null);
  const { shortCode } = useParams();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await RequestService.get(`/url/${shortCode}`, true);
        if (response.status === 200) {
          const longUrl = validateUrl(response.data.longUrl);
          window.location.href = longUrl;
        }
      } catch (error) {
        setError(error);
      }
    };

    handleRedirect();
  }, [shortCode]);

  if (error) 
    return <ErrorPage error={error} />;
  
  return null;
};

export default RedirectPage;