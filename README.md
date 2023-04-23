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

# ⚒️ example
- [![express](https://img.shields.io/badge/-server-black?logo=express)](./test/server:test.ts)
- [![typescript](https://img.shields.io/badge/-node-black?logo=typescript)](./test/node:test.ts)
- [![javascript](https://img.shields.io/badge/-web-black?logo=javascript)](./test/web:test.html)


## linkfetch document protocol

```json
{
  "$ref": "lazy end point"
}
```

ex)

```json
{
  "name": "my name is linkfetch",
  "product1": {
    "$ref": "https://dummyjson.com/products/1"
  }
}
```

# remote fetch

```typescript
import { FetchObjectType, linkfetch } from 'linkfetch';

type Data = {
  name: string;
  product1: { id: number, title: string, description: string };
}

const data: FetchObjectType<Data> = {
  name: 'my name is dom-render',
  product1: {$ref: 'https://dummyjson.com/products/1'}
}

const fetchObject = await linkfetch<Data, Config>(data, (data, config) => fetch(data.doc!.$ref, {method: 'GET'}).then(it => it.json()));

const product1 = await fetchObject.$product1();  // lazy fetch

console.log(product1); // or console.log(fetchObject.product1)
JSON.stringify(fetchObject) // {...}
```

# local fetch

```typescript
import { FetchObjectType, linkfetch } from 'linkfetch';

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
    $ref: 'local',
  }
}

const fetchObject = await linkfetch<Data, Config>(data, (data, config) => {
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

## first fetch

```typescript
type Data = {
  name: string;
  wow: { name: string },
  product: {
    products: { title: string, category: string }[];
    total: number;
    skip: number;
    limit: number
  };
}
const data: FetchObjectType<Data> = {
  $ref: 'local'
}
const fetchObject = await linkfetch<Data, Config>(data, (data, config) => {
  console.log('data', data, config);
  if (!data.fieldName) {
    return Promise.resolve({name: 'my name is dom-render', wow: {name: 'wow'}});
  }
  if (data.value) {
    return Promise.resolve(data.value);
  }
  if (data.fieldName === 'product') {
    return Promise.resolve({total: 1, skip: 0, limit: 1});
  }
  if (data.fieldName === 'products') {
    return Promise.resolve([{title: 'titletitle', category: 'categorycategory'}]);
  }
  return Promise.resolve(undefined);
});

console.log('first', fetchObject);
const product = await fetchObject.$product();
console.log(product);
const products = await fetchObject.product!.$products()
console.log(products, fetchObject.product!.products);
console.log(JSON.stringify(fetchObject));
```

# field path access

```typescript
const products = fetchObject.$$value('product.products');
```

# field path fetch

```typescript
const products = await fetchObject.$$fetch('product.products');
```

# api

- linkfetch
    - parameter
        - data: FetchObjectType
        - fetch: FetchCallBack
        - options: linkfetchConfig

```typescript
export async function linkfetch<T, C>(docObject: FetchObjectType<T>, fetch: FetchCallBack<C>, config?: { config?: C, linkfetchConfig?: linkfetchConfig }): Promise<FetchObjectPromiseType<T, C>> {/*...*/
};

export type FetchFieldType<T> = T;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> | FetchDoc : FetchFieldType<T[P]>;
}
type FetchCallBack<C = any> = (data: ValueDocSet, config: C) => Promise<any>;
type ValueDocSet<T = any> = { fieldName: string, fetchName: string, value?: T, doc?: FetchDoc, keys: string[] };
// keys: ex) ['product', 'products'] field depth path ← obj.product.products
type linkfetchConfig = {
  defaultNull?: boolean; // unfetch default value is null 
  everyFetch?: boolean; // every fetch   default false
  disableSync?: boolean; // default false 
} 
```
