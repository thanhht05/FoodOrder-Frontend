import React from 'react';
import { Card, Col, Row, Statistic, Table, List, Typography, Tag } from 'antd';
import {
    ShoppingCartOutlined,
    DollarCircleOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import OrderDistribution from "../../../components/Admin/Dashboard/OrderDistribution";
import RevenueChart from "../../../components/Admin/Dashboard/RevenueChart";

const { Title } = Typography;

const DashboardPage = () => {
    // Fake data for Recent Orders
    const recentOrdersData = [
        { key: '1', orderId: '#ORD001', customer: 'Nguyễn Văn A', total: '250,000 ₫', status: 'Hoàn thành', statusCode: 'success' },
        { key: '2', orderId: '#ORD002', customer: 'Trần Thị B', total: '120,000 ₫', status: 'Đang giao', statusCode: 'processing' },
        { key: '3', orderId: '#ORD003', customer: 'Lê Văn C', total: '450,000 ₫', status: 'Chờ duyệt', statusCode: 'warning' },
        { key: '4', orderId: '#ORD004', customer: 'Phạm Thị D', total: '300,000 ₫', status: 'Hoàn thành', statusCode: 'success' },
        { key: '5', orderId: '#ORD005', customer: 'Hoàng Văn E', total: '150,000 ₫', status: 'Đã hủy', statusCode: 'error' },
    ];

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

    // Fake data for Top Selling Items
    const topItemsData = [
        { name: 'Trà sữa Trân châu đường đen', sales: 120 },
        { name: 'Gà rán KFC', sales: 95 },
        { name: 'Pizza Hải sản', sales: 80 },
        { name: 'Hamburger Bò', sales: 65 },
        { name: 'Mì Ý Sốt Bò Bằm', sales: 50 },
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
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
                            value={1254}
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
                            value={125430000}
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
                            value={856}
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
                            value={45}
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
                <Col xs={24} lg={16}>
                    <Card title="Đơn hàng gần đây" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                        <Table
                            columns={recentOrdersColumns}
                            dataSource={recentOrdersData}
                            pagination={false}
                            size="middle"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Top món bán chạy" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={topItemsData}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <div style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                backgroundColor: index < 3 ? '#ffe58f' : '#f0f2f5',
                                                color: index < 3 ? '#faad14' : '#595959',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold'
                                            }}>
                                                {index + 1}
                                            </div>
                                        }
                                        title={<span style={{ fontWeight: 500 }}>{item.name}</span>}
                                        description={`Đã bán: ${item.sales} phần`}
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