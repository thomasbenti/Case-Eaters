import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function RegisterModal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mealPlan: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    let validationErrors = {};
    if (!formData.firstName) validationErrors.firstName = "First name is required";
    if (!formData.lastName) validationErrors.lastName = "Last name is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      toastr.success("Registered successfully!", "Success");
      navigate("/map"); 
    } catch (err) {
      toastr.error(err.response?.data?.message || "Registration failed", "Error");
      console.log(err);
    }
  };

  const handleCancel = () => {
    navigate("/"); 
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content border rounded shadow-lg"
        style={{
          width: "400px",
          maxWidth: "90%",
          backgroundColor: "white",
          borderRadius: "18px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="modal-header bg-primary rounded-top w-100 d-flex align-items-center justify-content-center"
          style={{ padding: "10px 0" }}
        >
          <h5
            className="modal-title"
            style={{
              fontSize: "20px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="fa fa-user-plus"></i> Register Form
          </h5>
        </div>

        <div className="form-group mt-3 w-100">
          {/* FIRST NAME */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={`form-control mb-3 ${errors.firstName ? "border border-danger" : ""}`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <small className="text-danger d-block mb-2">{errors.firstName}</small>}

          {/* LAST NAME */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`form-control mb-3 ${errors.lastName ? "border border-danger" : ""}`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <small className="text-danger d-block mb-2">{errors.lastName}</small>}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`form-control mb-3 ${errors.email ? "border border-danger" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="text-danger d-block mb-2">{errors.email}</small>}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`form-control mb-3 ${errors.password ? "border border-danger" : ""}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <small className="text-danger d-block mb-2">{errors.password}</small>}

          {/* MEAL PLAN */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="mealPlan"
              className="form-check-input"
              id="mealPlan"
              checked={formData.mealPlan}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="mealPlan">
              I have a meal plan
            </label>
          </div>

          {/* BUTTONS */}
          <div className="d-flex flex-column gap-2 mt-3 w-100">
            <button
              className="btn btn-primary w-100"
              onClick={handleSubmit}
              style={{ fontWeight: "bold" }}
            >
              REGISTER
            </button>
            <button
              className="btn btn-secondary w-100"
              onClick={handleCancel}
              style={{ fontWeight: "bold" }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
