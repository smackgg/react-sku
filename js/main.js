import React from 'react';
import SKUs from './skus';
import ReactDOM from 'react-dom';

// Test data
// 商品属性数据
import attributes from '../testData/attributes';
// 商品库存数据
import stocks from '../testData/stocks';

// style
import '../style/style.scss';

ReactDOM.render(<SKUs {...{ attributes, stocks }} />, document.getElementById('app'));
