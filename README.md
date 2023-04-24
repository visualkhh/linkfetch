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

# data provider
```typescript
import { executeProvider, FetchProviderDoc } from 'linkfetch';

type User = {
  name: string;
  id: string;
  address: {
    detail: {
      first: string;
      last: string;
    };
    zip: string;
  }
}

type Config = { id: string };
const root: FetchProviderDoc<User, Config> = {
  $data: async (config) => {
    return {
      name: 'linkfetch',
      id: config.id,
      address: {
        $ref: `http://localhost:3000/users/${config.id}/address`
      }
    }
  },
  address: {
    $data: async (config) => {
      return {
        zip: '6484',
        detail: {
          // first: 'first',
          // last: 'last',
          $ref: `http://localhost:3000/users/${config.id}/address/detail`
        }
      }
    },
    detail: {
      $data: async (config) => {
        return {
          first: `first-88 ${config.id}`,
          last: `last-64-${config.id}`
        }
      }
    }
  }
}

const rootData = await executeProvider<User, Config>(root, [], {id: req.params.id});
res.json(rootData);

const addressData = await executeProvider<User, Config>(root, ['address'], {id: req.params.id});
res.json(addressData);
```

# field path access
```typescript
const products = await fetchObject.$$value('product.products');
```

# field path fetch
```typescript
const products = await fetchObject.$$fetch('product.products');
```

# api doc

- linkfetch
    - parameter
        - data: FetchObjectType
        - fetch: FetchCallBack
        - options: linkfetchConfig

```typescript
export const PrefixField = '$' as const;
export type PrefixFieldType = typeof PrefixField;
export const ProviderData = '$data' as const;
export type ProviderDataType = typeof ProviderData;

export const PrefixMetaField = '$$' as const;
export type PrefixMetaFieldType = typeof PrefixMetaField;
export const MetaValue = `${PrefixMetaField}value` as const;
export type MetaValueType = typeof MetaValue;
export const MetaFetch = `${PrefixMetaField}fetch` as const;
export type MetaFetchType = typeof MetaFetch;

export const linkfetch = async <T extends object, C = any>(docObject: FetchObjectType<T>, fetch: FetchCallBack<C>, config?: { config?: C, linkfetchConfig?: FetchConfig, keys?: string[] }): Promise<FetchObjectPromiseType<T, C> & MetaFnc<T, C>> {/*...*/};
export const executeProvider = async <T, C>(target: FetchProviderDoc<T, C>, keys: string[] | string, config?: C) => {/*...*/}
export const execute = async (target: any, keys: string[] | string, parameter?: any[], fieldLoopCallBack?: (target: any, prev: any, value: any, name: string) => Promise<any>) => {/*...*/}

export type FetchFieldType<T> = T;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> | FetchDoc : FetchFieldType<T[P]>;
}
type FetchCallBack<C = any> = (data: ValueDocSet, config: C) => Promise<any>;
type FetchValueDocSet<T = any> = { fieldName: string, fetchName: string, value?: T, doc?: FetchDoc, keys: string[] };
// keys: ex) ['product', 'products'] field depth path ← obj.product.products
type FetchConfig = {
  defaultNull?: boolean; // unfetch default value is null 
  cached?: boolean; // cached
  disableSync?: boolean; // default false 
}
export type FetchDoc = { $ref: string };
export type FetchProviderDoc<T, C> = {
    [ProviderData]: (c: C) => Promise<{[key in keyof T]: T[key] extends object ? FetchDoc | T[key]  : T[key]}>;
  }
  & {
  [P in keyof T as T[P] extends object ? P : never]?: FetchProviderDoc<T[P], C>;
}
```
