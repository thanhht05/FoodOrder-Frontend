import React, { useState, useEffect } from 'react';
import {
    Pie,
    PieChart,
    Sector,
    Tooltip,
    Cell,
    ResponsiveContainer
} from "recharts";
import { Spin } from "antd";
import { callCountOrderStatus } from '../../../services/api';
import i18n, { useTranslation } from '../../../i18n';

const COLORS = ['#52c41a', '#1890ff', '#faad14', '#f5222d', '#13c2c2', '#eb2f96'];

const STATUS_CODE_COLORS = {
    'PENDING': '#faad14',
    'CONFIRMED': '#1890ff',
    'SHIPPING': '#13c2c2',
    'DELIVERED': '#52c41a',
    'COMPLETED': '#52c41a',
    'CANCELLED': '#f5222d',
};

const renderActiveShape = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
}) => {
    const RADIAN = Math.PI / 180;

    const sin = Math.sin(-RADIAN * (midAngle ?? 1));
    const cos = Math.cos(-RADIAN * (midAngle ?? 1));

    const sx =
        (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;

    const sy =
        (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;

    const mx =
        (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;

    const my =
        (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;

    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    const textAnchor = cos >= 0 ? "start" : "end";

    return (
        <g>
            {/* Center text */}
            <text
                x={cx}
                y={cy}
                dy={8}
                textAnchor="middle"
                fill={fill}
                style={{ fontWeight: 'bold', fontSize: '16px' }}
            >
                {payload.name}
            </text>

            {/* Main sector */}
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />

            {/* Active sector border */}
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={(outerRadius ?? 0) + 6}
                outerRadius={(outerRadius ?? 0) + 10}
                fill={fill}
            />

            {/* Connecting line */}
            <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={fill}
                fill="none"
            />

            {/* Circle */}
            <circle
                cx={ex}
                cy={ey}
                r={2}
                fill={fill}
                stroke="none"
            />

            {/* Value */}
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                textAnchor={textAnchor}
                fill="#333"
                style={{ fontWeight: 500 }}
            >
                {`${value} ${i18n.t('admin.dashboard.ordersUnit')}`}
            </text>

            {/* Percentage */}
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={textAnchor}
                fill="#999"
            >
                {`(${((percent ?? 1) * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

const OrderDistribution = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isAnimationActive = true;

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return t('admin.dashboard.statusPending');
            case 'CONFIRMED': return t('admin.dashboard.statusConfirmed');
            case 'SHIPPING': return t('admin.dashboard.statusShipping');
            case 'DELIVERED': return t('admin.dashboard.statusDelivered');
            case 'COMPLETED': return t('admin.dashboard.statusCompleted');
            case 'CANCELLED': return t('admin.dashboard.statusCancelled');
            default: return status;
        }
    };

    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const response = await callCountOrderStatus();
                if (response.data) {
                    setRawData(response.data);
                }
            } catch (error) {
                console.error("Error fetching order status count:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatus();
    }, []);

    const data = rawData.map(item => ({
        rawStatus: item.orderStatus,
        name: getStatusLabel(item.orderStatus),
        value: item.count
    }));

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const totalOrders = data.reduce((sum, item) => sum + item.value, 0);

    if (loading) {
        return (
            <div style={{ width: '100%', height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div style={{ width: '100%', height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>{t('admin.dashboard.noData')}</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={350}>
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="70%"
                        dataKey="value"
                        isAnimationActive={isAnimationActive}
                        onMouseEnter={onPieEnter}
                    >
                        {data.map((entry, index) => {
                            const cellColor = STATUS_CODE_COLORS[entry.rawStatus] || COLORS[index % COLORS.length];
                            return <Cell key={`cell-${index}`} fill={cellColor} />;
                        })}
                    </Pie>
                    <Tooltip content={() => null} />
                </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '16px',
                padding: '0 16px'
            }}>
                {data.map((entry, index) => {
                    const percent = totalOrders === 0 ? "0.0" : ((entry.value / totalOrders) * 100).toFixed(1);
                    const dotColor = STATUS_CODE_COLORS[entry.rawStatus] || COLORS[index % COLORS.length];
                    return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '14px',
                                height: '14px',
                                backgroundColor: dotColor,
                                borderRadius: '4px'
                            }} />
                            <span style={{ fontSize: '14px', color: '#595959' }}>
                                {entry.name}: <strong style={{ color: '#262626' }}>{entry.value}</strong> ({percent}%)
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OrderDistribution;