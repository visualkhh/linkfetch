import { FetchObjectType, linkFetch } from 'linkfetch';

// }
// type Optional<T> = {
//   [P in keyof T]?:  T[P];
// }
// type OptionalDeep<T> = {
//   [P in keyof T]?: T[P] extends object ? OptionalDeep<T[P]> : T[P];
// }
// export type FetchFieldPromiseType<T> =  (config?: any) => Promise<T> ;
// export type FetchObjectPromiseType<T> = {
//   [P in keyof T as `$${P}`]: T[P] extends object ? FetchFieldPromiseType<T[P]> : never;
// } & {
//   [P in keyof T]?: T[P] extends object ? FetchObjectPromiseType<T[P]> : T[P];
// };;
// type Data = {
//   name: string;
//   product1: {id: number, title: string, description: string};
// }
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
// type ZZ = OptionalDeep<Data>;
// const dd = {
//
// } as FetchObjectPromiseType<Data>;
// const aaa = dd.name;
// aaa?.length;
// const wwww = dd.wow;
// const z = dd.wow!;
// dd.wow!.$good;
// z.$good().then(it => it.name);
// dd.$wow();


type Config = {
  name: string
}

(async () => {
  // const data: FetchObjectType<Data> = {
  //   name: 'my name is dom-render',
  //   product1: {_$ref:'https://dummyjson.com/products/1'}
  // }
  const data: FetchObjectType<Data> = {
    name: 'my name is dom-render',
    wow: { name: 'wow' },
    product: {
      _$ref: 'https://dummyjson.com/products',
    }
  }
  // const data: FetchObjectType<Data> = {
  //   _$ref: 'https://dummyjson.com/products'
  // }

  const r = await linkFetch<Data, Config>(data, (data, config) => {
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
  }, {linkFetchConfig: {everyFetch: true}});

  const aa = r.product!.$products();
  const a2a = r.product!.products;
  a2a?.forEach(it => console.log(it!.title));
  console.log('--->', r);
  const product = await r.$product();
  const product2 = await r.$product();
  console.log(product, product2);
  // const products = await r.product!.$products();
  // console.log(products, r.product!.products);
  // r.product.products = [];
  // const r = linkFetch<Data, Config>(data, (data, config) => {
  //   console.log('fetch', data, config);
  //   return fetch(data.doc!._$ref, {method: 'GET'}).then(it => it.json());
  //   // return new Promise((resolve, reject) => {
  //   //   setTimeout(() => {
  //   //     resolve({name: 'my name is dom-render', product1: {id: 1, title: 'title', description: 'description'}});
  //   //   }, 1000);
  //   // });
  // });

  // const za = await r.$wow().then(it => it.good.name);
  // const aa = await r.wow.$good().then(it => it.name);
  // console.log('start-->',r.name)
  // console.log('start-->',r.product1);
  // console.log(r.wow);
  // console.log(await r.$wow());
  // const product = await r.$product();
  // console.log(product);
  // const product2 = await r.$product();
  // console.log(product2);
  // const product2 = await r.$product();
  // console.log(product2, product);

  console.log(JSON.stringify(r));
  // console.log(JSON.stringify(r));
})();
