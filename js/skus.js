import React, { PropTypes } from 'react';
import { Button, Card, message, Modal } from 'antd';

class SKUs extends React.Component {
  constructor(props) {
    super(props);

    this.attributes = props.attributes;
    this.stocks = props.stocks;
    this.state = {
      selectedTemp: {}, // 存放被选中的attribute
      attributes: this.attributes,
      price: '',  // 总价格
      count: 0, // 总数量
      submitalbe: false,
    };
    this.skuResult = this.initSKU();
  }

  componentWillMount() {
    this.skuHandler();
  }

  getFlagArrs(m, n) {
    if (!n || n < 1) {
      return [];
    }
    const resultArrs = [];
    const flagArr = [];
    let isEnd = false;
    let leftCnt;
    for (let i = 0; i < m; i++) {
      flagArr[i] = i < n ? 1 : 0;
    }
    resultArrs.push(flagArr.concat());
    while (!isEnd) {
      leftCnt = 0;
      for (let i = 0; i < m - 1; i++) {
        if (flagArr[i] === 1 && flagArr[i + 1] === 0) {
          for (let j = 0; j < i; j++) {
            flagArr[j] = j < leftCnt ? 1 : 0;
          }
          flagArr[i] = 0;
          flagArr[i + 1] = 1;
          const aTmp = flagArr.concat();
          resultArrs.push(aTmp);
          if (aTmp.slice(-n).join('').indexOf('0') === -1) {
            isEnd = true;
          }
          break;
        }
        flagArr[i] === 1 && leftCnt++;
      }
    }
    return resultArrs;
  }

  arrayCombine(targetArr) {
    if (!targetArr || !targetArr.length) {
      return [];
    }
    const len = targetArr.length;
    const resultArrs = [];
    for (let n = 1; n < len; n++) {
      const flagArrs = this.getFlagArrs(len, n);
      while (flagArrs.length) {
        const flagArr = flagArrs.shift();
        const combArr = targetArr.reduce((combArr, m, index) => {
          flagArr[index] && combArr.push(m);
          return combArr;
        }, []);
        resultArrs.push(combArr);
      }
    }
    return resultArrs;
  }

  // 字典查询 字典生成
  initSKU() {
    const data = this.stocks.reduce((obj, item) => {
      const object = Object.assign({}, obj);
      const total = item.attribute.reduce((arr, m) => {
        arr.push(m.childAttr.id);
        return arr;
      }, []);
      object[total.join(';')] = Object.assign({}, item);
      return object;
    }, {});
    const SKUResult = {};

    // const skuKeys = Object.keys(data).map((key) => key);
    // 需要剔除count为 0 的库存
    const skuKeys = Object.keys(data).reduce((arr, key) => {
      if (data[key].count > 0) {
        arr.push(key);
      }
      return arr;
    }, []);

    const _this = this;
    skuKeys.forEach((skuKey) => {
      const sku = data[skuKey];
      const skuKeyAttrs = skuKey.split(';');
      const combArr = _this.arrayCombine(skuKeyAttrs);
      for (let j = 0; j < combArr.length; j++) {
        const key = combArr[j].join(';');
        if (SKUResult[key]) {
          SKUResult[key].count += sku.count;
          SKUResult[key].prices.push(sku.price);
        } else {
          SKUResult[key] = {
            count: sku.count,
            prices: [sku.price],
            id: [sku.id],
          };
        }
      }
      SKUResult[skuKey] = {
        count: sku.count,
        prices: [sku.price],
        id: [sku.id],
      };
    });
    return SKUResult;
  }

