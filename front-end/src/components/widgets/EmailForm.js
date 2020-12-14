import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const EmailForm = (props) => {
  const onFinish = (values) => {
    axios
      .post('/api/users/forgot', values)
      .then((res) => {
        notification.open({
          message: 'Success',
          description:
            'You will receive an email with instructions to change your password shortly.'
        });
      })
      .catch((err) => {
        notification.open({
          message: 'Error',
          description: err.toString()
        });
      });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!'
          }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Reset my password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmailForm;
