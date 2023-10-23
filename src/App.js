import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "./images/icon-location.svg";
import L from "leaflet";
import iconShadow from "./images/icon-location.svg";
import iconArrow from "./images/icon-arrow.svg";

import MobileBgnImg from "./images/pattern-bg-mobile.png";
import DesktopBgnImg from "./images/pattern-bg-desktop.png";

const App = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [selectedIpAdress, setSelectedIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const [isp, setIsp] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}`
      )
      .then(function (response) {
        console.log(response.data);
        setLat(response.data.location.lat);
        setLng(response.data.location.lng);
        setSelectedIpAddress(response.data.ip);
        setLocation(
          `${response.data.location.city},${response.data.location.country} ${response.data.location.postalCode} `
        );
        setTimezone(`UTC ${response.data.location.timezone}`);
        setIsp(response.data.isp);
        setErrorMessage(null);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setErrorMessage(
          "An error occurred. Please refresh the page or enter your ip address or domain in the text box."
        );
      });
  }, []);

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  const handleIpAdress = (event) => {
    event.preventDefault();

    setLat(null);
    setLng(null);

    let axiosAddress = "";

    if (ipAddress.length > 0) {
      if (/^[0-9.]*$/.test(ipAddress)) {
        axiosAddress = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${ipAddress}`;
      } else {
        axiosAddress = `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_API_KEY}&domain=${ipAddress}`;
      }

      axios
        .get(axiosAddress)
        .then(function (response) {
          setLat(response.data.location.lat);
          setLng(response.data.location.lng);
          setSelectedIpAddress(response.data.ip);
          setLocation(
            `${response.data.location.city},${response.data.location.country} ${response.data.location.postalCode} `
          );
          setTimezone(`UTC ${response.data.location.timezone}`);
          setIsp(response.data.isp);
          setErrorMessage(null);
        })
        .catch(function (error) {
          // handle error
          console.log(error.message);
          setErrorMessage(
            "An error occurred. Enter your ip address or domain in the text box."
          );
        });
    } else {
      setErrorMessage("IP address or domain can not be empty");
    }
  };

  return (
    <div>
      <div className="information-style">
        <div className="information-layout">
          <h1>IP Address Tracker</h1>

          <div className="div-input">
            <input
              className="information-input"
              placeholder="Search for any IP address or domain"
              value={ipAddress}
              onChange={({ target }) => setIpAddress(target.value)}
            />
            <button className="information-btn" onClick={handleIpAdress}>
              <img src={iconArrow} alt="arrow-button" />
            </button>
          </div>

          {errorMessage === null ? (
            <div className="modal-style">
              <div style={{ padding: "10px" }}>
                <label>IP ADDRESS</label>
                <p>{selectedIpAdress}</p>
              </div>

              <div className="vertical-line"></div>

              <div style={{ padding: "10px" }}>
                <label>LOCATION</label>
                <p>{location}</p>
              </div>

              <div className="vertical-line"></div>

              <div style={{ padding: "10px" }}>
                <label>TIMEZONE</label>
                <p>{timezone}</p>
              </div>

              <div className="vertical-line"></div>

              <div style={{ padding: "10px" }}>
                <label>ISP</label>
                <p>{isp}</p>
              </div>
            </div>
          ) : (
            <div
              className="modal-style"
              style={{ color: "red", border: "2px solid red" }}
            >
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      <div>
        <img src={MobileBgnImg} className="mobile-bgn-image" alt="background" />
        <img
          src={DesktopBgnImg}
          className="desktop-bgn-image"
          alt="background"
        />

        {lat && lng ? (
          <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[lat, lng]} />
          </MapContainer>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default App;
