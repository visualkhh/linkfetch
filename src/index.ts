export const PrefixField = '$' as const;
export type PrefixFieldType = typeof PrefixField;
export const MetaPrefixField = '$$' as const;
export type MetaPrefixType = typeof MetaPrefixField;

export const Fetch = `${PrefixField}fetch` as const;
export type FetchType = typeof Fetch;
export const FlushUpdate = `${PrefixField}flushUpdate` as const;
export type FlushUpdateType = typeof FlushUpdate;

export const RequestType = `${PrefixField}requestType` as const;
export type RequestTypeType = typeof RequestType;
export const RequestFetch = `${PrefixField}request` as const;
export type RequestFetchType = typeof RequestFetch;
export const Config = `${PrefixField}config` as const;
export type ConfigType = typeof Config;
export const Ref = `${PrefixField}ref` as const;
export type RefType = typeof Ref;

export const MetaFetch = `${MetaPrefixField}fetch` as const;
export type MetaFetchType = typeof MetaFetch;
export const MetaRequest = `${MetaPrefixField}request` as const;
export type MetaRequestType = typeof MetaRequest;
export const MetaSnapshot = `${MetaPrefixField}snapshot` as const;
export type MetaSnapshotType = typeof MetaSnapshot;

export type ValueOf<T> = T[keyof T];
export type OptionalDeep<T> = {
  [P in keyof T]?: T[P] extends object ? OptionalDeep<T[P]> : T[P];
}
export type ObjectValueType<T, V> = {
  [P in keyof T]: V ;
}

export type GetPath<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ?
    K extends keyof T ? GetPath<T[K], R> : never
    :
    P extends keyof T ? T[P] : (P extends string ? T : never);

export type FlatKey<T> = {
  [P in keyof T as T[P] extends object
    ?
    // @ts-ignore
    `${P}.${keyof FlatKey<T[P]>}` | `${P}`
    :
    // @ts-ignore
    `${P}`]: unknown;
}

export type FlatKeyExcludeArrayDeep<T> = {
  [P in keyof T as // @ts-ignore
    T[P] extends any[] ? `${P}` : T[P] extends object
      ?
      // @ts-ignore
      `${P}.${keyof FlatKeyExcludeArrayDeep<T[P]>}` | `${P}`
      :
      // @ts-ignore
      `${P}`]: unknown;
}
export type FlatKeyExcludeArrayDeepAndDeleteType<T> = {
  [P in keyof Omit<T, RequestTypeType> as // @ts-ignore
    T[P] extends any[] ? `${P}` : T[P] extends object
      ?
      // @ts-ignore
      `${P}.${keyof FlatKeyExcludeArrayDeepAndDeleteType<T[P]>}` | `${P}`
      :
      // @ts-ignore
      `${P}`]: unknown;
}

export type FlatObjectKey<T> = {
  // @ts-ignore
  [P in keyof FlatKey<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
}
export type FlatObjectKeyExcludeArrayDepp<T> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeep<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
} & { '': T };
export type FlatObjectKeyExcludeArrayDeppAndDeleteType<T> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeepAndDeleteType<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
} & { '': T };
export type FlatObjectOptionKeyRequestTypeFetchExcludeArrayDeppAndDeleteType<T, C> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeepAndDeleteType<T> as GetPath<T, P> extends object ? P : never]?: undefined extends GetPath<T, P>[RequestTypeType] ? C : GetPath<T, P>[RequestTypeType];
  // @ts-ignore
} & { ''?: undefined extends T[RequestTypeType] ? C : T[RequestTypeType] };
/**
 ** @deprecated
 */
export type FlatKeyOptionAndType<T, TT> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeep<T> as T extends any[] ? never : P]?: TT;
}

// export type DeleteReturnType<T> = {
// }
export type DeleteRequestType<T> = {
  [P in keyof T as P extends RequestTypeType ? never : P]: T[P] extends (infer AT)[] ? AT[] : DeleteRequestType<T[P]>;
  // [P in keyof Omit<T, RequestTypeFetchType>]: T[P] extends object ? DeleteRequestType<T[P]> : T[P];
}


export type FlatKeyOptionAndObjectConfigType<T> = T extends (infer AT)[] ? {
  [P in keyof Omit<AT, RequestTypeType>]?: undefined extends AT[P]
    ? ObjectConfigType : Omit<ObjectConfigType, 'is'>;
} : {
  [P in keyof Omit<FlatKeyExcludeArrayDeep<T>, RequestTypeType>]?:
  // @ts-ignore
  undefined extends GetPath<T, P>
    ? ObjectConfigType : Omit<ObjectConfigType, 'is'>;
};

