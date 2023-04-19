export class FetchProxy<T extends object> implements ProxyHandler<T> {

  constructor() {
  }

  get(target: T, p: string | symbol, receiver: any): any {
  }

  set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
    return false;
  }

  has(target: T, p: string | symbol): boolean {
    return p === '_FetchProxy_isProxy' || p in target;
  }
}

export type FetchFieldType<T> =  T | Promise<T> | ((...arg: any[]) => Promise<T> | T) ;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> : FetchFieldType<T[P]>;
}
export abstract class FetchBase<T, D = FetchObjectType<T>> {
  constructor(docObject: D) {
    Object.entries(docObject).forEach(([key, value]) => {

    });
  }

  private proxy(a: any) {

  }
}