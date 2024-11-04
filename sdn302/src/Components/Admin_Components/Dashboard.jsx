import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsFillBellFill } from 'react-icons/bs';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../../Styles/Admin_css/Dashboard.module.css';
import axios from 'axios';
import { BarChart, Bar, Rectangle, Legend } from 'recharts';

function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [totalPremiumGroups, setTotalPremiumGroups] = useState(0);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user and group counts
        const userResponse = await axios.get('http://localhost:9999/users/count-users');
        const groupResponse = await axios.get('http://localhost:9999/groups/count');
        const premiumGroupResponse = await axios.get('http://localhost:9999/groups/count-premium');
        setTotalUsers(userResponse.data.count);
        setTotalGroups(groupResponse.data.count);
        setTotalPremiumGroups(premiumGroupResponse.data.count);
    
        // Fetch all groups for bar chart data
        const allGroupsResponse = await axios.get('http://localhost:9999/groups/get-all-groups');
        const groupsData = allGroupsResponse.data;
    
        // Get current date and the date for 7 days ago in local timezone
        const now = new Date();
        now.setHours(now.getHours() + 7); // Adjust for Vietnam timezone
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6); // Include today, so subtract 6 days
    
        // Prepare data for the last 7 days
        const dateLabels = [];
        const premiumCounts = new Array(7).fill(0);
        const normalCounts = new Array(7).fill(0);
    
        for (let i = 0; i < 7; i++) {
          const day = new Date(sevenDaysAgo);
          day.setDate(sevenDaysAgo.getDate() + i);
          dateLabels.push(day.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }));
        }
    
        // Count premium and normal groups for each of the last 7 days
        groupsData.forEach(group => {
          const createdAtDate = new Date(group.createdAt);
          createdAtDate.setHours(createdAtDate.getHours() + 7); // Adjust for Vietnam timezone
          const dayDifference = Math.floor((createdAtDate - sevenDaysAgo) / (1000 * 60 * 60 * 24));
    
          if (dayDifference >= 0 && dayDifference < 7) {
            if (group.isPremium) {
              premiumCounts[dayDifference]++;
            } else {
              normalCounts[dayDifference]++;
            }
          }
        });
    
        // Prepare the bar chart data
        const preparedBarChartData = dateLabels.map((date, index) => ({
          name: date,
          premium: premiumCounts[index],
          normal: normalCounts[index],
        }));
    
        setBarChartData(preparedBarChartData);
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
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
          <h1>{totalPremiumGroups * 2000}</h1>
        </div>
      </div>

      <div className={styles.charts}>
        <div>
          <h3>Groups Created in Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="normal" fill="#8884d8" />
              <Bar dataKey="premium" fill="#82ca9d" />
            </BarChart>
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

