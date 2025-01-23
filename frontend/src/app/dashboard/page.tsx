"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";


// Configurez votre client Supabase
const supabaseUrl = "https://sspzxnulivsmpnalhatw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcHp4bnVsaXZzbXBuYWxoYXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjM3NDA3NywiZXhwIjoyMDUxOTUwMDc3fQ.GQiuNioTqL20S23wyheK2Lo9Vj7WOyTEqW-2wNYU0II";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les données de Supabase
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("job_offers")
        .select("*");

      if (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tableau des Offres d'Emploi</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map((key) => (
              <th key={key} className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {Object.values(row).map((value, i) => (
                <td key={i} className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}