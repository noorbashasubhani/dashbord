import React, { useState } from "react";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the fields
    if (!email || !pass) {
      setIsValid(false);
      setError("Both email and password are required.");
    } else {
      // Proceed with login logic: send data to the backend
      try {
        const response = await fetch("http://localhost:4000/vendor/Check-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, pass }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          // Success - handle the login success logic (e.g., redirect, store token)
          console.log("Login successful:", data.message);
          alert('SUccesss');
          setError("");
          setIsValid(true);
          // Redirect user or update state as necessary
        } else {
          setError(data.message); // Display the error message from the backend
        }
      } catch (error) {
        setError("Something went wrong, please try again later.");
      }
    }
  };

  return (
    <>
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="card mb-3">
              <div className="card-body">
                <div className="pt-4 pb-2">
                  <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                </div>

                <form onSubmit={handleSubmit} className="row g-3 needs-validation" noValidate>
                  <div className="col-12">
                    <label htmlFor="yourEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="yourEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="yourPassword" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="yourPassword"
                      value={pass}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && <div className="text-danger">{error}</div>}

                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default VendorLogin;
