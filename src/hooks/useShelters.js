import { useState, useEffect } from "react";
import { getAllShelters } from "../services/shelterService";

export default function useShelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShelters() {
      const data = await getAllShelters();
      setShelters(data);
      setLoading(false);
    }
    loadShelters();
  }, []);

  return { shelters, loading };
}
