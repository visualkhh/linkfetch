import { User } from './types/User';
import { FlatKeyExcludeArrayDeep, FlatKeyOptionAndType, ObjectConfigType, FetchConfigConsumer, Fetcher, FetchObjectOrDocType, FetchRequest, linkfetch, FlatKey} from 'linkfetch';

type Req = {
  id: string;
  queryId: string;
}

const doc: FetchObjectOrDocType<User> = {
  $ref: 'http://localhost:3000/users/1',
  address: {
    $ref: 'http://localhost:3000/users/1/address'
  }
};
// const a: FlatKeyExcludeArrayDeep<User> = {
// }
const defaultRequest: FetchRequest<User, Req> = {
  $request: {id: '1', queryId: 'q1'},
  $config: {id: {is: true}},
  friends: {
    $request: {id: '2', queryId: 'q2'},
  },
  office: {
    $request: {id: '2', queryId: 'q2'},
    // colleagues: {
    //   $request: {id: '', queryId:''}
    // }
  },
  address: {
    $request: {id: '2', queryId: 'q2'},
    $config: {detail: {is: true}},
    // $fetch: async (r, config?:  FetchConfigConsumer<Req | {test: string}, User>) => {
    //   if (config?.request && 'test' in config.request) {
    //     config.request.test
    //   }
    // $fetch: async (r, config?: FetchConfigConsumer<Req, User>) => {
    //   return fetcher(r, config);
    // },
    detail: {
      $request: {id: '3', queryId: 'q3'}
    }
  }
}
const fetcher: Fetcher<Req, User> = async (doc, config) => {
  // console.log('doc------>', doc);
  console.log('config------>');
  const a = config!.path;
  console.dir(config, {depth: 10});
  if (doc) {
    const url = new URL(doc.$ref);
    url.searchParams.set('queryId', config?.request?.queryId ?? 'none');
    // @ts-ignore
    const body = doc?.$config ? JSON.stringify(doc.$config) : undefined;
    // console.log('body-->', body)
    const responsePromise = fetch(
      url,
      {
        method: 'POST',
        body: body,
        headers: {Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'}
      }
    );
    const dataPromise = responsePromise.then(it => it.json());
    return dataPromise;
  } else {
    return Promise.resolve(config?.value);
  }
}

(async () => {
  // console.log('lazy fetch------------------');
  // const request = {request: {id: '1', queryId: '2'}, linkfetchConfig: {cached: true}};
  // const dataSet = {
  //   data: doc,
  //   defaultRequest: defaultRequest
  // };
  // const root = await linkfetch<User, Req>(dataSet, fetcher, request);
  // console.log('\n\n\n');
  // const f = await root.friends();
  // console.log('---->', f);
  // const o = await root.office()
  // console.log('---->', o);
  // const address = await root.address({request: {id: '77', queryId: '777'}});
  // console.log('-->', address);
  // const details = await address.detail({config: {first: {}}})
  // console.log('-->', details);
  // const address = await root.address();
  // console.groupEnd();
  // const address = await root.address({request: {id: '', queryId: ''}, config: {}});
  // const detail = await root.$$fetch({key: 'address.detail', request: {id: '1', queryId: 'zzzzz'}});
  // address.detail({config: {first: {}}})
  // console.log('address', address);
  // console.log('detail', detail);
  // console.log('JSON stringify:', JSON.stringify(await root.$$snapshot({allFetch: true})));

  // console.log('request all fetch------------------');
  const requestData = await fetch('http://localhost:3000/users', {
    method: 'post',
    headers: {Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
    body: JSON.stringify(defaultRequest)
  }).then(it => it.json())
  console.log('requestData');
  console.dir(requestData, {depth: 5})
  // const request = await linkfetch<User, Req>({
  //   data: requestData,
  //   defaultRequest: defaultRequest
  // }, fetcher, {linkfetchConfig: {cached: true}});
  // console.log('JSON stringify:', JSON.stringify(await request.$$snapshot({allFetch: true})));
})();
