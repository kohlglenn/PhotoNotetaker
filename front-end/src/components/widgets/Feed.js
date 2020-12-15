import React, { useEffect, useState } from 'react';
import { List, message, Avatar, Spin, Card } from 'antd';
import axios from 'axios';

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import Item from 'antd/lib/list/Item';

const VirtualizedExample = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadedRowsMap = {};

  const fetchData = (callback) => {
    axios.get('api/feed').then((res) => {
      if (hasMore) {
        callback(res.data);
        setHasMore(!!res.data.next);
      }
    });
  };

  useEffect(() => {
    fetchData((res) => {
      setData(res.results);
    });
  }, []);

  const handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    setLoading(true);
    for (let i = startIndex; i <= stopIndex; i += 1) {
      // 1 means loading
      loadedRowsMap[i] = 1;
    }
    fetchData((res) => {
      setData([...data, ...res.results]);
      setLoading(false);
    });
  };

  const isRowLoaded = ({ index }) => !!loadedRowsMap[index];

  const renderItem = ({ index, key, style }) => {
    const item = data[index];
    return (
      <List.Item
        key={key}
        style={{ ...style, paddingLeft: 4, paddingRight: 4 }}
      >
        <List.Item.Meta
          avatar={<Avatar src={item.thumbnail} />}
          title={item.title}
          /* eslint-disable */
          description={item.description}
        />
        <div>Content</div>
      </List.Item>
    );
  };

  const vlist = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
    onRowsRendered,
    width
  }) => (
    <VList
      autoHeight
      height={height}
      isScrolling={isScrolling}
      onScroll={onChildScroll}
      overscanRowCount={2}
      rowCount={data.length}
      rowHeight={73}
      rowRenderer={renderItem}
      onRowsRendered={onRowsRendered}
      scrollTop={scrollTop}
      width={width}
    />
  );
  const autoSize = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
    onRowsRendered
  }) => (
    <AutoSizer disableHeight>
      {({ width }) =>
        vlist({
          height,
          isScrolling,
          onChildScroll,
          scrollTop,
          onRowsRendered,
          width
        })
      }
    </AutoSizer>
  );
  const infiniteLoader = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop
  }) => (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={handleInfiniteOnLoad}
      rowCount={data.length}
    >
      {({ onRowsRendered }) =>
        autoSize({
          height,
          isScrolling,
          onChildScroll,
          scrollTop,
          onRowsRendered
        })
      }
    </InfiniteLoader>
  );
  return (
    <List>
      {data.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
      {loading && <Spin className="demo-loading" />}
    </List>
  );
};

export default VirtualizedExample;
