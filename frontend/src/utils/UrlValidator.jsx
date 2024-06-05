import React from 'react';
import validator from 'validator';

export const validateUrl = (url) => {
  // Add https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  // Validate the URL
  if (!validator.isURL(url)) {
    throw new Error('Invalid URL');
  }

  return url.trim();
};