// T extends (infer AT)[] ? {
//   [P in keyof Omit<AT, RequestTypeFetchType>]?: undefined extends AT[P]
//   ? ObjectConfigType : Omit<ObjectConfigType, 'is'>;
// } :
export type ObjectOptionValueAndObjectConfigType<T> =  {
  [P in keyof Omit<T, RequestTypeType>]?: FlatKeyOptionAndObjectConfigType<T[P]>;
  // @ts-ignore
  // undefined extends T[P]
  //   ? ObjectConfigType : Omit<ObjectConfigType, 'is'>;
};



export type ObjectConfigType = { is?: boolean, format?: string, config?: any };


export type FetchDoc<T = any> = {
    [P in typeof Ref]: string
  }
  & {
  [P in typeof Config]?: FlatKeyOptionAndObjectConfigType<T>;
  // [P in typeof Config]?: FlatKeyOptionAndObjectConfigType<T>
};
export type FetchConfig = { defaultNull?: boolean; cached?: boolean; disableSync?: boolean };


export type RequestFetchBody<T, C, R = T> = {
    [P in typeof RequestFetch]: C;
  }
  & {
  [P in typeof Config]?: FlatKeyOptionAndObjectConfigType<T>;
}
  & {
  [P in typeof Fetch]?: Fetcher<C, R>;
} & {
  [P in typeof FlushUpdate]?: boolean;
};

// export type FetchRequest<T extends {[k in typeof RequestTypeFetch]? : T[k]}, C, R = T> = RequestFetchBody<T, T[RequestTypeFetchType] extends undefined ? C : T[RequestTypeFetchType], R>
// @ts-ignore
export type FetchRequest<T, C, R = T> = RequestFetchBody<T, RequestTypeType extends keyof T ? T[RequestTypeType] : C, R>
  & {
  [P in keyof Omit<T, RequestTypeType> as T[P] extends object ? P : never]?:
  T[P] extends any[] ?
    RequestFetchBody<T, RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, R>
    : FetchRequest<T[P], C>;
}


export type FetchObjectOrDocType<T> = {
  [P in keyof T]?: T[P] extends object ? FetchObjectOrDocType<T[P]> | FetchDoc<T> : T[P];
} | FetchDoc<T>;

export type ExtractRequestTypeFetchType<T> = {
  [K in keyof T]: T[K] extends { [RequestType]: infer W } ? W : never;
}
// export type FetchConfigConsumer<C = any, T = undefined> = { request?: C, path?: (T extends undefined ? number : keyof FlatObjectKey<T>), value?: any, config?: FetchRequest<any, C>, linkfetchConfig?: FetchConfig };
export type FetchConfigConsumer<C = any, T = undefined, P = keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>> = {
  path: (P);
  // @ts-ignore
  request?: C,
  // request?: RequestTypeFetchType extends keyof FlatObjectKeyExcludeArrayDepp<T>[keyof P] ? string : number,
  // @ts-ignore
  value?: FlatObjectKeyExcludeArrayDeppAndDeleteType<T>[P],
  config?: FetchRequest<any, C>,
  linkfetchConfig?: FetchConfig
};
export type Fetcher<C = any, T = undefined, P = keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>> = (
  doc: FetchDoc | undefined,
  config: FetchConfigConsumer<C, T, P>
) => Promise<any>;


export type GlobalFetchConfigConsumer<C = any, T = undefined, P = keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>> = P extends keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T> ? {
  path: (P);
  // @ts-ignore
  request?: RequestTypeType extends keyof FlatObjectKeyExcludeArrayDepp<T>[P] ? FlatObjectKeyExcludeArrayDepp<T>[P][RequestTypeType] : C,
  value?: Omit<FlatObjectKeyExcludeArrayDeppAndDeleteType<T>[P], RequestTypeType>,
  config?: FetchRequest<any, C>,
  linkfetchConfig?: FetchConfig
} : never;
export type GlobalFetcher<C = any, T = undefined, P = keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>> = (
  doc: FetchDoc | undefined,
  config: GlobalFetchConfigConsumer<C, T, P>
) => Promise<any>;


type ProducerFetchConfig<C, P extends keyof FlatObjectKeyExcludeArrayDepp<T>, T> = {
  path: P,
  request?: (RequestTypeType extends keyof FlatObjectKeyExcludeArrayDepp<T> ? FlatObjectKeyExcludeArrayDepp<T>[RequestTypeType] : C),
  config?: FlatKeyOptionAndObjectConfigType<T>
};

