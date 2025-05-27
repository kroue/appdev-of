import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ForgotPassword.css'; // <-- Add this import

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  // Step 1: Send code
  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('http://localhost:5000/api/send-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
            setCode(data.code); // For demo only; don't show code in production
            setStep(2);
            alert('A one-time code has been sent to your email.');
        } else {
            alert(data.message || 'Failed to send code.');
        }
    } catch (error) {
        alert('Server error. Please try again later.');
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (inputCode === code) {
      setStep(3);
    } else {
      alert('Invalid code.');
    }
  };

  // Step 3: Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Password changed!');
      navigate('/');
    } else {
      alert(data.message || 'Failed to change password.');
    }
  };

  return (
    <div className="forgot-container">
      {step === 1 && (
        <form onSubmit={handleSendCode}>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 16 }}
          />
          <button type="submit" className="signin-btn" style={{ width: '100%' }}>Send Code</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyCode}>
          <h2>Enter One-Time Code</h2>
          <input
            type="text"
            placeholder="Enter code"
            value={inputCode}
            required
            onChange={e => setInputCode(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 16 }}
          />
          <button type="submit" className="signin-btn" style={{ width: '100%' }}>Verify Code</button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleChangePassword}>
          <h2>Set New Password</h2>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            required
            onChange={e => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 16 }}
          />
          <button type="submit" className="signin-btn" style={{ width: '100%' }}>Change Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;