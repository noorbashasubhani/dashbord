import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../data/apiUrl';

const VendorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the fields
    if (!first_name || !last_name || !email || !password) {
      setError("All fields are required.");
    } else {
      setError("");  // Reset error message

      try {
        const response = await fetch(`${API_URL}/vendor/Add-User`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ first_name, last_name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // If login is successful, store the JWT token
          localStorage.setItem("token", data.token);
          setError("You have logged in successfully...");
          setTimeout(() => {
            navigate("/dashboard"); // Redirect to the dashboard or another page
          }, 5000);
        } else {
          setError(data.message || "Login failed, please try again.");
        }
      } catch (error) {
        setError("Something went wrong, please try again later.");
      }
    }
  };

  const loginFrom = () => {
    navigate("/login");
  };

  return (
    <>
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="card mb-3">
              <div className="card-body">
                <div className="pt-4 pb-2">
                  <h5 className="card-title text-center pb-0 fs-4">User Account Registration</h5>
                </div>

                <form onSubmit={handleSubmit} className="row g-3 needs-validation" noValidate>
                  <div className="col-12">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="yourEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
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
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && <div className="text-danger">{error}</div>}

                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">
                      Save
                    </button>
                  </div>
                </form>

                <center className="mt-3 text-primary">
                  <span onClick={loginFrom} style={{ cursor: "pointer" }}>
                    If you already have an account, please <u>Login here</u>
                  </span>
                </center>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default VendorLogin;
