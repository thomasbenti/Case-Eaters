import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import "./FoodMap.css";
import { postAPI } from "./services/api";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import PostForm from "./PostForm";

const BUILDING_COORDS = Object.freeze({
  MMB: { lat: 41.5050, lng: -81.6096 }, // Mather Memorial Building (approx)
  GLY: { lat: 41.5058, lng: -81.6088 }, // Glennan Gymnasium (approx)
  ADH: { lat: 41.5047, lng: -81.6060 }, // Adelbert Hall (approx)
  AML: { lat: 41.5066, lng: -81.6078 }, // Allen Memorial Library (approx)
  ARA: { lat: 41.5053, lng: -81.6028 }, // Ansel Road Apartments (approx)
  BOL: { lat: 41.5069, lng: -81.6073 }, // Bolton Field (approx)
  CRH: { lat: 41.5056, lng: -81.6068 }, // Crawford Hall (approx)
  DUH: { lat: 41.5042, lng: -81.6079 }, // Duncan House (approx)
  EAT: { lat: 41.5061, lng: -81.6070 }, // Eaton Hall (approx)
  FEN: { lat: 41.5094, lng: -81.6089 }, // Fenn Tower (approx)
  FOR: { lat: 41.5059, lng: -81.6074 }, // Ford Auditorium (approx)
  GFH: { lat: 41.5068, lng: -81.6106 }, // Gordon Field House (approx)
  HAY: { lat: 41.5070, lng: -81.6074 }, // Haydn Hall (approx)
  HER: { lat: 41.5063, lng: -81.6085 }, // Hershey Hall (approx)
  HIC: { lat: 41.5064, lng: -81.6065 }, // Hitchcock Hall (approx)
  KSEB: { lat: 41.5049, lng: -81.6069 }, // Kelvin Smith Engineering Building (approx)
  KLC: { lat: 41.5055, lng: -81.6056 }, // Klinck Commons (approx)
  LAC: { lat: 41.5044, lng: -81.6075 }, // Linsalata Alumni Center (approx)
  MSASS: { lat: 41.5090, lng: -81.6110 }, // Mandel School of Applied Social Sciences (approx)
  MJCC: { lat: 41.5068, lng: -81.6097 }, // Mandel JCC (approx)
  MDC: { lat: 41.5046, lng: -81.6071 }, // Mather Dance Center (approx)
  MMH: { lat: 41.5036, lng: -81.6075 }, // Michelson-Morley Hall (approx)
  MTPAC: { lat: 41.5052, lng: -81.6064 }, // Maltz Performing Arts Center (approx)
  NOR: { lat: 41.5051, lng: -81.6058 }, // Norton Hall (approx)
  OLI: { lat: 41.5071, lng: -81.6039 }, // Olin Library (approx)
  PRH: { lat: 41.5058, lng: -81.6079 }, // Prentiss Hall (approx)
  RIL: { lat: 41.5070, lng: -81.6056 }, // Ritter Library (approx)
  SEB: { lat: 41.5057, lng: -81.6070 }, // Sears Building (approx)
  SRH: { lat: 41.5055, lng: -81.6065 }, // Shafran Residence Hall (approx)
  SLV: { lat: 41.5039, lng: -81.6056 }, // Slavic Village (approx / neighborhood)
  SVF: { lat: 41.4875, lng: -81.6412 }, // Squire Valleevue Farm (approx — off-campus)
  STF: { lat: 41.5057, lng: -81.6111 }, // Stokes Field (approx)
  THW: { lat: 41.5072, lng: -81.6063 }, // Thwing Center (approx)
  TVC: { lat: 41.5069, lng: -81.6059 }, // Tinkham Veale University Center (approx)
  KSL: { lat: 41.5072978, lng: -81.6094011 }, // Kelvin Smith Library — authoritative geocode.
  HBS: { lat: 41.5096, lng: -81.6087 }, // Hathaway Brown School (approx; nearby)
  AMML: { lat: 41.5059, lng: -81.6079 }, // Allen Memorial Medical Library (approx)
  FRC: { lat: 41.5050, lng: -81.6063 }, // Fribley Commons (approx)
  GUH: { lat: 41.5048, lng: -81.6076 }, // Guilford House (approx)
  LTC: { lat: 41.5060, lng: -81.6050 }, // Leutner Commons (approx)
  NOD: { lat: 41.5045, lng: -81.6086 }, // Nord Hall (approx)
  RMH: { lat: 41.5029, lng: -81.6073 }, // Richey Mixon Hall (approx)
  STH: { lat: 41.5062, lng: -81.6078 }, // Strosacker Hall (approx)
  WRB: { lat: 41.5056, lng: -81.6098 }, // Wolstein Research Building (approx)
  YOS: { lat: 41.5064, lng: -81.6070 }, // Yost Hall (approx)
  LAW: { lat: 41.5026, lng: -81.6105 }, // School of Law (Cleveland-Marshall / nearby) (approx)
  MED: { lat: 41.5032, lng: -81.6190 }, // School of Medicine (approx; medical campus area)
  DENT: { lat: 41.5040, lng: -81.6115 }, // School of Dental Medicine (approx)
  NURS: { lat: 41.5042, lng: -81.6122 }, // School of Nursing (approx)
  MGT: { lat: 41.5052, lng: -81.6057 }, // School of Management (Weatherhead / approx)
  ENG: { lat: 41.5060, lng: -81.6065 }, // School of Engineering (approx)
  GRAD: { lat: 41.5065, lng: -81.6060 }, // School of Graduate Studies (approx)
  SEV: { lat: 41.5061001, lng: -81.6095521 }, // Severance Hall / Severance Music Center — authoritative geocode.
  CMA: { lat: 41.5079261, lng: -81.6119723 }, // Cleveland Museum of Art — authoritative geocode.
  CBG: { lat: 41.5114, lng: -81.6163 }, // Cleveland Botanical Garden (approx)
  CIM: { lat: 41.5069, lng: -81.6090 }, // Cleveland Institute of Music (approx)
  CIA: { lat: 41.5075, lng: -81.6129 }, // Cleveland Institute of Art (approx)
  CCM: { lat: 41.5060, lng: -81.6108 }, // Cleveland Cinematheque (approx / campus cinema)
  TCO: { lat: 41.5062, lng: -81.6096 }, // The Cleveland Orchestra (administration / tied to Severance) (approx)
  CPH: { lat: 41.5048, lng: -81.6140 }, // The Cleveland Play House (approx; Playhouse Square area)
  CPL: { lat: 41.5021, lng: -81.6696 }, // The Cleveland Public Library (main branch — downtown) (approx)
  CMNH: { lat: 41.5115, lng: -81.6130 }, // Cleveland Museum of Natural History — best-effort geocode.
  CMZ: { lat: 41.4150, lng: -81.5912 }, // Cleveland Metroparks Zoo (Brooklyn area) (approx)
  CMP: { lat: 41.4996, lng: -81.5120 }, // Cleveland Metroparks (representative central point; system-wide)
});


