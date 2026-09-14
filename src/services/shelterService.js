import sheltersData from "../data/shelters-clean.json";
import rehabGdosData from "../data/osrodki_rehabilitacji_gdos.json";
import igoData from "../data/azyle_igo.json";
import rehabInneData from "../data/osrodki_rehabilitacji_inne.json";

const allData = [
  ...sheltersData,
  ...rehabGdosData,
  ...igoData,
  ...rehabInneData,
];

export async function getAllShelters() {
  return allData;
}

export async function getShelterById(id) {
  return allData.find((s) => s.id === id) ?? null;
}

export function toMapPoints(shelters) {
  const points = [];
  for (const shelter of shelters) {
    for (const loc of shelter.locations || []) {
      if (loc.latitude != null && loc.longitude != null) {
        points.push({
          key: loc.id,
          lat: loc.latitude,
          lng: loc.longitude,
          shelter,
          location: loc,
        });
      }
    }
  }
  return points;
}
