import React, { useState } from "react";
import "./App.css";
import { Button, Form, Input, Table, Typography } from "antd";
import { convertTextToObject } from "./utils";
const { Paragraph } = Typography;

const validateMessages = {
  required: "Bạn chưa nhập thông tin đơn hàng!",
};

const columns = [
  {
    title: "Người nhận",
    dataIndex: "receiver",
    key: "receiver",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Thỉnh",
    dataIndex: "buying",
    key: "buying",
  },
  {
    title: "Phí ship",
    dataIndex: "freeship",
    key: "freeship",
  },
  {
    title: "Tổng giá",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Thông tin thanh toán",
    dataIndex: "paid",
    key: "paid",
  },
];

const App = () => {
  const [orders, setOrders] = useState([]);

  const onFinish = (value) => {
    try {
      setOrders([...orders, convertTextToObject(value.order)]);
    } catch (error) {
      alert(error);
    }
  };

  const _renderSample = () => {
    return (
      <Paragraph className="flex-1 justify-start items-start text-left">
        <pre>
          Vậy em chốt đơn của chị nhé
          <br />
          Thông tin đơn hàng
          <br />
          Người nhận: ...
          <br />
          Địa chỉ: ...
          <br />
          THỈNH: ...
          <br />
          Phí ship bên vận chuyển thu ạ
          <br />
          Chị kiểm tra lại giúp em xem thông tin đã chính xác chưa ạ, để em ship
          sớm cho chị nha
        </pre>
      </Paragraph>
    );
  };

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
              <Input.TextArea rows={10} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm đơn hàng
              </Button>
            </Form.Item>
          </Form>
        </div>
        {_renderSample()}
      </div>
      <Button type="primary" onClick={() => setOrders([])}>
        Clear
      </Button>
      <Table columns={columns} dataSource={orders} />
    </div>
  );
};

export default App;
