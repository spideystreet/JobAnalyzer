"use client"

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { createClient } from "@supabase/supabase-js";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

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
  const [domainData, setDomainData] = useState([]);

  useEffect(() => {
    const fetchJobData = async () => {
      const { data, error } = await supabase
        .from("job_offers")
        .select("REGION, DOMAIN");

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
        return coords ? [...coords, count * 75] : null;
      }).filter(point => point !== null);

      setHeatmapData(heatPoints);

      // Compter les occurrences par domaine
      const domainCounts = data.reduce((acc, item) => {
        acc[item.DOMAIN] = (acc[item.DOMAIN] || 0) + 1;
        return acc;
      }, {});

      // Trier et sélectionner le top 10
      const sortedDomainData = Object.entries(domainCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));

      setDomainData(sortedDomainData);
    };

    fetchJobData();
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

      <h2 className="text-xl font-bold mt-8 mb-4">Top 10 des Types de Postes</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={domainData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {domainData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(${index * 36}, 70%, 50%)`} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}