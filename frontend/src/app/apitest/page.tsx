'use client';

import { useState } from 'react';
import { postLogin } from '@/lib/api';

const Page = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleRequest = async (requestType: 'GET' | 'POST') => {
    try {
      const data = await postLogin(title, body, requestType);
      setResponseMessage(JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponseMessage('Request failed: ' + error.message);
      } else {
        setResponseMessage('Request failed: Unknown error');
      }
    }
  };

  return (
    <div>
    </div>
  );
};

export default Page;
