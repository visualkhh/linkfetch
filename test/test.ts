import { FetchObjectOrDocType, FetchRequest, GlobalFetcher, linkfetch } from 'linkfetch';
import { User } from 'test/types/User';

export type Product = {
  name: string;
  id: string;
  price: number;
  address: {
    first: string;
    last: string;
    lastAddr2?: string;
  }
}
// try {
  const a = await Promise.resolve('asd')
  console.log('------',a);


  const doc: FetchObjectOrDocType<Product> = {
    $ref: 'https://dummyjson.com/products',
    address: {
      $ref: 'https://dummyjson.com/products/1'
    }
  };

  const defaultRequest: FetchRequest<Product, any> = {
    $fetch: async (doc, config) => {
      console.log('default-->', doc, config)
     return await Promise.resolve({
       name: 'default',
       // address: {}
     });
    },
    address: {
      $fetch: async (r) => {
        console.log('default address--->')
        return await Promise.resolve({
          first: 'default address',
        });
      }
    }
  }

  const fetcher: GlobalFetcher<any, Product> = async (doc, config) => {
    console.log('------->', doc, config);
  }


  const dataSet = {
    data: doc,
    defaultRequest: defaultRequest
  };
  const root = await linkfetch<Product, any>(dataSet, fetcher
  );
  console.log('----->', root);
  const addr = await root.address();
  console.log('----->', addr);
  // console.log('\n\n\n');
  // console.dir(root, {depth: 10});
  // console.log('------->', addr);

// } catch(e) {
//
//   console.error(e)
// }