import React, { useState } from 'react';
import '../../styles/Contact.css';

const ContactUs = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Your message has been sent: ${message}`);
  };

  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            placeholder="Write your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </div>
  );
};

export default ContactUs;
