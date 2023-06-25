import { User } from './types/User';
import { FlatObjectOnlyKeyArrayItemDeppAndDeleteType, GetPathArrayItem } from 'linkfetch';
type Friends2 = {name: 's', address: {wow: string}}
type User2 = {
  friends: Friends2[]
}

type A = FlatObjectOnlyKeyArrayItemDeppAndDeleteType<User2>;
type AK = keyof A;
const a: AK = 'friends'

const aa: A = {
  'friends': [],
  'friends.address': {wow: ''},
  '': {} as any

}
