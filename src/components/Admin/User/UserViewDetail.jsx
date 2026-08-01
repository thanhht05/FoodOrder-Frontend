import {
  Button,
  Drawer,
  Descriptions,
  Avatar,
  Space,
  Typography,
  Divider,
} from "antd";
import dayjs from "dayjs";
const UserViewDetail = ({
  openViewDetail,
  setOpenViewDetail,
  userDataDetail,
  setUserDataDetail,
}) => {
  const { Title, Text } = Typography;

  const onClose = () => {
    setOpenViewDetail(false);
    setUserDataDetail(null);
  };
  return (
    <>
      <Drawer title="Chi tiết người dùng" onClose={onClose} open={openViewDetail}>
        {/* Header */}
        <Space align="center" style={{ marginBottom: 20 }}>
          {/* <Avatar size={64} icon={<UserOutlined />} /> */}
          <h2>Ảnh đại diện người dùng</h2> <br />
        </Space>

        <Divider />

        {/* Info */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="ID">{userDataDetail?.id}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">
            {userDataDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userDataDetail?.email}
          </Descriptions.Item>

          <Descriptions.Item label="Số điện thoại">
            {userDataDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm">
            {userDataDetail?.point}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {userDataDetail?.roleUser.name}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lúc">
            {dayjs(userDataDetail?.updatedAt).isValid()
              ? dayjs(userDataDetail?.updatedAt).format("DD/MM/YYYY HH:mm")
              : "Người dùng chưa được cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Tạo lúc">
            {dayjs(userDataDetail?.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default UserViewDetail;
