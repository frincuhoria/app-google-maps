import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Coordinates from "./Coordinates";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getFirestore } from "@firebase/firestore";
import app from "../firebase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const style = {
  width: "100%",
  height: "100%",
  position: "absolute",
};

const stylemui = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const containerStyle = {
  position: "absolute",
  width: "100vw",
  height: "100vh",
  left: 0,
  top: 0,
};

export const MapContainer = (props) => {
  const [adress, setAdress] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: 46,
    lng: 24,
  });

  const [coordinates, setCoordinates] = useState([]);
  const db = getFirestore(app);
  const coordinatesCollectionRef = collection(db, "coordinates");

  const [modal1, setModal1] = useState(false);
  const openModal1 = () => setModal1(true);
  const closeModal1 = () => setModal1(false);

  const [modal2, setModal2] = useState(false);
  const openModal2 = () => setModal2(true);
  const closeModal2 = () => setModal2(false);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [location, setLocation] = useState("");

  const [newLatitude, setNewLatitude] = useState(0);
  const [newLongitude, setNewLongitude] = useState(0);
  const [newLocation, setNewLocation] = useState("");

  const [selectedForEdit, setSelectedForEdit] = useState();

  const [modal3, setModal3] = useState(false);
  const openModal3 = () => setModal3(true);
  const closeModal3 = () => setModal3(false);

  const [modal4, setModal4] = useState(false);
  const openModal4 = () => setModal4(true);
  const closeModal4 = () => setModal4(false);

  const [modal5, setModal5] = useState(false);
  const openModal5 = () => setModal5(true);
  const closeModal5 = () => setModal5(false);

  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const getCoordinates = async () => {
    const data = await getDocs(coordinatesCollectionRef);
    setCoordinates(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getCoordinates();
  }, []);

  const handleChange = (address) => {
    setAdress(address);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log("Success", latLng);
        setAdress(address);
        setMapCenter(latLng);
      })
      .catch((error) => console.error("Error", error));
  };

  const handleUpdate = (id) => {
    let found = coordinates.find((coord) => coord.id === id);
    setSelectedForEdit(found);
    openModal4();
  };

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  const updateCoordinate = async () => {
    try {
      const coordRef = doc(db, "coordinates", selectedForEdit.id);
      await updateDoc(coordRef, {
        latitude: newLatitude ? newLatitude : selectedForEdit.latitude,
        longitude: newLongitude ? newLongitude : selectedForEdit.longitude,
        location: newLocation ? newLocation : selectedForEdit.location,
      });
      getCoordinates();
      closeModal4();
      setNewLatitude();
      setNewLocation();
      setNewLongitude();
    } catch (err) {
      alert(err);
    }
  };

  const createCoordinate = async () => {
    try {
      await addDoc(coordinatesCollectionRef, {
        latitude: latitude,
        longitude: longitude,
        location: location,
      });
      getCoordinates();
      closeModal2();
    } catch (err) {
      alert(err);
    }
  };

  const deleteCoordinates = async (id) => {
    try {
      const coordinatesDoc = doc(db, "coordinates", id);
      await deleteDoc(coordinatesDoc);
      getCoordinates();
      closeModal5();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          zIndex: 9999,
          backgroundColor: "#FFF5EB",
          height: "100vh",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          borderRight: "2px solid #276678",
        }}
      >
        <h1 className="text-center">Google Map</h1>
        <h6 className="text-center">User: {currentUser.email}</h6>
        <PlacesAutocomplete
          value={adress}
          onChange={(value) => handleChange(value)}
          onSelect={(value) => handleSelect(value)}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="mt-3">
              <input
                style={{
                  color: "#276678",
                  backgroundColor: "#F9F9F9",
                  border: "1px solid #1687A7",
                }}
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input px-3",
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <Button
          onClick={openModal1}
          className="mt-3"
          variant="outlined"
          style={{ color: "white", backgroundColor: "#1687A7" }}
        >
          See all locations
        </Button>
        <Button
          onClick={openModal2}
          className="mt-3"
          variant="outlined"
          style={{ color: "white", backgroundColor: "#1687A7" }}
        >
          Add new coordinates
        </Button>
        <Button
          onClick={openModal3}
          className="mt-3"
          variant="outlined"
          style={{ color: "white", backgroundColor: "#1687A7" }}
        >
          Update coordinates
        </Button>
        <Button
          onClick={openModal5}
          className="mt-3"
          variant="outlined"
          style={{ color: "white", backgroundColor: "#1687A7" }}
        >
          Delete coordinates
        </Button>
        <Button
          onClick={handleLogout}
          className="mt-auto"
          variant="contained"
          style={{ color: "white", backgroundColor: "#51C4D3" }}
        >
          Log Out
        </Button>
        <Modal
          open={modal1}
          onClose={closeModal1}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylemui} style={{ backgroundColor: "#F6F5F5" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h4"
              class=" text-center"
              style={{ color: "#1687A7" }}
            >
              Coordinates for each location
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Coordinates />
            </Typography>
          </Box>
        </Modal>
        <Modal
          open={modal2}
          onClose={closeModal2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylemui} style={{ backgroundColor: "#F6F5F5" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h4"
              class=" text-center"
              style={{ color: "#1687A7" }}
            >
              Insert new coordonate
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <input
                type="text"
                placeholder="Insert latitude..."
                className="mt-3 px-3 w-100"
                onChange={(event) => {
                  setLatitude(event.target.value);
                }}
                style={{
                  color: "#276678",
                  backgroundColor: "#F9F9F9",
                  border: "1px solid #1687A7",
                }}
              />
              <input
                type="text"
                placeholder="Insert longitude..."
                className="mt-3 px-3 w-100"
                onChange={(event) => {
                  setLongitude(event.target.value);
                }}
                style={{
                  color: "#276678",
                  backgroundColor: "#F9F9F9",
                  border: "1px solid #1687A7",
                }}
              />
              <input
                type="string"
                placeholder="Insert location..."
                className="mt-3 px-3 w-100"
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
                style={{
                  color: "#276678",
                  backgroundColor: "#F9F9F9",
                  border: "1px solid #1687A7",
                }}
              />
              <Button
                onClick={createCoordinate}
                className="mt-3 w-100"
                variant="contained"
                style={{ backgroundColor: "#1687A7" }}
              >
                Create coordiante
              </Button>
            </Typography>
          </Box>
        </Modal>
        <Modal
          open={modal3}
          onClose={closeModal3}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylemui} style={{ backgroundColor: "#F6F5F5" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h4"
              class=" text-center"
              style={{ color: "#1687A7" }}
            >
              Update latitude or longitude
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <div>
                {coordinates.map((coord) => {
                  return (
                    <div
                      className="border border-dark mt-3 rounded p-2"
                      style={{ backgroundColor: "#D3E0EA " }}
                    >
                      <h5
                        style={{ color: "#276678 " }}
                        className="mt-1 text-center"
                      >
                        Location: {coord.location}
                      </h5>
                      <h6 style={{ color: "#276678 " }} className="text-center">
                        Latitude: {coord.latitude}
                      </h6>
                      <h6 style={{ color: "#276678 " }} className="text-center">
                        Longitude: {coord.longitude}
                      </h6>
                      <Button
                        onClick={() => handleUpdate(coord.id)}
                        className="mt-3 w-100"
                        variant="contained"
                        style={{ backgroundColor: "#1687A7" }}
                      >
                        Update coordinate
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Typography>
          </Box>
        </Modal>
        <Modal
          open={modal4}
          onClose={closeModal4}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylemui} style={{ backgroundColor: "#F6F5F5" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h4"
              class=" text-center"
              style={{ color: "#1687A7" }}
            >
              Update coordinates
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <input
                type="text"
                placeholder="Insert latitude..."
                className="mt-3 px-3 w-100"
                defaultValue={selectedForEdit && selectedForEdit.latitude}
                onChange={(event) => {
                  setNewLatitude(event.target.value);
                }}
                style={{
                  color: "#276678",
                  backgroundColor: "#F9F9F9",
                  border: "1px solid #1687A7",
                }}
              />
              <input
                type="text"
                placeholder="Insert longitude..."
                className="mt-3 px-3 w-100"
                defaultValue={selectedForEdit && selectedForEdit.longitude}
                onChange={(event) => {
                  setNewLongitude(event.target.value);
                }}
                style={{
                  color: "#276678",
                  backgroundColor: "#F9F9F9",
                  border: "1px solid #1687A7",
                }}
              />
              <input
                type="text"
                placeholder="Insert location..."
                className="mt-3 px-3 w-100"
                defaultValue={selectedForEdit && selectedForEdit.location}
                onChange={(event) => {
                  setNewLocation(event.target.value);
                }}
                style={{
                  color: "#276678",
                  backgroundColor: "#F9F9F9",
                  border: "1px solid #1687A7",
                }}
              />
              <Button
                onClick={() => updateCoordinate()}
                className="mt-3 w-100"
                variant="contained"
                style={{ backgroundColor: "#1687A7" }}
              >
                Update
              </Button>
            </Typography>
          </Box>
        </Modal>
        <Modal
          open={modal5}
          onClose={closeModal5}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={stylemui} style={{ backgroundColor: "#F6F5F5" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h4"
              class=" text-center"
              style={{ color: "#1687A7" }}
            >
              Delete locations
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <div>
                {coordinates.map((coord) => {
                  return (
                    <div
                      className="border border-dark mt-3 rounded p-2"
                      style={{ backgroundColor: "#D3E0EA " }}
                    >
                      <h5
                        style={{ color: "#276678 " }}
                        className="mt-1 text-center"
                      >
                        Location: {coord.location}
                      </h5>
                      <h6 style={{ color: "#276678 " }} className="text-center">
                        Latitude: {coord.latitude}
                      </h6>
                      <h6 style={{ color: "#276678 " }} className="text-center">
                        Longitude: {coord.longitude}
                      </h6>
                      <Button
                        onClick={() => deleteCoordinates(coord.id)}
                        className="mt-3 w-100"
                        variant="contained"
                        style={{ backgroundColor: "#1687A7" }}
                      >
                        Delete location
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Typography>
          </Box>
        </Modal>
      </div>
      <div id="googleMap">
        <Map
          containerStyle={containerStyle}
          google={props.google}
          zoom={7}
          style={style}
          initialCenter={{
            lat: mapCenter.lat,
            lng: mapCenter.lng,
          }}
          center={{
            lat: mapCenter.lat,
            lng: mapCenter.lng,
          }}
        >
          {coordinates &&
            coordinates.map((coord, index) => (
              <Marker
                key={index}
                position={{ lat: coord.latitude, lng: coord.longitude }}
              />
            ))}
        </Map>
      </div>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBS5Ik40DwP88DcVdZ14MqlQ94EnWiTOYM",
})(MapContainer);
