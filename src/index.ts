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

export type GetPathArrayItem<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ?
    K extends keyof T ? GetPathArrayItem<T[K], R> : never
    :
    P extends keyof (T extends (infer AI)[] ? AI : T) ? (T extends (infer AI)[] ? AI : T)[P] :(P extends string ? T : never);
    // P extends keyof T ? T[P] : (P extends string ? T : never);

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
    T[P] extends unknown[] ? `${P}` : T[P] extends object
      ?
      // @ts-ignore
      `${P}.${keyof FlatKeyExcludeArrayDeep<T[P]>}` | `${P}`
      :
      // @ts-ignore
      `${P}`]: unknown;
}
export type FlatKeyExcludeArrayDeepAndDeleteType<T> = {
  [P in keyof Omit<T, RequestTypeType> as // @ts-ignore
    T[P] extends unknown[] ? `${P}` : T[P] extends object
      ?
      // @ts-ignore
      `${P}.${keyof FlatKeyExcludeArrayDeepAndDeleteType<T[P]>}` | `${P}`
      :
      // @ts-ignore
      `${P}`]: unknown;
}

export type FlatObjectKeyExcludeArrayDeepAndDeleteType<T> = {
  [P in keyof Omit<T, RequestTypeType> as // @ts-ignore
    T[P] extends unknown[] ? `${P}` : T[P] extends object
      ?
      // @ts-ignore
      `${P}.${keyof FlatObjectKeyExcludeArrayDeepAndDeleteType<T[P]>}` | `${P}`
      :
      // @ts-ignore
      never]: unknown;
}

export type FlatObjectOnlyKeyArrayItemAndDeleteType<T> = {
  [P in keyof Omit<T, RequestTypeType> as // @ts-ignore
    T[P] extends (infer AI)[]
      ?
      // @ts-ignore
      `${P}${AI extends object ? `.${keyof FlatObjectOnlyKeyArrayItemAndDeleteType<AI>}` : ''}`
      :
      T[P] extends object
        ? // @ts-ignore
        `${P}.${keyof FlatObjectOnlyKeyArrayItemAndDeleteType<T[P]>}` | `${P}`
        : // @ts-ignore
         never
  ]: unknown;
} & FlatObjectKeyExcludeArrayDeepAndDeleteType<T>;

export type FlatObjectKey<T> = {
  // @ts-ignore
  [P in keyof FlatKey<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
}
export type FlatRootObjectKeyExcludeArrayDepp<T> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeep<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
} & { '': T };
export type FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeepAndDeleteType<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
} & { '': T };
export type FlatRootObjectOptionKeyRequestTypeFetchExcludeArrayDeppAndDeleteType<T, C> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeepAndDeleteType<T> as GetPath<T, P> extends object ? P : never]?: undefined extends GetPath<T, P>[RequestTypeType] ? C : GetPath<T, P>[RequestTypeType];
  // @ts-ignore
} & { ''?: undefined extends T[RequestTypeType] ? C : T[RequestTypeType] };
// export type FlatRootObjectOnlyOptionKeyRequestTypeFetchArrayItemAndDeleteType<T, C> = {
//   // @ts-ignore
//   [P in keyof FlatObjectOnlyKeyArrayItemAndDeleteType<T> as GetPathArrayItem<T, P> extends object ? P : never]?: GetPathArrayItem<T, P>;// undefined extends GetPathArrayItem<T, P>[RequestTypeType] ? C : GetPathArrayItem<T, P>[RequestTypeType];
//   // @ts-ignore
// } & { ''?: undefined extends T[RequestTypeType] ? C : T[RequestTypeType] };
export type FlatRootObjectOnlyKeyArrayItemAndDeleteType<T> = {
  // @ts-ignore
  [P in keyof FlatObjectOnlyKeyArrayItemAndDeleteType<T> as GetPathArrayItem<T, P> extends object ? P : never]: GetPathArrayItem<T, P>;
} & { '': T };
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
  T[P] extends (infer AI)[] ?
      AI extends object ?
        FetchRequest<AI, C>
        : RequestFetchBody<T, RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, R>
    : FetchRequest<T[P], C>;
}


export type FetchObjectOrDocType<T> = {
  [P in keyof T]?: T[P] extends object ? FetchObjectOrDocType<T[P]> | FetchDoc<T> : T[P];
} | FetchDoc<T>;

export type ExtractRequestTypeFetchType<T> = {
  [K in keyof T]: T[K] extends { [RequestType]: infer W } ? W : never;
}
// export type FetchConfigConsumer<C = any, T = undefined> = { request?: C, path?: (T extends undefined ? number : keyof FlatObjectKey<T>), value?: any, config?: FetchRequest<any, C>, linkfetchConfig?: FetchConfig };
export type FetchConfigConsumer<C = any, T = undefined, P = keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>> = {
  path: (P);
  // @ts-ignore
  request?: C,
  // request?: RequestTypeFetchType extends keyof FlatObjectKeyExcludeArrayDepp<T>[keyof P] ? string : number,
  // @ts-ignore
  value?: FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>[P],
  config?: FetchRequest<any, C>,
  linkfetchConfig?: FetchConfig
};
export type Fetcher<C = any, T = undefined, P = keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>> = (
  doc: FetchDoc | undefined,
  config: FetchConfigConsumer<C, T, P>
) => Promise<any>;


