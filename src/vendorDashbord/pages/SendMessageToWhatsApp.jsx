import React, { useState } from 'react';

function SendMessageToWhatsApp() {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // You can set a default phone number here if needed

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSendMessage = () => {
    if (!message || !phoneNumber) {
      alert('Please enter both a phone number and a message!');
      return;
    }

    // Ensure the phone number is in international format (without '+' or '-')
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Removing any non-numeric characters
    const encodedMessage = encodeURIComponent(message); // URL encoding the message

    // WhatsApp Click-to-Chat URL format
    const whatsappLink = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp or WhatsApp Web with the pre-filled message
    window.open(whatsappLink, '_blank');
  };

  return (
    <div>
      <h1>Send a WhatsApp Message</h1>
      <input
        type="text"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Enter phone number (without + or -)"
      />
      <br />
      <textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="Type your message here"
      />
      <br />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
}

export default SendMessageToWhatsApp;
