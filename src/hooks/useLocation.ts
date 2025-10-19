import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface LocationData {
  country: string;
  countryName: string;
  city: string;
  region: string;
  ip: string;
  timezone: string;
}

const LOCATION_STORAGE_KEY = "user_selected_country";

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("GLOBAL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved country preference once
  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (saved) {
      console.log("📦 Loaded saved country:", saved);
      setSelectedCountry(saved);
    } else {
      // Default to GLOBAL if nothing saved
      localStorage.setItem(LOCATION_STORAGE_KEY, "GLOBAL");
    }
  }, []);

  // Detect user location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.functions.invoke(
          "geolocation-service"
        );

        if (error) {
          console.error("🚨 Supabase function error:", error);
          throw error;
        }

        if (data) {
          setLocation(data);

          // Do not override user preference; default remains GLOBAL unless user changes it

          setError(null);
        } else {
          throw new Error("No location data received");
        }
      } catch (err) {
        console.error("⚠️ Location detection error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to detect location"
        );

        const fallbackLocation: LocationData = {
          country: "US",
          countryName: "United States",
          city: "",
          region: "",
          ip: "",
          timezone: "",
        };

        setLocation(fallbackLocation);
        // Keep selected country as user preference or default GLOBAL; do not force US
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once

  const updateSelectedCountry = (country: string) => {
    console.log("✍️ User selected country:", country);
    setSelectedCountry(country);
    localStorage.setItem(LOCATION_STORAGE_KEY, country);
  };

  return {
    location,
    selectedCountry,
    updateSelectedCountry,
    loading,
    error,
  };
}
