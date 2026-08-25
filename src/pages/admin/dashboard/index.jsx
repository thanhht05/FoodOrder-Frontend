import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, List, Typography, Tag, Avatar } from 'antd';
import {
    ShoppingCartOutlined,
    DollarCircleOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import OrderDistribution from "../../../components/Admin/Dashboard/OrderDistribution";
import RevenueChart from "../../../components/Admin/Dashboard/RevenueChart";
import { callStatisticOverview, callGetLatestOrder, callGetTopProduct } from '../../../services/api';

const { Title } = Typography;

const DashboardPage = () => {
    const [statisticOverview, setStatisticOverview] = useState();
    const [recentOrdersData, setRecentOrdersData] = useState([]);
    const [topItemsData, setTopItemsData] = useState([]);


    const recentOrdersColumns = [
        { title: 'Mã đơn', dataIndex: 'orderId', key: 'orderId', fontWeight: 'bold' },
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
        { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <Tag color={record.statusCode}>{text}</Tag>
            )
        },
    ];


    useEffect(() => {
        const fetchDashboardData = async () => {
            const resStat = await callStatisticOverview();
            if (resStat?.data) {
                setStatisticOverview(resStat.data);
            }

            const resOrder = await callGetLatestOrder();
            if (resOrder?.data) {
                const formattedOrders = resOrder.data.map((order) => {
                    let statusText = order.orderStatus;
                    let statusCode = 'default';

                    if (order.orderStatus === 'PENDING') {
                        statusText = 'Chờ duyệt';
                        statusCode = 'warning';
                    } else if (order.orderStatus === 'CONFIRMED') {
                        statusText = 'Hoàn thành';
                        statusCode = 'success';
                    } else if (order.orderStatus === 'CANCELLED') {
                        statusText = 'Đã hủy';
                        statusCode = 'error';
                    }

                    return {
                        key: order.id,
                        orderId: '#' + order.id,
                        customer: order.fullName,
                        total: `${new Intl.NumberFormat('vi-VN').format(order.totalAmount)} ₫`,
                        status: statusText,
                        statusCode: statusCode
                    };
                });
                setRecentOrdersData(formattedOrders);
            }

            const resTop = await callGetTopProduct();
            if (resTop?.data) {
                setTopItemsData(resTop.data);
            }
        };
        fetchDashboardData();
    }, []);


    return (
        <div style={{ marginTop: '20px', padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: '24px' }}>Tổng quan hệ thống</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #e6f7ff 0%, #bae0ff 100%)',
                        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
                        border: '1px solid #91caff'
                    }}>
                        <Statistic
                            title={<span style={{ color: '#0050b3', fontWeight: 500, fontSize: '15px' }}>Tổng đơn hàng</span>}
                            value={statisticOverview?.totalOrder}
                            valueStyle={{ color: '#0050b3', fontWeight: 'bold', fontSize: '28px' }}
                            prefix={<ShoppingCartOutlined style={{ marginRight: '8px' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                        boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)',
                        border: '1px solid #b7eb8f'
                    }}>
                        <Statistic
                            title={<span style={{ color: '#237804', fontWeight: 500, fontSize: '15px' }}>Tổng doanh thu</span>}
                            value={statisticOverview?.totalRevenue}
                            valueStyle={{ color: '#237804', fontWeight: 'bold', fontSize: '28px' }}
                            prefix={<DollarCircleOutlined style={{ marginRight: '8px' }} />}
                            suffix="₫"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                        boxShadow: '0 4px 12px rgba(114, 46, 209, 0.15)',
                        border: '1px solid #d3adf7'
                    }}>
                        <Statistic
                            title={<span style={{ color: '#391085', fontWeight: 500, fontSize: '15px' }}>Tổng khách hàng</span>}
                            value={statisticOverview?.totalUser}
                            valueStyle={{ color: '#391085', fontWeight: 'bold', fontSize: '28px' }}
                            prefix={<UserOutlined style={{ marginRight: '8px' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)',
                        boxShadow: '0 4px 12px rgba(250, 173, 20, 0.15)',
                        border: '1px solid #ffe58f'
                    }}>
                        <Statistic
                            title={<span style={{ color: '#ad6800', fontWeight: 500, fontSize: '15px' }}>Đơn hàng chờ duyệt</span>}
                            value={statisticOverview?.pendingOrder}
                            valueStyle={{ color: '#ad6800', fontWeight: 'bold', fontSize: '28px' }}
                            prefix={<ClockCircleOutlined style={{ marginRight: '8px' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={14}>
                    <Card title="Doanh thu theo tháng" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                        <RevenueChart />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Phân bố đơn hàng" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <OrderDistribution />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={14}>
                    <Card title="Đơn hàng gần đây" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                        <Table
                            columns={recentOrdersColumns}
                            dataSource={recentOrdersData}
                            pagination={false}
                            size="middle"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={10}>
                    <Card title="Top món bán chạy" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={topItemsData}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item.img}`}
                                                size={40}
                                            />
                                        }
                                        title={<span style={{ fontWeight: 500 }}>{item.name}</span>}
                                        description={`Đã bán: ${item.sold} phần`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;