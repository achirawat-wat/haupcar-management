import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from 'antd';
import { CarOutlined, BankOutlined, TeamOutlined, DollarOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/cars';
const COLORS = ['#0048b3', '#4648d4', '#6063ee', '#89ceff', '#b2c5ff', '#e1e0ff'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setCars(response.data);
      } catch (error) {
        console.error("Failed to fetch cars", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Compute Metrics
  const totalCars = cars.length;
  const haupCarsCount = cars.filter(c => c.isCompanyOwned).length;
  const partnerCarsCount = totalCars - haupCarsCount;
  const evCarsCount = cars.filter(c => c.engineType === 'ev').length;
  
  const avgPrice = totalCars > 0 ? Number((cars.reduce((sum, c) => sum + (c.pricePerDay || 0), 0) / totalCars).toFixed(0)).toLocaleString() : 0;

  // Compute Brand Distribution for Pie Chart
  const brandData = cars.reduce((acc, car) => {
    const brand = car.brand || 'Unknown';
    const existing = acc.find(item => item.name === brand);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: brand, value: 1 });
    }
    return acc;
  }, []);

  const topBrand = brandData.length > 0 ? brandData.sort((a, b) => b.value - a.value)[0].name : '-';

  // Compute Car Type Distribution for Bar Chart
  const typeData = cars.reduce((acc, car) => {
    const type = car.carType || 'Unknown';
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: type, count: 1 });
    }
    return acc;
  }, []);

  // Compute Engine Type Distribution for Pie Chart
  const engineTypeData = cars.reduce((acc, car) => {
    const rawType = car.engineType || 'fuel';
    const type = rawType === 'ev' ? 'EV ⚡' : rawType === 'hybrid' ? 'Hybrid ♻️' : 'Fuel ⛽';
    const color = rawType === 'ev' ? '#52c41a' : rawType === 'hybrid' ? '#1677ff' : '#8c8c8c';
    
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1, color, rawValue: rawType });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <Skeleton active paragraph={{ rows: 1 }} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Skeleton.Button active style={{ height: 100, width: '100%' }} />
          <Skeleton.Button active style={{ height: 100, width: '100%' }} />
          <Skeleton.Button active style={{ height: 100, width: '100%' }} />
          <Skeleton.Button active style={{ height: 100, width: '100%' }} />
          <Skeleton.Button active style={{ height: 100, width: '100%' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton.Button active style={{ height: 350, width: '100%' }} />
          <Skeleton.Button active style={{ height: 350, width: '100%' }} />
          <Skeleton.Button active style={{ height: 350, width: '100%' }} />
        </div>
      </div>
    );
  }

  const KpiCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-300">
      <div>
        <p className="text-on-surface-variant font-body-sm mb-1">{title}</p>
        <h3 className="text-display-sm font-bold text-on-surface">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-background font-semibold">Dashboard Overview</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Key metrics and statistics of your fleet</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard 
          title="Total Vehicles" 
          value={totalCars} 
          icon={<CarOutlined />} 
          colorClass="bg-primary/10 text-primary"
        />
        <KpiCard 
          title="Haup Assets" 
          value={haupCarsCount} 
          icon={<BankOutlined />} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <KpiCard 
          title="Partner Cars" 
          value={partnerCarsCount} 
          icon={<TeamOutlined />} 
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <KpiCard 
          title="Avg. Price/Day" 
          value={`฿${avgPrice}`} 
          icon={<DollarOutlined />} 
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
        <KpiCard 
          title="Top Brand" 
          value={topBrand} 
          icon={<TrophyOutlined />} 
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Distribution (Bar Chart) */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-title-lg font-semibold mb-4 text-on-surface">Vehicles by Brand</h3>
          <div className="h-[400px] w-full overflow-y-auto pr-2 custom-scrollbar">
            {cars.length > 0 ? (
              <ResponsiveContainer width="100%" height={Math.max(400, brandData.length * 45)}>
                <BarChart
                  layout="vertical"
                  data={brandData.sort((a, b) => b.value - a.value)}
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                  <XAxis type="number" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} allowDecimals={false} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    style={{ fontSize: '12px', textTransform: 'capitalize' }} 
                    width={90} 
                    tickFormatter={(value) => value.length > 12 ? value.substring(0, 11) + '...' : value}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0, 72, 179, 0.05)' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 6, 6, 0]} 
                    maxBarSize={32}
                    onClick={(data) => {
                      if (data && data.name) {
                        navigate('/cars', { state: { searchText: data.name } });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {brandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant font-body-md">No data available</div>
            )}
          </div>
        </div>

        {/* Type Distribution (Bar Chart) */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-title-lg font-semibold mb-4 text-on-surface">Vehicles by Body Type</h3>
          <div className="h-[400px] w-full">
            {cars.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={typeData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    style={{ textTransform: 'capitalize', fontSize: '12px' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false}
                    style={{ fontSize: '12px' }}
                    dx={-10}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0, 72, 179, 0.05)' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#0048b3" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={60} 
                    onClick={(data) => {
                      if (data && data.name) {
                        navigate('/cars', { state: { searchText: data.name } });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant font-body-md">No data available</div>
            )}
          </div>
        </div>
        {/* Engine Type Distribution (Donut Chart) */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-title-lg font-semibold mb-4 text-on-surface">Engine Types</h3>
          <div className="h-[400px] w-full">
            {cars.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engineTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    onClick={(data) => {
                      if (data && data.rawValue) {
                        navigate('/cars', { state: { searchText: data.rawValue } });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {engineTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant font-body-md">No data available</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
