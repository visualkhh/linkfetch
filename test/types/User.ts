import {
  ExtractRequestTypeFetchType,
  RequestType,
  RequestTypeType,
  DeleteRequestType,
  FlatObjectKeyExcludeArrayDeppAndDeleteType,
  FlatObjectKeyExcludeArrayDepp
} from 'linkfetch';

export type Friend = {
  name: string;
  id: string;
  age: number,
  address: {
    first: string;
    last: string;
    lastAddr2?: string;
    [RequestType]?: {
      id: string;
    }
  }
  [RequestType]?: {
    wowfriend: string;
    wowfriends?: string;
  }
}
export type User = {
  name: string;
  id: string;
  optionId?: string;
  [RequestType]: {
    wow: string;
  },
  address: {
    details: {
      first: string;
      last?: string;
      subDetails: {
        first: string;
        last?: string;
      },
      // [RequestType]: {
      //   wowaddressDetails: string;
      //   wowaddressDetailsss?: string;
      // }
    };
    zip: string;
    secondZip?: string;
    [RequestType]: {
      wowaddress: string;
      wowaddressggg?: string;
    }
  },
  office: {
    name?: string;
    colleagues: Friend[]
  }
  friends: Friend[]
  //   & {
  //   [key in RequestTypeFetchType]: {
  //     wowfriends: string;
  //   }
  // };
}

// const aaaa: FlatObjectKeyExcludeArrayDeppAndDeleteType<User> = {
//   'address.detail.first'
// }
// export type UserOrigin = DeleteRequestType<User>;
// const user: UserOrigin = {
//   id: '',
//   name: '',
//   address: {
//     zip: '',
//     secondZip: '',
//     detail: {
//       first: '',
//       last: ''
//     }
//   },
//   office: {
//     colleagues: []
//   },
//   friends: []
// }

// const t: User = {
//
// }
// const t: User = {
//   friends: Object.assign([], { [RequestTypeFetch]: {wow: '12'}})
// }
// t.friends[RequestTypeFetch].wow = '1';
