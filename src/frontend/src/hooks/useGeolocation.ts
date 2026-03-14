import { useCallback, useState } from "react";

interface GeolocationState {
  address: string;
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    address: "",
    lat: null,
    lng: null,
    loading: false,
    error: null,
  });

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use OpenStreetMap Nominatim for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
            { headers: { "Accept-Language": "en" } },
          );
          const data = await response.json();
          const address =
            data.display_name ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setState({
            address,
            lat: latitude,
            lng: longitude,
            loading: false,
            error: null,
          });
        } catch {
          // Fallback to coordinates if geocoding fails
          const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setState({
            address: fallback,
            lat: latitude,
            lng: longitude,
            loading: false,
            error: null,
          });
        }
      },
      (err) => {
        let message = "Unable to retrieve your location.";
        if (err.code === err.PERMISSION_DENIED)
          message = "Location permission denied.";
        else if (err.code === err.POSITION_UNAVAILABLE)
          message = "Location information unavailable.";
        else if (err.code === err.TIMEOUT)
          message = "Location request timed out.";
        setState((prev) => ({ ...prev, loading: false, error: message }));
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  return { ...state, detectLocation };
}
