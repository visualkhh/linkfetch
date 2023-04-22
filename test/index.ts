import { FetchObjectType, linkFetch } from 'linkfetch';

// export type FetchFieldType<T> =  T | Promise<T> | ((...arg: any[]) => Promise<T> | T) ;


type Data = {
  name: string;
  friends: {name: string}[];
  age: number;
  wow: {
    name: string;
    good: {
      name: string;
    }
  }
}
(async () => {

  const data: FetchObjectType<Data> = {
    name: 'my name is dom-render',
    friends: [{name: 'a'}, {name: 'b'}, {name: 'c'}],
    age: 1,
    wow: {
      name: 'wow',
      good: {
        $ref: 'wow.good'
      }
    }
  }

  const r = linkFetch<Data>(data, (data, config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('xxxxx');
      }, 1000);
    });
  });
  // console.log('----->', await r.name);
  // console.log(r.name);
  // r.friendsAA
  const a = r.age;
  const aa =11;
  const zz = r.wow.good;
  console.log(r.wow.good.name)
  // r.wow.$good
  let data1 = r.$wow();
  console.log(data1)
  // console.log(r.wow.then(it => it.good)good);

})();
