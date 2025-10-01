import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 41.5045, lng: -81.6086 }; // CWRU campus center

const dummyReports = [
  {
    id: 1,
    type: "Pizza",
    location: "KSL Library",
    description: "Free leftover pizza",
    time: "2:00 PM",
    position: { lat: 41.507, lng: -81.609 },
  },
  {
    id: 2,
    type: "Sandwiches",
    location: "Tinkham Veale",
    description: "Club event sandwiches",
    time: "12:30 PM",
    position: { lat: 41.5052, lng: -81.6075 },
  },
];

class FoodMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listView: false,
      selected: null,
    };
  }

  toggleView = () => {
    this.setState((prevState) => ({ listView: !prevState.listView }));
  };

  selectReport = (report) => {
    this.setState({ selected: report });
  };

  closeInfo = () => {
    this.setState({ selected: null });
  };

  render() {
    const { listView, selected } = this.state;

    return (
      <div className="food-map-page">
        <h2>Locate Food</h2>
        <button onClick={this.toggleView}>
          {listView ? "Show Map" : "Show List"}
        </button>

        {listView ? (
          <ul className="food-list">
            {dummyReports.map((report) => (
              <li key={report.id} onClick={() => this.selectReport(report)}>
                <strong>{report.type}</strong> — {report.location}
                <p>{report.description}</p>
                <span>{report.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
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
        )}
      </div>
    );
  }
}

export default FoodMap;