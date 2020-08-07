import React, { useEffect } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

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
        center={[51.505, -0.09]}
        zoom={13}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </Map>
    </div>
  );
}

export default App;
