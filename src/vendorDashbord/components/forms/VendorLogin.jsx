import React, { useState } from 'react';

const VendorLogin = () => {
  const [vendorId, setVendorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorId || !password) {
      setError('Both Vendor ID and Password are required');
    } else {
      // Handle vendor login logic here, e.g., API call
      console.log('Logging in with:', { vendorId, password });
      setError('');
      // You can add navigation logic to the vendor dashboard here
    }
  };

  return (
    <>
  <meta charSet="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>Login  | Gogaga Holidays</title>
  <meta content="" name="description" />
  <meta content="" name="keywords" />
  {/* Favicons */}
  <link href="https://gogagacrm.com/gogaga/assets/images/logo_gogaga.png" rel="icon" />
  <link href="https://gogagacrm.com/gogaga/assets/images/logo_gogaga.png" rel="apple-touch-icon" />
  {/* Google Fonts */}
  <link href="https://fonts.gstatic.com" rel="preconnect" />
  <link
    href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
    rel="stylesheet"
  />
  {/* Vendor CSS Files */}
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
  <link
    href="assets/vendor/bootstrap-icons/bootstrap-icons.css"
    rel="stylesheet"
  />
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet" />
  <link href="assets/vendor/quill/quill.snow.css" rel="stylesheet" />
  <link href="assets/vendor/quill/quill.bubble.css" rel="stylesheet" />
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet" />
  <link href="assets/vendor/simple-datatables/style.css" rel="stylesheet" />
  {/* Template Main CSS File */}
  <link href="assets/css/style.css" rel="stylesheet" />
  {/* =======================================================
  * Template Name: NiceAdmin
  * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
  * Updated: Apr 20 2024 with Bootstrap v5.3.3
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== */}
  <main>
    <div className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a
                  href="index.html"
                  className="logo d-flex align-items-center w-auto"
                >
                  <img src="https://gogagacrm.com/gogaga/assets/images/logo_gogaga.png" alt="" />
                  
                </a>
              </div>
              {/* End Logo */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Login to Your Account
                    </h5>
                    <p className="text-center small">
                      Enter your username &amp; password to login
                    </p>
                  </div>
                  <form className="row g-3 needs-validation" noValidate="">
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">
                        Username
                      </label>
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          @
                        </span>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          id="yourUsername"
                          required=""
                        />
                        <div className="invalid-feedback">
                          Please enter your username.
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        required=""
                      />
                      <div className="invalid-feedback">
                        Please enter your password!
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="remember"
                          defaultValue="true"
                          id="rememberMe"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Login
                      </button>
                    </div>
                    <div className="col-12">
                      <p className="small mb-0">
                        Don't have account?{" "}
                        <a href="pages-register.html">Create an account</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
  {/* End #main */}
  <a
    href="#"
    className="back-to-top d-flex align-items-center justify-content-center"
  >
    <i className="bi bi-arrow-up-short" />
  </a>
  {/* Vendor JS Files */}
  {/* Template Main JS File */}
</>

  );
};

export default VendorLogin;
