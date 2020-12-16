import React, { useState } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';

import { registerUser } from '../../actions/authActions';

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

const RegistrationForm = (props) => {
  const { modalVisible } = props;
  const [form] = Form.useForm();

  const { history } = props;

  const onFinish = (values) => {
    props.registerUser(values, history);
    // axios
    //   .post('api/users/signup', values)
    //   .then((res) => history.push('/'))
    //   .catch((err) => console.log(err.toString()));
    // console.log('Received values of form: ', values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
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
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!'
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

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error('Should accept agreement'))
          }
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          <span style={{ marginRight: -12 }}>I have read the</span>
          <Button size="sm" onClick={() => modalVisible(true)} type="link">
            agreement
          </Button>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

RegistrationForm.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  modalVisible: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(RegistrationForm);
