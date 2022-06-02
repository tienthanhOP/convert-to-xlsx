import React, { useState } from "react";
import "./App.css";
import { Button, Empty, Form, Input, Space, Table, Typography } from "antd";

import { convertTextToObject, downloadXLSX } from "./utils";
const { Paragraph } = Typography;

const validateMessages = {
  required: "Bạn chưa nhập thông tin đơn hàng!",
};

const App = () => {
  const [form] = Form.useForm();
  const [orders, setOrders] = useState([]);

  const onPasteAndAdd = () => {
    navigator.clipboard.readText()
      .then(text => {
        form.setFieldsValue({
          order: text,
        });
      })
      .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

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

  const initialValues = {
    order: '',
  };

  return (
    <div className="App p-3">
      <div className="flex flex-row flex-1">
        <div className="flex-1">
          <Form
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}>
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
              <Button className="mr-1" type="primary" onClick={onPasteAndAdd}>
                Dán đơn hàng
              </Button>
              <Button className="ml-1" type="primary" htmlType="submit">
                Thêm đơn hàng
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Space
        style={{
          marginBottom: 16,
        }}
      >
        <Button onClick={() => downloadXLSX(orders)}>Tải về Excel</Button>
        <Button onClick={() => { }}>Xóa toàn bộ đơn</Button>
      </Space>
      <Table columns={columns} dataSource={orders} size={20} locale={{
        emptyText: <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={"Bé iu chưa thêm đơn hàng nào :("}
        />
      }} />
    </div>
  );
};

export default App;
