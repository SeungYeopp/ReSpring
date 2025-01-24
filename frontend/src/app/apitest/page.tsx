'use client';

import { useState } from 'react';
import { postLogin } from '@/lib/api';

const Page = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleRequest = async (requestType: 'GET' | 'POST') => {
    console.log(`Sending ${requestType} request`);
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
    <div style={styles.container}>
      <h1 style={styles.title}>API Tester</h1>

      <div style={styles.form}>
        <label style={styles.label}>Title</label>
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Body</label>
        <textarea
          placeholder="Enter body..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={styles.textarea}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={() => handleRequest('GET')} style={styles.button}>Send GET</button>
        <button onClick={() => handleRequest('POST')} style={styles.button}>Send POST</button>
      </div>

      <h2 style={styles.responseTitle}>Response</h2>
      <pre style={styles.responseBox}>{responseMessage}</pre>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '80px',
    resize: 'none' as const,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  button: {
    flex: 1,
    padding: '10px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  responseTitle: {
    marginTop: '20px',
    textAlign: 'center',
  },
  responseBox: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    whiteSpace: 'pre-wrap' as const,
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
};

export default Page;
