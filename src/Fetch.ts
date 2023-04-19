import { FetchBase, FetchObjectType } from 'FetchBase';

export class Fetch<T> extends FetchBase<T> {

  constructor(docObject: FetchObjectType<T>) {
    super(docObject);
  }
}