import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import VendorLogin from '../components/forms/VendorLogin'
import VendorRegistration from '../components/forms/VendorRegistration'

import  { useState } from 'react';
import Footer from '../components/forms/Footer'
import Layout from '../components/Layout'
import useIdleLogout from './useIdleLogout'
const Dashbord = () => {
useIdleLogout();
  const [formType, setFormType] = useState('');
  const handleFormSwitch = (form) => {
    setFormType(form);
  };
  return (
    <Layout>
    
      
      
    <main id="main" className="main">

  <div className="pagetitle">
    <h1>Dashboard</h1>
    <nav>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="index.html">Home</a>
        </li>
        <li className="breadcrumb-item active">Dashboard</li>
      </ol>
    </nav>
  </div>
  {/* End Page Title */}
  <section className="section dashboard">
    <div className="row">
      {/* Left side columns */}
      <div className="col-lg-8">
        <div className="row">
          {/* Sales Card */}
          <div className="col-xxl-4 col-md-6">
            <div className="card info-card sales-card">
              <div className="filter">
                <a className="icon" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li className="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Today
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Month
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Year
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  Sales <span>| Today</span>
                </h5>
                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-cart" />
                  </div>
                  <div className="ps-3">
                    <h6>145</h6>
                    <span className="text-success small pt-1 fw-bold">
                      12%
                    </span>{" "}
                    <span className="text-muted small pt-2 ps-1">increase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Sales Card */}
          {/* Revenue Card */}
          <div className="col-xxl-4 col-md-6">
            <div className="card info-card revenue-card">
              <div className="filter">
                <a className="icon" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li className="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Today
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Month
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Year
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  Revenue <span>| This Month</span>
                </h5>
                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-currency-dollar" />
                  </div>
                  <div className="ps-3">
                    <h6>$3,264</h6>
                    <span className="text-success small pt-1 fw-bold">
                      8%
                    </span>{" "}
                    <span className="text-muted small pt-2 ps-1">increase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Revenue Card */}
          {/* Customers Card */}
          <div className="col-xxl-4 col-xl-12">
            <div className="card info-card customers-card">
              <div className="filter">
                <a className="icon" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li className="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Today
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Month
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Year
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  Customers <span>| This Year</span>
                </h5>
                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-people" />
                  </div>
                  <div className="ps-3">
                    <h6>1244</h6>
                    <span className="text-danger small pt-1 fw-bold">
                      12%
                    </span>{" "}
                    <span className="text-muted small pt-2 ps-1">decrease</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Customers Card */}
          {/* Reports */}
          <div className="col-12">
            <div className="card">
              <div className="filter">
                <a className="icon" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li className="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Today
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Month
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Year
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  Reports <span>/Today</span>
                </h5>
                {/* Line Chart */}
                <div id="reportsChart" />
                {/* End Line Chart */}
              </div>
            </div>
          </div>
          {/* End Reports */}
          {/* Recent Sales */}
          <div className="col-12">
            <div className="card recent-sales overflow-auto">
              <div className="filter">
                <a className="icon" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li className="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Today
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Month
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Year
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  Recent Sales <span>| Today</span>
                </h5>
                <table className="table table-borderless datatable">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <a href="#">#2457</a>
                      </th>
                      <td>Brandon Jacob</td>
                      <td>
                        <a href="#" className="text-primary">
                          At praesentium minu
                        </a>
                      </td>
                      <td>$64</td>
                      <td>
                        <span className="badge bg-success">Approved</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">#2147</a>
                      </th>
                      <td>Bridie Kessler</td>
                      <td>
                        <a href="#" className="text-primary">
                          Blanditiis dolor omnis similique
                        </a>
                      </td>
                      <td>$47</td>
                      <td>
                        <span className="badge bg-warning">Pending</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">#2049</a>
                      </th>
                      <td>Ashleigh Langosh</td>
                      <td>
                        <a href="#" className="text-primary">
                          At recusandae consectetur
                        </a>
                      </td>
                      <td>$147</td>
                      <td>
                        <span className="badge bg-success">Approved</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">#2644</a>
                      </th>
                      <td>Angus Grady</td>
                      <td>
                        <a href="#" className="text-primar">
                          Ut voluptatem id earum et
                        </a>
                      </td>
                      <td>$67</td>
                      <td>
                        <span className="badge bg-danger">Rejected</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">#2644</a>
                      </th>
                      <td>Raheem Lehner</td>
                      <td>
                        <a href="#" className="text-primary">
                          Sunt similique distinctio
                        </a>
                      </td>
                      <td>$165</td>
                      <td>
                        <span className="badge bg-success">Approved</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* End Recent Sales */}
          {/* Top Selling */}
          <div className="col-12">
            <div className="card top-selling overflow-auto">
              <div className="filter">
                <a className="icon" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                  <li className="dropdown-header text-start">
                    <h6>Filter</h6>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Today
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Month
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      This Year
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body pb-0">
                <h5 className="card-title">
                  Top Selling <span>| Today</span>
                </h5>
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Preview</th>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <th scope="col">Sold</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <a href="#">
                          <img src="assets/img/product-1.jpg" alt="" />
                        </a>
                      </th>
                      <td>
                        <a href="#" className="text-primary fw-bold">
                          Ut inventore ipsa voluptas nulla
                        </a>
                      </td>
                      <td>$64</td>
                      <td className="fw-bold">124</td>
                      <td>$5,828</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">
                          <img src="assets/img/product-2.jpg" alt="" />
                        </a>
                      </th>
                      <td>
                        <a href="#" className="text-primary fw-bold">
                          Exercitationem similique doloremque
                        </a>
                      </td>
                      <td>$46</td>
                      <td className="fw-bold">98</td>
                      <td>$4,508</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">
                          <img src="assets/img/product-3.jpg" alt="" />
                        </a>
                      </th>
                      <td>
                        <a href="#" className="text-primary fw-bold">
                          Doloribus nisi exercitationem
                        </a>
                      </td>
                      <td>$59</td>
                      <td className="fw-bold">74</td>
                      <td>$4,366</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">
                          <img src="assets/img/product-4.jpg" alt="" />
                        </a>
                      </th>
                      <td>
                        <a href="#" className="text-primary fw-bold">
                          Officiis quaerat sint rerum error
                        </a>
                      </td>
                      <td>$32</td>
                      <td className="fw-bold">63</td>
                      <td>$2,016</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <a href="#">
                          <img src="assets/img/product-5.jpg" alt="" />
                        </a>
                      </th>
                      <td>
                        <a href="#" className="text-primary fw-bold">
                          Sit unde debitis delectus repellendus
                        </a>
                      </td>
                      <td>$79</td>
                      <td className="fw-bold">41</td>
                      <td>$3,239</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* End Top Selling */}
        </div>
      </div>
      {/* End Left side columns */}
      {/* Right side columns */}
      <div className="col-lg-4">
        {/* Recent Activity */}
        <div className="card">
          <div className="filter">
            <a className="icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-three-dots" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Today
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Month
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Year
                </a>
              </li>
            </ul>
          </div>
          <div className="card-body">
            <h5 className="card-title">
              Recent Activity <span>| Today</span>
            </h5>
            <div className="activity">
              <div className="activity-item d-flex">
                <div className="activite-label">32 min</div>
                <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                <div className="activity-content">
                  Quia quae rerum{" "}
                  <a href="#" className="fw-bold text-dark">
                    explicabo officiis
                  </a>{" "}
                  beatae
                </div>
              </div>
              {/* End activity item*/}
              <div className="activity-item d-flex">
                <div className="activite-label">56 min</div>
                <i className="bi bi-circle-fill activity-badge text-danger align-self-start" />
                <div className="activity-content">
                  Voluptatem blanditiis blanditiis eveniet
                </div>
              </div>
              {/* End activity item*/}
              <div className="activity-item d-flex">
                <div className="activite-label">2 hrs</div>
                <i className="bi bi-circle-fill activity-badge text-primary align-self-start" />
                <div className="activity-content">
                  Voluptates corrupti molestias voluptatem
                </div>
              </div>
              {/* End activity item*/}
              <div className="activity-item d-flex">
                <div className="activite-label">1 day</div>
                <i className="bi bi-circle-fill activity-badge text-info align-self-start" />
                <div className="activity-content">
                  Tempore autem saepe{" "}
                  <a href="#" className="fw-bold text-dark">
                    occaecati voluptatem
                  </a>{" "}
                  tempore
                </div>
              </div>
              {/* End activity item*/}
              <div className="activity-item d-flex">
                <div className="activite-label">2 days</div>
                <i className="bi bi-circle-fill activity-badge text-warning align-self-start" />
                <div className="activity-content">
                  Est sit eum reiciendis exercitationem
                </div>
              </div>
              {/* End activity item*/}
              <div className="activity-item d-flex">
                <div className="activite-label">4 weeks</div>
                <i className="bi bi-circle-fill activity-badge text-muted align-self-start" />
                <div className="activity-content">
                  Dicta dolorem harum nulla eius. Ut quidem quidem sit quas
                </div>
              </div>
              {/* End activity item*/}
            </div>
          </div>
        </div>
        {/* End Recent Activity */}
        {/* Budget Report */}
        <div className="card">
          <div className="filter">
            <a className="icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-three-dots" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Today
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Month
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Year
                </a>
              </li>
            </ul>
          </div>
          <div className="card-body pb-0">
            <h5 className="card-title">
              Budget Report <span>| This Month</span>
            </h5>
            <div
              id="budgetChart"
              style={{ minHeight: 400 }}
              className="echart"
            />
          </div>
        </div>
        {/* End Budget Report */}
        {/* Website Traffic */}
        <div className="card">
          <div className="filter">
            <a className="icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-three-dots" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Today
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Month
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Year
                </a>
              </li>
            </ul>
          </div>
          <div className="card-body pb-0">
            <h5 className="card-title">
              Website Traffic <span>| Today</span>
            </h5>
            <div
              id="trafficChart"
              style={{ minHeight: 400 }}
              className="echart"
            />
          </div>
        </div>
        {/* End Website Traffic */}
        {/* News & Updates Traffic */}
        <div className="card">
          <div className="filter">
            <a className="icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-three-dots" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <li className="dropdown-header text-start">
                <h6>Filter</h6>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Today
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Month
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This Year
                </a>
              </li>
            </ul>
          </div>
          <div className="card-body pb-0">
            <h5 className="card-title">
              News &amp; Updates <span>| Today</span>
            </h5>
            <div className="news">
              <div className="post-item clearfix">
                <img src="assets/img/news-1.jpg" alt="" />
                <h4>
                  <a href="#">Nihil blanditiis at in nihil autem</a>
                </h4>
                <p>
                  Sit recusandae non aspernatur laboriosam. Quia enim eligendi
                  sed ut harum...
                </p>
              </div>
              <div className="post-item clearfix">
                <img src="assets/img/news-2.jpg" alt="" />
                <h4>
                  <a href="#">Quidem autem et impedit</a>
                </h4>
                <p>
                  Illo nemo neque maiores vitae officiis cum eum turos elan
                  dries werona nande...
                </p>
              </div>
              <div className="post-item clearfix">
                <img src="assets/img/news-3.jpg" alt="" />
                <h4>
                  <a href="#">Id quia et et ut maxime similique occaecati ut</a>
                </h4>
                <p>
                  Fugiat voluptas vero eaque accusantium eos. Consequuntur sed
                  ipsam et totam...
                </p>
              </div>
              <div className="post-item clearfix">
                <img src="assets/img/news-4.jpg" alt="" />
                <h4>
                  <a href="#">Laborum corporis quo dara net para</a>
                </h4>
                <p>
                  Qui enim quia optio. Eligendi aut asperiores enim
                  repellendusvel rerum cuder...
                </p>
              </div>
              <div className="post-item clearfix">
                <img src="assets/img/news-5.jpg" alt="" />
                <h4>
                  <a href="#">Et dolores corrupti quae illo quod dolor</a>
                </h4>
                <p>
                  Odit ut eveniet modi reiciendis. Atque cupiditate libero
                  beatae dignissimos eius...
                </p>
              </div>
            </div>
            {/* End sidebar recent posts*/}
          </div>
        </div>
        {/* End News & Updates */}
      </div>
      {/* End Right side columns */}
    </div>
  </section>
    </main>
    
    </Layout>
  )
}

export default Dashbord