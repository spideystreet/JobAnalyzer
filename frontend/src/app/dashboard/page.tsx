"use client"

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { createClient } from "@supabase/supabase-js";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
  const [technoData, setTechnoData] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      const { data, error } = await supabase
        .from("job_offers")
        .select("REGION, DOMAIN, TECHNOS");

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

  useEffect(() => {
    const fetchTechnoData = async () => {
      const { data, error } = await supabase
        .from("job_offers")
        .select("DOMAIN, TECHNOS");

      if (error) {
        console.error("Erreur de récupération:", error);
        return;
      }

      // Compter les occurrences des technologies par domaine
      const technoCountsByDomain = data.reduce((acc, item) => {
        const domain = item.DOMAIN;
        const technos = item.TECHNOS || [];
        if (!acc[domain]) acc[domain] = {};
        technos.forEach(tech => {
          acc[domain][tech] = (acc[domain][tech] || 0) + 1;
        });
        return acc;
      }, {});

      // Mettre à jour les technologies pour le domaine sélectionné
      if (selectedDomain) {
        const technoCounts = technoCountsByDomain[selectedDomain] || {};
        const sortedTechnoData = Object.entries(technoCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, value]) => ({ name, value }));

        setTechnoData(sortedTechnoData);
      }
    };

    fetchTechnoData();
  }, [selectedDomain]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Carte de Chaleur des Offres d'Emploi</h1>
      <MapContainer 
        center={[46.5, 2]} 
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

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Top 10 des Types de Postes</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={domainData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
              onClick={(data, index) => setSelectedDomain(data.name)}
            >
              {domainData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(0, 0%, ${index * 10 + 30}%)`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Top 10 des Technologies pour {selectedDomain || "Sélectionnez un métier"}</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={technoData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#82ca9d"
              dataKey="value"
              label
            >
              {technoData.map((entry, index) => (
                <Cell key={`cell-tech-${index}`} fill={`hsl(${index * 36}, 70%, 50%)`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}