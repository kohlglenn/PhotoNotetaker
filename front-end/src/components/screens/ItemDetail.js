import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spin, Card, Carousel, List } from 'antd';
import PropTypes from 'prop-types';

import Navbar from '../layout/Navbar';

const { Item } = List;

function ItemDetailCard(props) {
  const { data } = props;

  const renderCarousel = (photos) => {
    return (
      <Carousel autoplay>
        {photos.map((p) => (
          <img alt={`${data.latinName}`} src={p.uri} />
        ))}
      </Carousel>
    );
  };

  const list = [];
  Object.entries(data).forEach(([k, v]) => {
    switch (k) {
      case 'photos':
      case 'commonName':
      case 'latinName':
        break;
      case 'characteristics':
      case 'bioticDisturbances':
        list.push(<Item>{`${k}:`}</Item>);
        Object.entries(data[k]).forEach(([k2, v2]) => {
          list.push(<Item>{`${k2}: ${v2}`}</Item>);
        });
        break;
      default:
        list.push(<Item>{`${k}: ${v}`}</Item>);
    }
  });

  return (
    <Card
      hoverable
      style={{ width: '100%', maxWidth: 500 }}
      cover={renderCarousel(data.photos)}
    >
      <Card.Meta title={data.commonName} description={data.latinName} />
      <List>{list}</List>
    </Card>
  );
}

ItemDetailCard.propTypes = {
  data: PropTypes.object.isRequired
};

function ItemDetail(props) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const { username, latinName } = useParams();

  const fetchData = () => {
    axios.get(`api/feed/${username}/${latinName}`).then((res) => {
      console.log(res.data.results);
      setData(res.data.results);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Navbar {...props}>
      {!loading && <ItemDetailCard data={data} />}
      {loading && <Spin className="demo-loading" />}
    </Navbar>
  );
}

export default ItemDetail;