const center = { lat: 41.5045, lng: -81.6086 }; // CWRU campus center

class FoodMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      showAddForm: false,
      allPosts: [],
      newPost: {
        title: "",
        description: "",
        buildingCode: "",
        lat: null,
        lng: null,
        expiresAt: "",
        type: "freefood"
      }
    };
  }

  async componentDidMount() {
    this.loadPosts();
  }
  
  loadPosts = async () => {
    try {
      const posts = await postAPI.getAllPosts();
      this.setState({ allPosts: posts });
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  selectReport = (report) => {
    this.setState({ selected: report });
  };

  closeInfo = () => {
    this.setState({ selected: null });
  };

 
  toggleAddForm = () => {
    this.setState({ showAddForm: !this.state.showAddForm });
  };

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({
      newPost: {
        ...this.state.newPost,
        [name]: value
      }
    });
  };

  handleSave = async (postData) => {
    try {
      const coords = BUILDING_COORDS[postData.location];
      if (!coords) {
        toastr.error("Invalid building code", "Error");
        return;
      }

      const newPost = await postAPI.createPost({
        type: postData.type || "FreeFood",
        title: postData.title,
        description: postData.description,
        location: {
          buildingCode: postData.location,
          lat: coords.lat,
          lng: coords.lng
        },
        expiresAt: postData.expiresAt
      });

      this.setState({
        allPosts: [newPost, ...this.state.allPosts],
        showAddForm: false,
        newPost: {
          title: "",
          description: "",
          buildingCode: "",
          expiresAt: "",
          type: "FreeFood"
        }
      });

      toastr.success('Post added successfully!', 'Success');
    } catch (err) {
      console.error("Failed to submit post:", err);
      toastr.error(err.message || "Failed to create post", "Error");
    }
  };

  handleMapClick = (e) => {
    const { latLng } = e;
    this.setState({
      newPost: {
        ...this.state.newPost,
        lat: latLng.lat(),
        lng: latLng.lng()
      }
    });
  };

  render() {
    const { selected, showAddForm, allPosts, newPost} = this.state;

    return (
      <div className="food-map-page">


        {/* Map Section */}
        {/* Post Button */}
        
        <div className="map-container" style={{ position: "relative"}}>
        <button
          className="add-post-btn"
          onClick={this.toggleAddForm}
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            zIndex: 900,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)"
          }}
        >
          + Add Post
        </button>
        {showAddForm && (
  <div
    className="postform-overlay"
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
      zIndex: 1050
    }}
  >
    <PostForm
      post={newPost}
      onSave={this.handleSave}
      onCancel={() => this.setState({ showAddForm: false })}
    />
  </div>
)}

   
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              onClick={this.handleMapClick}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={15}
              options={{ mapTypeControl: false }}
            >
              {allPosts.map(post =>
                post.location && post.location.lat != null && post.location.lng != null && (
                  <Marker
                    key={post._id}
                    position={{ lat: post.location.lat, lng: post.location.lng }}
                    onClick={() => this.selectReport(post)}
                  />
                )
              )}

              {selected && (
                <InfoWindow
                  position={{ lat: selected.location.lat, lng: selected.location.lng }}
                  onCloseClick={this.closeInfo}
                >
                  <div>
                    <h3>{selected.title}</h3>
                    <p>{selected.description}</p>
                    <p><strong>{selected.location.buildingCode}</strong></p>
                    <small>Expires: {new Date(selected.expiresAt).toLocaleString()}</small>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* List Section */}
        <div className="food-list-container">
          <h3>Available Food</h3>
          <ul className="food-list">
            {allPosts.map(post => (
              <li key={post._id} onClick={() => this.selectReport(post)}>
                <strong>{post.title}</strong> — {post.location.buildingCode}
                <p>{post.description}</p>
                <span>Expires: {new Date(post.expiresAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default FoodMap;