import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 10
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const PasswordTokenForm = (props) => {
  const [form] = Form.useForm();

  const { history } = props;

  const { token } = useParams();

  const onFinish = (values) => {
    axios
      .patch(`/api/users/forgot/${token}`, values)
      .then((res) => {
        notification.open({
          message: 'Success',
          description: 'Redirecting to login screen...',
          duration: 1.9
        });
        setTimeout(() => {
          history.push('/');
        }, 2000);
      })
      .catch((err) => {
        notification.open({
          message: 'Connection Issues',
          description: err.toString()
        });
      });
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="change-password"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!'
          },
          {
            required: true,
            message: 'Please input your E-mail!'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!'
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two passwords that you entered do not match!')
              );
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};

PasswordTokenForm.propTypes = {
  history: PropTypes.object.isRequired
};

export default PasswordTokenForm;
