import React from 'react';

const FaviconDisplay = ({ url }) => {
  const favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=128`;

  return <img src={favicon} width={50} height={50} alt="favicon" />;
};

export default FaviconDisplay;
