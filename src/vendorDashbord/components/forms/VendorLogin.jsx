import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../data/apiUrl';


const VendorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the fields
    if (!email || !password) {
      setIsValid(false);
      setError("Both email and password are required.");
    } else {
      // Reset error message if validation passes
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
          // If login is successful, store the JWT token
          //console.log(data.to);
          //const datas = localStorage.setItem('token', data.token);
          localStorage.setItem("token", data.token);  // Save it as a string

          //console.log(datas);
          //console.log('Login successful, token:', data.token);
          setError("You have logged in successfully...");
          setIsValid(true);
          setTimeout(() => {
            navigate("/dashboard");// Redirect to the dashboard or another page
          }, 5000); 
          
          // You can add logic here to redirect the user or update the UI.
        } else {
          // If backend returns error, display it
          setError(data.message || "Login failed, please try again.");
        }
      } catch (error) {
        setError("Something went wrong, please try again later.");
      }
    }
  };

  const regFrom = () => {
    navigate("/User-Registartion");
  }

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
                      <span onClick={regFrom}>If You Dont have Accout Please <u style={{cursor:"pointer"}} >Registration Here</u></span>
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
