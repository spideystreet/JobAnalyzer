"use client"

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { createClient } from "@supabase/supabase-js";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Coordonnées approximatives des régions françaises
const REGION_COORDINATES = {
  'Auvergne-Rhône-Alpes': [45.5, 4.5],
  'Bourgogne-Franche-Comté': [47, 4.5],
  'Bretagne': [48, -3],
  'Centre-Val de Loire': [47.3, 1.5],
  'Corse': [42, 9],
  'Grand Est': [48.5, 5],
  'Hauts-de-France': [50, 3],
  'Île-de-France': [48.8, 2.3],
  'Normandie': [49, 0],
  'Nouvelle-Aquitaine': [44.5, 0],
  'Occitanie': [43.5, 2.5],
  'Pays de la Loire': [47.5, -1],
  'Provence-Alpes-Côte d\'Azur': [43.5, 6.5]
};

function HeatmapLayer({ data }) {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      // Supprimer toute heatmap existante avant d'en ajouter une nouvelle
      const existingHeatLayer = map.eachLayer((layer) => {
        if (layer instanceof L.HeatLayer) {
          map.removeLayer(layer);
        }
      });

      const heat = L.heatLayer(data, { 
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

export default function JobHeatmap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    const fetchJobData = async () => {
      const { data, error } = await supabase
        .from("job_offers")
        .select("REGION");

      if (error) {
        console.error("Erreur de récupération:", error);
        return;
      }

      // Compter les occurrences par région
      const regionCounts = data.reduce((acc, item) => {
        acc[item.REGION] = (acc[item.REGION] || 0) + 1;
        return acc;
      }, {});

      // Générer des points de chaleur basés sur le nombre d'offres
      const heatPoints = Object.entries(regionCounts).map(([region, count]) => {
        const coords = REGION_COORDINATES[region];
        return coords ? [...coords, count * 75] : null; // Multiplier par 10 pour plus de visibilité
      }).filter(point => point !== null);

      setHeatmapData(heatPoints);
    };

    const fetchRegionData = async () => {
      const { data, error } = await supabase
        .from("job_offers")
        .select("REGION");

      if (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } else {
        const counts = data.reduce((acc, row) => {
          acc[row.REGION] = (acc[row.REGION] || 0) + 1;
          return acc;
        }, {});

        const formattedData = Object.keys(counts).map(region => ({
          region,
          count: counts[region]
        }));

        setRegionData(formattedData);
      }
    };

    fetchJobData();
    fetchRegionData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Carte de Chaleur des Offres d'Emploi</h1>
      <MapContainer 
        center={[46.5, 2]} 
        zoom={6} 
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {heatmapData.length > 0 && (
          <HeatmapLayer data={heatmapData} />
        )}
      </MapContainer>
    </div>
  );
}