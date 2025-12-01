import React, { useState, useEffect } from "react";
import "./PostForm.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BUILDING = Object.freeze({
  "Adelbert Hall": {
    id: "ADH",
    lat: 41.5050,
    lng: -81.6083
  },
  "Allen Memorial Library": {
    id: "AML",
    lat: 41.5060,
    lng: -81.608
  },
  "Crawford Hall": {
    id: "CRH",
    lat: 41.504780696786995, 
    lng: -81.60967835590283
  },
  "Ford Auditorium": {
    id: "FOR",
    lat: 41.50609968944791,
    lng: -81.60842541368149
  },
  "Fribley Commons": {
    id: "FRC",
    lat: 41.50128097018468, 
    lng: -81.60269321354278
  },
  "Guilford House": {
    id: "GUH",
    lat: 41.50876841513002,
    lng: -81.60823050010588
  },
  "Haydn Hall": {
    id: "HAY",
    lat: 41.50878618991214,
    long: -81.60716367362305
  },
  "Hitchcock Hall": {
    id: "HIC",
    lat: 41.51409067368143,
    lng: -81.60484838290454
  }
  // ,
  // "Kelvin Smith Library": "KSL",
  // "Leutner Commons": "LTC",
  // "Mandel School of Applied Social Sciences": "MSASS",
  // "Mather Dance Center": "MDC",
  // "Mather Memorial Building": "MMB",
  // "Michelson Hall": "MMH",
  // "Milton and Tamar Maltz Performing Arts Center": "MTPAC",
  // "Nord Hall": "NOD",
  // "Norton Hall": "NOR",
  // "Olin Library": "OLI",
  // "Sears Building": "SEB",
  // "School of Dental Medicine": "DENT",
  // "School of Engineering": "ENG",
  // "School of Graduate Studies": "GRAD",
  // "School of Law": "LAW",
  // "School of Management": "MGT",
  // "School of Medicine": "MED",
  // "School of Nursing": "NURS",
  // "Severance Hall": "SEV",
  // "Stokes Field": "STF",
  // "Strosacker Hall": "STH",
  // "Thwing Center": "THW",
  // "Tinkham Veale University Center": "TVC",
  // "Wolstein Research Building": "WRB",
  // "Yost Hall": "YOS",
});


export default function PostForm({ post, onSubmit, onCancel, onChange }) {
  // const [postData, setPostData] = useState({
  //   title: "",
  //   description: "",
  // });

  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (post) setPostData(post);
  // }, [post]);

  // const handleInput = (e) => {
  //   const { name, value } = e.target;
  //   setPostData((prev) => ({ ...prev, [name]: value }));
  //   setErrors((prev) => ({ ...prev, [name]: "" }));
  // };

  const handleSubmit = () => {
    let fieldErrors = {};

    if (!postData.title?.trim()) {
      fieldErrors.title = "Title is required!";
    }

    if (!postData.description?.trim()) {
      fieldErrors.description = "Description is required!";
    }

    if (!postData.location) fieldErrors.location = "Location is required!";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

  };

  return (
    <div
      className="taskform-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content border rounded shadow-lg"
        style={{ width: "350px", maxWidth: "90%", backgroundColor: "white",  borderRadius: "18px",}}
      >
        <div
          className="modal-header bg-primary rounded-top d-flex align-items-center justify-content-between"
          
        >
          <h5 className="modal-title m-0 d-flex align-items-center gap-2"
          style={{ fontSize: "20px", color: "white" }}>
            
                <i className="fa fa-plus-circle"></i> Add Post
          </h5>
        </div>

        <div className="form-group mt-2"
        >
          <div className="form-group mt-2"
          >
          {/* TITLE */}
          <>
            <textarea
              type="text"
              name="title"
              placeholder="Title"
              className={`form-control mb-2 ${
                errors.title ? "border border-danger" : ""
              }`}
              value={post.title}
              onChange={onChange}
            />
              <span className="error-space">
                {errors.title && (
                <small className="text-danger d-block">{errors.title}</small>
                )}
              </span>
          </>
          </div>

          {/* DESCRIPTION */}
          <div className="form-group  mt-2"
          >
              <textarea
                name="description"
                placeholder="Description"
                className={`form-control mb-2 ${errors.description ? "border border-danger" : ""}`}
                value={post.description}
                onChange={onChange}
                rows={4}
              />
              <span className="error-space">
                {errors.description && (
                <small className="text-danger d-block">{errors.description}</small>
                )}
              </span>
          </div>

          {/* LOCATION */}
          <div className="form-group mt-2">
            <select
              name="location"
              className={`form-control mb-2 ${errors.location ? "border border-danger" : ""}`}
              value={post.location}
              onChange={onChange}
            >
              <option value="">Select a building</option>
              {Object.entries(BUILDING).map(([name, code]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            
            {errors.location && <small className="text-danger d-block">{errors.location}</small>}
          </div>

          {/* BUTTONS */}
          <div className="mt-4 d-flex gap-4 justify-content-start">
            <button
              className="btn btn-primary d-flex align-items-center shadow"
              onClick={onSubmit}
            >
              
            + ADD
                
            </button>

            <button
              className="btn btn-primary d-flex align-items-center shadow ml-3"
              onClick={onCancel}
            >
         
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
