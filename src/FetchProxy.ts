import {FetchDoc} from './index';
export class FetchProxy<T extends object> implements ProxyHandler<T> {
  private doc?: FetchDoc;
  constructor(private original: any) {
    if (original && typeof original === 'object' && '$ref' in original) {
      this.doc = {...original};
    }
  }

  get(target: T, p: string | symbol, receiver: any): any {
    // console.log('isProxy', '_FetchProxy_isProxy' in target, '_FetchProxy_isProxy' in receiver);
    console.log('get', target, p, receiver);
    // const value = Reflect.get(target, p, receiver);
    // if (value && typeof value === 'object' && '$ref' in value) {
    //   console.log('????')
    // }
    return Reflect.get(target, p, receiver);
  }

  set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
    return false;
  }

  has(target: T, p: string | symbol): boolean {
    return p === '_FetchProxy_isProxy' || p in target;
  }
}


// export abstract class FetchBase<T, D = FetchObjectType<T>> {
//   constructor(public docObject: D) {
//
//   }
//
//   private proxy(a: any) {
//
//   }
//
//   run(): T {
//
//     Object.entries(this.docObject).forEach(([key, value]) => {
//
//     });
//     return {} as T;
//   }
// }