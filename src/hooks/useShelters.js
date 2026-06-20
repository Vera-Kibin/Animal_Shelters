import { useState, useEffect } from "react";
import { getAllShelters } from "../services/shelterService";

export default function useShelters() {
  const [shelters, setShelters] = useState([]); // start: pusto
  const [loading, setLoading] = useState(true); // start: ładuje się

  useEffect(() => {
    async function loadShelters() {
      const data = await getAllShelters();
      setShelters(data);
      setLoading(false);
    }
    loadShelters();
  }, []); // [] = jeden raz, po pierwszym renderze

  return { shelters, loading };
}
