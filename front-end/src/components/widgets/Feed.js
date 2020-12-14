import React, { useEffect, useState } from 'react';
import { List, Spin, Card, notification } from 'antd';
import axios from 'axios';

import InfiniteScroll from 'react-infinite-scroller';

const InfiniteListExample = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = () => {
    axios
      .get('/api/feed')
      .then((res) => {
        if (res.results) {
          setData([...data, ...res.results]);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch((err) => {
        notification.open({
          message: 'Connection Issues',
          description: err.toString()
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    fetchData();
  };

  return (
    <div className="demo-infinite-container">
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
        <List
          // https://getbootstrap.com/docs/3.4/css/#grid-options
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card title={item.title}>Card content</Card>
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteListExample;
