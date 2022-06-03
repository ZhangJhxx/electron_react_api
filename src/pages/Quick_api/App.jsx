import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Select, Tabs } from 'antd';

import Addable_headers from "../../components/header/Headers.jsx";
import client from "../../utils/client.js";
import "./app.scss"
const { Option } = Select;
const { TabPane } = Tabs;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const App = () => {
  const parentRef = useRef();
  const onFinish = (values) => {
    const headers = parentRef.current.getHeaders();
    client(values.method, values.url, headers,(res)=>{
      const response_container = document.querySelector('.response_container');
      response_container.innerHTML = res;
    });
    console.log(values, headers);
  };
  return (
    <div className="quick_api_container">
      <div className="api_request_bar">
        <Form
          layout="inline"
          initialValues={{
            method: "GET",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="method"
          >
            <Select style={{ width: 120 }} onChange={handleChange}>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="url"
            placeholder="输入http或https起始的完整URL"
            rules={[
              {
                required: true,
                message: 'URL格式不正确，输入http或https起始的完整URL!',
              },
            ]}
          >
            <Input style={{ width: '400px' }} />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              发送
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="parameter">
        <Tabs defaultActiveKey="Tab_3" onChange={handleChange}>
          <TabPane tab="Params" key="Tab_1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Body" key="Tab_2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Headers" key="Tab_3">
            <Addable_headers ref={parentRef} />
          </TabPane>
        </Tabs>
      </div>
      <div className="response_container">

      </div>
    </div>

  )
};

export default App;