import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsFillBellFill } from 'react-icons/bs';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import styles from '../../Styles/Admin_css/Dashboard.module.css'; // Import CSS Module
import axios from 'axios';

function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [totalPremiumGroups, setTotalPremiumGroups] = useState(0);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:9999/users/count-users');
        const groupResponse = await axios.get('http://localhost:9999/groups/count');
        const premiumGroupResponse = await axios.get('http://localhost:9999/groups/count-premium');
        setTotalUsers(userResponse.data.count); // Assuming the API returns { count: number }
        setTotalGroups(groupResponse.data.count); // Assuming the API returns { count: number }
        setTotalPremiumGroups(premiumGroupResponse.data.count); // Assuming the API returns { count: number }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const normalGroups = totalGroups - totalPremiumGroups;
  const pieData = [
    { name: 'Premium Group', value: totalPremiumGroups },
    { name: 'Normal Group', value: normalGroups },
  ];

  const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: -1000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 500, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: -2000, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: -250, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.uv));
    const dataMin = Math.min(...data.map((i) => i.uv));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <main className={styles.mainContainer}>
      <div className={styles.mainTitle}>
        <h3>DASHBOARD</h3>
      </div>

      <div className={styles.mainCards}>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <h3>Total Users</h3>
            <BsFillArchiveFill className={styles.cardIcon} />
          </div>
          <h1>{totalUsers}</h1>
        </div>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <h3>Total Groups</h3>
            <BsFillGrid3X3GapFill className={styles.cardIcon} />
          </div>
          <h1>{totalGroups}</h1>
        </div>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <h3>Revenue</h3>
            <BsFillBellFill className={styles.cardIcon} />
          </div>
          <h1>5</h1>
        </div>
      </div>

      <div className={styles.charts}>
        <div>
          <h3>Revenue Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="green" stopOpacity={1} />
                  <stop offset={off} stopColor="red" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="uv" stroke="#000" fill="url(#splitColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3>Users Distribution Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={105}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className={styles.chartExplanation}>
            This chart shows the distribution of user groups within the system. It highlights the proportion of
            <span style={{ color: COLORS[0] }}> Premium Groups</span> vs
            <span style={{ color: COLORS[1] }}> Normal Groups</span> based on the total number of groups.
            The percentage represents the share of each group type relative to the overall group count.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Home;