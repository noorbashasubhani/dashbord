const SuccessModal = ({ message, onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Success!</h3>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  