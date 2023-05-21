import { User } from './types/User';
import { Fetcher, FetchObjectOrDocType, FetchRequest, linkfetch } from 'linkfetch';

type Req = {
  id: string;
  queryId: string;
}

const doc: FetchObjectOrDocType<User> = {
  $ref: 'http://localhost:3000/users/1',
  $config: {address: {}}
};

const defaultRequest: FetchRequest<User, Req> = {
  $request: {id: '1', queryId: 'q1'},
  address: {
    $request: {id: '2', queryId: 'q2'},
    $config: {detail: {}},
    detail: {
      $request: {id: '3', queryId: 'q3'}
    }
  }
}

const fetcher: Fetcher<Req> = async (doc, config) => {
  if (doc) {
    const url = new URL(doc.$ref);
    url.searchParams.set('queryId', config?.request?.queryId ?? 'none');
    const responsePromise = fetch(url, {method: 'GET'});
    return responsePromise.then(it => it.json());
  } else {
    return Promise.resolve(config?.value);
  }
}

(async () => {
  console.log('lazy fetch------------------');
  const root = await linkfetch<User, Req>({
    data: doc,
    defaultRequest: defaultRequest
  }, fetcher, {linkfetchConfig: {cached: true}});
  const address = await root.address({request: {id: '', queryId: ''}, config: {}});
  const detail = await root.$$fetch({key: 'address.detail', request: {id: '1', queryId: 'zzzzz'}});
  address.detail({config: {first: {}}})
  console.log('address', address);
  console.log('detail', detail);
  console.log('JSON stringify:', JSON.stringify(await root.$$snapshot({allFetch: true})));

  console.log('request all fetch------------------');
  const requestData = await fetch('http://localhost:3000/users', {
    method: 'post',
    headers: {Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
    body: JSON.stringify(defaultRequest)
  }).then(it => it.json())
  console.log('requestData', requestData);
  const request = await linkfetch<User, Req>({
    data: requestData,
    defaultRequest: defaultRequest
  }, fetcher, {linkfetchConfig: {cached: true}});
  console.log('JSON stringify:', JSON.stringify(await request.$$snapshot({allFetch: true})));
})();
