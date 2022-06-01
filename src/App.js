import React, { useState } from "react";
import "./App.css";
import { Button, Form, Input, Table, Typography } from "antd";

import { convertTextToObject, downloadXLSX } from "./utils";
const { Paragraph } = Typography;

const validateMessages = {
  required: "Bạn chưa nhập thông tin đơn hàng!",
};

const App = () => {
  const [orders, setOrders] = useState([]);

  const onFinish = (value) => {
    try {
      setOrders([...orders, convertTextToObject(value.order)]);
    } catch (error) {
      alert(error);
    }
  };

  const onDelete = (id) => {
    setOrders(orders.filter(e => e.id !== id))
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (value, item, index) => index + 1
    },
    {
      title: "Mã vận đơn",
      dataIndex: "freeship",
      key: "freeship",
    },
    {
      title: "Họ và tên",
      dataIndex: "receiver",
      key: "receiver",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Chi tiết",
      dataIndex: "buying",
      key: "buying",
    },
    {
      title: "Tiền",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "",
      dataIndex: "delete",
      key: "delete",
      render: (value, item) => <a onClick={() => onDelete(item.id)}>Xóa</a>
    },
  ];

  return (
    <div className="App p-3">
      <div className="flex flex-row flex-1">
        <div className="flex-1 mr-2">
          <Form onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
              name={"order"}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={8} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm đơn hàng
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Button className="mb-2" type="primary" onClick={() => downloadXLSX(orders)}>
        Tải về
      </Button>
      <Table columns={columns} dataSource={orders} size={100} />
    </div>
  );
};

export default App;
