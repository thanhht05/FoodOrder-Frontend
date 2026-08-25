import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { callGetRevenueMonth } from "../../../services/api";

const RevenueChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchRevenue = async () => {
            const res = await callGetRevenueMonth();
            if (res?.data) {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const formattedData = res.data.map(item => ({
                    month: monthNames[item.month - 1],
                    revenue: item.revenue
                }));
                setChartData(formattedData);
            }
        };
        fetchRevenue();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;