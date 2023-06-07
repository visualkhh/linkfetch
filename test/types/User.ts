import { RequestTypeFetch, RequestTypeFetchType, DeleteRequestType } from 'linkfetch';

export type User = {
  name: string;
  id: string;
  [RequestTypeFetch]: {
    wow: string;
  },
  address: {
    detail: {
      first: string;
      last: string;
    };
    zip: string;
    [RequestTypeFetch]: {
      wowaddress: string;
    }
  },
  office: {
    colleagues: User[]
  }
  friends: User[]
  & {  [RequestTypeFetch]: {
      wowfriends: string;
    }
  }
  //   & {
  //   [key in RequestTypeFetchType]: {
  //     wowfriends: string;
  //   }
  // };
}

export type UserOrigin = DeleteRequestType<User>;
const user: UserOrigin = {
  id: '',
  name: '',
  address: {
    zip: '',
    detail: {
      first: '',
      last: ''
    }
  },
  office: {
    colleagues: []
  },
  friends: []
}

// const t: User = {
//
// }
// const t: User = {
//   friends: Object.assign([], { [RequestTypeFetch]: {wow: '12'}})
// }
// t.friends[RequestTypeFetch].wow = '1';