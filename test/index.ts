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


type Data = {
  name: string;
  friends: {name: string}[];
  age: number;
  wow: {
    name: string;
    good: {
      name: string;
      addr:string;
    }
  }
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

  const r = linkFetch<Data, Config>(data, (data, config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('xxxxx');
      }, 1000);
    });
  });

  // const za = await r.$wow().then(it => it.good.name);
  // const aa = await r.wow.$good().then(it => it.name);


  // // console.log('----->', await r.name);
  // // console.log(r.name);
  // // r.friendsAA
  // const a = r.age;
  // const aa =11;
  // const zz = r;
  // zz.name
  // console.log(r.wow.good.name)
  // // r.wow.$good
  // let data1 = r.$wow();
  // console.log(data1)
  // console.log(r.wow.then(it => it.good)good);

})();
