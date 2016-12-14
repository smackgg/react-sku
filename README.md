# react-sku
react-SKUs
<a href="http://smackgg.github.io/react-sku" target="_blank">Here is demo</a>
# Demo & Examples

Clone this repo then run:

```javascript
npm install
npm start
```
Then open [`localhost:8080`](http://localhost:8080) in a browser.

# If you want to use this react-sku, your data should like these:

### Attributes (商品属性)
```json
[
  {
    "title": "Place of production",
    "childAttr": [{
      "title": "China",
      "id": 121
    }, {
      "title": "Korea",
      "id": 120
    }, {
      "title": "Indonesia",
      "id": 24
    }, {
      "title": "Japan",
      "id": 23
    }, {
      "title": "America",
      "id": 22
    }]
  },
  {
    "title": "Other",
    "childAttr": [{
      "title": "陈奕迅",
      "id": 20
    }, {
      "title": "陈冠希",
      "id": 19
    }]
  }
]
```

### stocks (库存)

```
[
  {
    "attribute": [{
      "title": "Color",
      "childAttr": {
        "title": "White",
        "id": 11
      }
    }, {
      "title": "Size",
      "childAttr": {
        "title": "41",
        "id": 13
      }
    }, {
      "title": "Other",
      "childAttr": {
        "title": "陈奕迅",
        "id": 20
      }
    }, {
      "title": "Place of production",
      "childAttr": {
        "title": "America",
        "id": 22
      }
    }],
    "price": 0.01,
    "count": 21
  },
  {
    "attribute": [{
      "title": "Color",
      "childAttr": {
        "title": "Blue",
        "id": 9
      }
    }, {
      "title": "Size",
      "childAttr": {
        "title": "42",
        "id": 14
      }
    }, {
      "title": "Other",
      "childAttr": {
        "title": "陈奕迅",
        "id": 20
      }
    }, {
      "title": "Place of production",
      "childAttr": {
        "title": "America",
        "id": 22
      }
    }],
    "price": 0.01,
    "count": 11
  }
]
```

