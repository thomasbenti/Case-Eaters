import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

function LoginModal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    let validationErrors = {};
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      toastr.success("Logged in successfully!", "Success");
      navigate("/map");
    } catch (err) {
      toastr.error(err.response?.data?.message || "Login failed", "Error");
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
          width: "350px",
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
            Login Form
          </h5>
        </div>

        <div className="form-group mt-3 w-100">
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

          {/* BUTTONS */}
          <div className="d-flex flex-column gap-2 mt-3 w-100">
            <button
              className="btn btn-primary w-100"
              onClick={handleSubmit}
              style={{ fontWeight: "bold" }}
            >
              LOGIN
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

export default LoginModal;
