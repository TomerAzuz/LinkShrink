import React from 'react';
import ShortenedUrlResult from './ShortenedUrlResult/ShortenedUrlResult';
import OriginalUrlResult from './UnshortenUrlResult/UnshortenUrlResult';
import UrlReportResult from './UrlReportResult/UrlReportResult';

const UrlResult = ({ actionType, result, resetUrlInput }) => {
  switch (actionType) {
    case 'shorten':
      return <ShortenedUrlResult result={result} resetUrlInput={resetUrlInput} />;
    case 'unshorten':
      return <OriginalUrlResult result={result} resetUrlInput={resetUrlInput} />;
    case 'report':
      return <UrlReportResult result={result} resetUrlInput={resetUrlInput} />;
    default:
      return null;  
  }
};

export default UrlResult;