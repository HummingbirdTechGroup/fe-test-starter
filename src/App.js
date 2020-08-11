import React from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const center = [51.505, -0.09];

function App() {
  return (
    <div>
      <header>
        <h1>Welcome to th Hummingbird starter app</h1>
      </header>
      <p>
        To get started, edit <code>src/App.js</code> and save to reload. This is
        just a starter App, change it, remove things and add things however you
        want.
      </p>
      <Map
        style={{ width: "500px", height: "500px" }}
        center={center}
        zoom={13}
      >
        {/* {fields.map((field) => (
          <GeoJSON data={field.boundary} />
        ))} */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </Map>
    </div>
  );
}

export default App;