export type FetchRequestParameter<C, T = undefined> = {
  path?: (T extends undefined ? string : keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>),
  request?: C,
  config?: FlatKeyOptionAndObjectConfigType<T>,
  flushUpdate?: boolean
};

export type FetchObjectRequestParameter<C, T = undefined> = Omit<FetchRequestParameter<C, T>, 'path'>;

export type FetchProducerDocReturnType<T> = {
  [key in keyof Omit<T, RequestTypeType>]: T[key] extends object ? FetchDoc<DeleteRequestType<T[key]>> | DeleteRequestType<T[key]> : DeleteRequestType<T[key]>
};

export type FetchFnc<T, C, R = T> = {
  [P in typeof Fetch]: (request: FetchRequestParameter<RequestTypeType extends keyof T ? T[RequestTypeType] : C, R>) => T extends (infer TA)[] ? Promise<TA[]> : Promise<FetchProducerDocReturnType<T>>;
};
export type FetchProducerDoc<T, C, R = T> = FetchFnc<T, C, R>
  & {
  [P in keyof Omit<T, RequestTypeType> as T[P] extends object ? P : never]?: T[P] extends unknown[] ? FetchFnc<T[P], C, R> : FetchProducerDoc<T[P], C, T>;
  // [P in keyof T as T[P] extends object ? P : never]?: FetchProducerDoc<T[P], C, T>;
}

export type FetchObject<T extends { [RequestType]?: T[RequestTypeType] }, C = any> = {
  [P in keyof Omit<T, RequestTypeType>]:
  T[P] extends object ?
    T[P] extends any[]
      ? (request?: FetchObjectRequestParameter<RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, T[P]>) => Promise<DeleteRequestType<T[P]>>
      : (request?: FetchObjectRequestParameter<RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, T[P]>) => Promise<FetchObject<DeleteRequestType<T[P]>, RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C>>
    // : (request?: FetchObjectRequestParameter<RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C, T[P]>) => Promise<FetchObject<DeleteRequestType<T[P]>, RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C>>
    // : (request?: FetchObjectRequestParameter<RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C, T[P]>) => Promise<FetchObject<Omit<T[P], RequestTypeFetchType>, RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C>>
    : T[P];
}

// /////////////////////////////////////////////

const isFetchDoc = (value: any): value is FetchDoc => {
  return value && typeof value === 'object' && ((Ref in value) || (Config in value));
}

const execute = async (
  target: any,
  paths: string[] | string = [],
  parameter?: any[] | ((target: any, prev: any, value: any, name: string, paths: string[]) => Promise<any[]>),
  fieldLoopCallBack?: (target: any, prev: any, value: any, name: string, paths: string[]) => Promise<any>
) => {
  let t = target;
  const pPaths = [];
  const keyArray = (Array.isArray(paths) ? paths : paths.split('.')).filter(it => it);
  for (const key of keyArray) {
    pPaths.push(key);
    if (t === undefined || t === null) {
      return undefined;
    }
    t = fieldLoopCallBack ? (await fieldLoopCallBack(target, t, t[key], key, [...pPaths])) : t[key];
  }
  console.log('-----!!!!', t, parameter);
  if (typeof t === 'function') {
    return t.apply(target, parameter);
  }
  return t as any;
};

// producer
const fetchProducer = async <T, C>(target: FetchProducerDoc<T, C>, keys: string[] | string = [], config?: ProducerFetchConfig<C, any, T>) => {
  const keyArray = Array.isArray(keys) ? keys : keys.split('.');
  keyArray.push(Fetch);
  return await execute(target, keyArray, [config]);
}

export const producer = <T, C>(target: FetchProducerDoc<T, C>) => {
  const data = Object.assign(target, {
    // @ts-ignore
    // [MetaFetch]: async <P extends keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>>(config?: ProducerFetchConfig<C, P, FlatObjectKeyExcludeArrayDepp<T>[P]>): Promise<FlatObjectKeyExcludeArrayDepp<T>[P]> => {
    [MetaFetch]: async <P extends keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>>(config: ProducerFetchConfig<C, P, FlatObjectKeyExcludeArrayDeppAndDeleteType<T>[P]>): Promise<FlatObjectKeyExcludeArrayDeppAndDeleteType<T>[P]> => {
      return await fetchProducer(target, config.path as any, config as any);
    },
    // @ts-ignore
    [MetaRequest]: async (request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
      // @ts-ignore
      return requestProducer(target, request);
    }
  });
  return data;
}

