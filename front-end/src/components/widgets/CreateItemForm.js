/* eslint-disable */
import React, { useEffect, useState } from 'react';
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
  AutoComplete,
  Upload,
  Modal,
  Space
} from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { registerUser } from '../../actions/authActions';

const { Option } = Select;

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

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []
  };

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let result = reader.result;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.thumbUrl,
      previewVisible: true
    });
  };

  handleUpload = ({ fileList }) => {
    //---------------^^^^^----------------
    // this is equivalent to your "const img = event.target.files[0]"
    // here, antd is giving you an array of files, just like event.target.files
    // but the structure is a bit different that the original file
    // the original file is located at the `originFileObj` key of each of this files
    // so `event.target.files[0]` is actually fileList[0].originFileObj
    // console.log('fileList', fileList);

    // you store them in state, so that you can make a http req with them later
    this.setState({ fileList });
    this.props.setImages(fileList);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          listType="picture-card"
          fileList={fileList}
          previewFile={this.getBase64}
          onPreview={this.handlePreview}
          onChange={this.handleUpload}
          beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
        >
          {uploadButton}
        </Upload>

        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

const ArrayEntryTwoColumn = (props) => {
  const { keys, name, label1, label2 } = props;

  return (
    <>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) => {
                    let flag = true;
                    Object.keys(prevValues).forEach((k) => {
                      if (prevValues[k] !== curValues[k]) {
                        flag = false;
                      }
                    });
                    return flag;
                  }}
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label={label1}
                      name={[field.name, 'key']}
                      fieldKey={[field.fieldKey, 'key']}
                      rules={[{ required: true, message: `Missing ${label1}` }]}
                    >
                      <Select style={{ width: 130 }}>
                        {keys.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>
                <Form.Item
                  {...field}
                  label={label2}
                  name={[field.name, 'value']}
                  fieldKey={[field.fieldKey, 'value']}
                  rules={[{ required: true, message: `Missing ${label2}` }]}
                >
                  <Input />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                {`Add ${label1}`}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};

const ArrayEntryOneColumn = (props) => {
  const { name, label1 } = props;

  return (
    <>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  {...field}
                  label={label1}
                  name={[field.name, 'value']}
                  fieldKey={[field.fieldKey, 'value']}
                  rules={[{ required: true, message: `Missing ${label1}` }]}
                >
                  <Input />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                {`Add ${label1}`}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
};

const CHARACTERISTICS = {
  Type: 'type',
  'Mature Height': 'matureHeight',
  'Mature Spread': 'matureSpread',
  Form: 'form',
  'Leaf Arrangement': 'leafArrangement',
  'Bud Arrangement': 'budArrangement',
  'Flowers, Fruits & Cones': 'flowersFruitCones',
  'Soil & Sun Requirements': 'soilSunRequirements',
  Use: 'use',
  Limitations: 'limitations'
};

const BIOTIC_DISTURBANCES = {
  Signs: 'signs',
  Symptoms: 'symptoms',
  'Management Strategy': 'managementStrategy'
};

const RegistrationForm = (props) => {
  const { modalVisible } = props;
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({});

  const { history } = props;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation(coords);
    });
  }, []);

  const onFinish = (values) => {
    console.log(values);
    let tempCharacteristics = {};
    values.characteristics.forEach((c) => {
      console.log(c.key);
      tempCharacteristics[CHARACTERISTICS[c.key]] = c.value;
    });
    values.characteristics = tempCharacteristics;
    let tempBioticDisturbances = {};
    values.bioticDisturbances.forEach((b) => {
      tempBioticDisturbances[BIOTIC_DISTURBANCES[b.key]] = b.value;
    });
    values.bioticDisturbances = tempBioticDisturbances;
    let formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image.originFileObj);
    });
    Object.keys(values).forEach((key) => {
      formData.set(key, values[key]);
    });
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(function (result) {
          if (result.state === 'granted') {
            formData.set('location', location);
            console.log(location);
          }
        });
    } else {
      alert('Sorry Not available!');
    }

    axios
      .post('/api/create', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        }
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err.toString()));
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="createTree"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item>
        <PicturesWall images={images} setImages={setImages} />
      </Form.Item>

      {/* TODO: Error checking that this is unique done serverside */}
      <Form.Item name="latinName" label="Latin Name">
        <Input />
      </Form.Item>

      <Form.Item name="commonName" label="Common Name">
        <Input />
      </Form.Item>

      <Form.Item name="familyName" label="Family Name">
        <Input />
      </Form.Item>

      <Form.Item label="Key ID Features">
        <ArrayEntryOneColumn name={'keyIdFeatures'} label1={'ID'} />
      </Form.Item>

      <Form.Item label="Characteristics">
        <ArrayEntryTwoColumn
          keys={Object.keys(CHARACTERISTICS)}
          name={'characteristics'}
          label1={'Characteristic'}
          label2={'Value'}
        />
      </Form.Item>

      <Form.Item label="Biotic Disturbances">
        <ArrayEntryTwoColumn
          keys={Object.keys(BIOTIC_DISTURBANCES)}
          name={'bioticDisturbances'}
          label1={'Biotic Disturbance'}
          label2={'Value'}
        />
      </Form.Item>

      <Form.Item name="notes" label="Notes">
        <Input.TextArea autoSize={{ minRows: 2 }} />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Create Tree
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
