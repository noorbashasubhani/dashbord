import React, { useState } from 'react';

// Employee List Component
const EmployeeList = ({ employees, onSelectEmployee }) => {
  return (
    <div>
      <h2>Select an Employee to Chat</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id} onClick={() => onSelectEmployee(employee)}>
            {employee.name} - {employee.jobTitle}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Chat Window Component
const ChatWindow = ({ employee, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div>
      <h3>Chat with {employee.name}</h3>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}>
        {/* Chat messages will go here */}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

// Main Component to combine everything
const Chat = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleSendMessage = (message) => {
    setMessages([...messages, { employee: selectedEmployee.name, message }]);
  };

  return (
    <div>
      {!selectedEmployee ? (
        <EmployeeList employees={employees} onSelectEmployee={handleSelectEmployee} />
      ) : (
        <div>
          <ChatWindow employee={selectedEmployee} onSendMessage={handleSendMessage} />
          <div>
            <h4>Chat Messages:</h4>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.employee}: </strong>{msg.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
