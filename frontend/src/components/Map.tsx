import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

interface MapProps {
  heatmapData: [number, number, number][];
}

declare module 'leaflet' {
  export interface HeatLayer extends L.Layer {
    setLatLngs(latlngs: L.LatLngExpression[]): void;
    addTo(map: L.Map): this;
  }
  export interface HeatLayerFactory {
    new(latlngs: L.LatLngExpression[], options?: any): HeatLayer;
  }
  export const HeatLayer: HeatLayerFactory;
  export function heatLayer(latlngs: L.LatLngExpression[], options?: any): HeatLayer;
}

function HeatmapLayer({ data }: { data: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      map.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.HeatLayer) {
          map.removeLayer(layer);
        }
      });

      const heat = L.heatLayer(data as L.LatLngExpression[], { 
        radius: 30, 
        blur: 20,
        gradient: {
          0.4: 'blue',
          0.65: 'lime',
          1: 'red'
        }
      }).addTo(map);

      return () => {
        map.removeLayer(heat);
      };
    }
  }, [data, map]);

  return null;
}

export default function Map({ heatmapData }: MapProps) {
  return (
    <MapContainer 
      center={[46.5, 2] as L.LatLngExpression} 
      zoom={6} 
      style={{ height: "400px", width: "100%", borderRadius: "8px", overflow: "hidden" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {heatmapData.length > 0 && (
        <HeatmapLayer data={heatmapData} />
      )}
    </MapContainer>
  );
} 