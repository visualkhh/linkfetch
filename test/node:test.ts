import { FetchObjectType, linkfetch } from 'linkfetch';

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
type UserConfig = {
  id: string;
}
const createUserDoc = (id: string): FetchObjectType<User> => {
  return {
    $ref: `http://localhost:3000/users/${id}`
  }
}

(async () => {
  const data = createUserDoc('1');
  const fetchObject = await linkfetch<User, UserConfig>(data, (data, config) => {
    if (data.doc) {
      return fetch(data.doc!.$ref, {method: 'GET'}).then(it => it.json());
    } else {
      return Promise.resolve(data.value);
    }
  }, {linkfetchConfig: {cached: true}});
  const detail = await fetchObject.$$fetch('address.detail', {id: '2'});
  console.log('---->', detail);
  await fetchObject.$$fetch('address.detail', {id: '2'});
  const g = await fetchObject.$address();
  console.log(JSON.stringify(fetchObject));
  // const zz = fetchObject as FetchFieldPromiseType<User, UserConfig>;
  // const z = await (zz.id = Promise.resolve('s'));
  // const a = await zz.id;
 // const a = ((fetchObject as any).addressss = Promise.resolve('ss'));
})();
