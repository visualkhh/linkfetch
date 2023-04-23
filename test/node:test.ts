import { FetchObjectType, linkfetch } from 'linkfetch';

type User = {
  name: string;
  id: string;
  address: {
    detail: string;
    zip: string;
  }
}
type UserConfig = {
  id: string;
}
const createUserDoc = (id: string): FetchObjectType<User> => {
  return {
    name: 'linkfetch',
    id: id,
    address: {
      $ref: `http://localhost:3000/users/${id}/address`,
    }
  }
}

(async () => {
  const data = createUserDoc('1');
  const fetchObject = await linkfetch<User, UserConfig>(data, (data, config) => {
    return fetch(data.doc!.$ref, {method: 'GET'}).then(it => it.json());
  });
  console.log('start-->', fetchObject.name)
  await fetchObject.$address({id: '1'});
  console.log(JSON.stringify(fetchObject));
})();
