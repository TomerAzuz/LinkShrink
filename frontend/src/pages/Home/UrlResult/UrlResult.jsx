import React from 'react';
import ShortenedUrlResult from './ShortenedUrlResult/ShortenedUrlResult';
import OriginalUrlResult from './OriginalUrlResult/OriginalUrlResult';
import MaliciousUrlReportResult from './MaliciousUrlReportResult/MaliciousUrlReportResult';

const UrlResult = ({ actionType, result, resetUrlInput }) => {
  switch (actionType) {
    case 'shorten':
      return <ShortenedUrlResult result={result} resetUrlInput={resetUrlInput} />;
    case 'unshorten':
      return <OriginalUrlResult result={result} resetUrlInput={resetUrlInput} />;
    case 'report':
      return <MaliciousUrlReportResult result={result} resetUrlInput={resetUrlInput} />;
    default:
      return null;  
  }
};

export default UrlResult;