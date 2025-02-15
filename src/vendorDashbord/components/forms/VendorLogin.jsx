import React, { useState } from 'react';

const VendorLogin = () => {
  const [vendorId, setVendorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the fields
    if (!vendorId || !password) {
      setIsValid(false);
      setError('Both Vendor ID and Password are required.');
    } else {
      // Proceed with login logic, e.g., API call
      console.log('Logging in with:', { vendorId, password });
      setError('');
      setIsValid(true);
      // Add further navigation or state update logic as needed
    }
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>Login | Gogaga Holidays</title>

      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-4">
                    <a href="index.html" className="logo d-flex align-items-center w-auto">
                      <img src="https://gogagacrm.com/gogaga/assets/images/logo_gogaga.png" alt="" />
                    </a>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">
                          Login to Your Account
                        </h5>
                       
                      </div>

                      {/* Form Start */}
                      <form onSubmit={handleSubmit} className="row g-3 needs-validation" noValidate>
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">Username</label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                            <input
                              type="text"
                              name="username"
                              className="form-control"
                              id="yourUsername"
                              value={vendorId}
                              onChange={(e) => setVendorId(e.target.value)}
                              required
                            />
                            <div className="invalid-feedback">
                              Please enter your username.
                            </div>
                          </div>
                          {!isValid && !vendorId && <div className="text-danger">Vendor ID is required.</div>}
                        </div>

                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">Password</label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="yourPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter your password!
                          </div>
                          {!isValid && !password && <div className="text-danger">Password is required.</div>}
                        </div>

                        {/* Error Message if form is invalid */}
                        {error && <div className="text-danger">{error}</div>}

                        

                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit">
                            Login
                          </button>
                        </div>

                        
                      </form>
                      {/* Form End */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Back to top */}
      <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short" />
      </a>
    </>
  );
};

export default VendorLogin;