  // 处理sku数据
  skuHandler() {
    const selectedTemp = this.state.selectedTemp || {};
    const attributes = this.state.attributes;
    const skuResult = this.skuResult;
    const nextState = {};
    // 根据已选中的selectedTemp，生成字典查询selectedIds
    const selectedIds = Object.keys(selectedTemp).reduce((arr, m) => {
      if (selectedTemp[m]) {
        arr.push(selectedTemp[m].id);
      }
      return arr;
    }, []);
    selectedIds.sort((value1, value2) => parseInt(value1, 10) - parseInt(value2, 10));

    // 处理attributes数据，根据字典查询结果计算当前选择情况的价格范围以及总数量。
    // 并添加selected属性，用于render判断。
    attributes.forEach((m) => {
      let selectedObjId;
      m.childAttr.forEach((a) => {
        a.selected = !!(selectedTemp[m.title] && selectedTemp[m.title].id === a.id);
        if (!a.selected) {
          let testAttrIds = [];
          if (selectedTemp[m.title]) {
            selectedObjId = selectedTemp[m.title].id;
            for (let i = 0; i < selectedIds.length; i++) {
              (selectedIds[i] !== selectedObjId) && testAttrIds.push(selectedIds[i]);
            }
          } else {
            testAttrIds = selectedIds.concat();
          }
          testAttrIds = testAttrIds.concat(a.id);
          testAttrIds.sort((value1, value2) => parseInt(value1, 10) - parseInt(value2, 10));
          a.unselectable = !skuResult[testAttrIds.join(';')];
        }
      });
    });
    nextState.submitalbe = false;
    if (skuResult[selectedIds.join(';')]) {
      const prices = skuResult[selectedIds.join(';')].prices;
      const max = Math.max.apply(Math, prices);
      const min = Math.min.apply(Math, prices);
      nextState.price = max === min ? max : `${min}~${max}`;
      if (selectedIds.length === attributes.length) {
        nextState.submitalbe = true;
        nextState.price = skuResult[selectedIds.join(';')].prices[0];
      }
      nextState.count = skuResult[selectedIds.join(';')].count;
    } else {
      nextState.count = this.stocks.reduce((count, item) => count + item.count, 0);
    }
    Object.keys(nextState).length > 0 && this.setState(nextState);
  }
  clickHandler(item) {
    const attributes = this.state.attributes;
    const selectedTemp = this.state.selectedTemp;

    attributes.forEach((info) => {
      if (selectedTemp[info.title] && selectedTemp[info.title].id === item.id) {
        selectedTemp[info.title] = null;
      } else {
        info.childAttr.forEach((c) => {
          if (c.id === item.id) {
            c.selected = false;
            selectedTemp[info.title] = {};
            selectedTemp[info.title].title = c.title;
            selectedTemp[info.title].id = c.id;
          }
        });
      }
    });

    this.setState({
      selectedTemp,
    });

    this.skuHandler();
  }

  submit(content) {
    const confirmOptions = {
      title: 'Are you sure submit?',
      content,
      onCancel() {
        message.success('Cancel', 3);
      },
      onOk() {
        message.success('Submit success', 3);
      },
      okText: 'OK',
      cancelText: 'CANCEL',
    };

    Modal.confirm(confirmOptions);
  }

  render() {
    const attributes = this.state.attributes;
    return (
      <div className="skus">
        {
          attributes.map((attribute, index) =>
            <Card title={attribute.title} key={index} style={{ width: 500 }}>
              <div className="layout layout-align-space-around">
                {attribute.childAttr.map(
                  (item, i) => {
                    const buttonType = item.selected ? 'primary' : 'ghost';
                    if (item.unselectable) {
                      return <Button type={buttonType} disabled key={i}>{item.title}</Button>;
                    }
                    return <Button type={buttonType} onClick={ () => this.clickHandler(item) } key={i}>{item.title}</Button>;
                  }
                )}
              </div>
            </Card>
          )
        }
        <Card title="Result" style={{ width: 500 }}>
        <div className="layout-align-space-around">
        <p><span>价格：</span><span>{this.state.price}</span></p>
        <p><span>库存：</span><span>{this.state.count}</span></p>
          {
            (() => {
              if (!this.state.submitalbe) {
                return <Button type="ghost" disabled>Submit</Button>;
              }
              const selectedTemp = this.state.selectedTemp;
              const selectedText = Object.keys(selectedTemp).reduce((str, item) => `${str} ${item}-${selectedTemp[item].title}`, '');
              const confirmText = `You choosed: ${selectedText};Stock on hand: ${this.state.count};Total Fee: ${this.state.price};`;
              return (
                <Button type="ghost" onClick={() => this.submit(confirmText)}>Submit</Button>
              );
            })()
          }
        </div>
        </Card>
      </div>
    );
  }
}
SKUs.propTypes = {
  attributes: PropTypes.array,
  stocks: PropTypes.array,
};

export default SKUs;
