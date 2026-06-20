import sheltersData from "../data/shelters-clean.json";

export async function getAllShelters() {
  return sheltersData;
}

export async function getShelterById(id) {
  return sheltersData.find((s) => s.id === id) ?? null;
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
