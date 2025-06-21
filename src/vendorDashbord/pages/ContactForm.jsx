import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

const DynamicEmailForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_jbe3c9s',
      'template_t0dafph',
      form.current,
      'ZZMSXfVWOw0ZIClZY'
    )
    .then((result) => {
      alert("Email sent successfully!");
      form.current.reset();
    })
    .catch((error) => {
      alert("Failed to send email.");
      console.error(error);
    });
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Recipient Email (To)</label>
      <input type="email" name="to_email" required />

      <label>Your Name</label>
      <input type="text" name="user_name" required />

      <label>Your Email (From)</label>
      <input type="email" name="user_email" required />

      <label>Message</label>
      <textarea name="message" required />

      <button type="submit">Send</button>
    </form>
  );
};

export default DynamicEmailForm;
