export type User = {
  name: string;
  id: string;
  address: {
    detail: {
      first: string;
      last: string;
    };
    zip: string;
  },
  office: {
    colleagues: User[]
  }
  friends: User[];
}
