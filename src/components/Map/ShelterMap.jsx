import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toMapPoints } from "../../services/shelterService";
import "./ShelterMap.css";

const POLAND_CENTER = [52.0, 19.3];
const START_ZOOM = 6;

function colorFor(shelter) {
  const t = shelter.details?.animalTypes || [];
  if (t.includes("dogs")) return "#f5d90a";
  if (t.includes("cats")) return "#e8a13c";
  return "#3f7d57";
}

function pinIcon(color, active) {
  const s = active ? 38 : 28;
  const paw = s * 0.55;
  const html =
    '<div class="map-pin" style="width:' +
    s +
    "px;height:" +
    s +
    "px;background:" +
    color +
    (active ? ";box-shadow:0 0 0 4px rgba(245,217,10,.35)" : "") +
    '">' +
    '<svg viewBox="0 0 24 24" width="' +
    paw +
    '" height="' +
    paw +
    '" fill="#fff">' +
    '<ellipse cx="12" cy="16" rx="5" ry="4"/>' +
    '<circle cx="5.5" cy="9.5" r="2"/><circle cx="9.5" cy="6" r="2"/>' +
    '<circle cx="14.5" cy="6" r="2"/><circle cx="18.5" cy="9.5" r="2"/></svg></div>';
  return L.divIcon({
    className: "paw-pin",
    html,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  });
}

function MapFocus({ point }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], 13, { duration: 0.8 });
  }, [point, map]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    const t1 = setTimeout(fix, 200);
    const t2 = setTimeout(fix, 600);
    window.addEventListener("resize", fix);
    window.addEventListener("orientationchange", fix);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", fix);
      window.removeEventListener("orientationchange", fix);
    };
  }, [map]);
  return null;
}

function userIcon() {
  return L.divIcon({
    className: "user-pin",
    html: '<div class="user-dot"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function ShelterMap({
  shelters,
  selectedId,
  onSelect,
  onOpenProfile,
  userPos,
}) {
  const points = toMapPoints(shelters);
  const selectedPoint = points.find((p) => p.shelter.id === selectedId);
  // dokąd lecieć: do zaznaczonego schroniska, a jeśli nie ma — do użytkownika
  const focus =
    selectedPoint || (userPos ? { lat: userPos.lat, lng: userPos.lng } : null);

  return (
    <div className="shelter-map">
      <MapContainer
        center={POLAND_CENTER}
        zoom={START_ZOOM}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus point={focus} />
        <MapResizer />
        {userPos && (
          <Marker position={[userPos.lat, userPos.lng]} icon={userIcon()}>
            <Popup>Twoja lokalizacja</Popup>
          </Marker>
        )}
        {points.map((p) => (
          <Marker
            key={p.key}
            position={[p.lat, p.lng]}
            icon={pinIcon(colorFor(p.shelter), p.shelter.id === selectedId)}
            eventHandlers={{ click: () => onSelect?.(p.shelter.id) }}
          >
            <Popup>
              <strong>{p.shelter.name}</strong>
              <br />
              {p.location.city}
              {p.shelter.contact?.phone && (
                <>
                  <br />
                  {p.shelter.contact.phone.split(",")[0].trim()}
                </>
              )}
              {p.shelter.contact?.website && (
                <>
                  <br />
                  <a
                    href={p.shelter.contact.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Strona
                  </a>
                </>
              )}
              {onOpenProfile && (
                <>
                  <br />
                  <button
                    className="map-popup__profile"
                    onClick={() => onOpenProfile(p.shelter)}
                  >
                    Zobacz profil →
                  </button>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
