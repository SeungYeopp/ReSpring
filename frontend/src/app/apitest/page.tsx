'use client'; // <- 여기 위치 중요!

import { useState } from 'react';
import { postLogin } from '../../lib/api';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleLogin = async () => {
    console.log('TEST');
    try {
      const data = await postLogin(email, password);
      setResponseMessage('Login successful: ' + data);
    } catch (error) {
      setResponseMessage('Login failed: ');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <div>{responseMessage}</div>
    </div>
  );
};

export default Page;
