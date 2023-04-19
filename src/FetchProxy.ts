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