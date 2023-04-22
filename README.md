linked lazy fetch!
===

[![typescript](https://img.shields.io/badge/-npm-black?logo=npm)](https://www.npmjs.com/package/linkfetch) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)

* Supports Lazy fetch with field access.
* You can fetch by accessing the $fieldName.  (prefix: '$')
  * ex) fetchObject.$fieldName()  ← Promise Object
* value is automatically assigned to the field variable after fetch.
  * ex) fetchObject.fieldName

# 🚀 Quick start  install

```bash
npm install linkfetch
```

## linkfetch document protocol

```json
{
  "_$ref": "lazy end point"
}
```

# remote fetch

```typescript
import { FetchObjectType, linkFetch } from 'linkfetch';

type Data = {
  name: string;
  product1: { id: number, title: string, description: string };
}

const data: FetchObjectType<Data> = {
  name: 'my name is dom-render',
  product1: {_$ref: 'https://dummyjson.com/products/1'}
}

const fetchObject = linkFetch<Data, Config>(data, (data, config) => fetch(data.doc!._$ref, {method: 'GET'}).then(it => it.json()));

const product1 = await fetchObject.$product1();  // lazy fetch

console.log(product1); // or console.log(fetchObject.product1)
JSON.stringify(fetchObject) // {...}
```

# local fetch

```typescript
import { FetchObjectType, linkFetch } from 'linkfetch';

type Data = {
  name: string;
  product: {
    products: { title: string, category: string }[];
    total: number;
    skip: number;
    limit: number
  };
}
const data: FetchObjectType<Data> = {
  name: 'my name is dom-render',
  product: {
    _$ref: 'local',
  }
}

const fetchObject = linkFetch<Data, Config>(data, (data, config) => {
  if (data.fieldName === 'product') {
    return Promise.resolve({total: 1, skip: 0, limit: 1});
  }
  if (data.fieldName === 'products') {
    return Promise.resolve([{title: 'titletitle', category: 'categorycategory'}]);
  }
  return Promise.resolve(undefined);
});

const product = await fetchObject.$product();  // lazy fetch
const products = await fetchObject.product.$products() // lazy fetch

console.log(product, products); // or console.log(fetchObject.product, fetchObject.product.products)
JSON.stringify(fetchObject) // {...}
```

# api

- linkFetch
    - parameter
        - data: FetchObjectType
        - fetch: FetchCallBack
        - options: LinkFetchConfig

```typescript
export type FetchFieldType<T> = T;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> | FetchDoc : FetchFieldType<T[P]>;
}
type FetchCallBack<C = any> = (data: ValueDocSet, config: C) => Promise<any>;
type ValueDocSet<T = any> = { fieldName: string, fetchName: string, value?: T, doc?: FetchDoc };
type LinkFetchConfig = {
  defaultNull?: boolean; // unfetch default value is null 
} 
```