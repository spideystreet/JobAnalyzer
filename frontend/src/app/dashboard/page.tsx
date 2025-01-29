"use client"

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from "@supabase/supabase-js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface JobOffer {
  REGION: string;
  DOMAIN: string;
  TECHNOS: string[];
  CREATED_AT: string;
  XP: string;
}

interface ChartDataItem {
  date: string;
  count: number;
}

interface TechnoDataItem {
  name: string;
  value: number;
}

interface RegionCounts {
  [key: string]: number;
}

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
  'Provence-Alpes-Côte d&apos;Azur': [43.5, 6.5]
} as const;

type RegionCoordinates = typeof REGION_COORDINATES;
type RegionName = keyof RegionCoordinates;

// Import dynamique de la carte pour éviter les erreurs côté serveur
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>
});

export default function JobHeatmap() {
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [technoData, setTechnoData] = useState<TechnoDataItem[]>([]);
  const [technoDonutData, setTechnoDonutData] = useState<TechnoDataItem[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [xpData, setXpData] = useState<{ xp: string; count: number }[]>([]);

  // Configuration du graphique
  const chartConfig = {
    views: {
      label: "Page Views",
    },
    desktop: {
      label: "Régions",
      color: "#2563eb",
    },
    mobile: {
      label: "Missions",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("desktop");

  const total = React.useMemo(
    () => {
      const regionCounts = chartData.reduce<RegionCounts>((acc, curr) => {
        if (curr.date) {
          acc[curr.date] = (acc[curr.date] || 0) + 1;
        }
        return acc;
      }, {});

      const uniqueRegionCount = Object.keys(regionCounts).length;
      const totalMissions = chartData.reduce((acc, curr) => acc + curr.count, 0);

      return {
        desktop: uniqueRegionCount,
        mobile: totalMissions,
      };
    },
    [chartData],
  );

  useEffect(() => {
    const fetchJobData = async () => {
      const { data, error } = await supabase
        .from("job_offers")
        .select("REGION, DOMAIN, TECHNOS, CREATED_AT, XP");

      if (error) {
        console.error("Erreur de récupération:", error);
        return;
      }

      const jobOffers = data as JobOffer[];

      // Compter les occurrences par région
      const regionCounts = jobOffers.reduce<RegionCounts>((acc, item) => {
        if (item.REGION) {
          acc[item.REGION] = (acc[item.REGION] || 0) + 1;
        }
        return acc;
      }, {});

      // Générer des points de chaleur basés sur le nombre d'offres
      const heatPoints = Object.entries(regionCounts).map(([region, count]) => {
        const coords = REGION_COORDINATES[region as RegionName];
        return coords ? [...coords, count * 75] as [number, number, number] : null;
      }).filter((point): point is [number, number, number] => point !== null);

      setHeatmapData(heatPoints);

      // Compter les occurrences par jour
      const dateCounts = jobOffers.reduce<Record<string, number>>((acc, item) => {
        const date = new Date(item.CREATED_AT).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Préparer les données pour le graphique
      const chartDataArray = Object.entries(dateCounts)
        .map(([date, count]): ChartDataItem => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Filtrer pour le dernier mois
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const filteredChartData = chartDataArray.filter(item => 
        new Date(item.date).getTime() >= oneMonthAgo.getTime()
      );

      setChartData(filteredChartData);

      // Compter les occurrences des métiers (DOMAIN)
      const domainCounts = jobOffers.reduce<Record<string, number>>((acc, item) => {
        if (item.DOMAIN) {
          acc[item.DOMAIN] = (acc[item.DOMAIN] || 0) + 1;
        }
        return acc;
      }, {});

      // Préparer les données pour le camembert des métiers
      const domainChartData = Object.entries(domainCounts)
        .map(([domain, count]): TechnoDataItem => ({ name: domain, value: count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      setTechnoData(domainChartData);

      // Mettre à jour les données du donut en fonction du métier sélectionné
      if (selectedDomain) {
        const filteredTechnoCounts = jobOffers.reduce<Record<string, number>>((acc, item) => {
          if (item.DOMAIN === selectedDomain && Array.isArray(item.TECHNOS)) {
            item.TECHNOS.forEach(tech => {
              acc[tech] = (acc[tech] || 0) + 1;
            });
          }
          return acc;
        }, {});

        const filteredTechnoChartData = Object.entries(filteredTechnoCounts)
          .map(([tech, count]): TechnoDataItem => ({ name: tech, value: count }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);

        setTechnoDonutData(filteredTechnoChartData);
      }

      // Compter les occurrences des niveaux d'expérience (XP)
      const xpCounts = jobOffers.reduce<Record<string, number>>((acc, item) => {
        if (item.XP) {
          acc[item.XP] = (acc[item.XP] || 0) + 1;
        }
        return acc;
      }, {});

      const xpChartData = Object.entries(xpCounts)
        .map(([xp, count]) => ({ xp, count }))
        .sort((a, b) => b.count - a.count);

      setXpData(xpChartData);
    };

    fetchJobData();
  }, [selectedDomain]);

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <section id="header" className="text-center mb-16">
        <BlurFade delay={0.25} inView>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Hello 👋
          </h2>
        </BlurFade>
        <BlurFade delay={0.25 * 2} inView>
          <span className="text-xl text-pretty tracking-tighter sm:text-3xl xl:text-4xl/none">
            Analysez confortablement les offres ici
          </span>
        </BlurFade>
      </section>

      <Suspense fallback={<div>Chargement des graphiques...</div>}>
        <div className="flex justify-between space-x-4">
          <Card className="w-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Nombre de missions</CardTitle>
                <CardDescription>
                  Total au fil du temps
                </CardDescription>
              </div>
              <div className="flex">
                {["desktop", "mobile"].map((key) => {
                  const chart = key as keyof typeof chartConfig;
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs text-muted-foreground">
                        {chartConfig[chart].label}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl">
                        {total[key as keyof typeof total].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[150px] w-full"
              >
                <BarChart
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill={`var(--color-${String(activeChart)})`} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Distribution de l'expérience requise</CardTitle>
                <CardDescription>
                  Sénior / Confirmé / Intermédiaire / Junior
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[150px] w-full"
              >
                <BarChart
                  data={xpData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="xp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    fontSize={12}
                    angle={0}
                    textAnchor="middle"
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count">
                    {xpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        index === 0 ? "#ef4444" :  // Rouge pour la première barre
                        index === 1 ? "#1d4ed8" :  // Bleu foncé pour la deuxième
                        index === 2 ? "#6366f1" :  // Violet pour la troisième
                        "#fbbf24"                  // Jaune pour la dernière
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <Card className="w-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-8">
                <CardTitle>Top 10 des Métiers</CardTitle>
                <CardDescription>
                  Répartition des métiers
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <PieChart width={900} height={400}>
                <Pie
                  data={technoData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                  onClick={(data) => setSelectedDomain(data.name)}
                >
                  {technoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 36}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-8">
                <CardTitle>Distribution des Technos</CardTitle>
                <CardDescription>
                  Cliquez sur un métier pour voir les technos associées
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <PieChart width={900} height={400}>
                <Pie
                  data={technoDonutData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  fill="#82ca9d"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {technoDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 36}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      <h1 className="text-3xl font-bold mb-6 text-center">Carte de Chaleur des Offres d&apos;Emploi</h1>
      <Suspense fallback={<div>Chargement de la carte...</div>}>
        <MapWithNoSSR heatmapData={heatmapData} />
      </Suspense>
    </div>
  );
}