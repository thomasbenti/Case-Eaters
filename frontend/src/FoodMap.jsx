import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import "./FoodMap.css";

const center = { lat: 41.5045, lng: -81.6086 }; // CWRU campus center

class FoodMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],    
      selected: null,
    };
  }

  componentDidMount() {
    this.loadReports();
  }

  loadReports = async () => {
    try {
      const res = await fetch("http://localhost:3001/posts");
      const data = await res.json();
      const reportsWithPositions = data.map(post => ({
        id: post.postId,
        type: post.title,
        location: post.location,
        description: post.description,
        time: new Date(post.time).toLocaleTimeString(),
        position: this.getLatLng(post.location), 
      }));
      this.setState({ reports: reportsWithPositions });
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  getLatLng = (building) => {
    const map = {
      "KSL Library": { lat: 41.5049, lng: -81.6078 },
      "Tinkham Veale": { lat: 41.5052, lng: -81.6075 },
      "Nord Hall": { lat: 41.5048, lng: -81.6095 },
    };
    return map[building] || { lat: 41.5045, lng: -81.6086 }; 
  };


  selectReport = (report) => {
    this.setState({ selected: report });
  };

  closeInfo = () => {
    this.setState({ selected: null });
  };

  render() {
    const { selected } = this.state;

    return (
      <div className="food-map-page">
        {/* Map Section */}
        <div className="map-container">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={15}
            >
              {this.state.reports.map((report) => (
                <Marker
                  key={report.id}
                  position={report.position}
                  onClick={() => this.selectReport(report)}
                />
              ))}

              {selected && (
                <InfoWindow
                  position={selected.position}
                  onCloseClick={this.closeInfo}
                >
                  <div>
                    <h3>{selected.type}</h3>
                    <p>{selected.description}</p>
                    <p><em>{selected.location}</em></p>
                    <small>{selected.time}</small>
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
          {this.state.reports.map((report) => (
            <li key={report.id} onClick={() => this.selectReport(report)}>
              <strong>{report.type}</strong> — {report.location}
              <p>{report.description}</p>
              <span>{report.time}</span>
            </li>
          ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default FoodMap;