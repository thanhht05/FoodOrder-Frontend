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
  console.log(userDataDetail);
  return (
    <>
      <Button type="primary">Open</Button>
      <Drawer title="User Detail" onClose={onClose} open={openViewDetail}>
        {/* Header */}
        <Space align="center" style={{ marginBottom: 20 }}>
          {/* <Avatar size={64} icon={<UserOutlined />} /> */}
          <h2>This is for user avatar </h2> <br />
        </Space>

        <Divider />

        {/* Info */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="ID">{userDataDetail?.id}</Descriptions.Item>
          <Descriptions.Item label="Fullname">
            {userDataDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userDataDetail?.email}
          </Descriptions.Item>

          <Descriptions.Item label="Telephone">
            {userDataDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            {userDataDetail?.roleUser.name}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {dayjs(userDataDetail?.updatedAt).isValid()
              ? dayjs(userDataDetail?.updatedAt).format("DD/MM/YYYY HH:mm")
              : "User chưa được cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {dayjs(userDataDetail?.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default UserViewDetail;
