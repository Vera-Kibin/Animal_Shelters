import { MapContainer, TileLayer } from "react-leaflet";

function MapPanel() {
  return (
    <section className="map-panel">
      <MapContainer center={[54.3517, 18.6459]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </section>
  );
}

export default MapPanel;
