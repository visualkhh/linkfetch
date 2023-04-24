// export class TestProxy<T extends object> implements ProxyHandler<T> {
//   get(target: T, p: string | symbol, receiver: any): any {
//     console.log('----get')
//     return Reflect.get(target, p, receiver);
//   }
//
//   // set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
//   //   console.log('----set')
//   //   return Reflect.set(target, p, newValue, receiver);
//   // }
//
//   apply(target: T, thisArg: any, argArray: any[]): any {
//     console.log('apply');
//   }
//
//   // construct(target: T, argArray: any[], newTarget: Function): object {
//   //   console.log('construct');
//   //   return undefined;
//   // }
//
//   defineProperty(target: T, property: string | symbol, attributes: PropertyDescriptor): boolean {
//     console.log('defineProperty', target, property, attributes);
//     // attributes.value = 'cxx';
//     // (target as any)[property] = 'cxx';
//     return true;
//   }
//
//   deleteProperty(target: T, p: string | symbol): boolean {
//     console.log('deleteProperty', target, p);
//     return false;
//   }
//
//   getOwnPropertyDescriptor(target: T, p: string | symbol): PropertyDescriptor | undefined {
//     console.log('getOwnPropertyDescriptor', target, p);
//     // return { configurable: true, enumerable: true, value: 5 };
//     return {
//       get(): any {
//         console.log('get');
//         return 'cxx';
//       },
//       set(value: any): void {
//         console.log('set', value);
//       }
//     };
//   }
//
//   // getPrototypeOf(target: T): object | null {
//   //   console.log('getPrototypeOf');
//   //   return undefined;
//   // }
//
//   has(target: T, p: string | symbol): boolean {
//     console.log('has');
//     return false;
//   }
//
//   isExtensible(target: T): boolean {
//     console.log('isExtensible');
//     return false;
//   }
//
//   // ownKeys(target: T): ArrayLike<string | symbol> {
//   //   console.log('ownKeys');
//   //   return undefined;
//   // }
//
//   preventExtensions(target: T): boolean {
//     console.log('preventExtensions');
//     return false;
//   }
//
//   setPrototypeOf(target: T, v: object | null): boolean {
//     console.log(' setPrototypeOf');
//     return false;
//   }
//
// }
//
// const wow = {
//   name: 'a'
// }
//
// const proxy = new Proxy(wow, new TestProxy());
// // console.log(proxy.name);
// // proxy.name = 'b';
// // console.log(proxy.name);
// console.log(proxy.name = 'd');
// console.log(proxy.name);

let bValue ='2'
const o = {b: '3'};
Object.defineProperty(o, 'b', {
  get() {
    // return 'aaaa';
    return bValue + 'x';
  },
  set(newValue) {
    bValue = newValue + 'z';
  },
  enumerable: true,
  configurable: true,
});


// console.log(o.b);
// o.b = '4';
// console.log(bValue);
console.log(o.b = 'ddd');
console.log(bValue);