const requestProducer = async <T extends object, C>(data: FetchProducerDoc<T, C>, request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
  const change = async (bowl: any, field: any, request: any, paths: string[] = []) => {
    for (const [key, value] of Array.from(Object.entries(request))) {
      if (key === RequestFetch) {
        const newRequest: FetchRequestParameter<C, T> = {
          request: value as any,
          config: request[Config],
        }
        if (paths.length > 0) {
          (newRequest.path as any) = paths.join('.');
        }
        const source = await field?.[Fetch]?.(newRequest);
        if (Array.isArray(source)) {
          return source;
        } else {
          Object.assign(bowl, source);
        }
      } else if (key !== RequestFetch && key !== Config && typeof value === 'object') {
        paths.push(key);
        bowl[key] = await change({}, field[key], request[key], paths)
      }
    }
    return bowl;
  }
  const bowl = await change({}, data, request);
  return bowl as T;
}

// linkfetch
export const linkfetch = async <T extends object, C = any>(
  dataSet: { data: FetchObjectOrDocType<T>, defaultRequest?: FetchRequest<T, C> },
  fetch: GlobalFetcher<C, T>,
  request?: {
    request?: RequestTypeType extends keyof T ? T[RequestTypeType] : C,
    config?: FlatKeyOptionAndObjectConfigType<DeleteRequestType<T>>
    linkfetchConfig?: FetchConfig
  }
) => {
  const newData = Array.isArray(dataSet.data) ? [...dataSet.data] : Object.assign({}, dataSet.data);
  const targetResult = await linkfetchLoop<T, C>({
    data: newData as FetchObjectOrDocType<T>,
    defaultRequest: dataSet.defaultRequest
      // @ts-ignore
  }, fetch, request)({request: request?.request ?? dataSet.defaultRequest?.$request, config: request?.config});

  const executor = {
    [MetaFetch]: async <P extends keyof FlatObjectKeyExcludeArrayDeppAndDeleteType<T>>(
      config: {
        path: P,
        request?: FlatObjectOptionKeyRequestTypeFetchExcludeArrayDeppAndDeleteType<T, C>,
        config?: ObjectOptionValueAndObjectConfigType<FlatObjectKeyExcludeArrayDeppAndDeleteType<DeleteRequestType<T>>>,
        flushUpdate?: boolean
      }
    ) => {
      return await execute(targetResult, config.path as any, [],
        async (target, prev, value, name, paths) => {
          const newRequest = {...config};
          const pathsStr = paths.join('.');
          if (newRequest.config) {
            // @ts-ignore
            newRequest.config = newRequest.config?.[pathsStr];
          }
          if (newRequest.request) {
            // @ts-ignore
            newRequest.request = newRequest.request?.[pathsStr];
          }
          return await value(newRequest);
        }
      ) as FetchObject<DeleteRequestType<FlatObjectKeyExcludeArrayDeppAndDeleteType<T>[P]>>;
      //  FetchObject<User, Req>
    },
    [MetaSnapshot]: async (config?: {
      request?: FlatObjectOptionKeyRequestTypeFetchExcludeArrayDeppAndDeleteType<T, C>,
      config?: ObjectOptionValueAndObjectConfigType<FlatObjectKeyExcludeArrayDeppAndDeleteType<DeleteRequestType<T>>>,
      allFetch?: boolean
    }): Promise<OptionalDeep<T>> => {
      return linkfetchSnapshot<T, C>(targetResult, config);
    }
  }
  return Object.assign(targetResult, executor);
}

const linkfetchLoop = <T extends object, C = any>(
  dataSet: { data: FetchObjectOrDocType<T>, defaultRequest?: FetchRequest<T, C> },
  fetch: GlobalFetcher<C, T>,
  config?: { linkfetchConfig?: FetchConfig },
  paths: string[] = []):
