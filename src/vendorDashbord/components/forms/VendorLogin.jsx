import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../data/apiUrl';
import useIdleLogout from "../../pages/useIdleLogout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const VendorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  // ✅ Redirect if token is found
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setIsValid(false);
      setError("Both email and password are required.");
    } else {
      setIsValid(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/vendor/User-Login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          toast.success("Login successful!"); 
          setError("You have logged in successfully...");
          setIsValid(true);

          setTimeout(() => {
            navigate("/dashboard");
            //window.location.reload(); // optional
          }, 5000);
        } else {
          setError(data.message || "Login failed, please try again.");
        }
      } catch (error) {
        setError("Something went wrong, please try again later.");
      }
    }
  };

  const regFrom = () => {
    navigate("/User-Registartion");
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
 <ToastContainer position="top-right" autoClose={2000} />
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
                      value={password}
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

                <center className="mt-3 text-primary">
                  <span onClick={regFrom}>
                    If You Don't have an Account, Please <u style={{ cursor: "pointer" }}>Register Here</u>
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
