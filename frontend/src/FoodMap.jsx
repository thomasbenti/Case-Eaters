import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import "./FoodMap.css";

const center = { lat: 41.5045, lng: -81.6086 }; // CWRU campus center

const dummyReports = [
  {
    id: 1,
    type: "Pizza",
    location: "KSL Library",
    description: "Free leftover pizza available on the first floor.",
    time: "2:00 PM",
    position: { lat: 41.507, lng: -81.609 },
  },
  {
    id: 2,
    type: "Sandwiches",
    location: "Tinkham Veale",
    description: "Club event sandwiches open to all students.",
    time: "12:30 PM",
    position: { lat: 41.5052, lng: -81.6075 },
  },
  {
    id: 3,
    type: "Coffee & Donuts",
    location: "Nord Hall",
    description: "Morning event hosted by IEEE student branch.",
    time: "9:00 AM",
    position: { lat: 41.5048, lng: -81.6095 },
  },
];

class FoodMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };
  }

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
              {dummyReports.map((report) => (
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
            {dummyReports.map((report) => (
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