// @ts-ignore
  (request?: { request?: undefined extends T[RequestTypeType] ? C : T[RequestTypeType], config?: FlatKeyOptionAndObjectConfigType<DeleteRequestType<T>> }) => Promise<FetchObject<T, C>> => {

  // console.log('--dataSet-->', dataSet.data);
  const change = (field: any, defaultReqeust?: any, paths: string[] = []) => {
    // console.log('field--@@->', field)
    if (!Array.isArray(field)) {
      Object.entries(field)
        .filter(([key, value]) => (typeof value === 'object' || Array.isArray(value)) && !isFetchDoc(field))
        .forEach(([key, value]) => {
          // console.log('value@!@', key, value)
          const inputPath = [...paths];
          inputPath.push(key);
          field[key] = change(value, defaultReqeust?.[key], inputPath);
        });
    }

    // @ts-ignore
    const doc = isFetchDoc(field) ? {...field} : undefined;
    // defaultConfig $config Setting 해준다
    if (doc && defaultReqeust?.[Config]) {
      doc[Config] = doc[Config] ?? defaultReqeust?.[Config];
    }
    const p = Object.assign(
      // @ts-ignore
      (r?: { request?: undefined extends T[RequestTypeType] ? C : T[RequestTypeType], config?: FlatKeyOptionAndObjectConfigType<T>, flushUpdate?: boolean }) => {
        const flushUpdate = r?.flushUpdate ?? defaultReqeust?.[FlushUpdate];
        if (flushUpdate) {
          p.$$linkfetch_cache = undefined;
          p.$$linkfetch_age = 0;
        }
        if (config?.linkfetchConfig?.cached && p.$$linkfetch_age > 0) {
          return Promise.resolve(p.$$linkfetch_cache);
        }
        // @ts-ignore
        const newConfig: FetchRequest<T, C> = {
          $request: r?.request ?? defaultReqeust?.[RequestFetch],
          $config: r?.config ?? defaultReqeust?.[Config]
        };
        const newRequest = {...(r?.request ?? defaultReqeust?.[RequestFetch])};
        // newRequest.$config = newConfig.$config;
        // console.log('-----?path', paths)
        // @ts-ignore
        const fetchConfig: FetchConfigConsumer<C, T> = {
          request: newRequest,
          value: field,
          path: paths.filter(it => it).join('.') as any,
          config: newConfig as any,
          linkfetchConfig: config?.linkfetchConfig
        };
        // if (paths.length > 0) {
        //   (fetchConfig.path as any) = paths.join('.');
        // }
        const runFetch = (defaultReqeust?.[Fetch] ?? fetch) as Fetcher<C, T>;
        return runFetch(doc, fetchConfig).then(it => {
          console.log('FetchObject fetch--->');
          console.dir(it, {depth: 10});
          if (!Array.isArray(it)) {
            linkfetchLoop({data: it, defaultRequest: defaultReqeust}, fetch, config, [...paths])
          }
          p.$$linkfetch_cache = it;
          p.$$linkfetch_age++;
          // p.$$config = it?.$config;
          return it;
        });
      },
      {$$linkfetch_cache: undefined, $$linkfetch_age: 0});
    return p;
  }
  const target = change(dataSet.data, dataSet?.defaultRequest, [...paths]);
  return target as any;
}

// @ts-ignore
const linkfetchSnapshot = async <T extends object, C>(data: FetchObject<T, C>, config?: {
  allFetch?: boolean,
  request?: FlatObjectOptionKeyRequestTypeFetchExcludeArrayDeppAndDeleteType<T, C>,
  config?: ObjectOptionValueAndObjectConfigType<FlatObjectKeyExcludeArrayDeppAndDeleteType<DeleteRequestType<T>>>,
}): Promise<OptionalDeep<T>> => {
  const change = async (bowl: any, field: any, path: string[] = []) => {
    // console.log('path------->', path)
    if (!field) {
      return bowl;
    }
    for (const [key, value] of Array.from(Object.entries(field))) {
      const npath = [...path];
      npath.push(key);
      const pathsStr = npath.filter(it => it).join('.');
      if ((typeof value === 'function') && ('$$linkfetch_cache' in value) && ('$$linkfetch_age' in value)) {
        // console.log('snapshot!!------>', pathsStr, config, value.$$linkfetch_cache);
        if (config?.allFetch && !value.$$linkfetch_age) {
          const newRequest = {...config};
          if (newRequest.config) {
            // @ts-ignore
            newRequest.config = newRequest.config?.[pathsStr];
          }
          if (newRequest.request) {
            // @ts-ignore
            newRequest.request = newRequest.request?.[pathsStr];
          }
          // @ts-ignore
          await value(newRequest);
        }

        // console.log('------>', value.$$linkfetch_cache)
        if (Array.isArray(value.$$linkfetch_cache)) {
          bowl[key] = value.$$linkfetch_cache;
        } else {
          bowl[key] = await change({}, value.$$linkfetch_cache, npath);
        }
      } else if (typeof value !== 'function') {
        bowl[key] = value;
      }
    }
    return bowl;
  }
  const bowl = await change({}, data, []);
  return bowl as T;
}
