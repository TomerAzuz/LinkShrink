import React from 'react';
import validUrl from 'valid-url';

export const validateUrl = (url) => {
  // Check if the URL is valid
  if (!validUrl.isWebUri(url)) {
    throw new Error('Invalid URL');
  }

  // If URL doesn't contain a protocol, prepend 'https://'
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  return url.trim();
};