export type GlobalFetchConfigConsumer<C = any, T = undefined, P = keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>> = P extends keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T> ? {
  path: (P);
  // @ts-ignore
  request?: RequestTypeType extends keyof FlatRootObjectKeyExcludeArrayDepp<T>[P] ? FlatRootObjectKeyExcludeArrayDepp<T>[P][RequestTypeType] : C,
  value?: Omit<FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>[P], RequestTypeType>,
  config?: FetchRequest<any, C>,
  linkfetchConfig?: FetchConfig
} : never;
export type GlobalFetcher<C = any, T = undefined, P = keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>> = (
  doc: FetchDoc | undefined,
  config: GlobalFetchConfigConsumer<C, T, P>
) => Promise<any>;


type StoreFetchMetaConfig<C, P extends keyof FlatRootObjectOnlyKeyArrayItemAndDeleteType<T>, T> = {
  path: P,
  request?: T extends (infer AI)[]
    ?
    (RequestTypeType extends keyof AI ? AI[RequestTypeType] : C)
    : (RequestTypeType extends keyof T ? T[RequestTypeType] : C)
  config?: FlatKeyOptionAndObjectConfigType<T>
};

type FetchMetaConfig<C, P extends keyof FlatRootObjectOnlyKeyArrayItemAndDeleteType<T>, T> = {
  path: P,
  // request?: T extends (infer AI)[]
  //   ?
  //   {wow:1}
  //   :  FlatRootObjectOnlyOptionKeyRequestTypeFetchArrayItemAndDeleteType<T, C>,
  request?: {
    // @ts-ignore
    [P in keyof FlatObjectOnlyKeyArrayItemAndDeleteType<T> as GetPathArrayItem<T, P> extends object ? P : never]?:
    // @ts-ignore
    GetPathArrayItem<T, P> extends (infer AI)[]
      ?
      (RequestTypeType extends keyof AI ? AI[RequestTypeType] : C)
      :// @ts-ignore
      (RequestTypeType extends keyof GetPathArrayItem<T, P> ? GetPathArrayItem<T, P>[RequestTypeType] : C)
    ;// undefined extends GetPathArrayItem<T, P>[RequestTypeType] ? C : GetPathArrayItem<T, P>[RequestTypeType];
    // @ts-ignore
  } & { ''?: undefined extends T[RequestTypeType] ? C : T[RequestTypeType] },
  // config?: FlatKeyOptionAndObjectConfigType<T>
  config?: ObjectOptionValueAndObjectConfigType<FlatRootObjectOnlyKeyArrayItemAndDeleteType<DeleteRequestType<T>>>,
  flushUpdate?: boolean
};

export type FetchRequestParameter<C, T = undefined> = {
  path?: (T extends undefined ? string : keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>),
  request?: C,
  config?: FlatKeyOptionAndObjectConfigType<Omit<T, RequestTypeType>>,
  flushUpdate?: boolean
};

export type FetchObjectRequestParameter<C, T = undefined> = Omit<FetchRequestParameter<C, T>, 'path'>;

export type FetchProducerReturnType<T> = {
  [key in keyof Omit<T, RequestTypeType>]: T[key] extends object ? FetchDoc<DeleteRequestType<T[key]>> | DeleteRequestType<T[key]> : DeleteRequestType<T[key]>
};

export type FetchFnc<T, C, R = T> = {
  // [P in typeof Fetch]: (request: FetchRequestParameter<RequestTypeType extends keyof T ? T[RequestTypeType] : C, R>) => T extends (infer TA)[] ? Promise<TA[]> : Promise<FetchProducerReturnType<T>>;
  [P in typeof Fetch]: (request: FetchRequestParameter<RequestTypeType extends keyof T ? T[RequestTypeType] : C, R>) =>
    T extends (infer AI)[]
      ?
      AI extends object
        ? Promise<FetchProducerReturnType<AI>[]>
        : Promise<AI[]>
      :
      Promise<FetchProducerReturnType<T>>;
};


export type FetchArrayProducer<T, C, R = T> = FetchFnc<T[], C, R>
  & {
  [P in keyof Omit<T, RequestTypeType> as T[P] extends object ? P : never]?:
  T[P] extends unknown[]
    ?
    FetchFnc<T[P], C, R>
    :
    FetchStore<T[P], C, T>;
}

export type FetchStore<T, C, R = T> = FetchFnc<T, C, R>
  & {
  [P in keyof Omit<T, RequestTypeType> as T[P] extends object ? P : never]?:
  T[P] extends (infer AI)[]
    ?
      AI extends object
        // ? FetchFnc<T[P], C, R>
        ? FetchArrayProducer<AI, C, R>
        : FetchFnc<T[P], C, R>
    :
      FetchStore<T[P], C, T>;
}

