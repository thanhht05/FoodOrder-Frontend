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
import { useTranslation } from "../../../i18n";
const UserViewDetail = ({
  openViewDetail,
  setOpenViewDetail,
  userDataDetail,
  setUserDataDetail,
}) => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();

  const onClose = () => {
    setOpenViewDetail(false);
    setUserDataDetail(null);
  };
  return (
    <>
      <Drawer title={t("admin.user.detailDrawerTitle")} onClose={onClose} open={openViewDetail}>
        {/* Header */}
        <Space align="center" style={{ marginBottom: 20 }}>
          {/* <Avatar size={64} icon={<UserOutlined />} /> */}
          <h2>{t("admin.user.avatarHeader")}</h2> <br />
        </Space>

        <Divider />

        {/* Info */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label={t("admin.user.colId")}>{userDataDetail?.id}</Descriptions.Item>
          <Descriptions.Item label={t("admin.user.colFullName")}>
            {userDataDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label={t("admin.user.colEmail")}>
            {userDataDetail?.email}
          </Descriptions.Item>

          <Descriptions.Item label={t("admin.user.colPhone")}>
            {userDataDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label={t("admin.user.pointLabel")}>
            {userDataDetail?.point}
          </Descriptions.Item>
          <Descriptions.Item label={t("admin.user.colRole")}>
            {userDataDetail?.roleUser.name}
          </Descriptions.Item>
          <Descriptions.Item label={t("admin.voucher.updatedAtLabel")}>
            {dayjs(userDataDetail?.updatedAt).isValid()
              ? dayjs(userDataDetail?.updatedAt).format("DD/MM/YYYY HH:mm")
              : t("admin.user.notUpdatedYet")}
          </Descriptions.Item>
          <Descriptions.Item label={t("admin.voucher.createdAtLabel")}>
            {dayjs(userDataDetail?.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default UserViewDetail;
