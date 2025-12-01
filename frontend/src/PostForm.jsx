import React, { useState, useEffect } from "react";
import "./PostForm.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BUILDING = Object.freeze({
  "Adelbert Hall": "ADH",
  "Allen Memorial Library": "AML",
  "Allen Memorial Medical Library": "AMML",
  "Ansel Road Apartments": "ARA",
  "Bolton Field": "BOL",
  "Cleveland Botanical Garden": "CBG",
  "Cleveland Cinematheque": "CCM",
  "Cleveland Institute of Art": "CIA",
  "Cleveland Institute of Music": "CIM",
  "Cleveland Museum of Art": "CMA",
  "Crawford Hall": "CRH",
  "Duncan House": "DUH",
  "Eaton Hall": "EAT",
  "Fenn Tower": "FEN",
  "Ford Auditorium": "FOR",
  "Fribley Commons": "FRC",
  "Gordon Field House": "GFH",
  "Guilford House": "GUH",
  "Glennan Gymnasium": "GLY",
  "Hathaway Brown School": "HBS",
  "Haydn Hall": "HAY",
  "Hershey Hall": "HER",
  "Hitchcock Hall": "HIC",
  "Kelvin Smith Engineering Building": "KSEB",
  "Kelvin Smith Library": "KSL",
  "Klinck Commons": "KLC",
  "Leutner Commons": "LTC",
  "Linsalata Alumni Center": "LAC",
  "Mandel JCC": "MJCC",
  "Mandel School of Applied Social Sciences": "MSASS",
  "Mather Dance Center": "MDC",
  "Mather Memorial Building": "MMB",
  "Michelson-Morley Hall": "MMH",
  "Milton and Tamar Maltz Performing Arts Center": "MTPAC",
  "Nord Hall": "NOD",
  "Norton Hall": "NOR",
  "Olin Library": "OLI",
  "Prentiss Hall": "PRH",
  "Richey Mixon Hall": "RMH",
  "Ritter Library": "RIL",
  "Sears Building": "SEB",
  "School of Dental Medicine": "DENT",
  "School of Engineering": "ENG",
  "School of Graduate Studies": "GRAD",
  "School of Law": "LAW",
  "School of Management": "MGT",
  "School of Medicine": "MED",
  "School of Nursing": "NURS",
  "Severance Hall": "SEV",
  "Shafran Residence Hall": "SRH",
  "Slavic Village": "SLV",
  "Squire Valleevue Farm": "SVF",
  "Stokes Field": "STF",
  "Strosacker Hall": "STH",
  "Thwing Center": "THW",
  "Tinkham Veale University Center": "TVC",
  "The Cleveland Metroparks": "CMP",
  "The Cleveland Metroparks Zoo": "CMZ",
  "The Cleveland Museum of Natural History": "CMNH",
  "The Cleveland Orchestra": "TCO",
  "The Cleveland Play House": "CPH",
  "The Cleveland Public Library": "CPL",
  "Wolstein Research Building": "WRB",
  "Yost Hall": "YOS",
});


export default function PostForm({ post, onSave, onCancel }) {
  const [postData, setPostData] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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

    onSave(postData);
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
              value={postData.title}
              onChange={handleInput}
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
                value={postData.description}
                onChange={handleInput}
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
              value={postData.location}
              onChange={handleInput}
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
              onClick={handleSubmit}
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