export type FetchObject<T extends { [RequestType]?: T[RequestTypeType] }, C = any> = {
  [P in keyof Omit<T, RequestTypeType>]:
  T[P] extends object ?
    T[P] extends (infer AI)[]
      ? (request?: FetchObjectRequestParameter<RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, T[P]>) => Promise<DeleteRequestType<T[P]>>
      : (request?: FetchObjectRequestParameter<RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, T[P]>) => Promise<FetchObject<T[P], C>>
    // : (request?: FetchObjectRequestParameter<RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C, T[P]>) => Promise<FetchObject<DeleteRequestType<T[P]>, RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C>>
    // : (request?: FetchObjectRequestParameter<RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C, T[P]>) => Promise<FetchObject<Omit<T[P], RequestTypeFetchType>, RequestTypeFetchType extends keyof T[P] ? T[P][RequestTypeFetchType] : C>>
    : T[P];
}
export type FetchReturnObject<T extends { [RequestType]?: T[RequestTypeType] }, C = any> = {
  [P in keyof Omit<T, RequestTypeType>]:
  T[P] extends object ?
    T[P] extends (infer AI)[]
      ?
        AI extends object
          ? (request?: FetchObjectRequestParameter<RequestTypeType extends keyof AI ? AI[RequestTypeType] : C, AI>) => Promise<FetchReturnObject<AI, C>[]>
          : (request?: FetchObjectRequestParameter<RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, T[P]>) => Promise<DeleteRequestType<T[P]>>
      : (request?: FetchObjectRequestParameter<RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, T[P]>) => Promise<FetchReturnObject<T[P], C>>
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
  if (typeof t === 'function') {
    return t.apply(target, parameter);
  }
  return t as any;
};

// producer
const fetchStore = async <T, C>(target: FetchStore<T, C>, keys: string[] | string = [], config?: StoreFetchMetaConfig<C, any, T>) => {
  const keyArray = Array.isArray(keys) ? keys : keys.split('.');
  keyArray.push(Fetch);
  return await execute(target, keyArray, [config]);
}

export const linkstore = <T, C>(target: FetchStore<T, C>) => {
  const data = Object.assign(target, {
    // @ts-ignore
      [MetaFetch]: async <P extends keyof FlatRootObjectOnlyKeyArrayItemAndDeleteType<T>>(config: StoreFetchMetaConfig<C, P, FlatRootObjectOnlyKeyArrayItemAndDeleteType<T>[P]>): Promise<FlatRootObjectKeyExcludeArrayDeppAndDeleteType<T>[P]> => {
      return await fetchStore(target, config.path as any, config as any);
    },
    // @ts-ignore
    [MetaRequest]: async (request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
      // @ts-ignore
      return requestStore(target, request);
    }
  });
  return data;
}

const requestStore = async <T extends object, C>(data: FetchStore<T, C>, request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
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
    [MetaFetch]: async <P extends keyof FlatRootObjectOnlyKeyArrayItemAndDeleteType<T>>(
      // @ts-ignore
      config: FetchMetaConfig<C, P, FlatRootObjectOnlyKeyArrayItemAndDeleteType<T>[P]>
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
      ) as FetchObject<DeleteRequestType<FlatRootObjectOnlyKeyArrayItemAndDeleteType<T>[P]>>;
      //  FetchObject<User, Req>
    },
    [MetaSnapshot]: async (config?: {
      request?: FlatRootObjectOptionKeyRequestTypeFetchExcludeArrayDeppAndDeleteType<T, C>,
      config?: ObjectOptionValueAndObjectConfigType<FlatRootObjectKeyExcludeArrayDeppAndDeleteType<DeleteRequestType<T>>>,
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
  (request?: { request?: undefined extends T[RequestTypeType] ? C : T[RequestTypeType], config?: FlatKeyOptionAndObjectConfigType<DeleteRequestType<T>> }) => Promise<FetchReturnObject<T, C>> => {

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
          if (Array.isArray(it)) {
            it.forEach((item, index) => {
              linkfetchLoop({data: item, defaultRequest: defaultReqeust}, fetch, config, [...paths])
            })
            // for (let i = 0; i < it.length; i++) {
            //   linkfetchLoop({data: it, defaultRequest: defaultReqeust}, fetch, config, [...paths])
            // }
          } else {
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
const linkfetchSnapshot = async <T extends object, C>(data: FetchReturnObject<T, C>, config?: {
  allFetch?: boolean,
  request?: FlatRootObjectOptionKeyRequestTypeFetchExcludeArrayDeppAndDeleteType<T, C>,
  config?: ObjectOptionValueAndObjectConfigType<FlatRootObjectKeyExcludeArrayDeppAndDeleteType<DeleteRequestType<T>>>,
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
          bowl[key] = value.$$linkfetch_cache; // TODO: 변경필요?
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
