import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spin, Card, Carousel, List, Typography } from 'antd';
import PropTypes from 'prop-types';

import Navbar from '../layout/Navbar';

const { Item } = List;

function ItemDetailCard(props) {
  const { data } = props;
  const styles = {
    base: {
      fontFamily: 'Arial'
    },
    commonName: {
      fontFamily: 'Arial Black'
    },
    latinName: {
      fontStyle: 'italic'
    },
    normalText: {
      fontStyle: 'normal'
    },
    familyName: {
      fontVariant: 'small-caps'
    },
    keyIdFeatures: {
      fontFamily: 'Arial Black'
    },
    characteristics: {
      fontFamily: 'Arial Black'
    },
    bioticDisturbances: {
      fontFamily: 'Arial Black'
    },
    notes: {
      fontFamily: 'Arial Black'
    },
    noBullets: {
      listStyleType: 'none',
      margin: 0,
      padding: 0
    }
  };

  const renderCarousel = (photos) => {
    return (
      <Carousel autoplay dotPosition="top">
        {photos.map((p) => (
          <img alt={`${data.latinName}`} src={p.uri} />
        ))}
      </Carousel>
    );
  };

  return (
    <Card
      hoverable
      style={{ width: '100%', maxWidth: 800 }}
      cover={renderCarousel(data.photos)}
    >
      <List>
        <Item>
          <span style={{ ...styles.base, ...styles.latinName }}>
            {data.latinName}
          </span>
        </Item>
        <Item>
          <span style={{ ...styles.base, ...styles.commonName }}>
            {data.commonName}
          </span>
        </Item>
        <Item>
          <span style={{ ...styles.base, ...styles.familyName }}>
            {data.familyName}
          </span>
        </Item>
        <Item>
          <span style={{ ...styles.base, ...styles.keyIdFeatures }}>
            Key ID Features
          </span>
        </Item>
        <Item>
          <ul style={styles.noBullets}>
            {data.keyIdFeatures.map((f) => {
              return (
                <li
                  key={`keyID${f}`}
                  style={{ ...styles.base, ...styles.normalText }}
                >
                  {f}
                </li>
              );
            })}
          </ul>
        </Item>
        <Item>
          <span style={{ ...styles.base, ...styles.characteristics }}>
            Characteristics
          </span>
        </Item>
        <Item>
          <ul style={styles.noBullets}>
            {Object.entries(data.characteristics).map(([cKey, cVal]) => {
              let result = cKey.replace(/([A-Z])/g, ' $1');
              result = result.charAt(0).toUpperCase() + result.slice(1);
              return (
                <li
                  key={`characteristic${cKey}`}
                  style={{ ...styles.base, ...styles.normalText }}
                >
                  {`${result}: ${cVal}`}
                </li>
              );
            })}
          </ul>
        </Item>
        <Item>
          <span style={{ ...styles.base, ...styles.bioticDisturbances }}>
            Biotic Disturbances
          </span>
        </Item>
        {data.bioticDisturbances ? (
          <Item>
            <ul style={styles.noBullets}>
              {Object.entries(data.bioticDisturbances).map(([cKey, cVal]) => {
                let result = cKey.replace(/([A-Z])/g, ' $1');
                result = result.charAt(0).toUpperCase() + result.slice(1);
                return (
                  <li
                    key={`biotic${cKey}`}
                    style={{ ...styles.base, ...styles.normalText }}
                  >
                    {`${result}: ${cVal}`}
                  </li>
                );
              })}
            </ul>
          </Item>
        ) : null}
        <Item>
          <span style={{ ...styles.base, ...styles.notes }}>Notes</span>
        </Item>
        {data.notes ? (
          <Item>
            <span style={{ ...styles.base, ...styles.normalText }}>
              {data.notes}
            </span>
          </Item>
        ) : null}
      </List>
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
