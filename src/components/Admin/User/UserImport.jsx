import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, notification, Table } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../services/api";

const UserImport = ({ openModalUpload, setOpenModalUpload, fetchUser }) => {
  const [dataExcel, setDataExcel] = useState([]);

  const handleOk = async () => {
    // add password for user
    const data = dataExcel.map((item) => ({
      ...item,
      password: "123456",
      role: {
        id: 1,
      },
    }));

    const res = await callBulkCreateUser(data);

    if (res && res.data) {
      const { success, failed, total } = res.data;

      if (success.length === total) {
        //  all users are imported
        // console.log("All users created successfully");
        message.success(`Tạo thành công ${total} user`);
        setDataExcel([]);
        await fetchUser();
        setOpenModalUpload(false);
      } else if (success.length > 0) {
        // some user are successfully imported and failure
        // console.log(`Success: ${success.length}, Failed: ${failed.length}`);
        // console.log("Failed list:", failed);
        notification.warning({
          message: "Tạo user một phần",
          description: (
            <>
              <div>✅ Thành công: {success.length}</div>
              <div>❌ Thất bại: {failed.length}</div>
              <div>Email lỗi: {failed.map((f) => f.email).join(", ")}</div>
            </>
          ),
          duration: 5,
        });
        setDataExcel([]);
        await fetchUser();
        setOpenModalUpload(false);
      } else {
        // all user are falure import
        // console.log("All users failed");
        // console.log("Reason:", failed);
        notification.error({
          message: "Tạo user thất bại",
          description: (
            <>
              <div>CÓ lỗi xảy ra</div>
              <div>{failed.map((f) => f.email).join(", ")}</div>
            </>
          ),
          duration: 5,
        });
        setDataExcel([]);
        setOpenModalUpload(false);
      }
    }

    setOpenModalUpload(false);
  };
  const handleCancel = () => {
    setOpenModalUpload(false);
    setDataExcel([]);
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const propsUserUpload = {
    name: "file",
    multiple: true,
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    customRequest: dummyRequest,

    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file);
        // console.log("infor list", info.fileList[0].originFileObj);
      }
      if (status === "done") {
        // console.log(info.fileList);
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1, //skip header row
            });
            if (json && json.length > 0) setDataExcel(json);
          };
        }
        message.success(`${info.file.name} tải lên file thành công.`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên file thất bại.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
  ];
  return (
    <>
      <Modal
        title="Nhập dữ liệu người dùng"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openModalUpload}
        onOk={handleOk}
        okText="Nhập dữ liệu"
        onCancel={handleCancel}
      >
        <Dragger {...propsUserUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo thả file vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ tải lên file đơn hoặc số lượng lớn. Nghiêm cấm tải lên dữ liệu công ty hoặc các tập tin bị cấm khác.
          </p>
        </Dragger>

        <>
          <Table
            title={() => <span>Dữ liệu upload</span>}
            dataSource={dataExcel}
            columns={columns}
          />
          ;
        </>
      </Modal>
    </>
  );
};

export default UserImport;
