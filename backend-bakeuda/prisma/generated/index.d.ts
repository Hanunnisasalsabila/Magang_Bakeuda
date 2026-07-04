
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model LampiranDokumen
 * 
 */
export type LampiranDokumen = $Result.DefaultSelection<Prisma.$LampiranDokumenPayload>
/**
 * Model ObjekPajak
 * 
 */
export type ObjekPajak = $Result.DefaultSelection<Prisma.$ObjekPajakPayload>
/**
 * Model Sppt
 * 
 */
export type Sppt = $Result.DefaultSelection<Prisma.$SpptPayload>
/**
 * Model SubjekPajak
 * 
 */
export type SubjekPajak = $Result.DefaultSelection<Prisma.$SubjekPajakPayload>
/**
 * Model TransaksiSpop
 * 
 */
export type TransaksiSpop = $Result.DefaultSelection<Prisma.$TransaksiSpopPayload>
/**
 * Model DetailTransaksiAsal
 * 
 */
export type DetailTransaksiAsal = $Result.DefaultSelection<Prisma.$DetailTransaksiAsalPayload>
/**
 * Model DetailTransaksiTujuan
 * 
 */
export type DetailTransaksiTujuan = $Result.DefaultSelection<Prisma.$DetailTransaksiTujuanPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Wilayah
 * 
 */
export type Wilayah = $Result.DefaultSelection<Prisma.$WilayahPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const JenisDokumen: {
  KTP: 'KTP',
  SHM: 'SHM',
  AJB: 'AJB',
  GIRIK: 'GIRIK',
  SHGB: 'SHGB',
  IMB: 'IMB',
  LAINNYA: 'LAINNYA'
};

export type JenisDokumen = (typeof JenisDokumen)[keyof typeof JenisDokumen]


export const JenisTanah: {
  TANAH_BANGUNAN: 'TANAH_BANGUNAN',
  TANAH_PERTANIAN: 'TANAH_PERTANIAN',
  TANAH_PERKEBUNAN: 'TANAH_PERKEBUNAN',
  TANAH_KEHUTANAN: 'TANAH_KEHUTANAN',
  TANAH_LAINNYA: 'TANAH_LAINNYA'
};

export type JenisTanah = (typeof JenisTanah)[keyof typeof JenisTanah]


export const StatusBayar: {
  BELUM_BAYAR: 'BELUM_BAYAR',
  LUNAS: 'LUNAS',
  KEDALUWARSA: 'KEDALUWARSA'
};

export type StatusBayar = (typeof StatusBayar)[keyof typeof StatusBayar]


export const StatusWp: {
  PEMILIK: 'PEMILIK',
  PENYEWA: 'PENYEWA',
  PENGGARAP: 'PENGGARAP',
  PEMAKAI: 'PEMAKAI'
};

export type StatusWp = (typeof StatusWp)[keyof typeof StatusWp]


export const Pekerjaan: {
  PNS: 'PNS',
  TNI_POLRI: 'TNI_POLRI',
  PEGAWAI_SWASTA: 'PEGAWAI_SWASTA',
  WIRASWASTA: 'WIRASWASTA',
  PETANI: 'PETANI',
  NELAYAN: 'NELAYAN',
  PENSIUNAN: 'PENSIUNAN',
  LAINNYA: 'LAINNYA'
};

export type Pekerjaan = (typeof Pekerjaan)[keyof typeof Pekerjaan]


export const JenisTransaksi: {
  BARU: 'BARU',
  MUTASI: 'MUTASI',
  PECAH: 'PECAH',
  GABUNG: 'GABUNG',
  PERUBAHAN_DATA: 'PERUBAHAN_DATA'
};

export type JenisTransaksi = (typeof JenisTransaksi)[keyof typeof JenisTransaksi]


export const StatusAjuan: {
  DRAFT: 'DRAFT',
  MENUNGGU: 'MENUNGGU',
  DISETUJUI: 'DISETUJUI',
  DITOLAK: 'DITOLAK',
  REVISI: 'REVISI'
};

export type StatusAjuan = (typeof StatusAjuan)[keyof typeof StatusAjuan]


export const Role: {
  DESA: 'DESA',
  BAKEUDA: 'BAKEUDA'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type JenisDokumen = $Enums.JenisDokumen

export const JenisDokumen: typeof $Enums.JenisDokumen

export type JenisTanah = $Enums.JenisTanah

export const JenisTanah: typeof $Enums.JenisTanah

export type StatusBayar = $Enums.StatusBayar

export const StatusBayar: typeof $Enums.StatusBayar

export type StatusWp = $Enums.StatusWp

export const StatusWp: typeof $Enums.StatusWp

export type Pekerjaan = $Enums.Pekerjaan

export const Pekerjaan: typeof $Enums.Pekerjaan

export type JenisTransaksi = $Enums.JenisTransaksi

export const JenisTransaksi: typeof $Enums.JenisTransaksi

export type StatusAjuan = $Enums.StatusAjuan

export const StatusAjuan: typeof $Enums.StatusAjuan

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more LampiranDokumen
 * const lampiranDokumen = await prisma.lampiranDokumen.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more LampiranDokumen
   * const lampiranDokumen = await prisma.lampiranDokumen.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.lampiranDokumen`: Exposes CRUD operations for the **LampiranDokumen** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LampiranDokumen
    * const lampiranDokumen = await prisma.lampiranDokumen.findMany()
    * ```
    */
  get lampiranDokumen(): Prisma.LampiranDokumenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.objekPajak`: Exposes CRUD operations for the **ObjekPajak** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ObjekPajaks
    * const objekPajaks = await prisma.objekPajak.findMany()
    * ```
    */
  get objekPajak(): Prisma.ObjekPajakDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sppt`: Exposes CRUD operations for the **Sppt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sppts
    * const sppts = await prisma.sppt.findMany()
    * ```
    */
  get sppt(): Prisma.SpptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subjekPajak`: Exposes CRUD operations for the **SubjekPajak** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubjekPajaks
    * const subjekPajaks = await prisma.subjekPajak.findMany()
    * ```
    */
  get subjekPajak(): Prisma.SubjekPajakDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaksiSpop`: Exposes CRUD operations for the **TransaksiSpop** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TransaksiSpops
    * const transaksiSpops = await prisma.transaksiSpop.findMany()
    * ```
    */
  get transaksiSpop(): Prisma.TransaksiSpopDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.detailTransaksiAsal`: Exposes CRUD operations for the **DetailTransaksiAsal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DetailTransaksiAsals
    * const detailTransaksiAsals = await prisma.detailTransaksiAsal.findMany()
    * ```
    */
  get detailTransaksiAsal(): Prisma.DetailTransaksiAsalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.detailTransaksiTujuan`: Exposes CRUD operations for the **DetailTransaksiTujuan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DetailTransaksiTujuans
    * const detailTransaksiTujuans = await prisma.detailTransaksiTujuan.findMany()
    * ```
    */
  get detailTransaksiTujuan(): Prisma.DetailTransaksiTujuanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wilayah`: Exposes CRUD operations for the **Wilayah** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wilayahs
    * const wilayahs = await prisma.wilayah.findMany()
    * ```
    */
  get wilayah(): Prisma.WilayahDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    LampiranDokumen: 'LampiranDokumen',
    ObjekPajak: 'ObjekPajak',
    Sppt: 'Sppt',
    SubjekPajak: 'SubjekPajak',
    TransaksiSpop: 'TransaksiSpop',
    DetailTransaksiAsal: 'DetailTransaksiAsal',
    DetailTransaksiTujuan: 'DetailTransaksiTujuan',
    User: 'User',
    Wilayah: 'Wilayah'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "lampiranDokumen" | "objekPajak" | "sppt" | "subjekPajak" | "transaksiSpop" | "detailTransaksiAsal" | "detailTransaksiTujuan" | "user" | "wilayah"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LampiranDokumen: {
        payload: Prisma.$LampiranDokumenPayload<ExtArgs>
        fields: Prisma.LampiranDokumenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LampiranDokumenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LampiranDokumenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>
          }
          findFirst: {
            args: Prisma.LampiranDokumenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LampiranDokumenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>
          }
          findMany: {
            args: Prisma.LampiranDokumenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>[]
          }
          create: {
            args: Prisma.LampiranDokumenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>
          }
          createMany: {
            args: Prisma.LampiranDokumenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LampiranDokumenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>[]
          }
          delete: {
            args: Prisma.LampiranDokumenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>
          }
          update: {
            args: Prisma.LampiranDokumenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>
          }
          deleteMany: {
            args: Prisma.LampiranDokumenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LampiranDokumenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LampiranDokumenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>[]
          }
          upsert: {
            args: Prisma.LampiranDokumenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LampiranDokumenPayload>
          }
          aggregate: {
            args: Prisma.LampiranDokumenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLampiranDokumen>
          }
          groupBy: {
            args: Prisma.LampiranDokumenGroupByArgs<ExtArgs>
            result: $Utils.Optional<LampiranDokumenGroupByOutputType>[]
          }
          count: {
            args: Prisma.LampiranDokumenCountArgs<ExtArgs>
            result: $Utils.Optional<LampiranDokumenCountAggregateOutputType> | number
          }
        }
      }
      ObjekPajak: {
        payload: Prisma.$ObjekPajakPayload<ExtArgs>
        fields: Prisma.ObjekPajakFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObjekPajakFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObjekPajakFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>
          }
          findFirst: {
            args: Prisma.ObjekPajakFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObjekPajakFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>
          }
          findMany: {
            args: Prisma.ObjekPajakFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>[]
          }
          create: {
            args: Prisma.ObjekPajakCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>
          }
          createMany: {
            args: Prisma.ObjekPajakCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObjekPajakCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>[]
          }
          delete: {
            args: Prisma.ObjekPajakDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>
          }
          update: {
            args: Prisma.ObjekPajakUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>
          }
          deleteMany: {
            args: Prisma.ObjekPajakDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObjekPajakUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ObjekPajakUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>[]
          }
          upsert: {
            args: Prisma.ObjekPajakUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObjekPajakPayload>
          }
          aggregate: {
            args: Prisma.ObjekPajakAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObjekPajak>
          }
          groupBy: {
            args: Prisma.ObjekPajakGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObjekPajakGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObjekPajakCountArgs<ExtArgs>
            result: $Utils.Optional<ObjekPajakCountAggregateOutputType> | number
          }
        }
      }
      Sppt: {
        payload: Prisma.$SpptPayload<ExtArgs>
        fields: Prisma.SpptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>
          }
          findFirst: {
            args: Prisma.SpptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>
          }
          findMany: {
            args: Prisma.SpptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>[]
          }
          create: {
            args: Prisma.SpptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>
          }
          createMany: {
            args: Prisma.SpptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>[]
          }
          delete: {
            args: Prisma.SpptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>
          }
          update: {
            args: Prisma.SpptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>
          }
          deleteMany: {
            args: Prisma.SpptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>[]
          }
          upsert: {
            args: Prisma.SpptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpptPayload>
          }
          aggregate: {
            args: Prisma.SpptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSppt>
          }
          groupBy: {
            args: Prisma.SpptGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpptGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpptCountArgs<ExtArgs>
            result: $Utils.Optional<SpptCountAggregateOutputType> | number
          }
        }
      }
      SubjekPajak: {
        payload: Prisma.$SubjekPajakPayload<ExtArgs>
        fields: Prisma.SubjekPajakFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubjekPajakFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubjekPajakFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>
          }
          findFirst: {
            args: Prisma.SubjekPajakFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubjekPajakFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>
          }
          findMany: {
            args: Prisma.SubjekPajakFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>[]
          }
          create: {
            args: Prisma.SubjekPajakCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>
          }
          createMany: {
            args: Prisma.SubjekPajakCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubjekPajakCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>[]
          }
          delete: {
            args: Prisma.SubjekPajakDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>
          }
          update: {
            args: Prisma.SubjekPajakUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>
          }
          deleteMany: {
            args: Prisma.SubjekPajakDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubjekPajakUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubjekPajakUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>[]
          }
          upsert: {
            args: Prisma.SubjekPajakUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjekPajakPayload>
          }
          aggregate: {
            args: Prisma.SubjekPajakAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubjekPajak>
          }
          groupBy: {
            args: Prisma.SubjekPajakGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubjekPajakGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubjekPajakCountArgs<ExtArgs>
            result: $Utils.Optional<SubjekPajakCountAggregateOutputType> | number
          }
        }
      }
      TransaksiSpop: {
        payload: Prisma.$TransaksiSpopPayload<ExtArgs>
        fields: Prisma.TransaksiSpopFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransaksiSpopFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransaksiSpopFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>
          }
          findFirst: {
            args: Prisma.TransaksiSpopFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransaksiSpopFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>
          }
          findMany: {
            args: Prisma.TransaksiSpopFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>[]
          }
          create: {
            args: Prisma.TransaksiSpopCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>
          }
          createMany: {
            args: Prisma.TransaksiSpopCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransaksiSpopCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>[]
          }
          delete: {
            args: Prisma.TransaksiSpopDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>
          }
          update: {
            args: Prisma.TransaksiSpopUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>
          }
          deleteMany: {
            args: Prisma.TransaksiSpopDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransaksiSpopUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransaksiSpopUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>[]
          }
          upsert: {
            args: Prisma.TransaksiSpopUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiSpopPayload>
          }
          aggregate: {
            args: Prisma.TransaksiSpopAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaksiSpop>
          }
          groupBy: {
            args: Prisma.TransaksiSpopGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransaksiSpopGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransaksiSpopCountArgs<ExtArgs>
            result: $Utils.Optional<TransaksiSpopCountAggregateOutputType> | number
          }
        }
      }
      DetailTransaksiAsal: {
        payload: Prisma.$DetailTransaksiAsalPayload<ExtArgs>
        fields: Prisma.DetailTransaksiAsalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DetailTransaksiAsalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DetailTransaksiAsalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>
          }
          findFirst: {
            args: Prisma.DetailTransaksiAsalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DetailTransaksiAsalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>
          }
          findMany: {
            args: Prisma.DetailTransaksiAsalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>[]
          }
          create: {
            args: Prisma.DetailTransaksiAsalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>
          }
          createMany: {
            args: Prisma.DetailTransaksiAsalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DetailTransaksiAsalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>[]
          }
          delete: {
            args: Prisma.DetailTransaksiAsalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>
          }
          update: {
            args: Prisma.DetailTransaksiAsalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>
          }
          deleteMany: {
            args: Prisma.DetailTransaksiAsalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DetailTransaksiAsalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DetailTransaksiAsalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>[]
          }
          upsert: {
            args: Prisma.DetailTransaksiAsalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiAsalPayload>
          }
          aggregate: {
            args: Prisma.DetailTransaksiAsalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDetailTransaksiAsal>
          }
          groupBy: {
            args: Prisma.DetailTransaksiAsalGroupByArgs<ExtArgs>
            result: $Utils.Optional<DetailTransaksiAsalGroupByOutputType>[]
          }
          count: {
            args: Prisma.DetailTransaksiAsalCountArgs<ExtArgs>
            result: $Utils.Optional<DetailTransaksiAsalCountAggregateOutputType> | number
          }
        }
      }
      DetailTransaksiTujuan: {
        payload: Prisma.$DetailTransaksiTujuanPayload<ExtArgs>
        fields: Prisma.DetailTransaksiTujuanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DetailTransaksiTujuanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DetailTransaksiTujuanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>
          }
          findFirst: {
            args: Prisma.DetailTransaksiTujuanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DetailTransaksiTujuanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>
          }
          findMany: {
            args: Prisma.DetailTransaksiTujuanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>[]
          }
          create: {
            args: Prisma.DetailTransaksiTujuanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>
          }
          createMany: {
            args: Prisma.DetailTransaksiTujuanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DetailTransaksiTujuanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>[]
          }
          delete: {
            args: Prisma.DetailTransaksiTujuanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>
          }
          update: {
            args: Prisma.DetailTransaksiTujuanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>
          }
          deleteMany: {
            args: Prisma.DetailTransaksiTujuanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DetailTransaksiTujuanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DetailTransaksiTujuanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>[]
          }
          upsert: {
            args: Prisma.DetailTransaksiTujuanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailTransaksiTujuanPayload>
          }
          aggregate: {
            args: Prisma.DetailTransaksiTujuanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDetailTransaksiTujuan>
          }
          groupBy: {
            args: Prisma.DetailTransaksiTujuanGroupByArgs<ExtArgs>
            result: $Utils.Optional<DetailTransaksiTujuanGroupByOutputType>[]
          }
          count: {
            args: Prisma.DetailTransaksiTujuanCountArgs<ExtArgs>
            result: $Utils.Optional<DetailTransaksiTujuanCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Wilayah: {
        payload: Prisma.$WilayahPayload<ExtArgs>
        fields: Prisma.WilayahFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WilayahFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WilayahFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>
          }
          findFirst: {
            args: Prisma.WilayahFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WilayahFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>
          }
          findMany: {
            args: Prisma.WilayahFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>[]
          }
          create: {
            args: Prisma.WilayahCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>
          }
          createMany: {
            args: Prisma.WilayahCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WilayahCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>[]
          }
          delete: {
            args: Prisma.WilayahDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>
          }
          update: {
            args: Prisma.WilayahUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>
          }
          deleteMany: {
            args: Prisma.WilayahDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WilayahUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WilayahUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>[]
          }
          upsert: {
            args: Prisma.WilayahUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WilayahPayload>
          }
          aggregate: {
            args: Prisma.WilayahAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWilayah>
          }
          groupBy: {
            args: Prisma.WilayahGroupByArgs<ExtArgs>
            result: $Utils.Optional<WilayahGroupByOutputType>[]
          }
          count: {
            args: Prisma.WilayahCountArgs<ExtArgs>
            result: $Utils.Optional<WilayahCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    lampiranDokumen?: LampiranDokumenOmit
    objekPajak?: ObjekPajakOmit
    sppt?: SpptOmit
    subjekPajak?: SubjekPajakOmit
    transaksiSpop?: TransaksiSpopOmit
    detailTransaksiAsal?: DetailTransaksiAsalOmit
    detailTransaksiTujuan?: DetailTransaksiTujuanOmit
    user?: UserOmit
    wilayah?: WilayahOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ObjekPajakCountOutputType
   */

  export type ObjekPajakCountOutputType = {
    transaksi: number
    detail_asal: number
    sppt: number
  }

  export type ObjekPajakCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | ObjekPajakCountOutputTypeCountTransaksiArgs
    detail_asal?: boolean | ObjekPajakCountOutputTypeCountDetail_asalArgs
    sppt?: boolean | ObjekPajakCountOutputTypeCountSpptArgs
  }

  // Custom InputTypes
  /**
   * ObjekPajakCountOutputType without action
   */
  export type ObjekPajakCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajakCountOutputType
     */
    select?: ObjekPajakCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ObjekPajakCountOutputType without action
   */
  export type ObjekPajakCountOutputTypeCountTransaksiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaksiSpopWhereInput
  }

  /**
   * ObjekPajakCountOutputType without action
   */
  export type ObjekPajakCountOutputTypeCountDetail_asalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailTransaksiAsalWhereInput
  }

  /**
   * ObjekPajakCountOutputType without action
   */
  export type ObjekPajakCountOutputTypeCountSpptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpptWhereInput
  }


  /**
   * Count Type SubjekPajakCountOutputType
   */

  export type SubjekPajakCountOutputType = {
    objek_pajak: number
    detail_tujuan: number
  }

  export type SubjekPajakCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    objek_pajak?: boolean | SubjekPajakCountOutputTypeCountObjek_pajakArgs
    detail_tujuan?: boolean | SubjekPajakCountOutputTypeCountDetail_tujuanArgs
  }

  // Custom InputTypes
  /**
   * SubjekPajakCountOutputType without action
   */
  export type SubjekPajakCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajakCountOutputType
     */
    select?: SubjekPajakCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubjekPajakCountOutputType without action
   */
  export type SubjekPajakCountOutputTypeCountObjek_pajakArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjekPajakWhereInput
  }

  /**
   * SubjekPajakCountOutputType without action
   */
  export type SubjekPajakCountOutputTypeCountDetail_tujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailTransaksiTujuanWhereInput
  }


  /**
   * Count Type TransaksiSpopCountOutputType
   */

  export type TransaksiSpopCountOutputType = {
    detail_asal: number
    detail_tujuan: number
    lampiran: number
    sppt: number
  }

  export type TransaksiSpopCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detail_asal?: boolean | TransaksiSpopCountOutputTypeCountDetail_asalArgs
    detail_tujuan?: boolean | TransaksiSpopCountOutputTypeCountDetail_tujuanArgs
    lampiran?: boolean | TransaksiSpopCountOutputTypeCountLampiranArgs
    sppt?: boolean | TransaksiSpopCountOutputTypeCountSpptArgs
  }

  // Custom InputTypes
  /**
   * TransaksiSpopCountOutputType without action
   */
  export type TransaksiSpopCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpopCountOutputType
     */
    select?: TransaksiSpopCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransaksiSpopCountOutputType without action
   */
  export type TransaksiSpopCountOutputTypeCountDetail_asalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailTransaksiAsalWhereInput
  }

  /**
   * TransaksiSpopCountOutputType without action
   */
  export type TransaksiSpopCountOutputTypeCountDetail_tujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailTransaksiTujuanWhereInput
  }

  /**
   * TransaksiSpopCountOutputType without action
   */
  export type TransaksiSpopCountOutputTypeCountLampiranArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LampiranDokumenWhereInput
  }

  /**
   * TransaksiSpopCountOutputType without action
   */
  export type TransaksiSpopCountOutputTypeCountSpptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpptWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    subjek_pajak_dibuat: number
    objek_nonaktif: number
    transaksi_diajukan: number
    transaksi_diverifikasi: number
    lampiran_diupload: number
    sppt_digenerate: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subjek_pajak_dibuat?: boolean | UserCountOutputTypeCountSubjek_pajak_dibuatArgs
    objek_nonaktif?: boolean | UserCountOutputTypeCountObjek_nonaktifArgs
    transaksi_diajukan?: boolean | UserCountOutputTypeCountTransaksi_diajukanArgs
    transaksi_diverifikasi?: boolean | UserCountOutputTypeCountTransaksi_diverifikasiArgs
    lampiran_diupload?: boolean | UserCountOutputTypeCountLampiran_diuploadArgs
    sppt_digenerate?: boolean | UserCountOutputTypeCountSppt_digenerateArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubjek_pajak_dibuatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubjekPajakWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountObjek_nonaktifArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjekPajakWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransaksi_diajukanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaksiSpopWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransaksi_diverifikasiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaksiSpopWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLampiran_diuploadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LampiranDokumenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSppt_digenerateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpptWhereInput
  }


  /**
   * Count Type WilayahCountOutputType
   */

  export type WilayahCountOutputType = {
    users: number
  }

  export type WilayahCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | WilayahCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * WilayahCountOutputType without action
   */
  export type WilayahCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WilayahCountOutputType
     */
    select?: WilayahCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WilayahCountOutputType without action
   */
  export type WilayahCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Models
   */

  /**
   * Model LampiranDokumen
   */

  export type AggregateLampiranDokumen = {
    _count: LampiranDokumenCountAggregateOutputType | null
    _min: LampiranDokumenMinAggregateOutputType | null
    _max: LampiranDokumenMaxAggregateOutputType | null
  }

  export type LampiranDokumenMinAggregateOutputType = {
    id_dokumen: string | null
    id_transaksi: string | null
    jenis_dokumen: $Enums.JenisDokumen | null
    keterangan_dokumen: string | null
    url_file: string | null
    uploaded_at: Date | null
    uploaded_by: string | null
  }

  export type LampiranDokumenMaxAggregateOutputType = {
    id_dokumen: string | null
    id_transaksi: string | null
    jenis_dokumen: $Enums.JenisDokumen | null
    keterangan_dokumen: string | null
    url_file: string | null
    uploaded_at: Date | null
    uploaded_by: string | null
  }

  export type LampiranDokumenCountAggregateOutputType = {
    id_dokumen: number
    id_transaksi: number
    jenis_dokumen: number
    keterangan_dokumen: number
    url_file: number
    uploaded_at: number
    uploaded_by: number
    _all: number
  }


  export type LampiranDokumenMinAggregateInputType = {
    id_dokumen?: true
    id_transaksi?: true
    jenis_dokumen?: true
    keterangan_dokumen?: true
    url_file?: true
    uploaded_at?: true
    uploaded_by?: true
  }

  export type LampiranDokumenMaxAggregateInputType = {
    id_dokumen?: true
    id_transaksi?: true
    jenis_dokumen?: true
    keterangan_dokumen?: true
    url_file?: true
    uploaded_at?: true
    uploaded_by?: true
  }

  export type LampiranDokumenCountAggregateInputType = {
    id_dokumen?: true
    id_transaksi?: true
    jenis_dokumen?: true
    keterangan_dokumen?: true
    url_file?: true
    uploaded_at?: true
    uploaded_by?: true
    _all?: true
  }

  export type LampiranDokumenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LampiranDokumen to aggregate.
     */
    where?: LampiranDokumenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LampiranDokumen to fetch.
     */
    orderBy?: LampiranDokumenOrderByWithRelationInput | LampiranDokumenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LampiranDokumenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LampiranDokumen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LampiranDokumen.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LampiranDokumen
    **/
    _count?: true | LampiranDokumenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LampiranDokumenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LampiranDokumenMaxAggregateInputType
  }

  export type GetLampiranDokumenAggregateType<T extends LampiranDokumenAggregateArgs> = {
        [P in keyof T & keyof AggregateLampiranDokumen]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLampiranDokumen[P]>
      : GetScalarType<T[P], AggregateLampiranDokumen[P]>
  }




  export type LampiranDokumenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LampiranDokumenWhereInput
    orderBy?: LampiranDokumenOrderByWithAggregationInput | LampiranDokumenOrderByWithAggregationInput[]
    by: LampiranDokumenScalarFieldEnum[] | LampiranDokumenScalarFieldEnum
    having?: LampiranDokumenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LampiranDokumenCountAggregateInputType | true
    _min?: LampiranDokumenMinAggregateInputType
    _max?: LampiranDokumenMaxAggregateInputType
  }

  export type LampiranDokumenGroupByOutputType = {
    id_dokumen: string
    id_transaksi: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen: string | null
    url_file: string
    uploaded_at: Date
    uploaded_by: string
    _count: LampiranDokumenCountAggregateOutputType | null
    _min: LampiranDokumenMinAggregateOutputType | null
    _max: LampiranDokumenMaxAggregateOutputType | null
  }

  type GetLampiranDokumenGroupByPayload<T extends LampiranDokumenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LampiranDokumenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LampiranDokumenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LampiranDokumenGroupByOutputType[P]>
            : GetScalarType<T[P], LampiranDokumenGroupByOutputType[P]>
        }
      >
    >


  export type LampiranDokumenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_dokumen?: boolean
    id_transaksi?: boolean
    jenis_dokumen?: boolean
    keterangan_dokumen?: boolean
    url_file?: boolean
    uploaded_at?: boolean
    uploaded_by?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lampiranDokumen"]>

  export type LampiranDokumenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_dokumen?: boolean
    id_transaksi?: boolean
    jenis_dokumen?: boolean
    keterangan_dokumen?: boolean
    url_file?: boolean
    uploaded_at?: boolean
    uploaded_by?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lampiranDokumen"]>

  export type LampiranDokumenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_dokumen?: boolean
    id_transaksi?: boolean
    jenis_dokumen?: boolean
    keterangan_dokumen?: boolean
    url_file?: boolean
    uploaded_at?: boolean
    uploaded_by?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lampiranDokumen"]>

  export type LampiranDokumenSelectScalar = {
    id_dokumen?: boolean
    id_transaksi?: boolean
    jenis_dokumen?: boolean
    keterangan_dokumen?: boolean
    url_file?: boolean
    uploaded_at?: boolean
    uploaded_by?: boolean
  }

  export type LampiranDokumenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_dokumen" | "id_transaksi" | "jenis_dokumen" | "keterangan_dokumen" | "url_file" | "uploaded_at" | "uploaded_by", ExtArgs["result"]["lampiranDokumen"]>
  export type LampiranDokumenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LampiranDokumenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LampiranDokumenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    uploader?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LampiranDokumenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LampiranDokumen"
    objects: {
      transaksi: Prisma.$TransaksiSpopPayload<ExtArgs>
      uploader: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id_dokumen: string
      id_transaksi: string
      jenis_dokumen: $Enums.JenisDokumen
      keterangan_dokumen: string | null
      url_file: string
      uploaded_at: Date
      uploaded_by: string
    }, ExtArgs["result"]["lampiranDokumen"]>
    composites: {}
  }

  type LampiranDokumenGetPayload<S extends boolean | null | undefined | LampiranDokumenDefaultArgs> = $Result.GetResult<Prisma.$LampiranDokumenPayload, S>

  type LampiranDokumenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LampiranDokumenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LampiranDokumenCountAggregateInputType | true
    }

  export interface LampiranDokumenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LampiranDokumen'], meta: { name: 'LampiranDokumen' } }
    /**
     * Find zero or one LampiranDokumen that matches the filter.
     * @param {LampiranDokumenFindUniqueArgs} args - Arguments to find a LampiranDokumen
     * @example
     * // Get one LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LampiranDokumenFindUniqueArgs>(args: SelectSubset<T, LampiranDokumenFindUniqueArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LampiranDokumen that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LampiranDokumenFindUniqueOrThrowArgs} args - Arguments to find a LampiranDokumen
     * @example
     * // Get one LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LampiranDokumenFindUniqueOrThrowArgs>(args: SelectSubset<T, LampiranDokumenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LampiranDokumen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LampiranDokumenFindFirstArgs} args - Arguments to find a LampiranDokumen
     * @example
     * // Get one LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LampiranDokumenFindFirstArgs>(args?: SelectSubset<T, LampiranDokumenFindFirstArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LampiranDokumen that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LampiranDokumenFindFirstOrThrowArgs} args - Arguments to find a LampiranDokumen
     * @example
     * // Get one LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LampiranDokumenFindFirstOrThrowArgs>(args?: SelectSubset<T, LampiranDokumenFindFirstOrThrowArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LampiranDokumen that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LampiranDokumenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.findMany()
     * 
     * // Get first 10 LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.findMany({ take: 10 })
     * 
     * // Only select the `id_dokumen`
     * const lampiranDokumenWithId_dokumenOnly = await prisma.lampiranDokumen.findMany({ select: { id_dokumen: true } })
     * 
     */
    findMany<T extends LampiranDokumenFindManyArgs>(args?: SelectSubset<T, LampiranDokumenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LampiranDokumen.
     * @param {LampiranDokumenCreateArgs} args - Arguments to create a LampiranDokumen.
     * @example
     * // Create one LampiranDokumen
     * const LampiranDokumen = await prisma.lampiranDokumen.create({
     *   data: {
     *     // ... data to create a LampiranDokumen
     *   }
     * })
     * 
     */
    create<T extends LampiranDokumenCreateArgs>(args: SelectSubset<T, LampiranDokumenCreateArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LampiranDokumen.
     * @param {LampiranDokumenCreateManyArgs} args - Arguments to create many LampiranDokumen.
     * @example
     * // Create many LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LampiranDokumenCreateManyArgs>(args?: SelectSubset<T, LampiranDokumenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LampiranDokumen and returns the data saved in the database.
     * @param {LampiranDokumenCreateManyAndReturnArgs} args - Arguments to create many LampiranDokumen.
     * @example
     * // Create many LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LampiranDokumen and only return the `id_dokumen`
     * const lampiranDokumenWithId_dokumenOnly = await prisma.lampiranDokumen.createManyAndReturn({
     *   select: { id_dokumen: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LampiranDokumenCreateManyAndReturnArgs>(args?: SelectSubset<T, LampiranDokumenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LampiranDokumen.
     * @param {LampiranDokumenDeleteArgs} args - Arguments to delete one LampiranDokumen.
     * @example
     * // Delete one LampiranDokumen
     * const LampiranDokumen = await prisma.lampiranDokumen.delete({
     *   where: {
     *     // ... filter to delete one LampiranDokumen
     *   }
     * })
     * 
     */
    delete<T extends LampiranDokumenDeleteArgs>(args: SelectSubset<T, LampiranDokumenDeleteArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LampiranDokumen.
     * @param {LampiranDokumenUpdateArgs} args - Arguments to update one LampiranDokumen.
     * @example
     * // Update one LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LampiranDokumenUpdateArgs>(args: SelectSubset<T, LampiranDokumenUpdateArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LampiranDokumen.
     * @param {LampiranDokumenDeleteManyArgs} args - Arguments to filter LampiranDokumen to delete.
     * @example
     * // Delete a few LampiranDokumen
     * const { count } = await prisma.lampiranDokumen.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LampiranDokumenDeleteManyArgs>(args?: SelectSubset<T, LampiranDokumenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LampiranDokumen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LampiranDokumenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LampiranDokumenUpdateManyArgs>(args: SelectSubset<T, LampiranDokumenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LampiranDokumen and returns the data updated in the database.
     * @param {LampiranDokumenUpdateManyAndReturnArgs} args - Arguments to update many LampiranDokumen.
     * @example
     * // Update many LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LampiranDokumen and only return the `id_dokumen`
     * const lampiranDokumenWithId_dokumenOnly = await prisma.lampiranDokumen.updateManyAndReturn({
     *   select: { id_dokumen: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LampiranDokumenUpdateManyAndReturnArgs>(args: SelectSubset<T, LampiranDokumenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LampiranDokumen.
     * @param {LampiranDokumenUpsertArgs} args - Arguments to update or create a LampiranDokumen.
     * @example
     * // Update or create a LampiranDokumen
     * const lampiranDokumen = await prisma.lampiranDokumen.upsert({
     *   create: {
     *     // ... data to create a LampiranDokumen
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LampiranDokumen we want to update
     *   }
     * })
     */
    upsert<T extends LampiranDokumenUpsertArgs>(args: SelectSubset<T, LampiranDokumenUpsertArgs<ExtArgs>>): Prisma__LampiranDokumenClient<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LampiranDokumen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LampiranDokumenCountArgs} args - Arguments to filter LampiranDokumen to count.
     * @example
     * // Count the number of LampiranDokumen
     * const count = await prisma.lampiranDokumen.count({
     *   where: {
     *     // ... the filter for the LampiranDokumen we want to count
     *   }
     * })
    **/
    count<T extends LampiranDokumenCountArgs>(
      args?: Subset<T, LampiranDokumenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LampiranDokumenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LampiranDokumen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LampiranDokumenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LampiranDokumenAggregateArgs>(args: Subset<T, LampiranDokumenAggregateArgs>): Prisma.PrismaPromise<GetLampiranDokumenAggregateType<T>>

    /**
     * Group by LampiranDokumen.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LampiranDokumenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LampiranDokumenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LampiranDokumenGroupByArgs['orderBy'] }
        : { orderBy?: LampiranDokumenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LampiranDokumenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLampiranDokumenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LampiranDokumen model
   */
  readonly fields: LampiranDokumenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LampiranDokumen.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LampiranDokumenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transaksi<T extends TransaksiSpopDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpopDefaultArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    uploader<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LampiranDokumen model
   */
  interface LampiranDokumenFieldRefs {
    readonly id_dokumen: FieldRef<"LampiranDokumen", 'String'>
    readonly id_transaksi: FieldRef<"LampiranDokumen", 'String'>
    readonly jenis_dokumen: FieldRef<"LampiranDokumen", 'JenisDokumen'>
    readonly keterangan_dokumen: FieldRef<"LampiranDokumen", 'String'>
    readonly url_file: FieldRef<"LampiranDokumen", 'String'>
    readonly uploaded_at: FieldRef<"LampiranDokumen", 'DateTime'>
    readonly uploaded_by: FieldRef<"LampiranDokumen", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LampiranDokumen findUnique
   */
  export type LampiranDokumenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * Filter, which LampiranDokumen to fetch.
     */
    where: LampiranDokumenWhereUniqueInput
  }

  /**
   * LampiranDokumen findUniqueOrThrow
   */
  export type LampiranDokumenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * Filter, which LampiranDokumen to fetch.
     */
    where: LampiranDokumenWhereUniqueInput
  }

  /**
   * LampiranDokumen findFirst
   */
  export type LampiranDokumenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * Filter, which LampiranDokumen to fetch.
     */
    where?: LampiranDokumenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LampiranDokumen to fetch.
     */
    orderBy?: LampiranDokumenOrderByWithRelationInput | LampiranDokumenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LampiranDokumen.
     */
    cursor?: LampiranDokumenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LampiranDokumen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LampiranDokumen.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LampiranDokumen.
     */
    distinct?: LampiranDokumenScalarFieldEnum | LampiranDokumenScalarFieldEnum[]
  }

  /**
   * LampiranDokumen findFirstOrThrow
   */
  export type LampiranDokumenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * Filter, which LampiranDokumen to fetch.
     */
    where?: LampiranDokumenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LampiranDokumen to fetch.
     */
    orderBy?: LampiranDokumenOrderByWithRelationInput | LampiranDokumenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LampiranDokumen.
     */
    cursor?: LampiranDokumenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LampiranDokumen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LampiranDokumen.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LampiranDokumen.
     */
    distinct?: LampiranDokumenScalarFieldEnum | LampiranDokumenScalarFieldEnum[]
  }

  /**
   * LampiranDokumen findMany
   */
  export type LampiranDokumenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * Filter, which LampiranDokumen to fetch.
     */
    where?: LampiranDokumenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LampiranDokumen to fetch.
     */
    orderBy?: LampiranDokumenOrderByWithRelationInput | LampiranDokumenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LampiranDokumen.
     */
    cursor?: LampiranDokumenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LampiranDokumen from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LampiranDokumen.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LampiranDokumen.
     */
    distinct?: LampiranDokumenScalarFieldEnum | LampiranDokumenScalarFieldEnum[]
  }

  /**
   * LampiranDokumen create
   */
  export type LampiranDokumenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * The data needed to create a LampiranDokumen.
     */
    data: XOR<LampiranDokumenCreateInput, LampiranDokumenUncheckedCreateInput>
  }

  /**
   * LampiranDokumen createMany
   */
  export type LampiranDokumenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LampiranDokumen.
     */
    data: LampiranDokumenCreateManyInput | LampiranDokumenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LampiranDokumen createManyAndReturn
   */
  export type LampiranDokumenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * The data used to create many LampiranDokumen.
     */
    data: LampiranDokumenCreateManyInput | LampiranDokumenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LampiranDokumen update
   */
  export type LampiranDokumenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * The data needed to update a LampiranDokumen.
     */
    data: XOR<LampiranDokumenUpdateInput, LampiranDokumenUncheckedUpdateInput>
    /**
     * Choose, which LampiranDokumen to update.
     */
    where: LampiranDokumenWhereUniqueInput
  }

  /**
   * LampiranDokumen updateMany
   */
  export type LampiranDokumenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LampiranDokumen.
     */
    data: XOR<LampiranDokumenUpdateManyMutationInput, LampiranDokumenUncheckedUpdateManyInput>
    /**
     * Filter which LampiranDokumen to update
     */
    where?: LampiranDokumenWhereInput
    /**
     * Limit how many LampiranDokumen to update.
     */
    limit?: number
  }

  /**
   * LampiranDokumen updateManyAndReturn
   */
  export type LampiranDokumenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * The data used to update LampiranDokumen.
     */
    data: XOR<LampiranDokumenUpdateManyMutationInput, LampiranDokumenUncheckedUpdateManyInput>
    /**
     * Filter which LampiranDokumen to update
     */
    where?: LampiranDokumenWhereInput
    /**
     * Limit how many LampiranDokumen to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LampiranDokumen upsert
   */
  export type LampiranDokumenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * The filter to search for the LampiranDokumen to update in case it exists.
     */
    where: LampiranDokumenWhereUniqueInput
    /**
     * In case the LampiranDokumen found by the `where` argument doesn't exist, create a new LampiranDokumen with this data.
     */
    create: XOR<LampiranDokumenCreateInput, LampiranDokumenUncheckedCreateInput>
    /**
     * In case the LampiranDokumen was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LampiranDokumenUpdateInput, LampiranDokumenUncheckedUpdateInput>
  }

  /**
   * LampiranDokumen delete
   */
  export type LampiranDokumenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    /**
     * Filter which LampiranDokumen to delete.
     */
    where: LampiranDokumenWhereUniqueInput
  }

  /**
   * LampiranDokumen deleteMany
   */
  export type LampiranDokumenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LampiranDokumen to delete
     */
    where?: LampiranDokumenWhereInput
    /**
     * Limit how many LampiranDokumen to delete.
     */
    limit?: number
  }

  /**
   * LampiranDokumen without action
   */
  export type LampiranDokumenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
  }


  /**
   * Model ObjekPajak
   */

  export type AggregateObjekPajak = {
    _count: ObjekPajakCountAggregateOutputType | null
    _avg: ObjekPajakAvgAggregateOutputType | null
    _sum: ObjekPajakSumAggregateOutputType | null
    _min: ObjekPajakMinAggregateOutputType | null
    _max: ObjekPajakMaxAggregateOutputType | null
  }

  export type ObjekPajakAvgAggregateOutputType = {
    luas_tanah: Decimal | null
    jumlah_bangunan: number | null
    luas_bangunan: Decimal | null
    njop_tanah: Decimal | null
    njop_bangunan: Decimal | null
    njop_total: Decimal | null
    tahun_penilaian: number | null
  }

  export type ObjekPajakSumAggregateOutputType = {
    luas_tanah: Decimal | null
    jumlah_bangunan: number | null
    luas_bangunan: Decimal | null
    njop_tanah: Decimal | null
    njop_bangunan: Decimal | null
    njop_total: Decimal | null
    tahun_penilaian: number | null
  }

  export type ObjekPajakMinAggregateOutputType = {
    nop: string | null
    nik_subjek: string | null
    no_persil: string | null
    jalan_op: string | null
    blok_kav_no: string | null
    rw_op: string | null
    rt_op: string | null
    kelurahan_op: string | null
    kecamatan_op: string | null
    luas_tanah: Decimal | null
    zona_nilai_tanah: string | null
    jenis_tanah: $Enums.JenisTanah | null
    jumlah_bangunan: number | null
    luas_bangunan: Decimal | null
    njop_tanah: Decimal | null
    njop_bangunan: Decimal | null
    njop_total: Decimal | null
    tahun_penilaian: number | null
    status_aktif: boolean | null
    nonaktif_oleh: string | null
    nonaktif_at: Date | null
    created_at: Date | null
  }

  export type ObjekPajakMaxAggregateOutputType = {
    nop: string | null
    nik_subjek: string | null
    no_persil: string | null
    jalan_op: string | null
    blok_kav_no: string | null
    rw_op: string | null
    rt_op: string | null
    kelurahan_op: string | null
    kecamatan_op: string | null
    luas_tanah: Decimal | null
    zona_nilai_tanah: string | null
    jenis_tanah: $Enums.JenisTanah | null
    jumlah_bangunan: number | null
    luas_bangunan: Decimal | null
    njop_tanah: Decimal | null
    njop_bangunan: Decimal | null
    njop_total: Decimal | null
    tahun_penilaian: number | null
    status_aktif: boolean | null
    nonaktif_oleh: string | null
    nonaktif_at: Date | null
    created_at: Date | null
  }

  export type ObjekPajakCountAggregateOutputType = {
    nop: number
    nik_subjek: number
    no_persil: number
    jalan_op: number
    blok_kav_no: number
    rw_op: number
    rt_op: number
    kelurahan_op: number
    kecamatan_op: number
    luas_tanah: number
    zona_nilai_tanah: number
    jenis_tanah: number
    jumlah_bangunan: number
    luas_bangunan: number
    njop_tanah: number
    njop_bangunan: number
    njop_total: number
    tahun_penilaian: number
    status_aktif: number
    nonaktif_oleh: number
    nonaktif_at: number
    created_at: number
    _all: number
  }


  export type ObjekPajakAvgAggregateInputType = {
    luas_tanah?: true
    jumlah_bangunan?: true
    luas_bangunan?: true
    njop_tanah?: true
    njop_bangunan?: true
    njop_total?: true
    tahun_penilaian?: true
  }

  export type ObjekPajakSumAggregateInputType = {
    luas_tanah?: true
    jumlah_bangunan?: true
    luas_bangunan?: true
    njop_tanah?: true
    njop_bangunan?: true
    njop_total?: true
    tahun_penilaian?: true
  }

  export type ObjekPajakMinAggregateInputType = {
    nop?: true
    nik_subjek?: true
    no_persil?: true
    jalan_op?: true
    blok_kav_no?: true
    rw_op?: true
    rt_op?: true
    kelurahan_op?: true
    kecamatan_op?: true
    luas_tanah?: true
    zona_nilai_tanah?: true
    jenis_tanah?: true
    jumlah_bangunan?: true
    luas_bangunan?: true
    njop_tanah?: true
    njop_bangunan?: true
    njop_total?: true
    tahun_penilaian?: true
    status_aktif?: true
    nonaktif_oleh?: true
    nonaktif_at?: true
    created_at?: true
  }

  export type ObjekPajakMaxAggregateInputType = {
    nop?: true
    nik_subjek?: true
    no_persil?: true
    jalan_op?: true
    blok_kav_no?: true
    rw_op?: true
    rt_op?: true
    kelurahan_op?: true
    kecamatan_op?: true
    luas_tanah?: true
    zona_nilai_tanah?: true
    jenis_tanah?: true
    jumlah_bangunan?: true
    luas_bangunan?: true
    njop_tanah?: true
    njop_bangunan?: true
    njop_total?: true
    tahun_penilaian?: true
    status_aktif?: true
    nonaktif_oleh?: true
    nonaktif_at?: true
    created_at?: true
  }

  export type ObjekPajakCountAggregateInputType = {
    nop?: true
    nik_subjek?: true
    no_persil?: true
    jalan_op?: true
    blok_kav_no?: true
    rw_op?: true
    rt_op?: true
    kelurahan_op?: true
    kecamatan_op?: true
    luas_tanah?: true
    zona_nilai_tanah?: true
    jenis_tanah?: true
    jumlah_bangunan?: true
    luas_bangunan?: true
    njop_tanah?: true
    njop_bangunan?: true
    njop_total?: true
    tahun_penilaian?: true
    status_aktif?: true
    nonaktif_oleh?: true
    nonaktif_at?: true
    created_at?: true
    _all?: true
  }

  export type ObjekPajakAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObjekPajak to aggregate.
     */
    where?: ObjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjekPajaks to fetch.
     */
    orderBy?: ObjekPajakOrderByWithRelationInput | ObjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ObjekPajaks
    **/
    _count?: true | ObjekPajakCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ObjekPajakAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ObjekPajakSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObjekPajakMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObjekPajakMaxAggregateInputType
  }

  export type GetObjekPajakAggregateType<T extends ObjekPajakAggregateArgs> = {
        [P in keyof T & keyof AggregateObjekPajak]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObjekPajak[P]>
      : GetScalarType<T[P], AggregateObjekPajak[P]>
  }




  export type ObjekPajakGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObjekPajakWhereInput
    orderBy?: ObjekPajakOrderByWithAggregationInput | ObjekPajakOrderByWithAggregationInput[]
    by: ObjekPajakScalarFieldEnum[] | ObjekPajakScalarFieldEnum
    having?: ObjekPajakScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObjekPajakCountAggregateInputType | true
    _avg?: ObjekPajakAvgAggregateInputType
    _sum?: ObjekPajakSumAggregateInputType
    _min?: ObjekPajakMinAggregateInputType
    _max?: ObjekPajakMaxAggregateInputType
  }

  export type ObjekPajakGroupByOutputType = {
    nop: string
    nik_subjek: string
    no_persil: string | null
    jalan_op: string
    blok_kav_no: string | null
    rw_op: string | null
    rt_op: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal
    zona_nilai_tanah: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan: number
    luas_bangunan: Decimal
    njop_tanah: Decimal | null
    njop_bangunan: Decimal | null
    njop_total: Decimal | null
    tahun_penilaian: number | null
    status_aktif: boolean
    nonaktif_oleh: string | null
    nonaktif_at: Date | null
    created_at: Date
    _count: ObjekPajakCountAggregateOutputType | null
    _avg: ObjekPajakAvgAggregateOutputType | null
    _sum: ObjekPajakSumAggregateOutputType | null
    _min: ObjekPajakMinAggregateOutputType | null
    _max: ObjekPajakMaxAggregateOutputType | null
  }

  type GetObjekPajakGroupByPayload<T extends ObjekPajakGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObjekPajakGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObjekPajakGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObjekPajakGroupByOutputType[P]>
            : GetScalarType<T[P], ObjekPajakGroupByOutputType[P]>
        }
      >
    >


  export type ObjekPajakSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nop?: boolean
    nik_subjek?: boolean
    no_persil?: boolean
    jalan_op?: boolean
    blok_kav_no?: boolean
    rw_op?: boolean
    rt_op?: boolean
    kelurahan_op?: boolean
    kecamatan_op?: boolean
    luas_tanah?: boolean
    zona_nilai_tanah?: boolean
    jenis_tanah?: boolean
    jumlah_bangunan?: boolean
    luas_bangunan?: boolean
    njop_tanah?: boolean
    njop_bangunan?: boolean
    njop_total?: boolean
    tahun_penilaian?: boolean
    status_aktif?: boolean
    nonaktif_oleh?: boolean
    nonaktif_at?: boolean
    created_at?: boolean
    subjek_pajak?: boolean | SubjekPajakDefaultArgs<ExtArgs>
    user_nonaktif?: boolean | ObjekPajak$user_nonaktifArgs<ExtArgs>
    transaksi?: boolean | ObjekPajak$transaksiArgs<ExtArgs>
    detail_asal?: boolean | ObjekPajak$detail_asalArgs<ExtArgs>
    sppt?: boolean | ObjekPajak$spptArgs<ExtArgs>
    _count?: boolean | ObjekPajakCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["objekPajak"]>

  export type ObjekPajakSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nop?: boolean
    nik_subjek?: boolean
    no_persil?: boolean
    jalan_op?: boolean
    blok_kav_no?: boolean
    rw_op?: boolean
    rt_op?: boolean
    kelurahan_op?: boolean
    kecamatan_op?: boolean
    luas_tanah?: boolean
    zona_nilai_tanah?: boolean
    jenis_tanah?: boolean
    jumlah_bangunan?: boolean
    luas_bangunan?: boolean
    njop_tanah?: boolean
    njop_bangunan?: boolean
    njop_total?: boolean
    tahun_penilaian?: boolean
    status_aktif?: boolean
    nonaktif_oleh?: boolean
    nonaktif_at?: boolean
    created_at?: boolean
    subjek_pajak?: boolean | SubjekPajakDefaultArgs<ExtArgs>
    user_nonaktif?: boolean | ObjekPajak$user_nonaktifArgs<ExtArgs>
  }, ExtArgs["result"]["objekPajak"]>

  export type ObjekPajakSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nop?: boolean
    nik_subjek?: boolean
    no_persil?: boolean
    jalan_op?: boolean
    blok_kav_no?: boolean
    rw_op?: boolean
    rt_op?: boolean
    kelurahan_op?: boolean
    kecamatan_op?: boolean
    luas_tanah?: boolean
    zona_nilai_tanah?: boolean
    jenis_tanah?: boolean
    jumlah_bangunan?: boolean
    luas_bangunan?: boolean
    njop_tanah?: boolean
    njop_bangunan?: boolean
    njop_total?: boolean
    tahun_penilaian?: boolean
    status_aktif?: boolean
    nonaktif_oleh?: boolean
    nonaktif_at?: boolean
    created_at?: boolean
    subjek_pajak?: boolean | SubjekPajakDefaultArgs<ExtArgs>
    user_nonaktif?: boolean | ObjekPajak$user_nonaktifArgs<ExtArgs>
  }, ExtArgs["result"]["objekPajak"]>

  export type ObjekPajakSelectScalar = {
    nop?: boolean
    nik_subjek?: boolean
    no_persil?: boolean
    jalan_op?: boolean
    blok_kav_no?: boolean
    rw_op?: boolean
    rt_op?: boolean
    kelurahan_op?: boolean
    kecamatan_op?: boolean
    luas_tanah?: boolean
    zona_nilai_tanah?: boolean
    jenis_tanah?: boolean
    jumlah_bangunan?: boolean
    luas_bangunan?: boolean
    njop_tanah?: boolean
    njop_bangunan?: boolean
    njop_total?: boolean
    tahun_penilaian?: boolean
    status_aktif?: boolean
    nonaktif_oleh?: boolean
    nonaktif_at?: boolean
    created_at?: boolean
  }

  export type ObjekPajakOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"nop" | "nik_subjek" | "no_persil" | "jalan_op" | "blok_kav_no" | "rw_op" | "rt_op" | "kelurahan_op" | "kecamatan_op" | "luas_tanah" | "zona_nilai_tanah" | "jenis_tanah" | "jumlah_bangunan" | "luas_bangunan" | "njop_tanah" | "njop_bangunan" | "njop_total" | "tahun_penilaian" | "status_aktif" | "nonaktif_oleh" | "nonaktif_at" | "created_at", ExtArgs["result"]["objekPajak"]>
  export type ObjekPajakInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subjek_pajak?: boolean | SubjekPajakDefaultArgs<ExtArgs>
    user_nonaktif?: boolean | ObjekPajak$user_nonaktifArgs<ExtArgs>
    transaksi?: boolean | ObjekPajak$transaksiArgs<ExtArgs>
    detail_asal?: boolean | ObjekPajak$detail_asalArgs<ExtArgs>
    sppt?: boolean | ObjekPajak$spptArgs<ExtArgs>
    _count?: boolean | ObjekPajakCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ObjekPajakIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subjek_pajak?: boolean | SubjekPajakDefaultArgs<ExtArgs>
    user_nonaktif?: boolean | ObjekPajak$user_nonaktifArgs<ExtArgs>
  }
  export type ObjekPajakIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subjek_pajak?: boolean | SubjekPajakDefaultArgs<ExtArgs>
    user_nonaktif?: boolean | ObjekPajak$user_nonaktifArgs<ExtArgs>
  }

  export type $ObjekPajakPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ObjekPajak"
    objects: {
      subjek_pajak: Prisma.$SubjekPajakPayload<ExtArgs>
      user_nonaktif: Prisma.$UserPayload<ExtArgs> | null
      transaksi: Prisma.$TransaksiSpopPayload<ExtArgs>[]
      detail_asal: Prisma.$DetailTransaksiAsalPayload<ExtArgs>[]
      sppt: Prisma.$SpptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      nop: string
      nik_subjek: string
      no_persil: string | null
      jalan_op: string
      blok_kav_no: string | null
      rw_op: string | null
      rt_op: string | null
      kelurahan_op: string
      kecamatan_op: string
      luas_tanah: Prisma.Decimal
      zona_nilai_tanah: string | null
      jenis_tanah: $Enums.JenisTanah
      jumlah_bangunan: number
      luas_bangunan: Prisma.Decimal
      njop_tanah: Prisma.Decimal | null
      njop_bangunan: Prisma.Decimal | null
      njop_total: Prisma.Decimal | null
      tahun_penilaian: number | null
      status_aktif: boolean
      nonaktif_oleh: string | null
      nonaktif_at: Date | null
      created_at: Date
    }, ExtArgs["result"]["objekPajak"]>
    composites: {}
  }

  type ObjekPajakGetPayload<S extends boolean | null | undefined | ObjekPajakDefaultArgs> = $Result.GetResult<Prisma.$ObjekPajakPayload, S>

  type ObjekPajakCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ObjekPajakFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ObjekPajakCountAggregateInputType | true
    }

  export interface ObjekPajakDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ObjekPajak'], meta: { name: 'ObjekPajak' } }
    /**
     * Find zero or one ObjekPajak that matches the filter.
     * @param {ObjekPajakFindUniqueArgs} args - Arguments to find a ObjekPajak
     * @example
     * // Get one ObjekPajak
     * const objekPajak = await prisma.objekPajak.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObjekPajakFindUniqueArgs>(args: SelectSubset<T, ObjekPajakFindUniqueArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ObjekPajak that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ObjekPajakFindUniqueOrThrowArgs} args - Arguments to find a ObjekPajak
     * @example
     * // Get one ObjekPajak
     * const objekPajak = await prisma.objekPajak.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObjekPajakFindUniqueOrThrowArgs>(args: SelectSubset<T, ObjekPajakFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ObjekPajak that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjekPajakFindFirstArgs} args - Arguments to find a ObjekPajak
     * @example
     * // Get one ObjekPajak
     * const objekPajak = await prisma.objekPajak.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObjekPajakFindFirstArgs>(args?: SelectSubset<T, ObjekPajakFindFirstArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ObjekPajak that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjekPajakFindFirstOrThrowArgs} args - Arguments to find a ObjekPajak
     * @example
     * // Get one ObjekPajak
     * const objekPajak = await prisma.objekPajak.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObjekPajakFindFirstOrThrowArgs>(args?: SelectSubset<T, ObjekPajakFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ObjekPajaks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjekPajakFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ObjekPajaks
     * const objekPajaks = await prisma.objekPajak.findMany()
     * 
     * // Get first 10 ObjekPajaks
     * const objekPajaks = await prisma.objekPajak.findMany({ take: 10 })
     * 
     * // Only select the `nop`
     * const objekPajakWithNopOnly = await prisma.objekPajak.findMany({ select: { nop: true } })
     * 
     */
    findMany<T extends ObjekPajakFindManyArgs>(args?: SelectSubset<T, ObjekPajakFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ObjekPajak.
     * @param {ObjekPajakCreateArgs} args - Arguments to create a ObjekPajak.
     * @example
     * // Create one ObjekPajak
     * const ObjekPajak = await prisma.objekPajak.create({
     *   data: {
     *     // ... data to create a ObjekPajak
     *   }
     * })
     * 
     */
    create<T extends ObjekPajakCreateArgs>(args: SelectSubset<T, ObjekPajakCreateArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ObjekPajaks.
     * @param {ObjekPajakCreateManyArgs} args - Arguments to create many ObjekPajaks.
     * @example
     * // Create many ObjekPajaks
     * const objekPajak = await prisma.objekPajak.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObjekPajakCreateManyArgs>(args?: SelectSubset<T, ObjekPajakCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ObjekPajaks and returns the data saved in the database.
     * @param {ObjekPajakCreateManyAndReturnArgs} args - Arguments to create many ObjekPajaks.
     * @example
     * // Create many ObjekPajaks
     * const objekPajak = await prisma.objekPajak.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ObjekPajaks and only return the `nop`
     * const objekPajakWithNopOnly = await prisma.objekPajak.createManyAndReturn({
     *   select: { nop: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObjekPajakCreateManyAndReturnArgs>(args?: SelectSubset<T, ObjekPajakCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ObjekPajak.
     * @param {ObjekPajakDeleteArgs} args - Arguments to delete one ObjekPajak.
     * @example
     * // Delete one ObjekPajak
     * const ObjekPajak = await prisma.objekPajak.delete({
     *   where: {
     *     // ... filter to delete one ObjekPajak
     *   }
     * })
     * 
     */
    delete<T extends ObjekPajakDeleteArgs>(args: SelectSubset<T, ObjekPajakDeleteArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ObjekPajak.
     * @param {ObjekPajakUpdateArgs} args - Arguments to update one ObjekPajak.
     * @example
     * // Update one ObjekPajak
     * const objekPajak = await prisma.objekPajak.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObjekPajakUpdateArgs>(args: SelectSubset<T, ObjekPajakUpdateArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ObjekPajaks.
     * @param {ObjekPajakDeleteManyArgs} args - Arguments to filter ObjekPajaks to delete.
     * @example
     * // Delete a few ObjekPajaks
     * const { count } = await prisma.objekPajak.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObjekPajakDeleteManyArgs>(args?: SelectSubset<T, ObjekPajakDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObjekPajaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjekPajakUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ObjekPajaks
     * const objekPajak = await prisma.objekPajak.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObjekPajakUpdateManyArgs>(args: SelectSubset<T, ObjekPajakUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObjekPajaks and returns the data updated in the database.
     * @param {ObjekPajakUpdateManyAndReturnArgs} args - Arguments to update many ObjekPajaks.
     * @example
     * // Update many ObjekPajaks
     * const objekPajak = await prisma.objekPajak.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ObjekPajaks and only return the `nop`
     * const objekPajakWithNopOnly = await prisma.objekPajak.updateManyAndReturn({
     *   select: { nop: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ObjekPajakUpdateManyAndReturnArgs>(args: SelectSubset<T, ObjekPajakUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ObjekPajak.
     * @param {ObjekPajakUpsertArgs} args - Arguments to update or create a ObjekPajak.
     * @example
     * // Update or create a ObjekPajak
     * const objekPajak = await prisma.objekPajak.upsert({
     *   create: {
     *     // ... data to create a ObjekPajak
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ObjekPajak we want to update
     *   }
     * })
     */
    upsert<T extends ObjekPajakUpsertArgs>(args: SelectSubset<T, ObjekPajakUpsertArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ObjekPajaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjekPajakCountArgs} args - Arguments to filter ObjekPajaks to count.
     * @example
     * // Count the number of ObjekPajaks
     * const count = await prisma.objekPajak.count({
     *   where: {
     *     // ... the filter for the ObjekPajaks we want to count
     *   }
     * })
    **/
    count<T extends ObjekPajakCountArgs>(
      args?: Subset<T, ObjekPajakCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObjekPajakCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ObjekPajak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjekPajakAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObjekPajakAggregateArgs>(args: Subset<T, ObjekPajakAggregateArgs>): Prisma.PrismaPromise<GetObjekPajakAggregateType<T>>

    /**
     * Group by ObjekPajak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObjekPajakGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObjekPajakGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObjekPajakGroupByArgs['orderBy'] }
        : { orderBy?: ObjekPajakGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObjekPajakGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObjekPajakGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ObjekPajak model
   */
  readonly fields: ObjekPajakFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ObjekPajak.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObjekPajakClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subjek_pajak<T extends SubjekPajakDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubjekPajakDefaultArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user_nonaktif<T extends ObjekPajak$user_nonaktifArgs<ExtArgs> = {}>(args?: Subset<T, ObjekPajak$user_nonaktifArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    transaksi<T extends ObjekPajak$transaksiArgs<ExtArgs> = {}>(args?: Subset<T, ObjekPajak$transaksiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    detail_asal<T extends ObjekPajak$detail_asalArgs<ExtArgs> = {}>(args?: Subset<T, ObjekPajak$detail_asalArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sppt<T extends ObjekPajak$spptArgs<ExtArgs> = {}>(args?: Subset<T, ObjekPajak$spptArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ObjekPajak model
   */
  interface ObjekPajakFieldRefs {
    readonly nop: FieldRef<"ObjekPajak", 'String'>
    readonly nik_subjek: FieldRef<"ObjekPajak", 'String'>
    readonly no_persil: FieldRef<"ObjekPajak", 'String'>
    readonly jalan_op: FieldRef<"ObjekPajak", 'String'>
    readonly blok_kav_no: FieldRef<"ObjekPajak", 'String'>
    readonly rw_op: FieldRef<"ObjekPajak", 'String'>
    readonly rt_op: FieldRef<"ObjekPajak", 'String'>
    readonly kelurahan_op: FieldRef<"ObjekPajak", 'String'>
    readonly kecamatan_op: FieldRef<"ObjekPajak", 'String'>
    readonly luas_tanah: FieldRef<"ObjekPajak", 'Decimal'>
    readonly zona_nilai_tanah: FieldRef<"ObjekPajak", 'String'>
    readonly jenis_tanah: FieldRef<"ObjekPajak", 'JenisTanah'>
    readonly jumlah_bangunan: FieldRef<"ObjekPajak", 'Int'>
    readonly luas_bangunan: FieldRef<"ObjekPajak", 'Decimal'>
    readonly njop_tanah: FieldRef<"ObjekPajak", 'Decimal'>
    readonly njop_bangunan: FieldRef<"ObjekPajak", 'Decimal'>
    readonly njop_total: FieldRef<"ObjekPajak", 'Decimal'>
    readonly tahun_penilaian: FieldRef<"ObjekPajak", 'Int'>
    readonly status_aktif: FieldRef<"ObjekPajak", 'Boolean'>
    readonly nonaktif_oleh: FieldRef<"ObjekPajak", 'String'>
    readonly nonaktif_at: FieldRef<"ObjekPajak", 'DateTime'>
    readonly created_at: FieldRef<"ObjekPajak", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ObjekPajak findUnique
   */
  export type ObjekPajakFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which ObjekPajak to fetch.
     */
    where: ObjekPajakWhereUniqueInput
  }

  /**
   * ObjekPajak findUniqueOrThrow
   */
  export type ObjekPajakFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which ObjekPajak to fetch.
     */
    where: ObjekPajakWhereUniqueInput
  }

  /**
   * ObjekPajak findFirst
   */
  export type ObjekPajakFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which ObjekPajak to fetch.
     */
    where?: ObjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjekPajaks to fetch.
     */
    orderBy?: ObjekPajakOrderByWithRelationInput | ObjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObjekPajaks.
     */
    cursor?: ObjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObjekPajaks.
     */
    distinct?: ObjekPajakScalarFieldEnum | ObjekPajakScalarFieldEnum[]
  }

  /**
   * ObjekPajak findFirstOrThrow
   */
  export type ObjekPajakFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which ObjekPajak to fetch.
     */
    where?: ObjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjekPajaks to fetch.
     */
    orderBy?: ObjekPajakOrderByWithRelationInput | ObjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObjekPajaks.
     */
    cursor?: ObjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObjekPajaks.
     */
    distinct?: ObjekPajakScalarFieldEnum | ObjekPajakScalarFieldEnum[]
  }

  /**
   * ObjekPajak findMany
   */
  export type ObjekPajakFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which ObjekPajaks to fetch.
     */
    where?: ObjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObjekPajaks to fetch.
     */
    orderBy?: ObjekPajakOrderByWithRelationInput | ObjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ObjekPajaks.
     */
    cursor?: ObjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObjekPajaks.
     */
    distinct?: ObjekPajakScalarFieldEnum | ObjekPajakScalarFieldEnum[]
  }

  /**
   * ObjekPajak create
   */
  export type ObjekPajakCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * The data needed to create a ObjekPajak.
     */
    data: XOR<ObjekPajakCreateInput, ObjekPajakUncheckedCreateInput>
  }

  /**
   * ObjekPajak createMany
   */
  export type ObjekPajakCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ObjekPajaks.
     */
    data: ObjekPajakCreateManyInput | ObjekPajakCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ObjekPajak createManyAndReturn
   */
  export type ObjekPajakCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * The data used to create many ObjekPajaks.
     */
    data: ObjekPajakCreateManyInput | ObjekPajakCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ObjekPajak update
   */
  export type ObjekPajakUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * The data needed to update a ObjekPajak.
     */
    data: XOR<ObjekPajakUpdateInput, ObjekPajakUncheckedUpdateInput>
    /**
     * Choose, which ObjekPajak to update.
     */
    where: ObjekPajakWhereUniqueInput
  }

  /**
   * ObjekPajak updateMany
   */
  export type ObjekPajakUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ObjekPajaks.
     */
    data: XOR<ObjekPajakUpdateManyMutationInput, ObjekPajakUncheckedUpdateManyInput>
    /**
     * Filter which ObjekPajaks to update
     */
    where?: ObjekPajakWhereInput
    /**
     * Limit how many ObjekPajaks to update.
     */
    limit?: number
  }

  /**
   * ObjekPajak updateManyAndReturn
   */
  export type ObjekPajakUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * The data used to update ObjekPajaks.
     */
    data: XOR<ObjekPajakUpdateManyMutationInput, ObjekPajakUncheckedUpdateManyInput>
    /**
     * Filter which ObjekPajaks to update
     */
    where?: ObjekPajakWhereInput
    /**
     * Limit how many ObjekPajaks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ObjekPajak upsert
   */
  export type ObjekPajakUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * The filter to search for the ObjekPajak to update in case it exists.
     */
    where: ObjekPajakWhereUniqueInput
    /**
     * In case the ObjekPajak found by the `where` argument doesn't exist, create a new ObjekPajak with this data.
     */
    create: XOR<ObjekPajakCreateInput, ObjekPajakUncheckedCreateInput>
    /**
     * In case the ObjekPajak was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObjekPajakUpdateInput, ObjekPajakUncheckedUpdateInput>
  }

  /**
   * ObjekPajak delete
   */
  export type ObjekPajakDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    /**
     * Filter which ObjekPajak to delete.
     */
    where: ObjekPajakWhereUniqueInput
  }

  /**
   * ObjekPajak deleteMany
   */
  export type ObjekPajakDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObjekPajaks to delete
     */
    where?: ObjekPajakWhereInput
    /**
     * Limit how many ObjekPajaks to delete.
     */
    limit?: number
  }

  /**
   * ObjekPajak.user_nonaktif
   */
  export type ObjekPajak$user_nonaktifArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ObjekPajak.transaksi
   */
  export type ObjekPajak$transaksiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    where?: TransaksiSpopWhereInput
    orderBy?: TransaksiSpopOrderByWithRelationInput | TransaksiSpopOrderByWithRelationInput[]
    cursor?: TransaksiSpopWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransaksiSpopScalarFieldEnum | TransaksiSpopScalarFieldEnum[]
  }

  /**
   * ObjekPajak.detail_asal
   */
  export type ObjekPajak$detail_asalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    where?: DetailTransaksiAsalWhereInput
    orderBy?: DetailTransaksiAsalOrderByWithRelationInput | DetailTransaksiAsalOrderByWithRelationInput[]
    cursor?: DetailTransaksiAsalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetailTransaksiAsalScalarFieldEnum | DetailTransaksiAsalScalarFieldEnum[]
  }

  /**
   * ObjekPajak.sppt
   */
  export type ObjekPajak$spptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    where?: SpptWhereInput
    orderBy?: SpptOrderByWithRelationInput | SpptOrderByWithRelationInput[]
    cursor?: SpptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpptScalarFieldEnum | SpptScalarFieldEnum[]
  }

  /**
   * ObjekPajak without action
   */
  export type ObjekPajakDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
  }


  /**
   * Model Sppt
   */

  export type AggregateSppt = {
    _count: SpptCountAggregateOutputType | null
    _avg: SpptAvgAggregateOutputType | null
    _sum: SpptSumAggregateOutputType | null
    _min: SpptMinAggregateOutputType | null
    _max: SpptMaxAggregateOutputType | null
  }

  export type SpptAvgAggregateOutputType = {
    tahun_pajak: number | null
    njop_kena_pajak: Decimal | null
    njoptkp: Decimal | null
    tarif_pbb: Decimal | null
    pbb_terutang: Decimal | null
  }

  export type SpptSumAggregateOutputType = {
    tahun_pajak: number | null
    njop_kena_pajak: Decimal | null
    njoptkp: Decimal | null
    tarif_pbb: Decimal | null
    pbb_terutang: Decimal | null
  }

  export type SpptMinAggregateOutputType = {
    id_sppt: string | null
    nop: string | null
    tahun_pajak: number | null
    njop_kena_pajak: Decimal | null
    njoptkp: Decimal | null
    tarif_pbb: Decimal | null
    pbb_terutang: Decimal | null
    tgl_jatuh_tempo: Date | null
    status_bayar: $Enums.StatusBayar | null
    tgl_bayar: Date | null
    generated_by: string | null
    generated_at: Date | null
    id_transaksi_asal: string | null
  }

  export type SpptMaxAggregateOutputType = {
    id_sppt: string | null
    nop: string | null
    tahun_pajak: number | null
    njop_kena_pajak: Decimal | null
    njoptkp: Decimal | null
    tarif_pbb: Decimal | null
    pbb_terutang: Decimal | null
    tgl_jatuh_tempo: Date | null
    status_bayar: $Enums.StatusBayar | null
    tgl_bayar: Date | null
    generated_by: string | null
    generated_at: Date | null
    id_transaksi_asal: string | null
  }

  export type SpptCountAggregateOutputType = {
    id_sppt: number
    nop: number
    tahun_pajak: number
    njop_kena_pajak: number
    njoptkp: number
    tarif_pbb: number
    pbb_terutang: number
    tgl_jatuh_tempo: number
    status_bayar: number
    tgl_bayar: number
    generated_by: number
    generated_at: number
    id_transaksi_asal: number
    _all: number
  }


  export type SpptAvgAggregateInputType = {
    tahun_pajak?: true
    njop_kena_pajak?: true
    njoptkp?: true
    tarif_pbb?: true
    pbb_terutang?: true
  }

  export type SpptSumAggregateInputType = {
    tahun_pajak?: true
    njop_kena_pajak?: true
    njoptkp?: true
    tarif_pbb?: true
    pbb_terutang?: true
  }

  export type SpptMinAggregateInputType = {
    id_sppt?: true
    nop?: true
    tahun_pajak?: true
    njop_kena_pajak?: true
    njoptkp?: true
    tarif_pbb?: true
    pbb_terutang?: true
    tgl_jatuh_tempo?: true
    status_bayar?: true
    tgl_bayar?: true
    generated_by?: true
    generated_at?: true
    id_transaksi_asal?: true
  }

  export type SpptMaxAggregateInputType = {
    id_sppt?: true
    nop?: true
    tahun_pajak?: true
    njop_kena_pajak?: true
    njoptkp?: true
    tarif_pbb?: true
    pbb_terutang?: true
    tgl_jatuh_tempo?: true
    status_bayar?: true
    tgl_bayar?: true
    generated_by?: true
    generated_at?: true
    id_transaksi_asal?: true
  }

  export type SpptCountAggregateInputType = {
    id_sppt?: true
    nop?: true
    tahun_pajak?: true
    njop_kena_pajak?: true
    njoptkp?: true
    tarif_pbb?: true
    pbb_terutang?: true
    tgl_jatuh_tempo?: true
    status_bayar?: true
    tgl_bayar?: true
    generated_by?: true
    generated_at?: true
    id_transaksi_asal?: true
    _all?: true
  }

  export type SpptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sppt to aggregate.
     */
    where?: SpptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sppts to fetch.
     */
    orderBy?: SpptOrderByWithRelationInput | SpptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sppts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sppts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sppts
    **/
    _count?: true | SpptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpptMaxAggregateInputType
  }

  export type GetSpptAggregateType<T extends SpptAggregateArgs> = {
        [P in keyof T & keyof AggregateSppt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSppt[P]>
      : GetScalarType<T[P], AggregateSppt[P]>
  }




  export type SpptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpptWhereInput
    orderBy?: SpptOrderByWithAggregationInput | SpptOrderByWithAggregationInput[]
    by: SpptScalarFieldEnum[] | SpptScalarFieldEnum
    having?: SpptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpptCountAggregateInputType | true
    _avg?: SpptAvgAggregateInputType
    _sum?: SpptSumAggregateInputType
    _min?: SpptMinAggregateInputType
    _max?: SpptMaxAggregateInputType
  }

  export type SpptGroupByOutputType = {
    id_sppt: string
    nop: string
    tahun_pajak: number
    njop_kena_pajak: Decimal
    njoptkp: Decimal
    tarif_pbb: Decimal
    pbb_terutang: Decimal
    tgl_jatuh_tempo: Date
    status_bayar: $Enums.StatusBayar
    tgl_bayar: Date | null
    generated_by: string
    generated_at: Date
    id_transaksi_asal: string | null
    _count: SpptCountAggregateOutputType | null
    _avg: SpptAvgAggregateOutputType | null
    _sum: SpptSumAggregateOutputType | null
    _min: SpptMinAggregateOutputType | null
    _max: SpptMaxAggregateOutputType | null
  }

  type GetSpptGroupByPayload<T extends SpptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpptGroupByOutputType[P]>
            : GetScalarType<T[P], SpptGroupByOutputType[P]>
        }
      >
    >


  export type SpptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_sppt?: boolean
    nop?: boolean
    tahun_pajak?: boolean
    njop_kena_pajak?: boolean
    njoptkp?: boolean
    tarif_pbb?: boolean
    pbb_terutang?: boolean
    tgl_jatuh_tempo?: boolean
    status_bayar?: boolean
    tgl_bayar?: boolean
    generated_by?: boolean
    generated_at?: boolean
    id_transaksi_asal?: boolean
    objek_pajak?: boolean | ObjekPajakDefaultArgs<ExtArgs>
    generator?: boolean | UserDefaultArgs<ExtArgs>
    transaksi_asal?: boolean | Sppt$transaksi_asalArgs<ExtArgs>
  }, ExtArgs["result"]["sppt"]>

  export type SpptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_sppt?: boolean
    nop?: boolean
    tahun_pajak?: boolean
    njop_kena_pajak?: boolean
    njoptkp?: boolean
    tarif_pbb?: boolean
    pbb_terutang?: boolean
    tgl_jatuh_tempo?: boolean
    status_bayar?: boolean
    tgl_bayar?: boolean
    generated_by?: boolean
    generated_at?: boolean
    id_transaksi_asal?: boolean
    objek_pajak?: boolean | ObjekPajakDefaultArgs<ExtArgs>
    generator?: boolean | UserDefaultArgs<ExtArgs>
    transaksi_asal?: boolean | Sppt$transaksi_asalArgs<ExtArgs>
  }, ExtArgs["result"]["sppt"]>

  export type SpptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_sppt?: boolean
    nop?: boolean
    tahun_pajak?: boolean
    njop_kena_pajak?: boolean
    njoptkp?: boolean
    tarif_pbb?: boolean
    pbb_terutang?: boolean
    tgl_jatuh_tempo?: boolean
    status_bayar?: boolean
    tgl_bayar?: boolean
    generated_by?: boolean
    generated_at?: boolean
    id_transaksi_asal?: boolean
    objek_pajak?: boolean | ObjekPajakDefaultArgs<ExtArgs>
    generator?: boolean | UserDefaultArgs<ExtArgs>
    transaksi_asal?: boolean | Sppt$transaksi_asalArgs<ExtArgs>
  }, ExtArgs["result"]["sppt"]>

  export type SpptSelectScalar = {
    id_sppt?: boolean
    nop?: boolean
    tahun_pajak?: boolean
    njop_kena_pajak?: boolean
    njoptkp?: boolean
    tarif_pbb?: boolean
    pbb_terutang?: boolean
    tgl_jatuh_tempo?: boolean
    status_bayar?: boolean
    tgl_bayar?: boolean
    generated_by?: boolean
    generated_at?: boolean
    id_transaksi_asal?: boolean
  }

  export type SpptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_sppt" | "nop" | "tahun_pajak" | "njop_kena_pajak" | "njoptkp" | "tarif_pbb" | "pbb_terutang" | "tgl_jatuh_tempo" | "status_bayar" | "tgl_bayar" | "generated_by" | "generated_at" | "id_transaksi_asal", ExtArgs["result"]["sppt"]>
  export type SpptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    objek_pajak?: boolean | ObjekPajakDefaultArgs<ExtArgs>
    generator?: boolean | UserDefaultArgs<ExtArgs>
    transaksi_asal?: boolean | Sppt$transaksi_asalArgs<ExtArgs>
  }
  export type SpptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    objek_pajak?: boolean | ObjekPajakDefaultArgs<ExtArgs>
    generator?: boolean | UserDefaultArgs<ExtArgs>
    transaksi_asal?: boolean | Sppt$transaksi_asalArgs<ExtArgs>
  }
  export type SpptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    objek_pajak?: boolean | ObjekPajakDefaultArgs<ExtArgs>
    generator?: boolean | UserDefaultArgs<ExtArgs>
    transaksi_asal?: boolean | Sppt$transaksi_asalArgs<ExtArgs>
  }

  export type $SpptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sppt"
    objects: {
      objek_pajak: Prisma.$ObjekPajakPayload<ExtArgs>
      generator: Prisma.$UserPayload<ExtArgs>
      transaksi_asal: Prisma.$TransaksiSpopPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_sppt: string
      nop: string
      tahun_pajak: number
      njop_kena_pajak: Prisma.Decimal
      njoptkp: Prisma.Decimal
      tarif_pbb: Prisma.Decimal
      pbb_terutang: Prisma.Decimal
      tgl_jatuh_tempo: Date
      status_bayar: $Enums.StatusBayar
      tgl_bayar: Date | null
      generated_by: string
      generated_at: Date
      id_transaksi_asal: string | null
    }, ExtArgs["result"]["sppt"]>
    composites: {}
  }

  type SpptGetPayload<S extends boolean | null | undefined | SpptDefaultArgs> = $Result.GetResult<Prisma.$SpptPayload, S>

  type SpptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpptCountAggregateInputType | true
    }

  export interface SpptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sppt'], meta: { name: 'Sppt' } }
    /**
     * Find zero or one Sppt that matches the filter.
     * @param {SpptFindUniqueArgs} args - Arguments to find a Sppt
     * @example
     * // Get one Sppt
     * const sppt = await prisma.sppt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpptFindUniqueArgs>(args: SelectSubset<T, SpptFindUniqueArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sppt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpptFindUniqueOrThrowArgs} args - Arguments to find a Sppt
     * @example
     * // Get one Sppt
     * const sppt = await prisma.sppt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpptFindUniqueOrThrowArgs>(args: SelectSubset<T, SpptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sppt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpptFindFirstArgs} args - Arguments to find a Sppt
     * @example
     * // Get one Sppt
     * const sppt = await prisma.sppt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpptFindFirstArgs>(args?: SelectSubset<T, SpptFindFirstArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sppt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpptFindFirstOrThrowArgs} args - Arguments to find a Sppt
     * @example
     * // Get one Sppt
     * const sppt = await prisma.sppt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpptFindFirstOrThrowArgs>(args?: SelectSubset<T, SpptFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sppts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sppts
     * const sppts = await prisma.sppt.findMany()
     * 
     * // Get first 10 Sppts
     * const sppts = await prisma.sppt.findMany({ take: 10 })
     * 
     * // Only select the `id_sppt`
     * const spptWithId_spptOnly = await prisma.sppt.findMany({ select: { id_sppt: true } })
     * 
     */
    findMany<T extends SpptFindManyArgs>(args?: SelectSubset<T, SpptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sppt.
     * @param {SpptCreateArgs} args - Arguments to create a Sppt.
     * @example
     * // Create one Sppt
     * const Sppt = await prisma.sppt.create({
     *   data: {
     *     // ... data to create a Sppt
     *   }
     * })
     * 
     */
    create<T extends SpptCreateArgs>(args: SelectSubset<T, SpptCreateArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sppts.
     * @param {SpptCreateManyArgs} args - Arguments to create many Sppts.
     * @example
     * // Create many Sppts
     * const sppt = await prisma.sppt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpptCreateManyArgs>(args?: SelectSubset<T, SpptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sppts and returns the data saved in the database.
     * @param {SpptCreateManyAndReturnArgs} args - Arguments to create many Sppts.
     * @example
     * // Create many Sppts
     * const sppt = await prisma.sppt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sppts and only return the `id_sppt`
     * const spptWithId_spptOnly = await prisma.sppt.createManyAndReturn({
     *   select: { id_sppt: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpptCreateManyAndReturnArgs>(args?: SelectSubset<T, SpptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sppt.
     * @param {SpptDeleteArgs} args - Arguments to delete one Sppt.
     * @example
     * // Delete one Sppt
     * const Sppt = await prisma.sppt.delete({
     *   where: {
     *     // ... filter to delete one Sppt
     *   }
     * })
     * 
     */
    delete<T extends SpptDeleteArgs>(args: SelectSubset<T, SpptDeleteArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sppt.
     * @param {SpptUpdateArgs} args - Arguments to update one Sppt.
     * @example
     * // Update one Sppt
     * const sppt = await prisma.sppt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpptUpdateArgs>(args: SelectSubset<T, SpptUpdateArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sppts.
     * @param {SpptDeleteManyArgs} args - Arguments to filter Sppts to delete.
     * @example
     * // Delete a few Sppts
     * const { count } = await prisma.sppt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpptDeleteManyArgs>(args?: SelectSubset<T, SpptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sppts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sppts
     * const sppt = await prisma.sppt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpptUpdateManyArgs>(args: SelectSubset<T, SpptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sppts and returns the data updated in the database.
     * @param {SpptUpdateManyAndReturnArgs} args - Arguments to update many Sppts.
     * @example
     * // Update many Sppts
     * const sppt = await prisma.sppt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sppts and only return the `id_sppt`
     * const spptWithId_spptOnly = await prisma.sppt.updateManyAndReturn({
     *   select: { id_sppt: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SpptUpdateManyAndReturnArgs>(args: SelectSubset<T, SpptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sppt.
     * @param {SpptUpsertArgs} args - Arguments to update or create a Sppt.
     * @example
     * // Update or create a Sppt
     * const sppt = await prisma.sppt.upsert({
     *   create: {
     *     // ... data to create a Sppt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sppt we want to update
     *   }
     * })
     */
    upsert<T extends SpptUpsertArgs>(args: SelectSubset<T, SpptUpsertArgs<ExtArgs>>): Prisma__SpptClient<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sppts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpptCountArgs} args - Arguments to filter Sppts to count.
     * @example
     * // Count the number of Sppts
     * const count = await prisma.sppt.count({
     *   where: {
     *     // ... the filter for the Sppts we want to count
     *   }
     * })
    **/
    count<T extends SpptCountArgs>(
      args?: Subset<T, SpptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sppt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SpptAggregateArgs>(args: Subset<T, SpptAggregateArgs>): Prisma.PrismaPromise<GetSpptAggregateType<T>>

    /**
     * Group by Sppt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SpptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpptGroupByArgs['orderBy'] }
        : { orderBy?: SpptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SpptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sppt model
   */
  readonly fields: SpptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sppt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    objek_pajak<T extends ObjekPajakDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ObjekPajakDefaultArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    generator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transaksi_asal<T extends Sppt$transaksi_asalArgs<ExtArgs> = {}>(args?: Subset<T, Sppt$transaksi_asalArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sppt model
   */
  interface SpptFieldRefs {
    readonly id_sppt: FieldRef<"Sppt", 'String'>
    readonly nop: FieldRef<"Sppt", 'String'>
    readonly tahun_pajak: FieldRef<"Sppt", 'Int'>
    readonly njop_kena_pajak: FieldRef<"Sppt", 'Decimal'>
    readonly njoptkp: FieldRef<"Sppt", 'Decimal'>
    readonly tarif_pbb: FieldRef<"Sppt", 'Decimal'>
    readonly pbb_terutang: FieldRef<"Sppt", 'Decimal'>
    readonly tgl_jatuh_tempo: FieldRef<"Sppt", 'DateTime'>
    readonly status_bayar: FieldRef<"Sppt", 'StatusBayar'>
    readonly tgl_bayar: FieldRef<"Sppt", 'DateTime'>
    readonly generated_by: FieldRef<"Sppt", 'String'>
    readonly generated_at: FieldRef<"Sppt", 'DateTime'>
    readonly id_transaksi_asal: FieldRef<"Sppt", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Sppt findUnique
   */
  export type SpptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * Filter, which Sppt to fetch.
     */
    where: SpptWhereUniqueInput
  }

  /**
   * Sppt findUniqueOrThrow
   */
  export type SpptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * Filter, which Sppt to fetch.
     */
    where: SpptWhereUniqueInput
  }

  /**
   * Sppt findFirst
   */
  export type SpptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * Filter, which Sppt to fetch.
     */
    where?: SpptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sppts to fetch.
     */
    orderBy?: SpptOrderByWithRelationInput | SpptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sppts.
     */
    cursor?: SpptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sppts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sppts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sppts.
     */
    distinct?: SpptScalarFieldEnum | SpptScalarFieldEnum[]
  }

  /**
   * Sppt findFirstOrThrow
   */
  export type SpptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * Filter, which Sppt to fetch.
     */
    where?: SpptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sppts to fetch.
     */
    orderBy?: SpptOrderByWithRelationInput | SpptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sppts.
     */
    cursor?: SpptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sppts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sppts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sppts.
     */
    distinct?: SpptScalarFieldEnum | SpptScalarFieldEnum[]
  }

  /**
   * Sppt findMany
   */
  export type SpptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * Filter, which Sppts to fetch.
     */
    where?: SpptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sppts to fetch.
     */
    orderBy?: SpptOrderByWithRelationInput | SpptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sppts.
     */
    cursor?: SpptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sppts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sppts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sppts.
     */
    distinct?: SpptScalarFieldEnum | SpptScalarFieldEnum[]
  }

  /**
   * Sppt create
   */
  export type SpptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * The data needed to create a Sppt.
     */
    data: XOR<SpptCreateInput, SpptUncheckedCreateInput>
  }

  /**
   * Sppt createMany
   */
  export type SpptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sppts.
     */
    data: SpptCreateManyInput | SpptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sppt createManyAndReturn
   */
  export type SpptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * The data used to create many Sppts.
     */
    data: SpptCreateManyInput | SpptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sppt update
   */
  export type SpptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * The data needed to update a Sppt.
     */
    data: XOR<SpptUpdateInput, SpptUncheckedUpdateInput>
    /**
     * Choose, which Sppt to update.
     */
    where: SpptWhereUniqueInput
  }

  /**
   * Sppt updateMany
   */
  export type SpptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sppts.
     */
    data: XOR<SpptUpdateManyMutationInput, SpptUncheckedUpdateManyInput>
    /**
     * Filter which Sppts to update
     */
    where?: SpptWhereInput
    /**
     * Limit how many Sppts to update.
     */
    limit?: number
  }

  /**
   * Sppt updateManyAndReturn
   */
  export type SpptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * The data used to update Sppts.
     */
    data: XOR<SpptUpdateManyMutationInput, SpptUncheckedUpdateManyInput>
    /**
     * Filter which Sppts to update
     */
    where?: SpptWhereInput
    /**
     * Limit how many Sppts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sppt upsert
   */
  export type SpptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * The filter to search for the Sppt to update in case it exists.
     */
    where: SpptWhereUniqueInput
    /**
     * In case the Sppt found by the `where` argument doesn't exist, create a new Sppt with this data.
     */
    create: XOR<SpptCreateInput, SpptUncheckedCreateInput>
    /**
     * In case the Sppt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpptUpdateInput, SpptUncheckedUpdateInput>
  }

  /**
   * Sppt delete
   */
  export type SpptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    /**
     * Filter which Sppt to delete.
     */
    where: SpptWhereUniqueInput
  }

  /**
   * Sppt deleteMany
   */
  export type SpptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sppts to delete
     */
    where?: SpptWhereInput
    /**
     * Limit how many Sppts to delete.
     */
    limit?: number
  }

  /**
   * Sppt.transaksi_asal
   */
  export type Sppt$transaksi_asalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    where?: TransaksiSpopWhereInput
  }

  /**
   * Sppt without action
   */
  export type SpptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
  }


  /**
   * Model SubjekPajak
   */

  export type AggregateSubjekPajak = {
    _count: SubjekPajakCountAggregateOutputType | null
    _min: SubjekPajakMinAggregateOutputType | null
    _max: SubjekPajakMaxAggregateOutputType | null
  }

  export type SubjekPajakMinAggregateOutputType = {
    nik: string | null
    nama_subjek: string | null
    status_wp: $Enums.StatusWp | null
    pekerjaan: $Enums.Pekerjaan | null
    npwp: string | null
    no_hp: string | null
    alamat_jalan: string | null
    blok_kav_no_subjek: string | null
    rw: string | null
    rt: string | null
    kelurahan: string | null
    kabupaten: string | null
    kode_pos: string | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
  }

  export type SubjekPajakMaxAggregateOutputType = {
    nik: string | null
    nama_subjek: string | null
    status_wp: $Enums.StatusWp | null
    pekerjaan: $Enums.Pekerjaan | null
    npwp: string | null
    no_hp: string | null
    alamat_jalan: string | null
    blok_kav_no_subjek: string | null
    rw: string | null
    rt: string | null
    kelurahan: string | null
    kabupaten: string | null
    kode_pos: string | null
    created_at: Date | null
    updated_at: Date | null
    created_by: string | null
  }

  export type SubjekPajakCountAggregateOutputType = {
    nik: number
    nama_subjek: number
    status_wp: number
    pekerjaan: number
    npwp: number
    no_hp: number
    alamat_jalan: number
    blok_kav_no_subjek: number
    rw: number
    rt: number
    kelurahan: number
    kabupaten: number
    kode_pos: number
    created_at: number
    updated_at: number
    created_by: number
    _all: number
  }


  export type SubjekPajakMinAggregateInputType = {
    nik?: true
    nama_subjek?: true
    status_wp?: true
    pekerjaan?: true
    npwp?: true
    no_hp?: true
    alamat_jalan?: true
    blok_kav_no_subjek?: true
    rw?: true
    rt?: true
    kelurahan?: true
    kabupaten?: true
    kode_pos?: true
    created_at?: true
    updated_at?: true
    created_by?: true
  }

  export type SubjekPajakMaxAggregateInputType = {
    nik?: true
    nama_subjek?: true
    status_wp?: true
    pekerjaan?: true
    npwp?: true
    no_hp?: true
    alamat_jalan?: true
    blok_kav_no_subjek?: true
    rw?: true
    rt?: true
    kelurahan?: true
    kabupaten?: true
    kode_pos?: true
    created_at?: true
    updated_at?: true
    created_by?: true
  }

  export type SubjekPajakCountAggregateInputType = {
    nik?: true
    nama_subjek?: true
    status_wp?: true
    pekerjaan?: true
    npwp?: true
    no_hp?: true
    alamat_jalan?: true
    blok_kav_no_subjek?: true
    rw?: true
    rt?: true
    kelurahan?: true
    kabupaten?: true
    kode_pos?: true
    created_at?: true
    updated_at?: true
    created_by?: true
    _all?: true
  }

  export type SubjekPajakAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubjekPajak to aggregate.
     */
    where?: SubjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubjekPajaks to fetch.
     */
    orderBy?: SubjekPajakOrderByWithRelationInput | SubjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubjekPajaks
    **/
    _count?: true | SubjekPajakCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubjekPajakMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubjekPajakMaxAggregateInputType
  }

  export type GetSubjekPajakAggregateType<T extends SubjekPajakAggregateArgs> = {
        [P in keyof T & keyof AggregateSubjekPajak]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubjekPajak[P]>
      : GetScalarType<T[P], AggregateSubjekPajak[P]>
  }




  export type SubjekPajakGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubjekPajakWhereInput
    orderBy?: SubjekPajakOrderByWithAggregationInput | SubjekPajakOrderByWithAggregationInput[]
    by: SubjekPajakScalarFieldEnum[] | SubjekPajakScalarFieldEnum
    having?: SubjekPajakScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubjekPajakCountAggregateInputType | true
    _min?: SubjekPajakMinAggregateInputType
    _max?: SubjekPajakMaxAggregateInputType
  }

  export type SubjekPajakGroupByOutputType = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp: string | null
    no_hp: string | null
    alamat_jalan: string
    blok_kav_no_subjek: string | null
    rw: string | null
    rt: string | null
    kelurahan: string
    kabupaten: string
    kode_pos: string | null
    created_at: Date
    updated_at: Date
    created_by: string
    _count: SubjekPajakCountAggregateOutputType | null
    _min: SubjekPajakMinAggregateOutputType | null
    _max: SubjekPajakMaxAggregateOutputType | null
  }

  type GetSubjekPajakGroupByPayload<T extends SubjekPajakGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubjekPajakGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubjekPajakGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubjekPajakGroupByOutputType[P]>
            : GetScalarType<T[P], SubjekPajakGroupByOutputType[P]>
        }
      >
    >


  export type SubjekPajakSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nik?: boolean
    nama_subjek?: boolean
    status_wp?: boolean
    pekerjaan?: boolean
    npwp?: boolean
    no_hp?: boolean
    alamat_jalan?: boolean
    blok_kav_no_subjek?: boolean
    rw?: boolean
    rt?: boolean
    kelurahan?: boolean
    kabupaten?: boolean
    kode_pos?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    objek_pajak?: boolean | SubjekPajak$objek_pajakArgs<ExtArgs>
    detail_tujuan?: boolean | SubjekPajak$detail_tujuanArgs<ExtArgs>
    _count?: boolean | SubjekPajakCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subjekPajak"]>

  export type SubjekPajakSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nik?: boolean
    nama_subjek?: boolean
    status_wp?: boolean
    pekerjaan?: boolean
    npwp?: boolean
    no_hp?: boolean
    alamat_jalan?: boolean
    blok_kav_no_subjek?: boolean
    rw?: boolean
    rt?: boolean
    kelurahan?: boolean
    kabupaten?: boolean
    kode_pos?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subjekPajak"]>

  export type SubjekPajakSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    nik?: boolean
    nama_subjek?: boolean
    status_wp?: boolean
    pekerjaan?: boolean
    npwp?: boolean
    no_hp?: boolean
    alamat_jalan?: boolean
    blok_kav_no_subjek?: boolean
    rw?: boolean
    rt?: boolean
    kelurahan?: boolean
    kabupaten?: boolean
    kode_pos?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subjekPajak"]>

  export type SubjekPajakSelectScalar = {
    nik?: boolean
    nama_subjek?: boolean
    status_wp?: boolean
    pekerjaan?: boolean
    npwp?: boolean
    no_hp?: boolean
    alamat_jalan?: boolean
    blok_kav_no_subjek?: boolean
    rw?: boolean
    rt?: boolean
    kelurahan?: boolean
    kabupaten?: boolean
    kode_pos?: boolean
    created_at?: boolean
    updated_at?: boolean
    created_by?: boolean
  }

  export type SubjekPajakOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"nik" | "nama_subjek" | "status_wp" | "pekerjaan" | "npwp" | "no_hp" | "alamat_jalan" | "blok_kav_no_subjek" | "rw" | "rt" | "kelurahan" | "kabupaten" | "kode_pos" | "created_at" | "updated_at" | "created_by", ExtArgs["result"]["subjekPajak"]>
  export type SubjekPajakInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    objek_pajak?: boolean | SubjekPajak$objek_pajakArgs<ExtArgs>
    detail_tujuan?: boolean | SubjekPajak$detail_tujuanArgs<ExtArgs>
    _count?: boolean | SubjekPajakCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubjekPajakIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubjekPajakIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubjekPajakPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubjekPajak"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      objek_pajak: Prisma.$ObjekPajakPayload<ExtArgs>[]
      detail_tujuan: Prisma.$DetailTransaksiTujuanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      nik: string
      nama_subjek: string
      status_wp: $Enums.StatusWp
      pekerjaan: $Enums.Pekerjaan
      npwp: string | null
      no_hp: string | null
      alamat_jalan: string
      blok_kav_no_subjek: string | null
      rw: string | null
      rt: string | null
      kelurahan: string
      kabupaten: string
      kode_pos: string | null
      created_at: Date
      updated_at: Date
      created_by: string
    }, ExtArgs["result"]["subjekPajak"]>
    composites: {}
  }

  type SubjekPajakGetPayload<S extends boolean | null | undefined | SubjekPajakDefaultArgs> = $Result.GetResult<Prisma.$SubjekPajakPayload, S>

  type SubjekPajakCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubjekPajakFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubjekPajakCountAggregateInputType | true
    }

  export interface SubjekPajakDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubjekPajak'], meta: { name: 'SubjekPajak' } }
    /**
     * Find zero or one SubjekPajak that matches the filter.
     * @param {SubjekPajakFindUniqueArgs} args - Arguments to find a SubjekPajak
     * @example
     * // Get one SubjekPajak
     * const subjekPajak = await prisma.subjekPajak.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubjekPajakFindUniqueArgs>(args: SelectSubset<T, SubjekPajakFindUniqueArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubjekPajak that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubjekPajakFindUniqueOrThrowArgs} args - Arguments to find a SubjekPajak
     * @example
     * // Get one SubjekPajak
     * const subjekPajak = await prisma.subjekPajak.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubjekPajakFindUniqueOrThrowArgs>(args: SelectSubset<T, SubjekPajakFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubjekPajak that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjekPajakFindFirstArgs} args - Arguments to find a SubjekPajak
     * @example
     * // Get one SubjekPajak
     * const subjekPajak = await prisma.subjekPajak.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubjekPajakFindFirstArgs>(args?: SelectSubset<T, SubjekPajakFindFirstArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubjekPajak that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjekPajakFindFirstOrThrowArgs} args - Arguments to find a SubjekPajak
     * @example
     * // Get one SubjekPajak
     * const subjekPajak = await prisma.subjekPajak.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubjekPajakFindFirstOrThrowArgs>(args?: SelectSubset<T, SubjekPajakFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubjekPajaks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjekPajakFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubjekPajaks
     * const subjekPajaks = await prisma.subjekPajak.findMany()
     * 
     * // Get first 10 SubjekPajaks
     * const subjekPajaks = await prisma.subjekPajak.findMany({ take: 10 })
     * 
     * // Only select the `nik`
     * const subjekPajakWithNikOnly = await prisma.subjekPajak.findMany({ select: { nik: true } })
     * 
     */
    findMany<T extends SubjekPajakFindManyArgs>(args?: SelectSubset<T, SubjekPajakFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubjekPajak.
     * @param {SubjekPajakCreateArgs} args - Arguments to create a SubjekPajak.
     * @example
     * // Create one SubjekPajak
     * const SubjekPajak = await prisma.subjekPajak.create({
     *   data: {
     *     // ... data to create a SubjekPajak
     *   }
     * })
     * 
     */
    create<T extends SubjekPajakCreateArgs>(args: SelectSubset<T, SubjekPajakCreateArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubjekPajaks.
     * @param {SubjekPajakCreateManyArgs} args - Arguments to create many SubjekPajaks.
     * @example
     * // Create many SubjekPajaks
     * const subjekPajak = await prisma.subjekPajak.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubjekPajakCreateManyArgs>(args?: SelectSubset<T, SubjekPajakCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubjekPajaks and returns the data saved in the database.
     * @param {SubjekPajakCreateManyAndReturnArgs} args - Arguments to create many SubjekPajaks.
     * @example
     * // Create many SubjekPajaks
     * const subjekPajak = await prisma.subjekPajak.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubjekPajaks and only return the `nik`
     * const subjekPajakWithNikOnly = await prisma.subjekPajak.createManyAndReturn({
     *   select: { nik: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubjekPajakCreateManyAndReturnArgs>(args?: SelectSubset<T, SubjekPajakCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubjekPajak.
     * @param {SubjekPajakDeleteArgs} args - Arguments to delete one SubjekPajak.
     * @example
     * // Delete one SubjekPajak
     * const SubjekPajak = await prisma.subjekPajak.delete({
     *   where: {
     *     // ... filter to delete one SubjekPajak
     *   }
     * })
     * 
     */
    delete<T extends SubjekPajakDeleteArgs>(args: SelectSubset<T, SubjekPajakDeleteArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubjekPajak.
     * @param {SubjekPajakUpdateArgs} args - Arguments to update one SubjekPajak.
     * @example
     * // Update one SubjekPajak
     * const subjekPajak = await prisma.subjekPajak.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubjekPajakUpdateArgs>(args: SelectSubset<T, SubjekPajakUpdateArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubjekPajaks.
     * @param {SubjekPajakDeleteManyArgs} args - Arguments to filter SubjekPajaks to delete.
     * @example
     * // Delete a few SubjekPajaks
     * const { count } = await prisma.subjekPajak.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubjekPajakDeleteManyArgs>(args?: SelectSubset<T, SubjekPajakDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubjekPajaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjekPajakUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubjekPajaks
     * const subjekPajak = await prisma.subjekPajak.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubjekPajakUpdateManyArgs>(args: SelectSubset<T, SubjekPajakUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubjekPajaks and returns the data updated in the database.
     * @param {SubjekPajakUpdateManyAndReturnArgs} args - Arguments to update many SubjekPajaks.
     * @example
     * // Update many SubjekPajaks
     * const subjekPajak = await prisma.subjekPajak.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubjekPajaks and only return the `nik`
     * const subjekPajakWithNikOnly = await prisma.subjekPajak.updateManyAndReturn({
     *   select: { nik: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubjekPajakUpdateManyAndReturnArgs>(args: SelectSubset<T, SubjekPajakUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubjekPajak.
     * @param {SubjekPajakUpsertArgs} args - Arguments to update or create a SubjekPajak.
     * @example
     * // Update or create a SubjekPajak
     * const subjekPajak = await prisma.subjekPajak.upsert({
     *   create: {
     *     // ... data to create a SubjekPajak
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubjekPajak we want to update
     *   }
     * })
     */
    upsert<T extends SubjekPajakUpsertArgs>(args: SelectSubset<T, SubjekPajakUpsertArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubjekPajaks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjekPajakCountArgs} args - Arguments to filter SubjekPajaks to count.
     * @example
     * // Count the number of SubjekPajaks
     * const count = await prisma.subjekPajak.count({
     *   where: {
     *     // ... the filter for the SubjekPajaks we want to count
     *   }
     * })
    **/
    count<T extends SubjekPajakCountArgs>(
      args?: Subset<T, SubjekPajakCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubjekPajakCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubjekPajak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjekPajakAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubjekPajakAggregateArgs>(args: Subset<T, SubjekPajakAggregateArgs>): Prisma.PrismaPromise<GetSubjekPajakAggregateType<T>>

    /**
     * Group by SubjekPajak.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjekPajakGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubjekPajakGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubjekPajakGroupByArgs['orderBy'] }
        : { orderBy?: SubjekPajakGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubjekPajakGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubjekPajakGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubjekPajak model
   */
  readonly fields: SubjekPajakFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubjekPajak.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubjekPajakClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    objek_pajak<T extends SubjekPajak$objek_pajakArgs<ExtArgs> = {}>(args?: Subset<T, SubjekPajak$objek_pajakArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    detail_tujuan<T extends SubjekPajak$detail_tujuanArgs<ExtArgs> = {}>(args?: Subset<T, SubjekPajak$detail_tujuanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubjekPajak model
   */
  interface SubjekPajakFieldRefs {
    readonly nik: FieldRef<"SubjekPajak", 'String'>
    readonly nama_subjek: FieldRef<"SubjekPajak", 'String'>
    readonly status_wp: FieldRef<"SubjekPajak", 'StatusWp'>
    readonly pekerjaan: FieldRef<"SubjekPajak", 'Pekerjaan'>
    readonly npwp: FieldRef<"SubjekPajak", 'String'>
    readonly no_hp: FieldRef<"SubjekPajak", 'String'>
    readonly alamat_jalan: FieldRef<"SubjekPajak", 'String'>
    readonly blok_kav_no_subjek: FieldRef<"SubjekPajak", 'String'>
    readonly rw: FieldRef<"SubjekPajak", 'String'>
    readonly rt: FieldRef<"SubjekPajak", 'String'>
    readonly kelurahan: FieldRef<"SubjekPajak", 'String'>
    readonly kabupaten: FieldRef<"SubjekPajak", 'String'>
    readonly kode_pos: FieldRef<"SubjekPajak", 'String'>
    readonly created_at: FieldRef<"SubjekPajak", 'DateTime'>
    readonly updated_at: FieldRef<"SubjekPajak", 'DateTime'>
    readonly created_by: FieldRef<"SubjekPajak", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SubjekPajak findUnique
   */
  export type SubjekPajakFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which SubjekPajak to fetch.
     */
    where: SubjekPajakWhereUniqueInput
  }

  /**
   * SubjekPajak findUniqueOrThrow
   */
  export type SubjekPajakFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which SubjekPajak to fetch.
     */
    where: SubjekPajakWhereUniqueInput
  }

  /**
   * SubjekPajak findFirst
   */
  export type SubjekPajakFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which SubjekPajak to fetch.
     */
    where?: SubjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubjekPajaks to fetch.
     */
    orderBy?: SubjekPajakOrderByWithRelationInput | SubjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubjekPajaks.
     */
    cursor?: SubjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubjekPajaks.
     */
    distinct?: SubjekPajakScalarFieldEnum | SubjekPajakScalarFieldEnum[]
  }

  /**
   * SubjekPajak findFirstOrThrow
   */
  export type SubjekPajakFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which SubjekPajak to fetch.
     */
    where?: SubjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubjekPajaks to fetch.
     */
    orderBy?: SubjekPajakOrderByWithRelationInput | SubjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubjekPajaks.
     */
    cursor?: SubjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubjekPajaks.
     */
    distinct?: SubjekPajakScalarFieldEnum | SubjekPajakScalarFieldEnum[]
  }

  /**
   * SubjekPajak findMany
   */
  export type SubjekPajakFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * Filter, which SubjekPajaks to fetch.
     */
    where?: SubjekPajakWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubjekPajaks to fetch.
     */
    orderBy?: SubjekPajakOrderByWithRelationInput | SubjekPajakOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubjekPajaks.
     */
    cursor?: SubjekPajakWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubjekPajaks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubjekPajaks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubjekPajaks.
     */
    distinct?: SubjekPajakScalarFieldEnum | SubjekPajakScalarFieldEnum[]
  }

  /**
   * SubjekPajak create
   */
  export type SubjekPajakCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * The data needed to create a SubjekPajak.
     */
    data: XOR<SubjekPajakCreateInput, SubjekPajakUncheckedCreateInput>
  }

  /**
   * SubjekPajak createMany
   */
  export type SubjekPajakCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubjekPajaks.
     */
    data: SubjekPajakCreateManyInput | SubjekPajakCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubjekPajak createManyAndReturn
   */
  export type SubjekPajakCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * The data used to create many SubjekPajaks.
     */
    data: SubjekPajakCreateManyInput | SubjekPajakCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubjekPajak update
   */
  export type SubjekPajakUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * The data needed to update a SubjekPajak.
     */
    data: XOR<SubjekPajakUpdateInput, SubjekPajakUncheckedUpdateInput>
    /**
     * Choose, which SubjekPajak to update.
     */
    where: SubjekPajakWhereUniqueInput
  }

  /**
   * SubjekPajak updateMany
   */
  export type SubjekPajakUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubjekPajaks.
     */
    data: XOR<SubjekPajakUpdateManyMutationInput, SubjekPajakUncheckedUpdateManyInput>
    /**
     * Filter which SubjekPajaks to update
     */
    where?: SubjekPajakWhereInput
    /**
     * Limit how many SubjekPajaks to update.
     */
    limit?: number
  }

  /**
   * SubjekPajak updateManyAndReturn
   */
  export type SubjekPajakUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * The data used to update SubjekPajaks.
     */
    data: XOR<SubjekPajakUpdateManyMutationInput, SubjekPajakUncheckedUpdateManyInput>
    /**
     * Filter which SubjekPajaks to update
     */
    where?: SubjekPajakWhereInput
    /**
     * Limit how many SubjekPajaks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubjekPajak upsert
   */
  export type SubjekPajakUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * The filter to search for the SubjekPajak to update in case it exists.
     */
    where: SubjekPajakWhereUniqueInput
    /**
     * In case the SubjekPajak found by the `where` argument doesn't exist, create a new SubjekPajak with this data.
     */
    create: XOR<SubjekPajakCreateInput, SubjekPajakUncheckedCreateInput>
    /**
     * In case the SubjekPajak was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubjekPajakUpdateInput, SubjekPajakUncheckedUpdateInput>
  }

  /**
   * SubjekPajak delete
   */
  export type SubjekPajakDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    /**
     * Filter which SubjekPajak to delete.
     */
    where: SubjekPajakWhereUniqueInput
  }

  /**
   * SubjekPajak deleteMany
   */
  export type SubjekPajakDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubjekPajaks to delete
     */
    where?: SubjekPajakWhereInput
    /**
     * Limit how many SubjekPajaks to delete.
     */
    limit?: number
  }

  /**
   * SubjekPajak.objek_pajak
   */
  export type SubjekPajak$objek_pajakArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    where?: ObjekPajakWhereInput
    orderBy?: ObjekPajakOrderByWithRelationInput | ObjekPajakOrderByWithRelationInput[]
    cursor?: ObjekPajakWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObjekPajakScalarFieldEnum | ObjekPajakScalarFieldEnum[]
  }

  /**
   * SubjekPajak.detail_tujuan
   */
  export type SubjekPajak$detail_tujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    where?: DetailTransaksiTujuanWhereInput
    orderBy?: DetailTransaksiTujuanOrderByWithRelationInput | DetailTransaksiTujuanOrderByWithRelationInput[]
    cursor?: DetailTransaksiTujuanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetailTransaksiTujuanScalarFieldEnum | DetailTransaksiTujuanScalarFieldEnum[]
  }

  /**
   * SubjekPajak without action
   */
  export type SubjekPajakDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
  }


  /**
   * Model TransaksiSpop
   */

  export type AggregateTransaksiSpop = {
    _count: TransaksiSpopCountAggregateOutputType | null
    _avg: TransaksiSpopAvgAggregateOutputType | null
    _sum: TransaksiSpopSumAggregateOutputType | null
    _min: TransaksiSpopMinAggregateOutputType | null
    _max: TransaksiSpopMaxAggregateOutputType | null
  }

  export type TransaksiSpopAvgAggregateOutputType = {
    tahun_pajak: number | null
  }

  export type TransaksiSpopSumAggregateOutputType = {
    tahun_pajak: number | null
  }

  export type TransaksiSpopMinAggregateOutputType = {
    id_transaksi: string | null
    no_formulir: string | null
    id_user: string | null
    tahun_pajak: number | null
    jenis_transaksi: $Enums.JenisTransaksi | null
    nop_bersama: string | null
    no_sppt_lama: string | null
    nama_pengaju: string | null
    menggunakan_kuasa: boolean | null
    tanggal_pengajuan: Date | null
    status_ajuan: $Enums.StatusAjuan | null
    id_verifikator: string | null
    verified_at: Date | null
    catatan_bakeuda: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TransaksiSpopMaxAggregateOutputType = {
    id_transaksi: string | null
    no_formulir: string | null
    id_user: string | null
    tahun_pajak: number | null
    jenis_transaksi: $Enums.JenisTransaksi | null
    nop_bersama: string | null
    no_sppt_lama: string | null
    nama_pengaju: string | null
    menggunakan_kuasa: boolean | null
    tanggal_pengajuan: Date | null
    status_ajuan: $Enums.StatusAjuan | null
    id_verifikator: string | null
    verified_at: Date | null
    catatan_bakeuda: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TransaksiSpopCountAggregateOutputType = {
    id_transaksi: number
    no_formulir: number
    id_user: number
    tahun_pajak: number
    jenis_transaksi: number
    nop_bersama: number
    no_sppt_lama: number
    nama_pengaju: number
    menggunakan_kuasa: number
    tanggal_pengajuan: number
    status_ajuan: number
    id_verifikator: number
    verified_at: number
    catatan_bakeuda: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type TransaksiSpopAvgAggregateInputType = {
    tahun_pajak?: true
  }

  export type TransaksiSpopSumAggregateInputType = {
    tahun_pajak?: true
  }

  export type TransaksiSpopMinAggregateInputType = {
    id_transaksi?: true
    no_formulir?: true
    id_user?: true
    tahun_pajak?: true
    jenis_transaksi?: true
    nop_bersama?: true
    no_sppt_lama?: true
    nama_pengaju?: true
    menggunakan_kuasa?: true
    tanggal_pengajuan?: true
    status_ajuan?: true
    id_verifikator?: true
    verified_at?: true
    catatan_bakeuda?: true
    created_at?: true
    updated_at?: true
  }

  export type TransaksiSpopMaxAggregateInputType = {
    id_transaksi?: true
    no_formulir?: true
    id_user?: true
    tahun_pajak?: true
    jenis_transaksi?: true
    nop_bersama?: true
    no_sppt_lama?: true
    nama_pengaju?: true
    menggunakan_kuasa?: true
    tanggal_pengajuan?: true
    status_ajuan?: true
    id_verifikator?: true
    verified_at?: true
    catatan_bakeuda?: true
    created_at?: true
    updated_at?: true
  }

  export type TransaksiSpopCountAggregateInputType = {
    id_transaksi?: true
    no_formulir?: true
    id_user?: true
    tahun_pajak?: true
    jenis_transaksi?: true
    nop_bersama?: true
    no_sppt_lama?: true
    nama_pengaju?: true
    menggunakan_kuasa?: true
    tanggal_pengajuan?: true
    status_ajuan?: true
    id_verifikator?: true
    verified_at?: true
    catatan_bakeuda?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type TransaksiSpopAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransaksiSpop to aggregate.
     */
    where?: TransaksiSpopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransaksiSpops to fetch.
     */
    orderBy?: TransaksiSpopOrderByWithRelationInput | TransaksiSpopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransaksiSpopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransaksiSpops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransaksiSpops.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TransaksiSpops
    **/
    _count?: true | TransaksiSpopCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransaksiSpopAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransaksiSpopSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransaksiSpopMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransaksiSpopMaxAggregateInputType
  }

  export type GetTransaksiSpopAggregateType<T extends TransaksiSpopAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaksiSpop]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaksiSpop[P]>
      : GetScalarType<T[P], AggregateTransaksiSpop[P]>
  }




  export type TransaksiSpopGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaksiSpopWhereInput
    orderBy?: TransaksiSpopOrderByWithAggregationInput | TransaksiSpopOrderByWithAggregationInput[]
    by: TransaksiSpopScalarFieldEnum[] | TransaksiSpopScalarFieldEnum
    having?: TransaksiSpopScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransaksiSpopCountAggregateInputType | true
    _avg?: TransaksiSpopAvgAggregateInputType
    _sum?: TransaksiSpopSumAggregateInputType
    _min?: TransaksiSpopMinAggregateInputType
    _max?: TransaksiSpopMaxAggregateInputType
  }

  export type TransaksiSpopGroupByOutputType = {
    id_transaksi: string
    no_formulir: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama: string | null
    no_sppt_lama: string | null
    nama_pengaju: string | null
    menggunakan_kuasa: boolean
    tanggal_pengajuan: Date
    status_ajuan: $Enums.StatusAjuan
    id_verifikator: string | null
    verified_at: Date | null
    catatan_bakeuda: string | null
    created_at: Date
    updated_at: Date
    _count: TransaksiSpopCountAggregateOutputType | null
    _avg: TransaksiSpopAvgAggregateOutputType | null
    _sum: TransaksiSpopSumAggregateOutputType | null
    _min: TransaksiSpopMinAggregateOutputType | null
    _max: TransaksiSpopMaxAggregateOutputType | null
  }

  type GetTransaksiSpopGroupByPayload<T extends TransaksiSpopGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransaksiSpopGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransaksiSpopGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransaksiSpopGroupByOutputType[P]>
            : GetScalarType<T[P], TransaksiSpopGroupByOutputType[P]>
        }
      >
    >


  export type TransaksiSpopSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_transaksi?: boolean
    no_formulir?: boolean
    id_user?: boolean
    tahun_pajak?: boolean
    jenis_transaksi?: boolean
    nop_bersama?: boolean
    no_sppt_lama?: boolean
    nama_pengaju?: boolean
    menggunakan_kuasa?: boolean
    tanggal_pengajuan?: boolean
    status_ajuan?: boolean
    id_verifikator?: boolean
    verified_at?: boolean
    catatan_bakeuda?: boolean
    created_at?: boolean
    updated_at?: boolean
    pengaju?: boolean | UserDefaultArgs<ExtArgs>
    verifikator?: boolean | TransaksiSpop$verifikatorArgs<ExtArgs>
    objek_bersama?: boolean | TransaksiSpop$objek_bersamaArgs<ExtArgs>
    detail_asal?: boolean | TransaksiSpop$detail_asalArgs<ExtArgs>
    detail_tujuan?: boolean | TransaksiSpop$detail_tujuanArgs<ExtArgs>
    lampiran?: boolean | TransaksiSpop$lampiranArgs<ExtArgs>
    sppt?: boolean | TransaksiSpop$spptArgs<ExtArgs>
    _count?: boolean | TransaksiSpopCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaksiSpop"]>

  export type TransaksiSpopSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_transaksi?: boolean
    no_formulir?: boolean
    id_user?: boolean
    tahun_pajak?: boolean
    jenis_transaksi?: boolean
    nop_bersama?: boolean
    no_sppt_lama?: boolean
    nama_pengaju?: boolean
    menggunakan_kuasa?: boolean
    tanggal_pengajuan?: boolean
    status_ajuan?: boolean
    id_verifikator?: boolean
    verified_at?: boolean
    catatan_bakeuda?: boolean
    created_at?: boolean
    updated_at?: boolean
    pengaju?: boolean | UserDefaultArgs<ExtArgs>
    verifikator?: boolean | TransaksiSpop$verifikatorArgs<ExtArgs>
    objek_bersama?: boolean | TransaksiSpop$objek_bersamaArgs<ExtArgs>
  }, ExtArgs["result"]["transaksiSpop"]>

  export type TransaksiSpopSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_transaksi?: boolean
    no_formulir?: boolean
    id_user?: boolean
    tahun_pajak?: boolean
    jenis_transaksi?: boolean
    nop_bersama?: boolean
    no_sppt_lama?: boolean
    nama_pengaju?: boolean
    menggunakan_kuasa?: boolean
    tanggal_pengajuan?: boolean
    status_ajuan?: boolean
    id_verifikator?: boolean
    verified_at?: boolean
    catatan_bakeuda?: boolean
    created_at?: boolean
    updated_at?: boolean
    pengaju?: boolean | UserDefaultArgs<ExtArgs>
    verifikator?: boolean | TransaksiSpop$verifikatorArgs<ExtArgs>
    objek_bersama?: boolean | TransaksiSpop$objek_bersamaArgs<ExtArgs>
  }, ExtArgs["result"]["transaksiSpop"]>

  export type TransaksiSpopSelectScalar = {
    id_transaksi?: boolean
    no_formulir?: boolean
    id_user?: boolean
    tahun_pajak?: boolean
    jenis_transaksi?: boolean
    nop_bersama?: boolean
    no_sppt_lama?: boolean
    nama_pengaju?: boolean
    menggunakan_kuasa?: boolean
    tanggal_pengajuan?: boolean
    status_ajuan?: boolean
    id_verifikator?: boolean
    verified_at?: boolean
    catatan_bakeuda?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type TransaksiSpopOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_transaksi" | "no_formulir" | "id_user" | "tahun_pajak" | "jenis_transaksi" | "nop_bersama" | "no_sppt_lama" | "nama_pengaju" | "menggunakan_kuasa" | "tanggal_pengajuan" | "status_ajuan" | "id_verifikator" | "verified_at" | "catatan_bakeuda" | "created_at" | "updated_at", ExtArgs["result"]["transaksiSpop"]>
  export type TransaksiSpopInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pengaju?: boolean | UserDefaultArgs<ExtArgs>
    verifikator?: boolean | TransaksiSpop$verifikatorArgs<ExtArgs>
    objek_bersama?: boolean | TransaksiSpop$objek_bersamaArgs<ExtArgs>
    detail_asal?: boolean | TransaksiSpop$detail_asalArgs<ExtArgs>
    detail_tujuan?: boolean | TransaksiSpop$detail_tujuanArgs<ExtArgs>
    lampiran?: boolean | TransaksiSpop$lampiranArgs<ExtArgs>
    sppt?: boolean | TransaksiSpop$spptArgs<ExtArgs>
    _count?: boolean | TransaksiSpopCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TransaksiSpopIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pengaju?: boolean | UserDefaultArgs<ExtArgs>
    verifikator?: boolean | TransaksiSpop$verifikatorArgs<ExtArgs>
    objek_bersama?: boolean | TransaksiSpop$objek_bersamaArgs<ExtArgs>
  }
  export type TransaksiSpopIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pengaju?: boolean | UserDefaultArgs<ExtArgs>
    verifikator?: boolean | TransaksiSpop$verifikatorArgs<ExtArgs>
    objek_bersama?: boolean | TransaksiSpop$objek_bersamaArgs<ExtArgs>
  }

  export type $TransaksiSpopPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TransaksiSpop"
    objects: {
      pengaju: Prisma.$UserPayload<ExtArgs>
      verifikator: Prisma.$UserPayload<ExtArgs> | null
      objek_bersama: Prisma.$ObjekPajakPayload<ExtArgs> | null
      detail_asal: Prisma.$DetailTransaksiAsalPayload<ExtArgs>[]
      detail_tujuan: Prisma.$DetailTransaksiTujuanPayload<ExtArgs>[]
      lampiran: Prisma.$LampiranDokumenPayload<ExtArgs>[]
      sppt: Prisma.$SpptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_transaksi: string
      no_formulir: string | null
      id_user: string
      tahun_pajak: number
      jenis_transaksi: $Enums.JenisTransaksi
      nop_bersama: string | null
      no_sppt_lama: string | null
      nama_pengaju: string | null
      menggunakan_kuasa: boolean
      tanggal_pengajuan: Date
      status_ajuan: $Enums.StatusAjuan
      id_verifikator: string | null
      verified_at: Date | null
      catatan_bakeuda: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["transaksiSpop"]>
    composites: {}
  }

  type TransaksiSpopGetPayload<S extends boolean | null | undefined | TransaksiSpopDefaultArgs> = $Result.GetResult<Prisma.$TransaksiSpopPayload, S>

  type TransaksiSpopCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransaksiSpopFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransaksiSpopCountAggregateInputType | true
    }

  export interface TransaksiSpopDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TransaksiSpop'], meta: { name: 'TransaksiSpop' } }
    /**
     * Find zero or one TransaksiSpop that matches the filter.
     * @param {TransaksiSpopFindUniqueArgs} args - Arguments to find a TransaksiSpop
     * @example
     * // Get one TransaksiSpop
     * const transaksiSpop = await prisma.transaksiSpop.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransaksiSpopFindUniqueArgs>(args: SelectSubset<T, TransaksiSpopFindUniqueArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TransaksiSpop that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransaksiSpopFindUniqueOrThrowArgs} args - Arguments to find a TransaksiSpop
     * @example
     * // Get one TransaksiSpop
     * const transaksiSpop = await prisma.transaksiSpop.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransaksiSpopFindUniqueOrThrowArgs>(args: SelectSubset<T, TransaksiSpopFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransaksiSpop that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiSpopFindFirstArgs} args - Arguments to find a TransaksiSpop
     * @example
     * // Get one TransaksiSpop
     * const transaksiSpop = await prisma.transaksiSpop.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransaksiSpopFindFirstArgs>(args?: SelectSubset<T, TransaksiSpopFindFirstArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransaksiSpop that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiSpopFindFirstOrThrowArgs} args - Arguments to find a TransaksiSpop
     * @example
     * // Get one TransaksiSpop
     * const transaksiSpop = await prisma.transaksiSpop.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransaksiSpopFindFirstOrThrowArgs>(args?: SelectSubset<T, TransaksiSpopFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TransaksiSpops that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiSpopFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TransaksiSpops
     * const transaksiSpops = await prisma.transaksiSpop.findMany()
     * 
     * // Get first 10 TransaksiSpops
     * const transaksiSpops = await prisma.transaksiSpop.findMany({ take: 10 })
     * 
     * // Only select the `id_transaksi`
     * const transaksiSpopWithId_transaksiOnly = await prisma.transaksiSpop.findMany({ select: { id_transaksi: true } })
     * 
     */
    findMany<T extends TransaksiSpopFindManyArgs>(args?: SelectSubset<T, TransaksiSpopFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TransaksiSpop.
     * @param {TransaksiSpopCreateArgs} args - Arguments to create a TransaksiSpop.
     * @example
     * // Create one TransaksiSpop
     * const TransaksiSpop = await prisma.transaksiSpop.create({
     *   data: {
     *     // ... data to create a TransaksiSpop
     *   }
     * })
     * 
     */
    create<T extends TransaksiSpopCreateArgs>(args: SelectSubset<T, TransaksiSpopCreateArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TransaksiSpops.
     * @param {TransaksiSpopCreateManyArgs} args - Arguments to create many TransaksiSpops.
     * @example
     * // Create many TransaksiSpops
     * const transaksiSpop = await prisma.transaksiSpop.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransaksiSpopCreateManyArgs>(args?: SelectSubset<T, TransaksiSpopCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TransaksiSpops and returns the data saved in the database.
     * @param {TransaksiSpopCreateManyAndReturnArgs} args - Arguments to create many TransaksiSpops.
     * @example
     * // Create many TransaksiSpops
     * const transaksiSpop = await prisma.transaksiSpop.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TransaksiSpops and only return the `id_transaksi`
     * const transaksiSpopWithId_transaksiOnly = await prisma.transaksiSpop.createManyAndReturn({
     *   select: { id_transaksi: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransaksiSpopCreateManyAndReturnArgs>(args?: SelectSubset<T, TransaksiSpopCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TransaksiSpop.
     * @param {TransaksiSpopDeleteArgs} args - Arguments to delete one TransaksiSpop.
     * @example
     * // Delete one TransaksiSpop
     * const TransaksiSpop = await prisma.transaksiSpop.delete({
     *   where: {
     *     // ... filter to delete one TransaksiSpop
     *   }
     * })
     * 
     */
    delete<T extends TransaksiSpopDeleteArgs>(args: SelectSubset<T, TransaksiSpopDeleteArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TransaksiSpop.
     * @param {TransaksiSpopUpdateArgs} args - Arguments to update one TransaksiSpop.
     * @example
     * // Update one TransaksiSpop
     * const transaksiSpop = await prisma.transaksiSpop.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransaksiSpopUpdateArgs>(args: SelectSubset<T, TransaksiSpopUpdateArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TransaksiSpops.
     * @param {TransaksiSpopDeleteManyArgs} args - Arguments to filter TransaksiSpops to delete.
     * @example
     * // Delete a few TransaksiSpops
     * const { count } = await prisma.transaksiSpop.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransaksiSpopDeleteManyArgs>(args?: SelectSubset<T, TransaksiSpopDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransaksiSpops.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiSpopUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TransaksiSpops
     * const transaksiSpop = await prisma.transaksiSpop.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransaksiSpopUpdateManyArgs>(args: SelectSubset<T, TransaksiSpopUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransaksiSpops and returns the data updated in the database.
     * @param {TransaksiSpopUpdateManyAndReturnArgs} args - Arguments to update many TransaksiSpops.
     * @example
     * // Update many TransaksiSpops
     * const transaksiSpop = await prisma.transaksiSpop.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TransaksiSpops and only return the `id_transaksi`
     * const transaksiSpopWithId_transaksiOnly = await prisma.transaksiSpop.updateManyAndReturn({
     *   select: { id_transaksi: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransaksiSpopUpdateManyAndReturnArgs>(args: SelectSubset<T, TransaksiSpopUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TransaksiSpop.
     * @param {TransaksiSpopUpsertArgs} args - Arguments to update or create a TransaksiSpop.
     * @example
     * // Update or create a TransaksiSpop
     * const transaksiSpop = await prisma.transaksiSpop.upsert({
     *   create: {
     *     // ... data to create a TransaksiSpop
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TransaksiSpop we want to update
     *   }
     * })
     */
    upsert<T extends TransaksiSpopUpsertArgs>(args: SelectSubset<T, TransaksiSpopUpsertArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TransaksiSpops.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiSpopCountArgs} args - Arguments to filter TransaksiSpops to count.
     * @example
     * // Count the number of TransaksiSpops
     * const count = await prisma.transaksiSpop.count({
     *   where: {
     *     // ... the filter for the TransaksiSpops we want to count
     *   }
     * })
    **/
    count<T extends TransaksiSpopCountArgs>(
      args?: Subset<T, TransaksiSpopCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransaksiSpopCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TransaksiSpop.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiSpopAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransaksiSpopAggregateArgs>(args: Subset<T, TransaksiSpopAggregateArgs>): Prisma.PrismaPromise<GetTransaksiSpopAggregateType<T>>

    /**
     * Group by TransaksiSpop.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiSpopGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransaksiSpopGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransaksiSpopGroupByArgs['orderBy'] }
        : { orderBy?: TransaksiSpopGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransaksiSpopGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransaksiSpopGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TransaksiSpop model
   */
  readonly fields: TransaksiSpopFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TransaksiSpop.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransaksiSpopClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pengaju<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    verifikator<T extends TransaksiSpop$verifikatorArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpop$verifikatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    objek_bersama<T extends TransaksiSpop$objek_bersamaArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpop$objek_bersamaArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    detail_asal<T extends TransaksiSpop$detail_asalArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpop$detail_asalArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    detail_tujuan<T extends TransaksiSpop$detail_tujuanArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpop$detail_tujuanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    lampiran<T extends TransaksiSpop$lampiranArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpop$lampiranArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sppt<T extends TransaksiSpop$spptArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpop$spptArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TransaksiSpop model
   */
  interface TransaksiSpopFieldRefs {
    readonly id_transaksi: FieldRef<"TransaksiSpop", 'String'>
    readonly no_formulir: FieldRef<"TransaksiSpop", 'String'>
    readonly id_user: FieldRef<"TransaksiSpop", 'String'>
    readonly tahun_pajak: FieldRef<"TransaksiSpop", 'Int'>
    readonly jenis_transaksi: FieldRef<"TransaksiSpop", 'JenisTransaksi'>
    readonly nop_bersama: FieldRef<"TransaksiSpop", 'String'>
    readonly no_sppt_lama: FieldRef<"TransaksiSpop", 'String'>
    readonly nama_pengaju: FieldRef<"TransaksiSpop", 'String'>
    readonly menggunakan_kuasa: FieldRef<"TransaksiSpop", 'Boolean'>
    readonly tanggal_pengajuan: FieldRef<"TransaksiSpop", 'DateTime'>
    readonly status_ajuan: FieldRef<"TransaksiSpop", 'StatusAjuan'>
    readonly id_verifikator: FieldRef<"TransaksiSpop", 'String'>
    readonly verified_at: FieldRef<"TransaksiSpop", 'DateTime'>
    readonly catatan_bakeuda: FieldRef<"TransaksiSpop", 'String'>
    readonly created_at: FieldRef<"TransaksiSpop", 'DateTime'>
    readonly updated_at: FieldRef<"TransaksiSpop", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TransaksiSpop findUnique
   */
  export type TransaksiSpopFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * Filter, which TransaksiSpop to fetch.
     */
    where: TransaksiSpopWhereUniqueInput
  }

  /**
   * TransaksiSpop findUniqueOrThrow
   */
  export type TransaksiSpopFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * Filter, which TransaksiSpop to fetch.
     */
    where: TransaksiSpopWhereUniqueInput
  }

  /**
   * TransaksiSpop findFirst
   */
  export type TransaksiSpopFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * Filter, which TransaksiSpop to fetch.
     */
    where?: TransaksiSpopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransaksiSpops to fetch.
     */
    orderBy?: TransaksiSpopOrderByWithRelationInput | TransaksiSpopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransaksiSpops.
     */
    cursor?: TransaksiSpopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransaksiSpops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransaksiSpops.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransaksiSpops.
     */
    distinct?: TransaksiSpopScalarFieldEnum | TransaksiSpopScalarFieldEnum[]
  }

  /**
   * TransaksiSpop findFirstOrThrow
   */
  export type TransaksiSpopFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * Filter, which TransaksiSpop to fetch.
     */
    where?: TransaksiSpopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransaksiSpops to fetch.
     */
    orderBy?: TransaksiSpopOrderByWithRelationInput | TransaksiSpopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransaksiSpops.
     */
    cursor?: TransaksiSpopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransaksiSpops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransaksiSpops.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransaksiSpops.
     */
    distinct?: TransaksiSpopScalarFieldEnum | TransaksiSpopScalarFieldEnum[]
  }

  /**
   * TransaksiSpop findMany
   */
  export type TransaksiSpopFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * Filter, which TransaksiSpops to fetch.
     */
    where?: TransaksiSpopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransaksiSpops to fetch.
     */
    orderBy?: TransaksiSpopOrderByWithRelationInput | TransaksiSpopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TransaksiSpops.
     */
    cursor?: TransaksiSpopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransaksiSpops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransaksiSpops.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransaksiSpops.
     */
    distinct?: TransaksiSpopScalarFieldEnum | TransaksiSpopScalarFieldEnum[]
  }

  /**
   * TransaksiSpop create
   */
  export type TransaksiSpopCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * The data needed to create a TransaksiSpop.
     */
    data: XOR<TransaksiSpopCreateInput, TransaksiSpopUncheckedCreateInput>
  }

  /**
   * TransaksiSpop createMany
   */
  export type TransaksiSpopCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TransaksiSpops.
     */
    data: TransaksiSpopCreateManyInput | TransaksiSpopCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TransaksiSpop createManyAndReturn
   */
  export type TransaksiSpopCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * The data used to create many TransaksiSpops.
     */
    data: TransaksiSpopCreateManyInput | TransaksiSpopCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TransaksiSpop update
   */
  export type TransaksiSpopUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * The data needed to update a TransaksiSpop.
     */
    data: XOR<TransaksiSpopUpdateInput, TransaksiSpopUncheckedUpdateInput>
    /**
     * Choose, which TransaksiSpop to update.
     */
    where: TransaksiSpopWhereUniqueInput
  }

  /**
   * TransaksiSpop updateMany
   */
  export type TransaksiSpopUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TransaksiSpops.
     */
    data: XOR<TransaksiSpopUpdateManyMutationInput, TransaksiSpopUncheckedUpdateManyInput>
    /**
     * Filter which TransaksiSpops to update
     */
    where?: TransaksiSpopWhereInput
    /**
     * Limit how many TransaksiSpops to update.
     */
    limit?: number
  }

  /**
   * TransaksiSpop updateManyAndReturn
   */
  export type TransaksiSpopUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * The data used to update TransaksiSpops.
     */
    data: XOR<TransaksiSpopUpdateManyMutationInput, TransaksiSpopUncheckedUpdateManyInput>
    /**
     * Filter which TransaksiSpops to update
     */
    where?: TransaksiSpopWhereInput
    /**
     * Limit how many TransaksiSpops to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TransaksiSpop upsert
   */
  export type TransaksiSpopUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * The filter to search for the TransaksiSpop to update in case it exists.
     */
    where: TransaksiSpopWhereUniqueInput
    /**
     * In case the TransaksiSpop found by the `where` argument doesn't exist, create a new TransaksiSpop with this data.
     */
    create: XOR<TransaksiSpopCreateInput, TransaksiSpopUncheckedCreateInput>
    /**
     * In case the TransaksiSpop was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransaksiSpopUpdateInput, TransaksiSpopUncheckedUpdateInput>
  }

  /**
   * TransaksiSpop delete
   */
  export type TransaksiSpopDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    /**
     * Filter which TransaksiSpop to delete.
     */
    where: TransaksiSpopWhereUniqueInput
  }

  /**
   * TransaksiSpop deleteMany
   */
  export type TransaksiSpopDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransaksiSpops to delete
     */
    where?: TransaksiSpopWhereInput
    /**
     * Limit how many TransaksiSpops to delete.
     */
    limit?: number
  }

  /**
   * TransaksiSpop.verifikator
   */
  export type TransaksiSpop$verifikatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * TransaksiSpop.objek_bersama
   */
  export type TransaksiSpop$objek_bersamaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    where?: ObjekPajakWhereInput
  }

  /**
   * TransaksiSpop.detail_asal
   */
  export type TransaksiSpop$detail_asalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    where?: DetailTransaksiAsalWhereInput
    orderBy?: DetailTransaksiAsalOrderByWithRelationInput | DetailTransaksiAsalOrderByWithRelationInput[]
    cursor?: DetailTransaksiAsalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetailTransaksiAsalScalarFieldEnum | DetailTransaksiAsalScalarFieldEnum[]
  }

  /**
   * TransaksiSpop.detail_tujuan
   */
  export type TransaksiSpop$detail_tujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    where?: DetailTransaksiTujuanWhereInput
    orderBy?: DetailTransaksiTujuanOrderByWithRelationInput | DetailTransaksiTujuanOrderByWithRelationInput[]
    cursor?: DetailTransaksiTujuanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetailTransaksiTujuanScalarFieldEnum | DetailTransaksiTujuanScalarFieldEnum[]
  }

  /**
   * TransaksiSpop.lampiran
   */
  export type TransaksiSpop$lampiranArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    where?: LampiranDokumenWhereInput
    orderBy?: LampiranDokumenOrderByWithRelationInput | LampiranDokumenOrderByWithRelationInput[]
    cursor?: LampiranDokumenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LampiranDokumenScalarFieldEnum | LampiranDokumenScalarFieldEnum[]
  }

  /**
   * TransaksiSpop.sppt
   */
  export type TransaksiSpop$spptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    where?: SpptWhereInput
    orderBy?: SpptOrderByWithRelationInput | SpptOrderByWithRelationInput[]
    cursor?: SpptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpptScalarFieldEnum | SpptScalarFieldEnum[]
  }

  /**
   * TransaksiSpop without action
   */
  export type TransaksiSpopDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
  }


  /**
   * Model DetailTransaksiAsal
   */

  export type AggregateDetailTransaksiAsal = {
    _count: DetailTransaksiAsalCountAggregateOutputType | null
    _min: DetailTransaksiAsalMinAggregateOutputType | null
    _max: DetailTransaksiAsalMaxAggregateOutputType | null
  }

  export type DetailTransaksiAsalMinAggregateOutputType = {
    id_detail_asal: string | null
    id_transaksi: string | null
    nop_asal: string | null
    nonaktifkan_saat_disetujui: boolean | null
  }

  export type DetailTransaksiAsalMaxAggregateOutputType = {
    id_detail_asal: string | null
    id_transaksi: string | null
    nop_asal: string | null
    nonaktifkan_saat_disetujui: boolean | null
  }

  export type DetailTransaksiAsalCountAggregateOutputType = {
    id_detail_asal: number
    id_transaksi: number
    nop_asal: number
    nonaktifkan_saat_disetujui: number
    _all: number
  }


  export type DetailTransaksiAsalMinAggregateInputType = {
    id_detail_asal?: true
    id_transaksi?: true
    nop_asal?: true
    nonaktifkan_saat_disetujui?: true
  }

  export type DetailTransaksiAsalMaxAggregateInputType = {
    id_detail_asal?: true
    id_transaksi?: true
    nop_asal?: true
    nonaktifkan_saat_disetujui?: true
  }

  export type DetailTransaksiAsalCountAggregateInputType = {
    id_detail_asal?: true
    id_transaksi?: true
    nop_asal?: true
    nonaktifkan_saat_disetujui?: true
    _all?: true
  }

  export type DetailTransaksiAsalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetailTransaksiAsal to aggregate.
     */
    where?: DetailTransaksiAsalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiAsals to fetch.
     */
    orderBy?: DetailTransaksiAsalOrderByWithRelationInput | DetailTransaksiAsalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DetailTransaksiAsalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiAsals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiAsals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DetailTransaksiAsals
    **/
    _count?: true | DetailTransaksiAsalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DetailTransaksiAsalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DetailTransaksiAsalMaxAggregateInputType
  }

  export type GetDetailTransaksiAsalAggregateType<T extends DetailTransaksiAsalAggregateArgs> = {
        [P in keyof T & keyof AggregateDetailTransaksiAsal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDetailTransaksiAsal[P]>
      : GetScalarType<T[P], AggregateDetailTransaksiAsal[P]>
  }




  export type DetailTransaksiAsalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailTransaksiAsalWhereInput
    orderBy?: DetailTransaksiAsalOrderByWithAggregationInput | DetailTransaksiAsalOrderByWithAggregationInput[]
    by: DetailTransaksiAsalScalarFieldEnum[] | DetailTransaksiAsalScalarFieldEnum
    having?: DetailTransaksiAsalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DetailTransaksiAsalCountAggregateInputType | true
    _min?: DetailTransaksiAsalMinAggregateInputType
    _max?: DetailTransaksiAsalMaxAggregateInputType
  }

  export type DetailTransaksiAsalGroupByOutputType = {
    id_detail_asal: string
    id_transaksi: string
    nop_asal: string | null
    nonaktifkan_saat_disetujui: boolean
    _count: DetailTransaksiAsalCountAggregateOutputType | null
    _min: DetailTransaksiAsalMinAggregateOutputType | null
    _max: DetailTransaksiAsalMaxAggregateOutputType | null
  }

  type GetDetailTransaksiAsalGroupByPayload<T extends DetailTransaksiAsalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DetailTransaksiAsalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DetailTransaksiAsalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DetailTransaksiAsalGroupByOutputType[P]>
            : GetScalarType<T[P], DetailTransaksiAsalGroupByOutputType[P]>
        }
      >
    >


  export type DetailTransaksiAsalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_detail_asal?: boolean
    id_transaksi?: boolean
    nop_asal?: boolean
    nonaktifkan_saat_disetujui?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    objek_asal?: boolean | DetailTransaksiAsal$objek_asalArgs<ExtArgs>
  }, ExtArgs["result"]["detailTransaksiAsal"]>

  export type DetailTransaksiAsalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_detail_asal?: boolean
    id_transaksi?: boolean
    nop_asal?: boolean
    nonaktifkan_saat_disetujui?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    objek_asal?: boolean | DetailTransaksiAsal$objek_asalArgs<ExtArgs>
  }, ExtArgs["result"]["detailTransaksiAsal"]>

  export type DetailTransaksiAsalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_detail_asal?: boolean
    id_transaksi?: boolean
    nop_asal?: boolean
    nonaktifkan_saat_disetujui?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    objek_asal?: boolean | DetailTransaksiAsal$objek_asalArgs<ExtArgs>
  }, ExtArgs["result"]["detailTransaksiAsal"]>

  export type DetailTransaksiAsalSelectScalar = {
    id_detail_asal?: boolean
    id_transaksi?: boolean
    nop_asal?: boolean
    nonaktifkan_saat_disetujui?: boolean
  }

  export type DetailTransaksiAsalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_detail_asal" | "id_transaksi" | "nop_asal" | "nonaktifkan_saat_disetujui", ExtArgs["result"]["detailTransaksiAsal"]>
  export type DetailTransaksiAsalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    objek_asal?: boolean | DetailTransaksiAsal$objek_asalArgs<ExtArgs>
  }
  export type DetailTransaksiAsalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    objek_asal?: boolean | DetailTransaksiAsal$objek_asalArgs<ExtArgs>
  }
  export type DetailTransaksiAsalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    objek_asal?: boolean | DetailTransaksiAsal$objek_asalArgs<ExtArgs>
  }

  export type $DetailTransaksiAsalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DetailTransaksiAsal"
    objects: {
      transaksi: Prisma.$TransaksiSpopPayload<ExtArgs>
      objek_asal: Prisma.$ObjekPajakPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_detail_asal: string
      id_transaksi: string
      nop_asal: string | null
      nonaktifkan_saat_disetujui: boolean
    }, ExtArgs["result"]["detailTransaksiAsal"]>
    composites: {}
  }

  type DetailTransaksiAsalGetPayload<S extends boolean | null | undefined | DetailTransaksiAsalDefaultArgs> = $Result.GetResult<Prisma.$DetailTransaksiAsalPayload, S>

  type DetailTransaksiAsalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DetailTransaksiAsalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DetailTransaksiAsalCountAggregateInputType | true
    }

  export interface DetailTransaksiAsalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DetailTransaksiAsal'], meta: { name: 'DetailTransaksiAsal' } }
    /**
     * Find zero or one DetailTransaksiAsal that matches the filter.
     * @param {DetailTransaksiAsalFindUniqueArgs} args - Arguments to find a DetailTransaksiAsal
     * @example
     * // Get one DetailTransaksiAsal
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DetailTransaksiAsalFindUniqueArgs>(args: SelectSubset<T, DetailTransaksiAsalFindUniqueArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DetailTransaksiAsal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DetailTransaksiAsalFindUniqueOrThrowArgs} args - Arguments to find a DetailTransaksiAsal
     * @example
     * // Get one DetailTransaksiAsal
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DetailTransaksiAsalFindUniqueOrThrowArgs>(args: SelectSubset<T, DetailTransaksiAsalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetailTransaksiAsal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiAsalFindFirstArgs} args - Arguments to find a DetailTransaksiAsal
     * @example
     * // Get one DetailTransaksiAsal
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DetailTransaksiAsalFindFirstArgs>(args?: SelectSubset<T, DetailTransaksiAsalFindFirstArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetailTransaksiAsal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiAsalFindFirstOrThrowArgs} args - Arguments to find a DetailTransaksiAsal
     * @example
     * // Get one DetailTransaksiAsal
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DetailTransaksiAsalFindFirstOrThrowArgs>(args?: SelectSubset<T, DetailTransaksiAsalFindFirstOrThrowArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DetailTransaksiAsals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiAsalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DetailTransaksiAsals
     * const detailTransaksiAsals = await prisma.detailTransaksiAsal.findMany()
     * 
     * // Get first 10 DetailTransaksiAsals
     * const detailTransaksiAsals = await prisma.detailTransaksiAsal.findMany({ take: 10 })
     * 
     * // Only select the `id_detail_asal`
     * const detailTransaksiAsalWithId_detail_asalOnly = await prisma.detailTransaksiAsal.findMany({ select: { id_detail_asal: true } })
     * 
     */
    findMany<T extends DetailTransaksiAsalFindManyArgs>(args?: SelectSubset<T, DetailTransaksiAsalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DetailTransaksiAsal.
     * @param {DetailTransaksiAsalCreateArgs} args - Arguments to create a DetailTransaksiAsal.
     * @example
     * // Create one DetailTransaksiAsal
     * const DetailTransaksiAsal = await prisma.detailTransaksiAsal.create({
     *   data: {
     *     // ... data to create a DetailTransaksiAsal
     *   }
     * })
     * 
     */
    create<T extends DetailTransaksiAsalCreateArgs>(args: SelectSubset<T, DetailTransaksiAsalCreateArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DetailTransaksiAsals.
     * @param {DetailTransaksiAsalCreateManyArgs} args - Arguments to create many DetailTransaksiAsals.
     * @example
     * // Create many DetailTransaksiAsals
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DetailTransaksiAsalCreateManyArgs>(args?: SelectSubset<T, DetailTransaksiAsalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DetailTransaksiAsals and returns the data saved in the database.
     * @param {DetailTransaksiAsalCreateManyAndReturnArgs} args - Arguments to create many DetailTransaksiAsals.
     * @example
     * // Create many DetailTransaksiAsals
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DetailTransaksiAsals and only return the `id_detail_asal`
     * const detailTransaksiAsalWithId_detail_asalOnly = await prisma.detailTransaksiAsal.createManyAndReturn({
     *   select: { id_detail_asal: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DetailTransaksiAsalCreateManyAndReturnArgs>(args?: SelectSubset<T, DetailTransaksiAsalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DetailTransaksiAsal.
     * @param {DetailTransaksiAsalDeleteArgs} args - Arguments to delete one DetailTransaksiAsal.
     * @example
     * // Delete one DetailTransaksiAsal
     * const DetailTransaksiAsal = await prisma.detailTransaksiAsal.delete({
     *   where: {
     *     // ... filter to delete one DetailTransaksiAsal
     *   }
     * })
     * 
     */
    delete<T extends DetailTransaksiAsalDeleteArgs>(args: SelectSubset<T, DetailTransaksiAsalDeleteArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DetailTransaksiAsal.
     * @param {DetailTransaksiAsalUpdateArgs} args - Arguments to update one DetailTransaksiAsal.
     * @example
     * // Update one DetailTransaksiAsal
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DetailTransaksiAsalUpdateArgs>(args: SelectSubset<T, DetailTransaksiAsalUpdateArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DetailTransaksiAsals.
     * @param {DetailTransaksiAsalDeleteManyArgs} args - Arguments to filter DetailTransaksiAsals to delete.
     * @example
     * // Delete a few DetailTransaksiAsals
     * const { count } = await prisma.detailTransaksiAsal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DetailTransaksiAsalDeleteManyArgs>(args?: SelectSubset<T, DetailTransaksiAsalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetailTransaksiAsals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiAsalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DetailTransaksiAsals
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DetailTransaksiAsalUpdateManyArgs>(args: SelectSubset<T, DetailTransaksiAsalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetailTransaksiAsals and returns the data updated in the database.
     * @param {DetailTransaksiAsalUpdateManyAndReturnArgs} args - Arguments to update many DetailTransaksiAsals.
     * @example
     * // Update many DetailTransaksiAsals
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DetailTransaksiAsals and only return the `id_detail_asal`
     * const detailTransaksiAsalWithId_detail_asalOnly = await prisma.detailTransaksiAsal.updateManyAndReturn({
     *   select: { id_detail_asal: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DetailTransaksiAsalUpdateManyAndReturnArgs>(args: SelectSubset<T, DetailTransaksiAsalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DetailTransaksiAsal.
     * @param {DetailTransaksiAsalUpsertArgs} args - Arguments to update or create a DetailTransaksiAsal.
     * @example
     * // Update or create a DetailTransaksiAsal
     * const detailTransaksiAsal = await prisma.detailTransaksiAsal.upsert({
     *   create: {
     *     // ... data to create a DetailTransaksiAsal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DetailTransaksiAsal we want to update
     *   }
     * })
     */
    upsert<T extends DetailTransaksiAsalUpsertArgs>(args: SelectSubset<T, DetailTransaksiAsalUpsertArgs<ExtArgs>>): Prisma__DetailTransaksiAsalClient<$Result.GetResult<Prisma.$DetailTransaksiAsalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DetailTransaksiAsals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiAsalCountArgs} args - Arguments to filter DetailTransaksiAsals to count.
     * @example
     * // Count the number of DetailTransaksiAsals
     * const count = await prisma.detailTransaksiAsal.count({
     *   where: {
     *     // ... the filter for the DetailTransaksiAsals we want to count
     *   }
     * })
    **/
    count<T extends DetailTransaksiAsalCountArgs>(
      args?: Subset<T, DetailTransaksiAsalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DetailTransaksiAsalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DetailTransaksiAsal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiAsalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DetailTransaksiAsalAggregateArgs>(args: Subset<T, DetailTransaksiAsalAggregateArgs>): Prisma.PrismaPromise<GetDetailTransaksiAsalAggregateType<T>>

    /**
     * Group by DetailTransaksiAsal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiAsalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DetailTransaksiAsalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DetailTransaksiAsalGroupByArgs['orderBy'] }
        : { orderBy?: DetailTransaksiAsalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DetailTransaksiAsalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDetailTransaksiAsalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DetailTransaksiAsal model
   */
  readonly fields: DetailTransaksiAsalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DetailTransaksiAsal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DetailTransaksiAsalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transaksi<T extends TransaksiSpopDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpopDefaultArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    objek_asal<T extends DetailTransaksiAsal$objek_asalArgs<ExtArgs> = {}>(args?: Subset<T, DetailTransaksiAsal$objek_asalArgs<ExtArgs>>): Prisma__ObjekPajakClient<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DetailTransaksiAsal model
   */
  interface DetailTransaksiAsalFieldRefs {
    readonly id_detail_asal: FieldRef<"DetailTransaksiAsal", 'String'>
    readonly id_transaksi: FieldRef<"DetailTransaksiAsal", 'String'>
    readonly nop_asal: FieldRef<"DetailTransaksiAsal", 'String'>
    readonly nonaktifkan_saat_disetujui: FieldRef<"DetailTransaksiAsal", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * DetailTransaksiAsal findUnique
   */
  export type DetailTransaksiAsalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiAsal to fetch.
     */
    where: DetailTransaksiAsalWhereUniqueInput
  }

  /**
   * DetailTransaksiAsal findUniqueOrThrow
   */
  export type DetailTransaksiAsalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiAsal to fetch.
     */
    where: DetailTransaksiAsalWhereUniqueInput
  }

  /**
   * DetailTransaksiAsal findFirst
   */
  export type DetailTransaksiAsalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiAsal to fetch.
     */
    where?: DetailTransaksiAsalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiAsals to fetch.
     */
    orderBy?: DetailTransaksiAsalOrderByWithRelationInput | DetailTransaksiAsalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetailTransaksiAsals.
     */
    cursor?: DetailTransaksiAsalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiAsals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiAsals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailTransaksiAsals.
     */
    distinct?: DetailTransaksiAsalScalarFieldEnum | DetailTransaksiAsalScalarFieldEnum[]
  }

  /**
   * DetailTransaksiAsal findFirstOrThrow
   */
  export type DetailTransaksiAsalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiAsal to fetch.
     */
    where?: DetailTransaksiAsalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiAsals to fetch.
     */
    orderBy?: DetailTransaksiAsalOrderByWithRelationInput | DetailTransaksiAsalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetailTransaksiAsals.
     */
    cursor?: DetailTransaksiAsalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiAsals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiAsals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailTransaksiAsals.
     */
    distinct?: DetailTransaksiAsalScalarFieldEnum | DetailTransaksiAsalScalarFieldEnum[]
  }

  /**
   * DetailTransaksiAsal findMany
   */
  export type DetailTransaksiAsalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiAsals to fetch.
     */
    where?: DetailTransaksiAsalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiAsals to fetch.
     */
    orderBy?: DetailTransaksiAsalOrderByWithRelationInput | DetailTransaksiAsalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DetailTransaksiAsals.
     */
    cursor?: DetailTransaksiAsalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiAsals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiAsals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailTransaksiAsals.
     */
    distinct?: DetailTransaksiAsalScalarFieldEnum | DetailTransaksiAsalScalarFieldEnum[]
  }

  /**
   * DetailTransaksiAsal create
   */
  export type DetailTransaksiAsalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * The data needed to create a DetailTransaksiAsal.
     */
    data: XOR<DetailTransaksiAsalCreateInput, DetailTransaksiAsalUncheckedCreateInput>
  }

  /**
   * DetailTransaksiAsal createMany
   */
  export type DetailTransaksiAsalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DetailTransaksiAsals.
     */
    data: DetailTransaksiAsalCreateManyInput | DetailTransaksiAsalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DetailTransaksiAsal createManyAndReturn
   */
  export type DetailTransaksiAsalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * The data used to create many DetailTransaksiAsals.
     */
    data: DetailTransaksiAsalCreateManyInput | DetailTransaksiAsalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetailTransaksiAsal update
   */
  export type DetailTransaksiAsalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * The data needed to update a DetailTransaksiAsal.
     */
    data: XOR<DetailTransaksiAsalUpdateInput, DetailTransaksiAsalUncheckedUpdateInput>
    /**
     * Choose, which DetailTransaksiAsal to update.
     */
    where: DetailTransaksiAsalWhereUniqueInput
  }

  /**
   * DetailTransaksiAsal updateMany
   */
  export type DetailTransaksiAsalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DetailTransaksiAsals.
     */
    data: XOR<DetailTransaksiAsalUpdateManyMutationInput, DetailTransaksiAsalUncheckedUpdateManyInput>
    /**
     * Filter which DetailTransaksiAsals to update
     */
    where?: DetailTransaksiAsalWhereInput
    /**
     * Limit how many DetailTransaksiAsals to update.
     */
    limit?: number
  }

  /**
   * DetailTransaksiAsal updateManyAndReturn
   */
  export type DetailTransaksiAsalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * The data used to update DetailTransaksiAsals.
     */
    data: XOR<DetailTransaksiAsalUpdateManyMutationInput, DetailTransaksiAsalUncheckedUpdateManyInput>
    /**
     * Filter which DetailTransaksiAsals to update
     */
    where?: DetailTransaksiAsalWhereInput
    /**
     * Limit how many DetailTransaksiAsals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetailTransaksiAsal upsert
   */
  export type DetailTransaksiAsalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * The filter to search for the DetailTransaksiAsal to update in case it exists.
     */
    where: DetailTransaksiAsalWhereUniqueInput
    /**
     * In case the DetailTransaksiAsal found by the `where` argument doesn't exist, create a new DetailTransaksiAsal with this data.
     */
    create: XOR<DetailTransaksiAsalCreateInput, DetailTransaksiAsalUncheckedCreateInput>
    /**
     * In case the DetailTransaksiAsal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DetailTransaksiAsalUpdateInput, DetailTransaksiAsalUncheckedUpdateInput>
  }

  /**
   * DetailTransaksiAsal delete
   */
  export type DetailTransaksiAsalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
    /**
     * Filter which DetailTransaksiAsal to delete.
     */
    where: DetailTransaksiAsalWhereUniqueInput
  }

  /**
   * DetailTransaksiAsal deleteMany
   */
  export type DetailTransaksiAsalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetailTransaksiAsals to delete
     */
    where?: DetailTransaksiAsalWhereInput
    /**
     * Limit how many DetailTransaksiAsals to delete.
     */
    limit?: number
  }

  /**
   * DetailTransaksiAsal.objek_asal
   */
  export type DetailTransaksiAsal$objek_asalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    where?: ObjekPajakWhereInput
  }

  /**
   * DetailTransaksiAsal without action
   */
  export type DetailTransaksiAsalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiAsal
     */
    select?: DetailTransaksiAsalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiAsal
     */
    omit?: DetailTransaksiAsalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiAsalInclude<ExtArgs> | null
  }


  /**
   * Model DetailTransaksiTujuan
   */

  export type AggregateDetailTransaksiTujuan = {
    _count: DetailTransaksiTujuanCountAggregateOutputType | null
    _avg: DetailTransaksiTujuanAvgAggregateOutputType | null
    _sum: DetailTransaksiTujuanSumAggregateOutputType | null
    _min: DetailTransaksiTujuanMinAggregateOutputType | null
    _max: DetailTransaksiTujuanMaxAggregateOutputType | null
  }

  export type DetailTransaksiTujuanAvgAggregateOutputType = {
    luas_tanah_baru: Decimal | null
    luas_bangunan_baru: Decimal | null
    jumlah_bangunan_baru: number | null
  }

  export type DetailTransaksiTujuanSumAggregateOutputType = {
    luas_tanah_baru: Decimal | null
    luas_bangunan_baru: Decimal | null
    jumlah_bangunan_baru: number | null
  }

  export type DetailTransaksiTujuanMinAggregateOutputType = {
    id_detail_tujuan: string | null
    id_transaksi: string | null
    nik_calon_subjek: string | null
    luas_tanah_baru: Decimal | null
    luas_bangunan_baru: Decimal | null
    jumlah_bangunan_baru: number | null
    jenis_tanah_baru: $Enums.JenisTanah | null
    no_persil_baru: string | null
    nop_generated: string | null
  }

  export type DetailTransaksiTujuanMaxAggregateOutputType = {
    id_detail_tujuan: string | null
    id_transaksi: string | null
    nik_calon_subjek: string | null
    luas_tanah_baru: Decimal | null
    luas_bangunan_baru: Decimal | null
    jumlah_bangunan_baru: number | null
    jenis_tanah_baru: $Enums.JenisTanah | null
    no_persil_baru: string | null
    nop_generated: string | null
  }

  export type DetailTransaksiTujuanCountAggregateOutputType = {
    id_detail_tujuan: number
    id_transaksi: number
    nik_calon_subjek: number
    luas_tanah_baru: number
    luas_bangunan_baru: number
    jumlah_bangunan_baru: number
    jenis_tanah_baru: number
    no_persil_baru: number
    nop_generated: number
    _all: number
  }


  export type DetailTransaksiTujuanAvgAggregateInputType = {
    luas_tanah_baru?: true
    luas_bangunan_baru?: true
    jumlah_bangunan_baru?: true
  }

  export type DetailTransaksiTujuanSumAggregateInputType = {
    luas_tanah_baru?: true
    luas_bangunan_baru?: true
    jumlah_bangunan_baru?: true
  }

  export type DetailTransaksiTujuanMinAggregateInputType = {
    id_detail_tujuan?: true
    id_transaksi?: true
    nik_calon_subjek?: true
    luas_tanah_baru?: true
    luas_bangunan_baru?: true
    jumlah_bangunan_baru?: true
    jenis_tanah_baru?: true
    no_persil_baru?: true
    nop_generated?: true
  }

  export type DetailTransaksiTujuanMaxAggregateInputType = {
    id_detail_tujuan?: true
    id_transaksi?: true
    nik_calon_subjek?: true
    luas_tanah_baru?: true
    luas_bangunan_baru?: true
    jumlah_bangunan_baru?: true
    jenis_tanah_baru?: true
    no_persil_baru?: true
    nop_generated?: true
  }

  export type DetailTransaksiTujuanCountAggregateInputType = {
    id_detail_tujuan?: true
    id_transaksi?: true
    nik_calon_subjek?: true
    luas_tanah_baru?: true
    luas_bangunan_baru?: true
    jumlah_bangunan_baru?: true
    jenis_tanah_baru?: true
    no_persil_baru?: true
    nop_generated?: true
    _all?: true
  }

  export type DetailTransaksiTujuanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetailTransaksiTujuan to aggregate.
     */
    where?: DetailTransaksiTujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiTujuans to fetch.
     */
    orderBy?: DetailTransaksiTujuanOrderByWithRelationInput | DetailTransaksiTujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DetailTransaksiTujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiTujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiTujuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DetailTransaksiTujuans
    **/
    _count?: true | DetailTransaksiTujuanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DetailTransaksiTujuanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DetailTransaksiTujuanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DetailTransaksiTujuanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DetailTransaksiTujuanMaxAggregateInputType
  }

  export type GetDetailTransaksiTujuanAggregateType<T extends DetailTransaksiTujuanAggregateArgs> = {
        [P in keyof T & keyof AggregateDetailTransaksiTujuan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDetailTransaksiTujuan[P]>
      : GetScalarType<T[P], AggregateDetailTransaksiTujuan[P]>
  }




  export type DetailTransaksiTujuanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailTransaksiTujuanWhereInput
    orderBy?: DetailTransaksiTujuanOrderByWithAggregationInput | DetailTransaksiTujuanOrderByWithAggregationInput[]
    by: DetailTransaksiTujuanScalarFieldEnum[] | DetailTransaksiTujuanScalarFieldEnum
    having?: DetailTransaksiTujuanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DetailTransaksiTujuanCountAggregateInputType | true
    _avg?: DetailTransaksiTujuanAvgAggregateInputType
    _sum?: DetailTransaksiTujuanSumAggregateInputType
    _min?: DetailTransaksiTujuanMinAggregateInputType
    _max?: DetailTransaksiTujuanMaxAggregateInputType
  }

  export type DetailTransaksiTujuanGroupByOutputType = {
    id_detail_tujuan: string
    id_transaksi: string
    nik_calon_subjek: string
    luas_tanah_baru: Decimal
    luas_bangunan_baru: Decimal
    jumlah_bangunan_baru: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru: string | null
    nop_generated: string | null
    _count: DetailTransaksiTujuanCountAggregateOutputType | null
    _avg: DetailTransaksiTujuanAvgAggregateOutputType | null
    _sum: DetailTransaksiTujuanSumAggregateOutputType | null
    _min: DetailTransaksiTujuanMinAggregateOutputType | null
    _max: DetailTransaksiTujuanMaxAggregateOutputType | null
  }

  type GetDetailTransaksiTujuanGroupByPayload<T extends DetailTransaksiTujuanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DetailTransaksiTujuanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DetailTransaksiTujuanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DetailTransaksiTujuanGroupByOutputType[P]>
            : GetScalarType<T[P], DetailTransaksiTujuanGroupByOutputType[P]>
        }
      >
    >


  export type DetailTransaksiTujuanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_detail_tujuan?: boolean
    id_transaksi?: boolean
    nik_calon_subjek?: boolean
    luas_tanah_baru?: boolean
    luas_bangunan_baru?: boolean
    jumlah_bangunan_baru?: boolean
    jenis_tanah_baru?: boolean
    no_persil_baru?: boolean
    nop_generated?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    calon_subjek?: boolean | SubjekPajakDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detailTransaksiTujuan"]>

  export type DetailTransaksiTujuanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_detail_tujuan?: boolean
    id_transaksi?: boolean
    nik_calon_subjek?: boolean
    luas_tanah_baru?: boolean
    luas_bangunan_baru?: boolean
    jumlah_bangunan_baru?: boolean
    jenis_tanah_baru?: boolean
    no_persil_baru?: boolean
    nop_generated?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    calon_subjek?: boolean | SubjekPajakDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detailTransaksiTujuan"]>

  export type DetailTransaksiTujuanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_detail_tujuan?: boolean
    id_transaksi?: boolean
    nik_calon_subjek?: boolean
    luas_tanah_baru?: boolean
    luas_bangunan_baru?: boolean
    jumlah_bangunan_baru?: boolean
    jenis_tanah_baru?: boolean
    no_persil_baru?: boolean
    nop_generated?: boolean
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    calon_subjek?: boolean | SubjekPajakDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detailTransaksiTujuan"]>

  export type DetailTransaksiTujuanSelectScalar = {
    id_detail_tujuan?: boolean
    id_transaksi?: boolean
    nik_calon_subjek?: boolean
    luas_tanah_baru?: boolean
    luas_bangunan_baru?: boolean
    jumlah_bangunan_baru?: boolean
    jenis_tanah_baru?: boolean
    no_persil_baru?: boolean
    nop_generated?: boolean
  }

  export type DetailTransaksiTujuanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_detail_tujuan" | "id_transaksi" | "nik_calon_subjek" | "luas_tanah_baru" | "luas_bangunan_baru" | "jumlah_bangunan_baru" | "jenis_tanah_baru" | "no_persil_baru" | "nop_generated", ExtArgs["result"]["detailTransaksiTujuan"]>
  export type DetailTransaksiTujuanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    calon_subjek?: boolean | SubjekPajakDefaultArgs<ExtArgs>
  }
  export type DetailTransaksiTujuanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    calon_subjek?: boolean | SubjekPajakDefaultArgs<ExtArgs>
  }
  export type DetailTransaksiTujuanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiSpopDefaultArgs<ExtArgs>
    calon_subjek?: boolean | SubjekPajakDefaultArgs<ExtArgs>
  }

  export type $DetailTransaksiTujuanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DetailTransaksiTujuan"
    objects: {
      transaksi: Prisma.$TransaksiSpopPayload<ExtArgs>
      calon_subjek: Prisma.$SubjekPajakPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id_detail_tujuan: string
      id_transaksi: string
      nik_calon_subjek: string
      luas_tanah_baru: Prisma.Decimal
      luas_bangunan_baru: Prisma.Decimal
      jumlah_bangunan_baru: number
      jenis_tanah_baru: $Enums.JenisTanah
      no_persil_baru: string | null
      nop_generated: string | null
    }, ExtArgs["result"]["detailTransaksiTujuan"]>
    composites: {}
  }

  type DetailTransaksiTujuanGetPayload<S extends boolean | null | undefined | DetailTransaksiTujuanDefaultArgs> = $Result.GetResult<Prisma.$DetailTransaksiTujuanPayload, S>

  type DetailTransaksiTujuanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DetailTransaksiTujuanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DetailTransaksiTujuanCountAggregateInputType | true
    }

  export interface DetailTransaksiTujuanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DetailTransaksiTujuan'], meta: { name: 'DetailTransaksiTujuan' } }
    /**
     * Find zero or one DetailTransaksiTujuan that matches the filter.
     * @param {DetailTransaksiTujuanFindUniqueArgs} args - Arguments to find a DetailTransaksiTujuan
     * @example
     * // Get one DetailTransaksiTujuan
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DetailTransaksiTujuanFindUniqueArgs>(args: SelectSubset<T, DetailTransaksiTujuanFindUniqueArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DetailTransaksiTujuan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DetailTransaksiTujuanFindUniqueOrThrowArgs} args - Arguments to find a DetailTransaksiTujuan
     * @example
     * // Get one DetailTransaksiTujuan
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DetailTransaksiTujuanFindUniqueOrThrowArgs>(args: SelectSubset<T, DetailTransaksiTujuanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetailTransaksiTujuan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiTujuanFindFirstArgs} args - Arguments to find a DetailTransaksiTujuan
     * @example
     * // Get one DetailTransaksiTujuan
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DetailTransaksiTujuanFindFirstArgs>(args?: SelectSubset<T, DetailTransaksiTujuanFindFirstArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetailTransaksiTujuan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiTujuanFindFirstOrThrowArgs} args - Arguments to find a DetailTransaksiTujuan
     * @example
     * // Get one DetailTransaksiTujuan
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DetailTransaksiTujuanFindFirstOrThrowArgs>(args?: SelectSubset<T, DetailTransaksiTujuanFindFirstOrThrowArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DetailTransaksiTujuans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiTujuanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DetailTransaksiTujuans
     * const detailTransaksiTujuans = await prisma.detailTransaksiTujuan.findMany()
     * 
     * // Get first 10 DetailTransaksiTujuans
     * const detailTransaksiTujuans = await prisma.detailTransaksiTujuan.findMany({ take: 10 })
     * 
     * // Only select the `id_detail_tujuan`
     * const detailTransaksiTujuanWithId_detail_tujuanOnly = await prisma.detailTransaksiTujuan.findMany({ select: { id_detail_tujuan: true } })
     * 
     */
    findMany<T extends DetailTransaksiTujuanFindManyArgs>(args?: SelectSubset<T, DetailTransaksiTujuanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DetailTransaksiTujuan.
     * @param {DetailTransaksiTujuanCreateArgs} args - Arguments to create a DetailTransaksiTujuan.
     * @example
     * // Create one DetailTransaksiTujuan
     * const DetailTransaksiTujuan = await prisma.detailTransaksiTujuan.create({
     *   data: {
     *     // ... data to create a DetailTransaksiTujuan
     *   }
     * })
     * 
     */
    create<T extends DetailTransaksiTujuanCreateArgs>(args: SelectSubset<T, DetailTransaksiTujuanCreateArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DetailTransaksiTujuans.
     * @param {DetailTransaksiTujuanCreateManyArgs} args - Arguments to create many DetailTransaksiTujuans.
     * @example
     * // Create many DetailTransaksiTujuans
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DetailTransaksiTujuanCreateManyArgs>(args?: SelectSubset<T, DetailTransaksiTujuanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DetailTransaksiTujuans and returns the data saved in the database.
     * @param {DetailTransaksiTujuanCreateManyAndReturnArgs} args - Arguments to create many DetailTransaksiTujuans.
     * @example
     * // Create many DetailTransaksiTujuans
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DetailTransaksiTujuans and only return the `id_detail_tujuan`
     * const detailTransaksiTujuanWithId_detail_tujuanOnly = await prisma.detailTransaksiTujuan.createManyAndReturn({
     *   select: { id_detail_tujuan: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DetailTransaksiTujuanCreateManyAndReturnArgs>(args?: SelectSubset<T, DetailTransaksiTujuanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DetailTransaksiTujuan.
     * @param {DetailTransaksiTujuanDeleteArgs} args - Arguments to delete one DetailTransaksiTujuan.
     * @example
     * // Delete one DetailTransaksiTujuan
     * const DetailTransaksiTujuan = await prisma.detailTransaksiTujuan.delete({
     *   where: {
     *     // ... filter to delete one DetailTransaksiTujuan
     *   }
     * })
     * 
     */
    delete<T extends DetailTransaksiTujuanDeleteArgs>(args: SelectSubset<T, DetailTransaksiTujuanDeleteArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DetailTransaksiTujuan.
     * @param {DetailTransaksiTujuanUpdateArgs} args - Arguments to update one DetailTransaksiTujuan.
     * @example
     * // Update one DetailTransaksiTujuan
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DetailTransaksiTujuanUpdateArgs>(args: SelectSubset<T, DetailTransaksiTujuanUpdateArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DetailTransaksiTujuans.
     * @param {DetailTransaksiTujuanDeleteManyArgs} args - Arguments to filter DetailTransaksiTujuans to delete.
     * @example
     * // Delete a few DetailTransaksiTujuans
     * const { count } = await prisma.detailTransaksiTujuan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DetailTransaksiTujuanDeleteManyArgs>(args?: SelectSubset<T, DetailTransaksiTujuanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetailTransaksiTujuans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiTujuanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DetailTransaksiTujuans
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DetailTransaksiTujuanUpdateManyArgs>(args: SelectSubset<T, DetailTransaksiTujuanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetailTransaksiTujuans and returns the data updated in the database.
     * @param {DetailTransaksiTujuanUpdateManyAndReturnArgs} args - Arguments to update many DetailTransaksiTujuans.
     * @example
     * // Update many DetailTransaksiTujuans
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DetailTransaksiTujuans and only return the `id_detail_tujuan`
     * const detailTransaksiTujuanWithId_detail_tujuanOnly = await prisma.detailTransaksiTujuan.updateManyAndReturn({
     *   select: { id_detail_tujuan: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DetailTransaksiTujuanUpdateManyAndReturnArgs>(args: SelectSubset<T, DetailTransaksiTujuanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DetailTransaksiTujuan.
     * @param {DetailTransaksiTujuanUpsertArgs} args - Arguments to update or create a DetailTransaksiTujuan.
     * @example
     * // Update or create a DetailTransaksiTujuan
     * const detailTransaksiTujuan = await prisma.detailTransaksiTujuan.upsert({
     *   create: {
     *     // ... data to create a DetailTransaksiTujuan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DetailTransaksiTujuan we want to update
     *   }
     * })
     */
    upsert<T extends DetailTransaksiTujuanUpsertArgs>(args: SelectSubset<T, DetailTransaksiTujuanUpsertArgs<ExtArgs>>): Prisma__DetailTransaksiTujuanClient<$Result.GetResult<Prisma.$DetailTransaksiTujuanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DetailTransaksiTujuans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiTujuanCountArgs} args - Arguments to filter DetailTransaksiTujuans to count.
     * @example
     * // Count the number of DetailTransaksiTujuans
     * const count = await prisma.detailTransaksiTujuan.count({
     *   where: {
     *     // ... the filter for the DetailTransaksiTujuans we want to count
     *   }
     * })
    **/
    count<T extends DetailTransaksiTujuanCountArgs>(
      args?: Subset<T, DetailTransaksiTujuanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DetailTransaksiTujuanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DetailTransaksiTujuan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiTujuanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DetailTransaksiTujuanAggregateArgs>(args: Subset<T, DetailTransaksiTujuanAggregateArgs>): Prisma.PrismaPromise<GetDetailTransaksiTujuanAggregateType<T>>

    /**
     * Group by DetailTransaksiTujuan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailTransaksiTujuanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DetailTransaksiTujuanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DetailTransaksiTujuanGroupByArgs['orderBy'] }
        : { orderBy?: DetailTransaksiTujuanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DetailTransaksiTujuanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDetailTransaksiTujuanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DetailTransaksiTujuan model
   */
  readonly fields: DetailTransaksiTujuanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DetailTransaksiTujuan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DetailTransaksiTujuanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transaksi<T extends TransaksiSpopDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiSpopDefaultArgs<ExtArgs>>): Prisma__TransaksiSpopClient<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    calon_subjek<T extends SubjekPajakDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubjekPajakDefaultArgs<ExtArgs>>): Prisma__SubjekPajakClient<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DetailTransaksiTujuan model
   */
  interface DetailTransaksiTujuanFieldRefs {
    readonly id_detail_tujuan: FieldRef<"DetailTransaksiTujuan", 'String'>
    readonly id_transaksi: FieldRef<"DetailTransaksiTujuan", 'String'>
    readonly nik_calon_subjek: FieldRef<"DetailTransaksiTujuan", 'String'>
    readonly luas_tanah_baru: FieldRef<"DetailTransaksiTujuan", 'Decimal'>
    readonly luas_bangunan_baru: FieldRef<"DetailTransaksiTujuan", 'Decimal'>
    readonly jumlah_bangunan_baru: FieldRef<"DetailTransaksiTujuan", 'Int'>
    readonly jenis_tanah_baru: FieldRef<"DetailTransaksiTujuan", 'JenisTanah'>
    readonly no_persil_baru: FieldRef<"DetailTransaksiTujuan", 'String'>
    readonly nop_generated: FieldRef<"DetailTransaksiTujuan", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DetailTransaksiTujuan findUnique
   */
  export type DetailTransaksiTujuanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiTujuan to fetch.
     */
    where: DetailTransaksiTujuanWhereUniqueInput
  }

  /**
   * DetailTransaksiTujuan findUniqueOrThrow
   */
  export type DetailTransaksiTujuanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiTujuan to fetch.
     */
    where: DetailTransaksiTujuanWhereUniqueInput
  }

  /**
   * DetailTransaksiTujuan findFirst
   */
  export type DetailTransaksiTujuanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiTujuan to fetch.
     */
    where?: DetailTransaksiTujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiTujuans to fetch.
     */
    orderBy?: DetailTransaksiTujuanOrderByWithRelationInput | DetailTransaksiTujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetailTransaksiTujuans.
     */
    cursor?: DetailTransaksiTujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiTujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiTujuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailTransaksiTujuans.
     */
    distinct?: DetailTransaksiTujuanScalarFieldEnum | DetailTransaksiTujuanScalarFieldEnum[]
  }

  /**
   * DetailTransaksiTujuan findFirstOrThrow
   */
  export type DetailTransaksiTujuanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiTujuan to fetch.
     */
    where?: DetailTransaksiTujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiTujuans to fetch.
     */
    orderBy?: DetailTransaksiTujuanOrderByWithRelationInput | DetailTransaksiTujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetailTransaksiTujuans.
     */
    cursor?: DetailTransaksiTujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiTujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiTujuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailTransaksiTujuans.
     */
    distinct?: DetailTransaksiTujuanScalarFieldEnum | DetailTransaksiTujuanScalarFieldEnum[]
  }

  /**
   * DetailTransaksiTujuan findMany
   */
  export type DetailTransaksiTujuanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * Filter, which DetailTransaksiTujuans to fetch.
     */
    where?: DetailTransaksiTujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailTransaksiTujuans to fetch.
     */
    orderBy?: DetailTransaksiTujuanOrderByWithRelationInput | DetailTransaksiTujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DetailTransaksiTujuans.
     */
    cursor?: DetailTransaksiTujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailTransaksiTujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailTransaksiTujuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailTransaksiTujuans.
     */
    distinct?: DetailTransaksiTujuanScalarFieldEnum | DetailTransaksiTujuanScalarFieldEnum[]
  }

  /**
   * DetailTransaksiTujuan create
   */
  export type DetailTransaksiTujuanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * The data needed to create a DetailTransaksiTujuan.
     */
    data: XOR<DetailTransaksiTujuanCreateInput, DetailTransaksiTujuanUncheckedCreateInput>
  }

  /**
   * DetailTransaksiTujuan createMany
   */
  export type DetailTransaksiTujuanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DetailTransaksiTujuans.
     */
    data: DetailTransaksiTujuanCreateManyInput | DetailTransaksiTujuanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DetailTransaksiTujuan createManyAndReturn
   */
  export type DetailTransaksiTujuanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * The data used to create many DetailTransaksiTujuans.
     */
    data: DetailTransaksiTujuanCreateManyInput | DetailTransaksiTujuanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetailTransaksiTujuan update
   */
  export type DetailTransaksiTujuanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * The data needed to update a DetailTransaksiTujuan.
     */
    data: XOR<DetailTransaksiTujuanUpdateInput, DetailTransaksiTujuanUncheckedUpdateInput>
    /**
     * Choose, which DetailTransaksiTujuan to update.
     */
    where: DetailTransaksiTujuanWhereUniqueInput
  }

  /**
   * DetailTransaksiTujuan updateMany
   */
  export type DetailTransaksiTujuanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DetailTransaksiTujuans.
     */
    data: XOR<DetailTransaksiTujuanUpdateManyMutationInput, DetailTransaksiTujuanUncheckedUpdateManyInput>
    /**
     * Filter which DetailTransaksiTujuans to update
     */
    where?: DetailTransaksiTujuanWhereInput
    /**
     * Limit how many DetailTransaksiTujuans to update.
     */
    limit?: number
  }

  /**
   * DetailTransaksiTujuan updateManyAndReturn
   */
  export type DetailTransaksiTujuanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * The data used to update DetailTransaksiTujuans.
     */
    data: XOR<DetailTransaksiTujuanUpdateManyMutationInput, DetailTransaksiTujuanUncheckedUpdateManyInput>
    /**
     * Filter which DetailTransaksiTujuans to update
     */
    where?: DetailTransaksiTujuanWhereInput
    /**
     * Limit how many DetailTransaksiTujuans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetailTransaksiTujuan upsert
   */
  export type DetailTransaksiTujuanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * The filter to search for the DetailTransaksiTujuan to update in case it exists.
     */
    where: DetailTransaksiTujuanWhereUniqueInput
    /**
     * In case the DetailTransaksiTujuan found by the `where` argument doesn't exist, create a new DetailTransaksiTujuan with this data.
     */
    create: XOR<DetailTransaksiTujuanCreateInput, DetailTransaksiTujuanUncheckedCreateInput>
    /**
     * In case the DetailTransaksiTujuan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DetailTransaksiTujuanUpdateInput, DetailTransaksiTujuanUncheckedUpdateInput>
  }

  /**
   * DetailTransaksiTujuan delete
   */
  export type DetailTransaksiTujuanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
    /**
     * Filter which DetailTransaksiTujuan to delete.
     */
    where: DetailTransaksiTujuanWhereUniqueInput
  }

  /**
   * DetailTransaksiTujuan deleteMany
   */
  export type DetailTransaksiTujuanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetailTransaksiTujuans to delete
     */
    where?: DetailTransaksiTujuanWhereInput
    /**
     * Limit how many DetailTransaksiTujuans to delete.
     */
    limit?: number
  }

  /**
   * DetailTransaksiTujuan without action
   */
  export type DetailTransaksiTujuanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailTransaksiTujuan
     */
    select?: DetailTransaksiTujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailTransaksiTujuan
     */
    omit?: DetailTransaksiTujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailTransaksiTujuanInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id_user: string | null
    username: string | null
    password_hash: string | null
    nama_lengkap: string | null
    role: $Enums.Role | null
    kode_wilayah: string | null
    nip: string | null
    is_active: boolean | null
    created_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id_user: string | null
    username: string | null
    password_hash: string | null
    nama_lengkap: string | null
    role: $Enums.Role | null
    kode_wilayah: string | null
    nip: string | null
    is_active: boolean | null
    created_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id_user: number
    username: number
    password_hash: number
    nama_lengkap: number
    role: number
    kode_wilayah: number
    nip: number
    is_active: number
    created_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id_user?: true
    username?: true
    password_hash?: true
    nama_lengkap?: true
    role?: true
    kode_wilayah?: true
    nip?: true
    is_active?: true
    created_at?: true
  }

  export type UserMaxAggregateInputType = {
    id_user?: true
    username?: true
    password_hash?: true
    nama_lengkap?: true
    role?: true
    kode_wilayah?: true
    nip?: true
    is_active?: true
    created_at?: true
  }

  export type UserCountAggregateInputType = {
    id_user?: true
    username?: true
    password_hash?: true
    nama_lengkap?: true
    role?: true
    kode_wilayah?: true
    nip?: true
    is_active?: true
    created_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id_user: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah: string | null
    nip: string | null
    is_active: boolean
    created_at: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_user?: boolean
    username?: boolean
    password_hash?: boolean
    nama_lengkap?: boolean
    role?: boolean
    kode_wilayah?: boolean
    nip?: boolean
    is_active?: boolean
    created_at?: boolean
    wilayah?: boolean | User$wilayahArgs<ExtArgs>
    subjek_pajak_dibuat?: boolean | User$subjek_pajak_dibuatArgs<ExtArgs>
    objek_nonaktif?: boolean | User$objek_nonaktifArgs<ExtArgs>
    transaksi_diajukan?: boolean | User$transaksi_diajukanArgs<ExtArgs>
    transaksi_diverifikasi?: boolean | User$transaksi_diverifikasiArgs<ExtArgs>
    lampiran_diupload?: boolean | User$lampiran_diuploadArgs<ExtArgs>
    sppt_digenerate?: boolean | User$sppt_digenerateArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_user?: boolean
    username?: boolean
    password_hash?: boolean
    nama_lengkap?: boolean
    role?: boolean
    kode_wilayah?: boolean
    nip?: boolean
    is_active?: boolean
    created_at?: boolean
    wilayah?: boolean | User$wilayahArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_user?: boolean
    username?: boolean
    password_hash?: boolean
    nama_lengkap?: boolean
    role?: boolean
    kode_wilayah?: boolean
    nip?: boolean
    is_active?: boolean
    created_at?: boolean
    wilayah?: boolean | User$wilayahArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id_user?: boolean
    username?: boolean
    password_hash?: boolean
    nama_lengkap?: boolean
    role?: boolean
    kode_wilayah?: boolean
    nip?: boolean
    is_active?: boolean
    created_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_user" | "username" | "password_hash" | "nama_lengkap" | "role" | "kode_wilayah" | "nip" | "is_active" | "created_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wilayah?: boolean | User$wilayahArgs<ExtArgs>
    subjek_pajak_dibuat?: boolean | User$subjek_pajak_dibuatArgs<ExtArgs>
    objek_nonaktif?: boolean | User$objek_nonaktifArgs<ExtArgs>
    transaksi_diajukan?: boolean | User$transaksi_diajukanArgs<ExtArgs>
    transaksi_diverifikasi?: boolean | User$transaksi_diverifikasiArgs<ExtArgs>
    lampiran_diupload?: boolean | User$lampiran_diuploadArgs<ExtArgs>
    sppt_digenerate?: boolean | User$sppt_digenerateArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wilayah?: boolean | User$wilayahArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wilayah?: boolean | User$wilayahArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      wilayah: Prisma.$WilayahPayload<ExtArgs> | null
      subjek_pajak_dibuat: Prisma.$SubjekPajakPayload<ExtArgs>[]
      objek_nonaktif: Prisma.$ObjekPajakPayload<ExtArgs>[]
      transaksi_diajukan: Prisma.$TransaksiSpopPayload<ExtArgs>[]
      transaksi_diverifikasi: Prisma.$TransaksiSpopPayload<ExtArgs>[]
      lampiran_diupload: Prisma.$LampiranDokumenPayload<ExtArgs>[]
      sppt_digenerate: Prisma.$SpptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_user: string
      username: string
      password_hash: string
      nama_lengkap: string
      role: $Enums.Role
      kode_wilayah: string | null
      nip: string | null
      is_active: boolean
      created_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id_user`
     * const userWithId_userOnly = await prisma.user.findMany({ select: { id_user: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id_user`
     * const userWithId_userOnly = await prisma.user.createManyAndReturn({
     *   select: { id_user: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id_user`
     * const userWithId_userOnly = await prisma.user.updateManyAndReturn({
     *   select: { id_user: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wilayah<T extends User$wilayahArgs<ExtArgs> = {}>(args?: Subset<T, User$wilayahArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    subjek_pajak_dibuat<T extends User$subjek_pajak_dibuatArgs<ExtArgs> = {}>(args?: Subset<T, User$subjek_pajak_dibuatArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjekPajakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    objek_nonaktif<T extends User$objek_nonaktifArgs<ExtArgs> = {}>(args?: Subset<T, User$objek_nonaktifArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObjekPajakPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transaksi_diajukan<T extends User$transaksi_diajukanArgs<ExtArgs> = {}>(args?: Subset<T, User$transaksi_diajukanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transaksi_diverifikasi<T extends User$transaksi_diverifikasiArgs<ExtArgs> = {}>(args?: Subset<T, User$transaksi_diverifikasiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiSpopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    lampiran_diupload<T extends User$lampiran_diuploadArgs<ExtArgs> = {}>(args?: Subset<T, User$lampiran_diuploadArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LampiranDokumenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sppt_digenerate<T extends User$sppt_digenerateArgs<ExtArgs> = {}>(args?: Subset<T, User$sppt_digenerateArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id_user: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password_hash: FieldRef<"User", 'String'>
    readonly nama_lengkap: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly kode_wilayah: FieldRef<"User", 'String'>
    readonly nip: FieldRef<"User", 'String'>
    readonly is_active: FieldRef<"User", 'Boolean'>
    readonly created_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.wilayah
   */
  export type User$wilayahArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    where?: WilayahWhereInput
  }

  /**
   * User.subjek_pajak_dibuat
   */
  export type User$subjek_pajak_dibuatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjekPajak
     */
    select?: SubjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubjekPajak
     */
    omit?: SubjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjekPajakInclude<ExtArgs> | null
    where?: SubjekPajakWhereInput
    orderBy?: SubjekPajakOrderByWithRelationInput | SubjekPajakOrderByWithRelationInput[]
    cursor?: SubjekPajakWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubjekPajakScalarFieldEnum | SubjekPajakScalarFieldEnum[]
  }

  /**
   * User.objek_nonaktif
   */
  export type User$objek_nonaktifArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObjekPajak
     */
    select?: ObjekPajakSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObjekPajak
     */
    omit?: ObjekPajakOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObjekPajakInclude<ExtArgs> | null
    where?: ObjekPajakWhereInput
    orderBy?: ObjekPajakOrderByWithRelationInput | ObjekPajakOrderByWithRelationInput[]
    cursor?: ObjekPajakWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObjekPajakScalarFieldEnum | ObjekPajakScalarFieldEnum[]
  }

  /**
   * User.transaksi_diajukan
   */
  export type User$transaksi_diajukanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    where?: TransaksiSpopWhereInput
    orderBy?: TransaksiSpopOrderByWithRelationInput | TransaksiSpopOrderByWithRelationInput[]
    cursor?: TransaksiSpopWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransaksiSpopScalarFieldEnum | TransaksiSpopScalarFieldEnum[]
  }

  /**
   * User.transaksi_diverifikasi
   */
  export type User$transaksi_diverifikasiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiSpop
     */
    select?: TransaksiSpopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransaksiSpop
     */
    omit?: TransaksiSpopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiSpopInclude<ExtArgs> | null
    where?: TransaksiSpopWhereInput
    orderBy?: TransaksiSpopOrderByWithRelationInput | TransaksiSpopOrderByWithRelationInput[]
    cursor?: TransaksiSpopWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransaksiSpopScalarFieldEnum | TransaksiSpopScalarFieldEnum[]
  }

  /**
   * User.lampiran_diupload
   */
  export type User$lampiran_diuploadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LampiranDokumen
     */
    select?: LampiranDokumenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LampiranDokumen
     */
    omit?: LampiranDokumenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LampiranDokumenInclude<ExtArgs> | null
    where?: LampiranDokumenWhereInput
    orderBy?: LampiranDokumenOrderByWithRelationInput | LampiranDokumenOrderByWithRelationInput[]
    cursor?: LampiranDokumenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LampiranDokumenScalarFieldEnum | LampiranDokumenScalarFieldEnum[]
  }

  /**
   * User.sppt_digenerate
   */
  export type User$sppt_digenerateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sppt
     */
    select?: SpptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sppt
     */
    omit?: SpptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpptInclude<ExtArgs> | null
    where?: SpptWhereInput
    orderBy?: SpptOrderByWithRelationInput | SpptOrderByWithRelationInput[]
    cursor?: SpptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpptScalarFieldEnum | SpptScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Wilayah
   */

  export type AggregateWilayah = {
    _count: WilayahCountAggregateOutputType | null
    _min: WilayahMinAggregateOutputType | null
    _max: WilayahMaxAggregateOutputType | null
  }

  export type WilayahMinAggregateOutputType = {
    kode_wilayah: string | null
    nama_desa: string | null
    kode_kel: string | null
    kecamatan: string | null
    kode_kec: string | null
    kabupaten: string | null
    kode_kab: string | null
  }

  export type WilayahMaxAggregateOutputType = {
    kode_wilayah: string | null
    nama_desa: string | null
    kode_kel: string | null
    kecamatan: string | null
    kode_kec: string | null
    kabupaten: string | null
    kode_kab: string | null
  }

  export type WilayahCountAggregateOutputType = {
    kode_wilayah: number
    nama_desa: number
    kode_kel: number
    kecamatan: number
    kode_kec: number
    kabupaten: number
    kode_kab: number
    _all: number
  }


  export type WilayahMinAggregateInputType = {
    kode_wilayah?: true
    nama_desa?: true
    kode_kel?: true
    kecamatan?: true
    kode_kec?: true
    kabupaten?: true
    kode_kab?: true
  }

  export type WilayahMaxAggregateInputType = {
    kode_wilayah?: true
    nama_desa?: true
    kode_kel?: true
    kecamatan?: true
    kode_kec?: true
    kabupaten?: true
    kode_kab?: true
  }

  export type WilayahCountAggregateInputType = {
    kode_wilayah?: true
    nama_desa?: true
    kode_kel?: true
    kecamatan?: true
    kode_kec?: true
    kabupaten?: true
    kode_kab?: true
    _all?: true
  }

  export type WilayahAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wilayah to aggregate.
     */
    where?: WilayahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wilayahs to fetch.
     */
    orderBy?: WilayahOrderByWithRelationInput | WilayahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WilayahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wilayahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wilayahs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wilayahs
    **/
    _count?: true | WilayahCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WilayahMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WilayahMaxAggregateInputType
  }

  export type GetWilayahAggregateType<T extends WilayahAggregateArgs> = {
        [P in keyof T & keyof AggregateWilayah]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWilayah[P]>
      : GetScalarType<T[P], AggregateWilayah[P]>
  }




  export type WilayahGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WilayahWhereInput
    orderBy?: WilayahOrderByWithAggregationInput | WilayahOrderByWithAggregationInput[]
    by: WilayahScalarFieldEnum[] | WilayahScalarFieldEnum
    having?: WilayahScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WilayahCountAggregateInputType | true
    _min?: WilayahMinAggregateInputType
    _max?: WilayahMaxAggregateInputType
  }

  export type WilayahGroupByOutputType = {
    kode_wilayah: string
    nama_desa: string
    kode_kel: string
    kecamatan: string
    kode_kec: string
    kabupaten: string
    kode_kab: string
    _count: WilayahCountAggregateOutputType | null
    _min: WilayahMinAggregateOutputType | null
    _max: WilayahMaxAggregateOutputType | null
  }

  type GetWilayahGroupByPayload<T extends WilayahGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WilayahGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WilayahGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WilayahGroupByOutputType[P]>
            : GetScalarType<T[P], WilayahGroupByOutputType[P]>
        }
      >
    >


  export type WilayahSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    kode_wilayah?: boolean
    nama_desa?: boolean
    kode_kel?: boolean
    kecamatan?: boolean
    kode_kec?: boolean
    kabupaten?: boolean
    kode_kab?: boolean
    users?: boolean | Wilayah$usersArgs<ExtArgs>
    _count?: boolean | WilayahCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wilayah"]>

  export type WilayahSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    kode_wilayah?: boolean
    nama_desa?: boolean
    kode_kel?: boolean
    kecamatan?: boolean
    kode_kec?: boolean
    kabupaten?: boolean
    kode_kab?: boolean
  }, ExtArgs["result"]["wilayah"]>

  export type WilayahSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    kode_wilayah?: boolean
    nama_desa?: boolean
    kode_kel?: boolean
    kecamatan?: boolean
    kode_kec?: boolean
    kabupaten?: boolean
    kode_kab?: boolean
  }, ExtArgs["result"]["wilayah"]>

  export type WilayahSelectScalar = {
    kode_wilayah?: boolean
    nama_desa?: boolean
    kode_kel?: boolean
    kecamatan?: boolean
    kode_kec?: boolean
    kabupaten?: boolean
    kode_kab?: boolean
  }

  export type WilayahOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"kode_wilayah" | "nama_desa" | "kode_kel" | "kecamatan" | "kode_kec" | "kabupaten" | "kode_kab", ExtArgs["result"]["wilayah"]>
  export type WilayahInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Wilayah$usersArgs<ExtArgs>
    _count?: boolean | WilayahCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WilayahIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WilayahIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WilayahPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wilayah"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      kode_wilayah: string
      nama_desa: string
      kode_kel: string
      kecamatan: string
      kode_kec: string
      kabupaten: string
      kode_kab: string
    }, ExtArgs["result"]["wilayah"]>
    composites: {}
  }

  type WilayahGetPayload<S extends boolean | null | undefined | WilayahDefaultArgs> = $Result.GetResult<Prisma.$WilayahPayload, S>

  type WilayahCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WilayahFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WilayahCountAggregateInputType | true
    }

  export interface WilayahDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wilayah'], meta: { name: 'Wilayah' } }
    /**
     * Find zero or one Wilayah that matches the filter.
     * @param {WilayahFindUniqueArgs} args - Arguments to find a Wilayah
     * @example
     * // Get one Wilayah
     * const wilayah = await prisma.wilayah.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WilayahFindUniqueArgs>(args: SelectSubset<T, WilayahFindUniqueArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wilayah that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WilayahFindUniqueOrThrowArgs} args - Arguments to find a Wilayah
     * @example
     * // Get one Wilayah
     * const wilayah = await prisma.wilayah.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WilayahFindUniqueOrThrowArgs>(args: SelectSubset<T, WilayahFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wilayah that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WilayahFindFirstArgs} args - Arguments to find a Wilayah
     * @example
     * // Get one Wilayah
     * const wilayah = await prisma.wilayah.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WilayahFindFirstArgs>(args?: SelectSubset<T, WilayahFindFirstArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wilayah that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WilayahFindFirstOrThrowArgs} args - Arguments to find a Wilayah
     * @example
     * // Get one Wilayah
     * const wilayah = await prisma.wilayah.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WilayahFindFirstOrThrowArgs>(args?: SelectSubset<T, WilayahFindFirstOrThrowArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wilayahs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WilayahFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wilayahs
     * const wilayahs = await prisma.wilayah.findMany()
     * 
     * // Get first 10 Wilayahs
     * const wilayahs = await prisma.wilayah.findMany({ take: 10 })
     * 
     * // Only select the `kode_wilayah`
     * const wilayahWithKode_wilayahOnly = await prisma.wilayah.findMany({ select: { kode_wilayah: true } })
     * 
     */
    findMany<T extends WilayahFindManyArgs>(args?: SelectSubset<T, WilayahFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wilayah.
     * @param {WilayahCreateArgs} args - Arguments to create a Wilayah.
     * @example
     * // Create one Wilayah
     * const Wilayah = await prisma.wilayah.create({
     *   data: {
     *     // ... data to create a Wilayah
     *   }
     * })
     * 
     */
    create<T extends WilayahCreateArgs>(args: SelectSubset<T, WilayahCreateArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wilayahs.
     * @param {WilayahCreateManyArgs} args - Arguments to create many Wilayahs.
     * @example
     * // Create many Wilayahs
     * const wilayah = await prisma.wilayah.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WilayahCreateManyArgs>(args?: SelectSubset<T, WilayahCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Wilayahs and returns the data saved in the database.
     * @param {WilayahCreateManyAndReturnArgs} args - Arguments to create many Wilayahs.
     * @example
     * // Create many Wilayahs
     * const wilayah = await prisma.wilayah.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Wilayahs and only return the `kode_wilayah`
     * const wilayahWithKode_wilayahOnly = await prisma.wilayah.createManyAndReturn({
     *   select: { kode_wilayah: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WilayahCreateManyAndReturnArgs>(args?: SelectSubset<T, WilayahCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Wilayah.
     * @param {WilayahDeleteArgs} args - Arguments to delete one Wilayah.
     * @example
     * // Delete one Wilayah
     * const Wilayah = await prisma.wilayah.delete({
     *   where: {
     *     // ... filter to delete one Wilayah
     *   }
     * })
     * 
     */
    delete<T extends WilayahDeleteArgs>(args: SelectSubset<T, WilayahDeleteArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wilayah.
     * @param {WilayahUpdateArgs} args - Arguments to update one Wilayah.
     * @example
     * // Update one Wilayah
     * const wilayah = await prisma.wilayah.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WilayahUpdateArgs>(args: SelectSubset<T, WilayahUpdateArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wilayahs.
     * @param {WilayahDeleteManyArgs} args - Arguments to filter Wilayahs to delete.
     * @example
     * // Delete a few Wilayahs
     * const { count } = await prisma.wilayah.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WilayahDeleteManyArgs>(args?: SelectSubset<T, WilayahDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wilayahs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WilayahUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wilayahs
     * const wilayah = await prisma.wilayah.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WilayahUpdateManyArgs>(args: SelectSubset<T, WilayahUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wilayahs and returns the data updated in the database.
     * @param {WilayahUpdateManyAndReturnArgs} args - Arguments to update many Wilayahs.
     * @example
     * // Update many Wilayahs
     * const wilayah = await prisma.wilayah.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Wilayahs and only return the `kode_wilayah`
     * const wilayahWithKode_wilayahOnly = await prisma.wilayah.updateManyAndReturn({
     *   select: { kode_wilayah: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WilayahUpdateManyAndReturnArgs>(args: SelectSubset<T, WilayahUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Wilayah.
     * @param {WilayahUpsertArgs} args - Arguments to update or create a Wilayah.
     * @example
     * // Update or create a Wilayah
     * const wilayah = await prisma.wilayah.upsert({
     *   create: {
     *     // ... data to create a Wilayah
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wilayah we want to update
     *   }
     * })
     */
    upsert<T extends WilayahUpsertArgs>(args: SelectSubset<T, WilayahUpsertArgs<ExtArgs>>): Prisma__WilayahClient<$Result.GetResult<Prisma.$WilayahPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wilayahs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WilayahCountArgs} args - Arguments to filter Wilayahs to count.
     * @example
     * // Count the number of Wilayahs
     * const count = await prisma.wilayah.count({
     *   where: {
     *     // ... the filter for the Wilayahs we want to count
     *   }
     * })
    **/
    count<T extends WilayahCountArgs>(
      args?: Subset<T, WilayahCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WilayahCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wilayah.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WilayahAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WilayahAggregateArgs>(args: Subset<T, WilayahAggregateArgs>): Prisma.PrismaPromise<GetWilayahAggregateType<T>>

    /**
     * Group by Wilayah.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WilayahGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WilayahGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WilayahGroupByArgs['orderBy'] }
        : { orderBy?: WilayahGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WilayahGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWilayahGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wilayah model
   */
  readonly fields: WilayahFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wilayah.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WilayahClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Wilayah$usersArgs<ExtArgs> = {}>(args?: Subset<T, Wilayah$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wilayah model
   */
  interface WilayahFieldRefs {
    readonly kode_wilayah: FieldRef<"Wilayah", 'String'>
    readonly nama_desa: FieldRef<"Wilayah", 'String'>
    readonly kode_kel: FieldRef<"Wilayah", 'String'>
    readonly kecamatan: FieldRef<"Wilayah", 'String'>
    readonly kode_kec: FieldRef<"Wilayah", 'String'>
    readonly kabupaten: FieldRef<"Wilayah", 'String'>
    readonly kode_kab: FieldRef<"Wilayah", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Wilayah findUnique
   */
  export type WilayahFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * Filter, which Wilayah to fetch.
     */
    where: WilayahWhereUniqueInput
  }

  /**
   * Wilayah findUniqueOrThrow
   */
  export type WilayahFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * Filter, which Wilayah to fetch.
     */
    where: WilayahWhereUniqueInput
  }

  /**
   * Wilayah findFirst
   */
  export type WilayahFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * Filter, which Wilayah to fetch.
     */
    where?: WilayahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wilayahs to fetch.
     */
    orderBy?: WilayahOrderByWithRelationInput | WilayahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wilayahs.
     */
    cursor?: WilayahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wilayahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wilayahs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wilayahs.
     */
    distinct?: WilayahScalarFieldEnum | WilayahScalarFieldEnum[]
  }

  /**
   * Wilayah findFirstOrThrow
   */
  export type WilayahFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * Filter, which Wilayah to fetch.
     */
    where?: WilayahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wilayahs to fetch.
     */
    orderBy?: WilayahOrderByWithRelationInput | WilayahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wilayahs.
     */
    cursor?: WilayahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wilayahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wilayahs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wilayahs.
     */
    distinct?: WilayahScalarFieldEnum | WilayahScalarFieldEnum[]
  }

  /**
   * Wilayah findMany
   */
  export type WilayahFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * Filter, which Wilayahs to fetch.
     */
    where?: WilayahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wilayahs to fetch.
     */
    orderBy?: WilayahOrderByWithRelationInput | WilayahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wilayahs.
     */
    cursor?: WilayahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wilayahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wilayahs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wilayahs.
     */
    distinct?: WilayahScalarFieldEnum | WilayahScalarFieldEnum[]
  }

  /**
   * Wilayah create
   */
  export type WilayahCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * The data needed to create a Wilayah.
     */
    data: XOR<WilayahCreateInput, WilayahUncheckedCreateInput>
  }

  /**
   * Wilayah createMany
   */
  export type WilayahCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wilayahs.
     */
    data: WilayahCreateManyInput | WilayahCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wilayah createManyAndReturn
   */
  export type WilayahCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * The data used to create many Wilayahs.
     */
    data: WilayahCreateManyInput | WilayahCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wilayah update
   */
  export type WilayahUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * The data needed to update a Wilayah.
     */
    data: XOR<WilayahUpdateInput, WilayahUncheckedUpdateInput>
    /**
     * Choose, which Wilayah to update.
     */
    where: WilayahWhereUniqueInput
  }

  /**
   * Wilayah updateMany
   */
  export type WilayahUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wilayahs.
     */
    data: XOR<WilayahUpdateManyMutationInput, WilayahUncheckedUpdateManyInput>
    /**
     * Filter which Wilayahs to update
     */
    where?: WilayahWhereInput
    /**
     * Limit how many Wilayahs to update.
     */
    limit?: number
  }

  /**
   * Wilayah updateManyAndReturn
   */
  export type WilayahUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * The data used to update Wilayahs.
     */
    data: XOR<WilayahUpdateManyMutationInput, WilayahUncheckedUpdateManyInput>
    /**
     * Filter which Wilayahs to update
     */
    where?: WilayahWhereInput
    /**
     * Limit how many Wilayahs to update.
     */
    limit?: number
  }

  /**
   * Wilayah upsert
   */
  export type WilayahUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * The filter to search for the Wilayah to update in case it exists.
     */
    where: WilayahWhereUniqueInput
    /**
     * In case the Wilayah found by the `where` argument doesn't exist, create a new Wilayah with this data.
     */
    create: XOR<WilayahCreateInput, WilayahUncheckedCreateInput>
    /**
     * In case the Wilayah was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WilayahUpdateInput, WilayahUncheckedUpdateInput>
  }

  /**
   * Wilayah delete
   */
  export type WilayahDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
    /**
     * Filter which Wilayah to delete.
     */
    where: WilayahWhereUniqueInput
  }

  /**
   * Wilayah deleteMany
   */
  export type WilayahDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wilayahs to delete
     */
    where?: WilayahWhereInput
    /**
     * Limit how many Wilayahs to delete.
     */
    limit?: number
  }

  /**
   * Wilayah.users
   */
  export type Wilayah$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Wilayah without action
   */
  export type WilayahDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wilayah
     */
    select?: WilayahSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wilayah
     */
    omit?: WilayahOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WilayahInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LampiranDokumenScalarFieldEnum: {
    id_dokumen: 'id_dokumen',
    id_transaksi: 'id_transaksi',
    jenis_dokumen: 'jenis_dokumen',
    keterangan_dokumen: 'keterangan_dokumen',
    url_file: 'url_file',
    uploaded_at: 'uploaded_at',
    uploaded_by: 'uploaded_by'
  };

  export type LampiranDokumenScalarFieldEnum = (typeof LampiranDokumenScalarFieldEnum)[keyof typeof LampiranDokumenScalarFieldEnum]


  export const ObjekPajakScalarFieldEnum: {
    nop: 'nop',
    nik_subjek: 'nik_subjek',
    no_persil: 'no_persil',
    jalan_op: 'jalan_op',
    blok_kav_no: 'blok_kav_no',
    rw_op: 'rw_op',
    rt_op: 'rt_op',
    kelurahan_op: 'kelurahan_op',
    kecamatan_op: 'kecamatan_op',
    luas_tanah: 'luas_tanah',
    zona_nilai_tanah: 'zona_nilai_tanah',
    jenis_tanah: 'jenis_tanah',
    jumlah_bangunan: 'jumlah_bangunan',
    luas_bangunan: 'luas_bangunan',
    njop_tanah: 'njop_tanah',
    njop_bangunan: 'njop_bangunan',
    njop_total: 'njop_total',
    tahun_penilaian: 'tahun_penilaian',
    status_aktif: 'status_aktif',
    nonaktif_oleh: 'nonaktif_oleh',
    nonaktif_at: 'nonaktif_at',
    created_at: 'created_at'
  };

  export type ObjekPajakScalarFieldEnum = (typeof ObjekPajakScalarFieldEnum)[keyof typeof ObjekPajakScalarFieldEnum]


  export const SpptScalarFieldEnum: {
    id_sppt: 'id_sppt',
    nop: 'nop',
    tahun_pajak: 'tahun_pajak',
    njop_kena_pajak: 'njop_kena_pajak',
    njoptkp: 'njoptkp',
    tarif_pbb: 'tarif_pbb',
    pbb_terutang: 'pbb_terutang',
    tgl_jatuh_tempo: 'tgl_jatuh_tempo',
    status_bayar: 'status_bayar',
    tgl_bayar: 'tgl_bayar',
    generated_by: 'generated_by',
    generated_at: 'generated_at',
    id_transaksi_asal: 'id_transaksi_asal'
  };

  export type SpptScalarFieldEnum = (typeof SpptScalarFieldEnum)[keyof typeof SpptScalarFieldEnum]


  export const SubjekPajakScalarFieldEnum: {
    nik: 'nik',
    nama_subjek: 'nama_subjek',
    status_wp: 'status_wp',
    pekerjaan: 'pekerjaan',
    npwp: 'npwp',
    no_hp: 'no_hp',
    alamat_jalan: 'alamat_jalan',
    blok_kav_no_subjek: 'blok_kav_no_subjek',
    rw: 'rw',
    rt: 'rt',
    kelurahan: 'kelurahan',
    kabupaten: 'kabupaten',
    kode_pos: 'kode_pos',
    created_at: 'created_at',
    updated_at: 'updated_at',
    created_by: 'created_by'
  };

  export type SubjekPajakScalarFieldEnum = (typeof SubjekPajakScalarFieldEnum)[keyof typeof SubjekPajakScalarFieldEnum]


  export const TransaksiSpopScalarFieldEnum: {
    id_transaksi: 'id_transaksi',
    no_formulir: 'no_formulir',
    id_user: 'id_user',
    tahun_pajak: 'tahun_pajak',
    jenis_transaksi: 'jenis_transaksi',
    nop_bersama: 'nop_bersama',
    no_sppt_lama: 'no_sppt_lama',
    nama_pengaju: 'nama_pengaju',
    menggunakan_kuasa: 'menggunakan_kuasa',
    tanggal_pengajuan: 'tanggal_pengajuan',
    status_ajuan: 'status_ajuan',
    id_verifikator: 'id_verifikator',
    verified_at: 'verified_at',
    catatan_bakeuda: 'catatan_bakeuda',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type TransaksiSpopScalarFieldEnum = (typeof TransaksiSpopScalarFieldEnum)[keyof typeof TransaksiSpopScalarFieldEnum]


  export const DetailTransaksiAsalScalarFieldEnum: {
    id_detail_asal: 'id_detail_asal',
    id_transaksi: 'id_transaksi',
    nop_asal: 'nop_asal',
    nonaktifkan_saat_disetujui: 'nonaktifkan_saat_disetujui'
  };

  export type DetailTransaksiAsalScalarFieldEnum = (typeof DetailTransaksiAsalScalarFieldEnum)[keyof typeof DetailTransaksiAsalScalarFieldEnum]


  export const DetailTransaksiTujuanScalarFieldEnum: {
    id_detail_tujuan: 'id_detail_tujuan',
    id_transaksi: 'id_transaksi',
    nik_calon_subjek: 'nik_calon_subjek',
    luas_tanah_baru: 'luas_tanah_baru',
    luas_bangunan_baru: 'luas_bangunan_baru',
    jumlah_bangunan_baru: 'jumlah_bangunan_baru',
    jenis_tanah_baru: 'jenis_tanah_baru',
    no_persil_baru: 'no_persil_baru',
    nop_generated: 'nop_generated'
  };

  export type DetailTransaksiTujuanScalarFieldEnum = (typeof DetailTransaksiTujuanScalarFieldEnum)[keyof typeof DetailTransaksiTujuanScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id_user: 'id_user',
    username: 'username',
    password_hash: 'password_hash',
    nama_lengkap: 'nama_lengkap',
    role: 'role',
    kode_wilayah: 'kode_wilayah',
    nip: 'nip',
    is_active: 'is_active',
    created_at: 'created_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WilayahScalarFieldEnum: {
    kode_wilayah: 'kode_wilayah',
    nama_desa: 'nama_desa',
    kode_kel: 'kode_kel',
    kecamatan: 'kecamatan',
    kode_kec: 'kode_kec',
    kabupaten: 'kabupaten',
    kode_kab: 'kode_kab'
  };

  export type WilayahScalarFieldEnum = (typeof WilayahScalarFieldEnum)[keyof typeof WilayahScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'JenisDokumen'
   */
  export type EnumJenisDokumenFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisDokumen'>
    


  /**
   * Reference to a field of type 'JenisDokumen[]'
   */
  export type ListEnumJenisDokumenFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisDokumen[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'JenisTanah'
   */
  export type EnumJenisTanahFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTanah'>
    


  /**
   * Reference to a field of type 'JenisTanah[]'
   */
  export type ListEnumJenisTanahFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTanah[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'StatusBayar'
   */
  export type EnumStatusBayarFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusBayar'>
    


  /**
   * Reference to a field of type 'StatusBayar[]'
   */
  export type ListEnumStatusBayarFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusBayar[]'>
    


  /**
   * Reference to a field of type 'StatusWp'
   */
  export type EnumStatusWpFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusWp'>
    


  /**
   * Reference to a field of type 'StatusWp[]'
   */
  export type ListEnumStatusWpFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusWp[]'>
    


  /**
   * Reference to a field of type 'Pekerjaan'
   */
  export type EnumPekerjaanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Pekerjaan'>
    


  /**
   * Reference to a field of type 'Pekerjaan[]'
   */
  export type ListEnumPekerjaanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Pekerjaan[]'>
    


  /**
   * Reference to a field of type 'JenisTransaksi'
   */
  export type EnumJenisTransaksiFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTransaksi'>
    


  /**
   * Reference to a field of type 'JenisTransaksi[]'
   */
  export type ListEnumJenisTransaksiFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTransaksi[]'>
    


  /**
   * Reference to a field of type 'StatusAjuan'
   */
  export type EnumStatusAjuanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAjuan'>
    


  /**
   * Reference to a field of type 'StatusAjuan[]'
   */
  export type ListEnumStatusAjuanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAjuan[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type LampiranDokumenWhereInput = {
    AND?: LampiranDokumenWhereInput | LampiranDokumenWhereInput[]
    OR?: LampiranDokumenWhereInput[]
    NOT?: LampiranDokumenWhereInput | LampiranDokumenWhereInput[]
    id_dokumen?: StringFilter<"LampiranDokumen"> | string
    id_transaksi?: StringFilter<"LampiranDokumen"> | string
    jenis_dokumen?: EnumJenisDokumenFilter<"LampiranDokumen"> | $Enums.JenisDokumen
    keterangan_dokumen?: StringNullableFilter<"LampiranDokumen"> | string | null
    url_file?: StringFilter<"LampiranDokumen"> | string
    uploaded_at?: DateTimeFilter<"LampiranDokumen"> | Date | string
    uploaded_by?: StringFilter<"LampiranDokumen"> | string
    transaksi?: XOR<TransaksiSpopScalarRelationFilter, TransaksiSpopWhereInput>
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type LampiranDokumenOrderByWithRelationInput = {
    id_dokumen?: SortOrder
    id_transaksi?: SortOrder
    jenis_dokumen?: SortOrder
    keterangan_dokumen?: SortOrderInput | SortOrder
    url_file?: SortOrder
    uploaded_at?: SortOrder
    uploaded_by?: SortOrder
    transaksi?: TransaksiSpopOrderByWithRelationInput
    uploader?: UserOrderByWithRelationInput
  }

  export type LampiranDokumenWhereUniqueInput = Prisma.AtLeast<{
    id_dokumen?: string
    AND?: LampiranDokumenWhereInput | LampiranDokumenWhereInput[]
    OR?: LampiranDokumenWhereInput[]
    NOT?: LampiranDokumenWhereInput | LampiranDokumenWhereInput[]
    id_transaksi?: StringFilter<"LampiranDokumen"> | string
    jenis_dokumen?: EnumJenisDokumenFilter<"LampiranDokumen"> | $Enums.JenisDokumen
    keterangan_dokumen?: StringNullableFilter<"LampiranDokumen"> | string | null
    url_file?: StringFilter<"LampiranDokumen"> | string
    uploaded_at?: DateTimeFilter<"LampiranDokumen"> | Date | string
    uploaded_by?: StringFilter<"LampiranDokumen"> | string
    transaksi?: XOR<TransaksiSpopScalarRelationFilter, TransaksiSpopWhereInput>
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id_dokumen">

  export type LampiranDokumenOrderByWithAggregationInput = {
    id_dokumen?: SortOrder
    id_transaksi?: SortOrder
    jenis_dokumen?: SortOrder
    keterangan_dokumen?: SortOrderInput | SortOrder
    url_file?: SortOrder
    uploaded_at?: SortOrder
    uploaded_by?: SortOrder
    _count?: LampiranDokumenCountOrderByAggregateInput
    _max?: LampiranDokumenMaxOrderByAggregateInput
    _min?: LampiranDokumenMinOrderByAggregateInput
  }

  export type LampiranDokumenScalarWhereWithAggregatesInput = {
    AND?: LampiranDokumenScalarWhereWithAggregatesInput | LampiranDokumenScalarWhereWithAggregatesInput[]
    OR?: LampiranDokumenScalarWhereWithAggregatesInput[]
    NOT?: LampiranDokumenScalarWhereWithAggregatesInput | LampiranDokumenScalarWhereWithAggregatesInput[]
    id_dokumen?: StringWithAggregatesFilter<"LampiranDokumen"> | string
    id_transaksi?: StringWithAggregatesFilter<"LampiranDokumen"> | string
    jenis_dokumen?: EnumJenisDokumenWithAggregatesFilter<"LampiranDokumen"> | $Enums.JenisDokumen
    keterangan_dokumen?: StringNullableWithAggregatesFilter<"LampiranDokumen"> | string | null
    url_file?: StringWithAggregatesFilter<"LampiranDokumen"> | string
    uploaded_at?: DateTimeWithAggregatesFilter<"LampiranDokumen"> | Date | string
    uploaded_by?: StringWithAggregatesFilter<"LampiranDokumen"> | string
  }

  export type ObjekPajakWhereInput = {
    AND?: ObjekPajakWhereInput | ObjekPajakWhereInput[]
    OR?: ObjekPajakWhereInput[]
    NOT?: ObjekPajakWhereInput | ObjekPajakWhereInput[]
    nop?: StringFilter<"ObjekPajak"> | string
    nik_subjek?: StringFilter<"ObjekPajak"> | string
    no_persil?: StringNullableFilter<"ObjekPajak"> | string | null
    jalan_op?: StringFilter<"ObjekPajak"> | string
    blok_kav_no?: StringNullableFilter<"ObjekPajak"> | string | null
    rw_op?: StringNullableFilter<"ObjekPajak"> | string | null
    rt_op?: StringNullableFilter<"ObjekPajak"> | string | null
    kelurahan_op?: StringFilter<"ObjekPajak"> | string
    kecamatan_op?: StringFilter<"ObjekPajak"> | string
    luas_tanah?: DecimalFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: StringNullableFilter<"ObjekPajak"> | string | null
    jenis_tanah?: EnumJenisTanahFilter<"ObjekPajak"> | $Enums.JenisTanah
    jumlah_bangunan?: IntFilter<"ObjekPajak"> | number
    luas_bangunan?: DecimalFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    njop_tanah?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_total?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: IntNullableFilter<"ObjekPajak"> | number | null
    status_aktif?: BoolFilter<"ObjekPajak"> | boolean
    nonaktif_oleh?: StringNullableFilter<"ObjekPajak"> | string | null
    nonaktif_at?: DateTimeNullableFilter<"ObjekPajak"> | Date | string | null
    created_at?: DateTimeFilter<"ObjekPajak"> | Date | string
    subjek_pajak?: XOR<SubjekPajakScalarRelationFilter, SubjekPajakWhereInput>
    user_nonaktif?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    transaksi?: TransaksiSpopListRelationFilter
    detail_asal?: DetailTransaksiAsalListRelationFilter
    sppt?: SpptListRelationFilter
  }

  export type ObjekPajakOrderByWithRelationInput = {
    nop?: SortOrder
    nik_subjek?: SortOrder
    no_persil?: SortOrderInput | SortOrder
    jalan_op?: SortOrder
    blok_kav_no?: SortOrderInput | SortOrder
    rw_op?: SortOrderInput | SortOrder
    rt_op?: SortOrderInput | SortOrder
    kelurahan_op?: SortOrder
    kecamatan_op?: SortOrder
    luas_tanah?: SortOrder
    zona_nilai_tanah?: SortOrderInput | SortOrder
    jenis_tanah?: SortOrder
    jumlah_bangunan?: SortOrder
    luas_bangunan?: SortOrder
    njop_tanah?: SortOrderInput | SortOrder
    njop_bangunan?: SortOrderInput | SortOrder
    njop_total?: SortOrderInput | SortOrder
    tahun_penilaian?: SortOrderInput | SortOrder
    status_aktif?: SortOrder
    nonaktif_oleh?: SortOrderInput | SortOrder
    nonaktif_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    subjek_pajak?: SubjekPajakOrderByWithRelationInput
    user_nonaktif?: UserOrderByWithRelationInput
    transaksi?: TransaksiSpopOrderByRelationAggregateInput
    detail_asal?: DetailTransaksiAsalOrderByRelationAggregateInput
    sppt?: SpptOrderByRelationAggregateInput
  }

  export type ObjekPajakWhereUniqueInput = Prisma.AtLeast<{
    nop?: string
    AND?: ObjekPajakWhereInput | ObjekPajakWhereInput[]
    OR?: ObjekPajakWhereInput[]
    NOT?: ObjekPajakWhereInput | ObjekPajakWhereInput[]
    nik_subjek?: StringFilter<"ObjekPajak"> | string
    no_persil?: StringNullableFilter<"ObjekPajak"> | string | null
    jalan_op?: StringFilter<"ObjekPajak"> | string
    blok_kav_no?: StringNullableFilter<"ObjekPajak"> | string | null
    rw_op?: StringNullableFilter<"ObjekPajak"> | string | null
    rt_op?: StringNullableFilter<"ObjekPajak"> | string | null
    kelurahan_op?: StringFilter<"ObjekPajak"> | string
    kecamatan_op?: StringFilter<"ObjekPajak"> | string
    luas_tanah?: DecimalFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: StringNullableFilter<"ObjekPajak"> | string | null
    jenis_tanah?: EnumJenisTanahFilter<"ObjekPajak"> | $Enums.JenisTanah
    jumlah_bangunan?: IntFilter<"ObjekPajak"> | number
    luas_bangunan?: DecimalFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    njop_tanah?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_total?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: IntNullableFilter<"ObjekPajak"> | number | null
    status_aktif?: BoolFilter<"ObjekPajak"> | boolean
    nonaktif_oleh?: StringNullableFilter<"ObjekPajak"> | string | null
    nonaktif_at?: DateTimeNullableFilter<"ObjekPajak"> | Date | string | null
    created_at?: DateTimeFilter<"ObjekPajak"> | Date | string
    subjek_pajak?: XOR<SubjekPajakScalarRelationFilter, SubjekPajakWhereInput>
    user_nonaktif?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    transaksi?: TransaksiSpopListRelationFilter
    detail_asal?: DetailTransaksiAsalListRelationFilter
    sppt?: SpptListRelationFilter
  }, "nop">

  export type ObjekPajakOrderByWithAggregationInput = {
    nop?: SortOrder
    nik_subjek?: SortOrder
    no_persil?: SortOrderInput | SortOrder
    jalan_op?: SortOrder
    blok_kav_no?: SortOrderInput | SortOrder
    rw_op?: SortOrderInput | SortOrder
    rt_op?: SortOrderInput | SortOrder
    kelurahan_op?: SortOrder
    kecamatan_op?: SortOrder
    luas_tanah?: SortOrder
    zona_nilai_tanah?: SortOrderInput | SortOrder
    jenis_tanah?: SortOrder
    jumlah_bangunan?: SortOrder
    luas_bangunan?: SortOrder
    njop_tanah?: SortOrderInput | SortOrder
    njop_bangunan?: SortOrderInput | SortOrder
    njop_total?: SortOrderInput | SortOrder
    tahun_penilaian?: SortOrderInput | SortOrder
    status_aktif?: SortOrder
    nonaktif_oleh?: SortOrderInput | SortOrder
    nonaktif_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: ObjekPajakCountOrderByAggregateInput
    _avg?: ObjekPajakAvgOrderByAggregateInput
    _max?: ObjekPajakMaxOrderByAggregateInput
    _min?: ObjekPajakMinOrderByAggregateInput
    _sum?: ObjekPajakSumOrderByAggregateInput
  }

  export type ObjekPajakScalarWhereWithAggregatesInput = {
    AND?: ObjekPajakScalarWhereWithAggregatesInput | ObjekPajakScalarWhereWithAggregatesInput[]
    OR?: ObjekPajakScalarWhereWithAggregatesInput[]
    NOT?: ObjekPajakScalarWhereWithAggregatesInput | ObjekPajakScalarWhereWithAggregatesInput[]
    nop?: StringWithAggregatesFilter<"ObjekPajak"> | string
    nik_subjek?: StringWithAggregatesFilter<"ObjekPajak"> | string
    no_persil?: StringNullableWithAggregatesFilter<"ObjekPajak"> | string | null
    jalan_op?: StringWithAggregatesFilter<"ObjekPajak"> | string
    blok_kav_no?: StringNullableWithAggregatesFilter<"ObjekPajak"> | string | null
    rw_op?: StringNullableWithAggregatesFilter<"ObjekPajak"> | string | null
    rt_op?: StringNullableWithAggregatesFilter<"ObjekPajak"> | string | null
    kelurahan_op?: StringWithAggregatesFilter<"ObjekPajak"> | string
    kecamatan_op?: StringWithAggregatesFilter<"ObjekPajak"> | string
    luas_tanah?: DecimalWithAggregatesFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: StringNullableWithAggregatesFilter<"ObjekPajak"> | string | null
    jenis_tanah?: EnumJenisTanahWithAggregatesFilter<"ObjekPajak"> | $Enums.JenisTanah
    jumlah_bangunan?: IntWithAggregatesFilter<"ObjekPajak"> | number
    luas_bangunan?: DecimalWithAggregatesFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    njop_tanah?: DecimalNullableWithAggregatesFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: DecimalNullableWithAggregatesFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_total?: DecimalNullableWithAggregatesFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: IntNullableWithAggregatesFilter<"ObjekPajak"> | number | null
    status_aktif?: BoolWithAggregatesFilter<"ObjekPajak"> | boolean
    nonaktif_oleh?: StringNullableWithAggregatesFilter<"ObjekPajak"> | string | null
    nonaktif_at?: DateTimeNullableWithAggregatesFilter<"ObjekPajak"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"ObjekPajak"> | Date | string
  }

  export type SpptWhereInput = {
    AND?: SpptWhereInput | SpptWhereInput[]
    OR?: SpptWhereInput[]
    NOT?: SpptWhereInput | SpptWhereInput[]
    id_sppt?: StringFilter<"Sppt"> | string
    nop?: StringFilter<"Sppt"> | string
    tahun_pajak?: IntFilter<"Sppt"> | number
    njop_kena_pajak?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFilter<"Sppt"> | Date | string
    status_bayar?: EnumStatusBayarFilter<"Sppt"> | $Enums.StatusBayar
    tgl_bayar?: DateTimeNullableFilter<"Sppt"> | Date | string | null
    generated_by?: StringFilter<"Sppt"> | string
    generated_at?: DateTimeFilter<"Sppt"> | Date | string
    id_transaksi_asal?: StringNullableFilter<"Sppt"> | string | null
    objek_pajak?: XOR<ObjekPajakScalarRelationFilter, ObjekPajakWhereInput>
    generator?: XOR<UserScalarRelationFilter, UserWhereInput>
    transaksi_asal?: XOR<TransaksiSpopNullableScalarRelationFilter, TransaksiSpopWhereInput> | null
  }

  export type SpptOrderByWithRelationInput = {
    id_sppt?: SortOrder
    nop?: SortOrder
    tahun_pajak?: SortOrder
    njop_kena_pajak?: SortOrder
    njoptkp?: SortOrder
    tarif_pbb?: SortOrder
    pbb_terutang?: SortOrder
    tgl_jatuh_tempo?: SortOrder
    status_bayar?: SortOrder
    tgl_bayar?: SortOrderInput | SortOrder
    generated_by?: SortOrder
    generated_at?: SortOrder
    id_transaksi_asal?: SortOrderInput | SortOrder
    objek_pajak?: ObjekPajakOrderByWithRelationInput
    generator?: UserOrderByWithRelationInput
    transaksi_asal?: TransaksiSpopOrderByWithRelationInput
  }

  export type SpptWhereUniqueInput = Prisma.AtLeast<{
    id_sppt?: string
    AND?: SpptWhereInput | SpptWhereInput[]
    OR?: SpptWhereInput[]
    NOT?: SpptWhereInput | SpptWhereInput[]
    nop?: StringFilter<"Sppt"> | string
    tahun_pajak?: IntFilter<"Sppt"> | number
    njop_kena_pajak?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFilter<"Sppt"> | Date | string
    status_bayar?: EnumStatusBayarFilter<"Sppt"> | $Enums.StatusBayar
    tgl_bayar?: DateTimeNullableFilter<"Sppt"> | Date | string | null
    generated_by?: StringFilter<"Sppt"> | string
    generated_at?: DateTimeFilter<"Sppt"> | Date | string
    id_transaksi_asal?: StringNullableFilter<"Sppt"> | string | null
    objek_pajak?: XOR<ObjekPajakScalarRelationFilter, ObjekPajakWhereInput>
    generator?: XOR<UserScalarRelationFilter, UserWhereInput>
    transaksi_asal?: XOR<TransaksiSpopNullableScalarRelationFilter, TransaksiSpopWhereInput> | null
  }, "id_sppt">

  export type SpptOrderByWithAggregationInput = {
    id_sppt?: SortOrder
    nop?: SortOrder
    tahun_pajak?: SortOrder
    njop_kena_pajak?: SortOrder
    njoptkp?: SortOrder
    tarif_pbb?: SortOrder
    pbb_terutang?: SortOrder
    tgl_jatuh_tempo?: SortOrder
    status_bayar?: SortOrder
    tgl_bayar?: SortOrderInput | SortOrder
    generated_by?: SortOrder
    generated_at?: SortOrder
    id_transaksi_asal?: SortOrderInput | SortOrder
    _count?: SpptCountOrderByAggregateInput
    _avg?: SpptAvgOrderByAggregateInput
    _max?: SpptMaxOrderByAggregateInput
    _min?: SpptMinOrderByAggregateInput
    _sum?: SpptSumOrderByAggregateInput
  }

  export type SpptScalarWhereWithAggregatesInput = {
    AND?: SpptScalarWhereWithAggregatesInput | SpptScalarWhereWithAggregatesInput[]
    OR?: SpptScalarWhereWithAggregatesInput[]
    NOT?: SpptScalarWhereWithAggregatesInput | SpptScalarWhereWithAggregatesInput[]
    id_sppt?: StringWithAggregatesFilter<"Sppt"> | string
    nop?: StringWithAggregatesFilter<"Sppt"> | string
    tahun_pajak?: IntWithAggregatesFilter<"Sppt"> | number
    njop_kena_pajak?: DecimalWithAggregatesFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalWithAggregatesFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalWithAggregatesFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalWithAggregatesFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeWithAggregatesFilter<"Sppt"> | Date | string
    status_bayar?: EnumStatusBayarWithAggregatesFilter<"Sppt"> | $Enums.StatusBayar
    tgl_bayar?: DateTimeNullableWithAggregatesFilter<"Sppt"> | Date | string | null
    generated_by?: StringWithAggregatesFilter<"Sppt"> | string
    generated_at?: DateTimeWithAggregatesFilter<"Sppt"> | Date | string
    id_transaksi_asal?: StringNullableWithAggregatesFilter<"Sppt"> | string | null
  }

  export type SubjekPajakWhereInput = {
    AND?: SubjekPajakWhereInput | SubjekPajakWhereInput[]
    OR?: SubjekPajakWhereInput[]
    NOT?: SubjekPajakWhereInput | SubjekPajakWhereInput[]
    nik?: StringFilter<"SubjekPajak"> | string
    nama_subjek?: StringFilter<"SubjekPajak"> | string
    status_wp?: EnumStatusWpFilter<"SubjekPajak"> | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFilter<"SubjekPajak"> | $Enums.Pekerjaan
    npwp?: StringNullableFilter<"SubjekPajak"> | string | null
    no_hp?: StringNullableFilter<"SubjekPajak"> | string | null
    alamat_jalan?: StringFilter<"SubjekPajak"> | string
    blok_kav_no_subjek?: StringNullableFilter<"SubjekPajak"> | string | null
    rw?: StringNullableFilter<"SubjekPajak"> | string | null
    rt?: StringNullableFilter<"SubjekPajak"> | string | null
    kelurahan?: StringFilter<"SubjekPajak"> | string
    kabupaten?: StringFilter<"SubjekPajak"> | string
    kode_pos?: StringNullableFilter<"SubjekPajak"> | string | null
    created_at?: DateTimeFilter<"SubjekPajak"> | Date | string
    updated_at?: DateTimeFilter<"SubjekPajak"> | Date | string
    created_by?: StringFilter<"SubjekPajak"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    objek_pajak?: ObjekPajakListRelationFilter
    detail_tujuan?: DetailTransaksiTujuanListRelationFilter
  }

  export type SubjekPajakOrderByWithRelationInput = {
    nik?: SortOrder
    nama_subjek?: SortOrder
    status_wp?: SortOrder
    pekerjaan?: SortOrder
    npwp?: SortOrderInput | SortOrder
    no_hp?: SortOrderInput | SortOrder
    alamat_jalan?: SortOrder
    blok_kav_no_subjek?: SortOrderInput | SortOrder
    rw?: SortOrderInput | SortOrder
    rt?: SortOrderInput | SortOrder
    kelurahan?: SortOrder
    kabupaten?: SortOrder
    kode_pos?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    user?: UserOrderByWithRelationInput
    objek_pajak?: ObjekPajakOrderByRelationAggregateInput
    detail_tujuan?: DetailTransaksiTujuanOrderByRelationAggregateInput
  }

  export type SubjekPajakWhereUniqueInput = Prisma.AtLeast<{
    nik?: string
    AND?: SubjekPajakWhereInput | SubjekPajakWhereInput[]
    OR?: SubjekPajakWhereInput[]
    NOT?: SubjekPajakWhereInput | SubjekPajakWhereInput[]
    nama_subjek?: StringFilter<"SubjekPajak"> | string
    status_wp?: EnumStatusWpFilter<"SubjekPajak"> | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFilter<"SubjekPajak"> | $Enums.Pekerjaan
    npwp?: StringNullableFilter<"SubjekPajak"> | string | null
    no_hp?: StringNullableFilter<"SubjekPajak"> | string | null
    alamat_jalan?: StringFilter<"SubjekPajak"> | string
    blok_kav_no_subjek?: StringNullableFilter<"SubjekPajak"> | string | null
    rw?: StringNullableFilter<"SubjekPajak"> | string | null
    rt?: StringNullableFilter<"SubjekPajak"> | string | null
    kelurahan?: StringFilter<"SubjekPajak"> | string
    kabupaten?: StringFilter<"SubjekPajak"> | string
    kode_pos?: StringNullableFilter<"SubjekPajak"> | string | null
    created_at?: DateTimeFilter<"SubjekPajak"> | Date | string
    updated_at?: DateTimeFilter<"SubjekPajak"> | Date | string
    created_by?: StringFilter<"SubjekPajak"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    objek_pajak?: ObjekPajakListRelationFilter
    detail_tujuan?: DetailTransaksiTujuanListRelationFilter
  }, "nik">

  export type SubjekPajakOrderByWithAggregationInput = {
    nik?: SortOrder
    nama_subjek?: SortOrder
    status_wp?: SortOrder
    pekerjaan?: SortOrder
    npwp?: SortOrderInput | SortOrder
    no_hp?: SortOrderInput | SortOrder
    alamat_jalan?: SortOrder
    blok_kav_no_subjek?: SortOrderInput | SortOrder
    rw?: SortOrderInput | SortOrder
    rt?: SortOrderInput | SortOrder
    kelurahan?: SortOrder
    kabupaten?: SortOrder
    kode_pos?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
    _count?: SubjekPajakCountOrderByAggregateInput
    _max?: SubjekPajakMaxOrderByAggregateInput
    _min?: SubjekPajakMinOrderByAggregateInput
  }

  export type SubjekPajakScalarWhereWithAggregatesInput = {
    AND?: SubjekPajakScalarWhereWithAggregatesInput | SubjekPajakScalarWhereWithAggregatesInput[]
    OR?: SubjekPajakScalarWhereWithAggregatesInput[]
    NOT?: SubjekPajakScalarWhereWithAggregatesInput | SubjekPajakScalarWhereWithAggregatesInput[]
    nik?: StringWithAggregatesFilter<"SubjekPajak"> | string
    nama_subjek?: StringWithAggregatesFilter<"SubjekPajak"> | string
    status_wp?: EnumStatusWpWithAggregatesFilter<"SubjekPajak"> | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanWithAggregatesFilter<"SubjekPajak"> | $Enums.Pekerjaan
    npwp?: StringNullableWithAggregatesFilter<"SubjekPajak"> | string | null
    no_hp?: StringNullableWithAggregatesFilter<"SubjekPajak"> | string | null
    alamat_jalan?: StringWithAggregatesFilter<"SubjekPajak"> | string
    blok_kav_no_subjek?: StringNullableWithAggregatesFilter<"SubjekPajak"> | string | null
    rw?: StringNullableWithAggregatesFilter<"SubjekPajak"> | string | null
    rt?: StringNullableWithAggregatesFilter<"SubjekPajak"> | string | null
    kelurahan?: StringWithAggregatesFilter<"SubjekPajak"> | string
    kabupaten?: StringWithAggregatesFilter<"SubjekPajak"> | string
    kode_pos?: StringNullableWithAggregatesFilter<"SubjekPajak"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"SubjekPajak"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"SubjekPajak"> | Date | string
    created_by?: StringWithAggregatesFilter<"SubjekPajak"> | string
  }

  export type TransaksiSpopWhereInput = {
    AND?: TransaksiSpopWhereInput | TransaksiSpopWhereInput[]
    OR?: TransaksiSpopWhereInput[]
    NOT?: TransaksiSpopWhereInput | TransaksiSpopWhereInput[]
    id_transaksi?: StringFilter<"TransaksiSpop"> | string
    no_formulir?: StringNullableFilter<"TransaksiSpop"> | string | null
    id_user?: StringFilter<"TransaksiSpop"> | string
    tahun_pajak?: IntFilter<"TransaksiSpop"> | number
    jenis_transaksi?: EnumJenisTransaksiFilter<"TransaksiSpop"> | $Enums.JenisTransaksi
    nop_bersama?: StringNullableFilter<"TransaksiSpop"> | string | null
    no_sppt_lama?: StringNullableFilter<"TransaksiSpop"> | string | null
    nama_pengaju?: StringNullableFilter<"TransaksiSpop"> | string | null
    menggunakan_kuasa?: BoolFilter<"TransaksiSpop"> | boolean
    tanggal_pengajuan?: DateTimeFilter<"TransaksiSpop"> | Date | string
    status_ajuan?: EnumStatusAjuanFilter<"TransaksiSpop"> | $Enums.StatusAjuan
    id_verifikator?: StringNullableFilter<"TransaksiSpop"> | string | null
    verified_at?: DateTimeNullableFilter<"TransaksiSpop"> | Date | string | null
    catatan_bakeuda?: StringNullableFilter<"TransaksiSpop"> | string | null
    created_at?: DateTimeFilter<"TransaksiSpop"> | Date | string
    updated_at?: DateTimeFilter<"TransaksiSpop"> | Date | string
    pengaju?: XOR<UserScalarRelationFilter, UserWhereInput>
    verifikator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    objek_bersama?: XOR<ObjekPajakNullableScalarRelationFilter, ObjekPajakWhereInput> | null
    detail_asal?: DetailTransaksiAsalListRelationFilter
    detail_tujuan?: DetailTransaksiTujuanListRelationFilter
    lampiran?: LampiranDokumenListRelationFilter
    sppt?: SpptListRelationFilter
  }

  export type TransaksiSpopOrderByWithRelationInput = {
    id_transaksi?: SortOrder
    no_formulir?: SortOrderInput | SortOrder
    id_user?: SortOrder
    tahun_pajak?: SortOrder
    jenis_transaksi?: SortOrder
    nop_bersama?: SortOrderInput | SortOrder
    no_sppt_lama?: SortOrderInput | SortOrder
    nama_pengaju?: SortOrderInput | SortOrder
    menggunakan_kuasa?: SortOrder
    tanggal_pengajuan?: SortOrder
    status_ajuan?: SortOrder
    id_verifikator?: SortOrderInput | SortOrder
    verified_at?: SortOrderInput | SortOrder
    catatan_bakeuda?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    pengaju?: UserOrderByWithRelationInput
    verifikator?: UserOrderByWithRelationInput
    objek_bersama?: ObjekPajakOrderByWithRelationInput
    detail_asal?: DetailTransaksiAsalOrderByRelationAggregateInput
    detail_tujuan?: DetailTransaksiTujuanOrderByRelationAggregateInput
    lampiran?: LampiranDokumenOrderByRelationAggregateInput
    sppt?: SpptOrderByRelationAggregateInput
  }

  export type TransaksiSpopWhereUniqueInput = Prisma.AtLeast<{
    id_transaksi?: string
    AND?: TransaksiSpopWhereInput | TransaksiSpopWhereInput[]
    OR?: TransaksiSpopWhereInput[]
    NOT?: TransaksiSpopWhereInput | TransaksiSpopWhereInput[]
    no_formulir?: StringNullableFilter<"TransaksiSpop"> | string | null
    id_user?: StringFilter<"TransaksiSpop"> | string
    tahun_pajak?: IntFilter<"TransaksiSpop"> | number
    jenis_transaksi?: EnumJenisTransaksiFilter<"TransaksiSpop"> | $Enums.JenisTransaksi
    nop_bersama?: StringNullableFilter<"TransaksiSpop"> | string | null
    no_sppt_lama?: StringNullableFilter<"TransaksiSpop"> | string | null
    nama_pengaju?: StringNullableFilter<"TransaksiSpop"> | string | null
    menggunakan_kuasa?: BoolFilter<"TransaksiSpop"> | boolean
    tanggal_pengajuan?: DateTimeFilter<"TransaksiSpop"> | Date | string
    status_ajuan?: EnumStatusAjuanFilter<"TransaksiSpop"> | $Enums.StatusAjuan
    id_verifikator?: StringNullableFilter<"TransaksiSpop"> | string | null
    verified_at?: DateTimeNullableFilter<"TransaksiSpop"> | Date | string | null
    catatan_bakeuda?: StringNullableFilter<"TransaksiSpop"> | string | null
    created_at?: DateTimeFilter<"TransaksiSpop"> | Date | string
    updated_at?: DateTimeFilter<"TransaksiSpop"> | Date | string
    pengaju?: XOR<UserScalarRelationFilter, UserWhereInput>
    verifikator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    objek_bersama?: XOR<ObjekPajakNullableScalarRelationFilter, ObjekPajakWhereInput> | null
    detail_asal?: DetailTransaksiAsalListRelationFilter
    detail_tujuan?: DetailTransaksiTujuanListRelationFilter
    lampiran?: LampiranDokumenListRelationFilter
    sppt?: SpptListRelationFilter
  }, "id_transaksi">

  export type TransaksiSpopOrderByWithAggregationInput = {
    id_transaksi?: SortOrder
    no_formulir?: SortOrderInput | SortOrder
    id_user?: SortOrder
    tahun_pajak?: SortOrder
    jenis_transaksi?: SortOrder
    nop_bersama?: SortOrderInput | SortOrder
    no_sppt_lama?: SortOrderInput | SortOrder
    nama_pengaju?: SortOrderInput | SortOrder
    menggunakan_kuasa?: SortOrder
    tanggal_pengajuan?: SortOrder
    status_ajuan?: SortOrder
    id_verifikator?: SortOrderInput | SortOrder
    verified_at?: SortOrderInput | SortOrder
    catatan_bakeuda?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: TransaksiSpopCountOrderByAggregateInput
    _avg?: TransaksiSpopAvgOrderByAggregateInput
    _max?: TransaksiSpopMaxOrderByAggregateInput
    _min?: TransaksiSpopMinOrderByAggregateInput
    _sum?: TransaksiSpopSumOrderByAggregateInput
  }

  export type TransaksiSpopScalarWhereWithAggregatesInput = {
    AND?: TransaksiSpopScalarWhereWithAggregatesInput | TransaksiSpopScalarWhereWithAggregatesInput[]
    OR?: TransaksiSpopScalarWhereWithAggregatesInput[]
    NOT?: TransaksiSpopScalarWhereWithAggregatesInput | TransaksiSpopScalarWhereWithAggregatesInput[]
    id_transaksi?: StringWithAggregatesFilter<"TransaksiSpop"> | string
    no_formulir?: StringNullableWithAggregatesFilter<"TransaksiSpop"> | string | null
    id_user?: StringWithAggregatesFilter<"TransaksiSpop"> | string
    tahun_pajak?: IntWithAggregatesFilter<"TransaksiSpop"> | number
    jenis_transaksi?: EnumJenisTransaksiWithAggregatesFilter<"TransaksiSpop"> | $Enums.JenisTransaksi
    nop_bersama?: StringNullableWithAggregatesFilter<"TransaksiSpop"> | string | null
    no_sppt_lama?: StringNullableWithAggregatesFilter<"TransaksiSpop"> | string | null
    nama_pengaju?: StringNullableWithAggregatesFilter<"TransaksiSpop"> | string | null
    menggunakan_kuasa?: BoolWithAggregatesFilter<"TransaksiSpop"> | boolean
    tanggal_pengajuan?: DateTimeWithAggregatesFilter<"TransaksiSpop"> | Date | string
    status_ajuan?: EnumStatusAjuanWithAggregatesFilter<"TransaksiSpop"> | $Enums.StatusAjuan
    id_verifikator?: StringNullableWithAggregatesFilter<"TransaksiSpop"> | string | null
    verified_at?: DateTimeNullableWithAggregatesFilter<"TransaksiSpop"> | Date | string | null
    catatan_bakeuda?: StringNullableWithAggregatesFilter<"TransaksiSpop"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"TransaksiSpop"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"TransaksiSpop"> | Date | string
  }

  export type DetailTransaksiAsalWhereInput = {
    AND?: DetailTransaksiAsalWhereInput | DetailTransaksiAsalWhereInput[]
    OR?: DetailTransaksiAsalWhereInput[]
    NOT?: DetailTransaksiAsalWhereInput | DetailTransaksiAsalWhereInput[]
    id_detail_asal?: StringFilter<"DetailTransaksiAsal"> | string
    id_transaksi?: StringFilter<"DetailTransaksiAsal"> | string
    nop_asal?: StringNullableFilter<"DetailTransaksiAsal"> | string | null
    nonaktifkan_saat_disetujui?: BoolFilter<"DetailTransaksiAsal"> | boolean
    transaksi?: XOR<TransaksiSpopScalarRelationFilter, TransaksiSpopWhereInput>
    objek_asal?: XOR<ObjekPajakNullableScalarRelationFilter, ObjekPajakWhereInput> | null
  }

  export type DetailTransaksiAsalOrderByWithRelationInput = {
    id_detail_asal?: SortOrder
    id_transaksi?: SortOrder
    nop_asal?: SortOrderInput | SortOrder
    nonaktifkan_saat_disetujui?: SortOrder
    transaksi?: TransaksiSpopOrderByWithRelationInput
    objek_asal?: ObjekPajakOrderByWithRelationInput
  }

  export type DetailTransaksiAsalWhereUniqueInput = Prisma.AtLeast<{
    id_detail_asal?: string
    AND?: DetailTransaksiAsalWhereInput | DetailTransaksiAsalWhereInput[]
    OR?: DetailTransaksiAsalWhereInput[]
    NOT?: DetailTransaksiAsalWhereInput | DetailTransaksiAsalWhereInput[]
    id_transaksi?: StringFilter<"DetailTransaksiAsal"> | string
    nop_asal?: StringNullableFilter<"DetailTransaksiAsal"> | string | null
    nonaktifkan_saat_disetujui?: BoolFilter<"DetailTransaksiAsal"> | boolean
    transaksi?: XOR<TransaksiSpopScalarRelationFilter, TransaksiSpopWhereInput>
    objek_asal?: XOR<ObjekPajakNullableScalarRelationFilter, ObjekPajakWhereInput> | null
  }, "id_detail_asal">

  export type DetailTransaksiAsalOrderByWithAggregationInput = {
    id_detail_asal?: SortOrder
    id_transaksi?: SortOrder
    nop_asal?: SortOrderInput | SortOrder
    nonaktifkan_saat_disetujui?: SortOrder
    _count?: DetailTransaksiAsalCountOrderByAggregateInput
    _max?: DetailTransaksiAsalMaxOrderByAggregateInput
    _min?: DetailTransaksiAsalMinOrderByAggregateInput
  }

  export type DetailTransaksiAsalScalarWhereWithAggregatesInput = {
    AND?: DetailTransaksiAsalScalarWhereWithAggregatesInput | DetailTransaksiAsalScalarWhereWithAggregatesInput[]
    OR?: DetailTransaksiAsalScalarWhereWithAggregatesInput[]
    NOT?: DetailTransaksiAsalScalarWhereWithAggregatesInput | DetailTransaksiAsalScalarWhereWithAggregatesInput[]
    id_detail_asal?: StringWithAggregatesFilter<"DetailTransaksiAsal"> | string
    id_transaksi?: StringWithAggregatesFilter<"DetailTransaksiAsal"> | string
    nop_asal?: StringNullableWithAggregatesFilter<"DetailTransaksiAsal"> | string | null
    nonaktifkan_saat_disetujui?: BoolWithAggregatesFilter<"DetailTransaksiAsal"> | boolean
  }

  export type DetailTransaksiTujuanWhereInput = {
    AND?: DetailTransaksiTujuanWhereInput | DetailTransaksiTujuanWhereInput[]
    OR?: DetailTransaksiTujuanWhereInput[]
    NOT?: DetailTransaksiTujuanWhereInput | DetailTransaksiTujuanWhereInput[]
    id_detail_tujuan?: StringFilter<"DetailTransaksiTujuan"> | string
    id_transaksi?: StringFilter<"DetailTransaksiTujuan"> | string
    nik_calon_subjek?: StringFilter<"DetailTransaksiTujuan"> | string
    luas_tanah_baru?: DecimalFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFilter<"DetailTransaksiTujuan"> | number
    jenis_tanah_baru?: EnumJenisTanahFilter<"DetailTransaksiTujuan"> | $Enums.JenisTanah
    no_persil_baru?: StringNullableFilter<"DetailTransaksiTujuan"> | string | null
    nop_generated?: StringNullableFilter<"DetailTransaksiTujuan"> | string | null
    transaksi?: XOR<TransaksiSpopScalarRelationFilter, TransaksiSpopWhereInput>
    calon_subjek?: XOR<SubjekPajakScalarRelationFilter, SubjekPajakWhereInput>
  }

  export type DetailTransaksiTujuanOrderByWithRelationInput = {
    id_detail_tujuan?: SortOrder
    id_transaksi?: SortOrder
    nik_calon_subjek?: SortOrder
    luas_tanah_baru?: SortOrder
    luas_bangunan_baru?: SortOrder
    jumlah_bangunan_baru?: SortOrder
    jenis_tanah_baru?: SortOrder
    no_persil_baru?: SortOrderInput | SortOrder
    nop_generated?: SortOrderInput | SortOrder
    transaksi?: TransaksiSpopOrderByWithRelationInput
    calon_subjek?: SubjekPajakOrderByWithRelationInput
  }

  export type DetailTransaksiTujuanWhereUniqueInput = Prisma.AtLeast<{
    id_detail_tujuan?: string
    AND?: DetailTransaksiTujuanWhereInput | DetailTransaksiTujuanWhereInput[]
    OR?: DetailTransaksiTujuanWhereInput[]
    NOT?: DetailTransaksiTujuanWhereInput | DetailTransaksiTujuanWhereInput[]
    id_transaksi?: StringFilter<"DetailTransaksiTujuan"> | string
    nik_calon_subjek?: StringFilter<"DetailTransaksiTujuan"> | string
    luas_tanah_baru?: DecimalFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFilter<"DetailTransaksiTujuan"> | number
    jenis_tanah_baru?: EnumJenisTanahFilter<"DetailTransaksiTujuan"> | $Enums.JenisTanah
    no_persil_baru?: StringNullableFilter<"DetailTransaksiTujuan"> | string | null
    nop_generated?: StringNullableFilter<"DetailTransaksiTujuan"> | string | null
    transaksi?: XOR<TransaksiSpopScalarRelationFilter, TransaksiSpopWhereInput>
    calon_subjek?: XOR<SubjekPajakScalarRelationFilter, SubjekPajakWhereInput>
  }, "id_detail_tujuan">

  export type DetailTransaksiTujuanOrderByWithAggregationInput = {
    id_detail_tujuan?: SortOrder
    id_transaksi?: SortOrder
    nik_calon_subjek?: SortOrder
    luas_tanah_baru?: SortOrder
    luas_bangunan_baru?: SortOrder
    jumlah_bangunan_baru?: SortOrder
    jenis_tanah_baru?: SortOrder
    no_persil_baru?: SortOrderInput | SortOrder
    nop_generated?: SortOrderInput | SortOrder
    _count?: DetailTransaksiTujuanCountOrderByAggregateInput
    _avg?: DetailTransaksiTujuanAvgOrderByAggregateInput
    _max?: DetailTransaksiTujuanMaxOrderByAggregateInput
    _min?: DetailTransaksiTujuanMinOrderByAggregateInput
    _sum?: DetailTransaksiTujuanSumOrderByAggregateInput
  }

  export type DetailTransaksiTujuanScalarWhereWithAggregatesInput = {
    AND?: DetailTransaksiTujuanScalarWhereWithAggregatesInput | DetailTransaksiTujuanScalarWhereWithAggregatesInput[]
    OR?: DetailTransaksiTujuanScalarWhereWithAggregatesInput[]
    NOT?: DetailTransaksiTujuanScalarWhereWithAggregatesInput | DetailTransaksiTujuanScalarWhereWithAggregatesInput[]
    id_detail_tujuan?: StringWithAggregatesFilter<"DetailTransaksiTujuan"> | string
    id_transaksi?: StringWithAggregatesFilter<"DetailTransaksiTujuan"> | string
    nik_calon_subjek?: StringWithAggregatesFilter<"DetailTransaksiTujuan"> | string
    luas_tanah_baru?: DecimalWithAggregatesFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalWithAggregatesFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntWithAggregatesFilter<"DetailTransaksiTujuan"> | number
    jenis_tanah_baru?: EnumJenisTanahWithAggregatesFilter<"DetailTransaksiTujuan"> | $Enums.JenisTanah
    no_persil_baru?: StringNullableWithAggregatesFilter<"DetailTransaksiTujuan"> | string | null
    nop_generated?: StringNullableWithAggregatesFilter<"DetailTransaksiTujuan"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id_user?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    nama_lengkap?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    kode_wilayah?: StringNullableFilter<"User"> | string | null
    nip?: StringNullableFilter<"User"> | string | null
    is_active?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    wilayah?: XOR<WilayahNullableScalarRelationFilter, WilayahWhereInput> | null
    subjek_pajak_dibuat?: SubjekPajakListRelationFilter
    objek_nonaktif?: ObjekPajakListRelationFilter
    transaksi_diajukan?: TransaksiSpopListRelationFilter
    transaksi_diverifikasi?: TransaksiSpopListRelationFilter
    lampiran_diupload?: LampiranDokumenListRelationFilter
    sppt_digenerate?: SpptListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id_user?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    nama_lengkap?: SortOrder
    role?: SortOrder
    kode_wilayah?: SortOrderInput | SortOrder
    nip?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    wilayah?: WilayahOrderByWithRelationInput
    subjek_pajak_dibuat?: SubjekPajakOrderByRelationAggregateInput
    objek_nonaktif?: ObjekPajakOrderByRelationAggregateInput
    transaksi_diajukan?: TransaksiSpopOrderByRelationAggregateInput
    transaksi_diverifikasi?: TransaksiSpopOrderByRelationAggregateInput
    lampiran_diupload?: LampiranDokumenOrderByRelationAggregateInput
    sppt_digenerate?: SpptOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id_user?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password_hash?: StringFilter<"User"> | string
    nama_lengkap?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    kode_wilayah?: StringNullableFilter<"User"> | string | null
    nip?: StringNullableFilter<"User"> | string | null
    is_active?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    wilayah?: XOR<WilayahNullableScalarRelationFilter, WilayahWhereInput> | null
    subjek_pajak_dibuat?: SubjekPajakListRelationFilter
    objek_nonaktif?: ObjekPajakListRelationFilter
    transaksi_diajukan?: TransaksiSpopListRelationFilter
    transaksi_diverifikasi?: TransaksiSpopListRelationFilter
    lampiran_diupload?: LampiranDokumenListRelationFilter
    sppt_digenerate?: SpptListRelationFilter
  }, "id_user" | "username">

  export type UserOrderByWithAggregationInput = {
    id_user?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    nama_lengkap?: SortOrder
    role?: SortOrder
    kode_wilayah?: SortOrderInput | SortOrder
    nip?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id_user?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password_hash?: StringWithAggregatesFilter<"User"> | string
    nama_lengkap?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    kode_wilayah?: StringNullableWithAggregatesFilter<"User"> | string | null
    nip?: StringNullableWithAggregatesFilter<"User"> | string | null
    is_active?: BoolWithAggregatesFilter<"User"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type WilayahWhereInput = {
    AND?: WilayahWhereInput | WilayahWhereInput[]
    OR?: WilayahWhereInput[]
    NOT?: WilayahWhereInput | WilayahWhereInput[]
    kode_wilayah?: StringFilter<"Wilayah"> | string
    nama_desa?: StringFilter<"Wilayah"> | string
    kode_kel?: StringFilter<"Wilayah"> | string
    kecamatan?: StringFilter<"Wilayah"> | string
    kode_kec?: StringFilter<"Wilayah"> | string
    kabupaten?: StringFilter<"Wilayah"> | string
    kode_kab?: StringFilter<"Wilayah"> | string
    users?: UserListRelationFilter
  }

  export type WilayahOrderByWithRelationInput = {
    kode_wilayah?: SortOrder
    nama_desa?: SortOrder
    kode_kel?: SortOrder
    kecamatan?: SortOrder
    kode_kec?: SortOrder
    kabupaten?: SortOrder
    kode_kab?: SortOrder
    users?: UserOrderByRelationAggregateInput
  }

  export type WilayahWhereUniqueInput = Prisma.AtLeast<{
    kode_wilayah?: string
    AND?: WilayahWhereInput | WilayahWhereInput[]
    OR?: WilayahWhereInput[]
    NOT?: WilayahWhereInput | WilayahWhereInput[]
    nama_desa?: StringFilter<"Wilayah"> | string
    kode_kel?: StringFilter<"Wilayah"> | string
    kecamatan?: StringFilter<"Wilayah"> | string
    kode_kec?: StringFilter<"Wilayah"> | string
    kabupaten?: StringFilter<"Wilayah"> | string
    kode_kab?: StringFilter<"Wilayah"> | string
    users?: UserListRelationFilter
  }, "kode_wilayah">

  export type WilayahOrderByWithAggregationInput = {
    kode_wilayah?: SortOrder
    nama_desa?: SortOrder
    kode_kel?: SortOrder
    kecamatan?: SortOrder
    kode_kec?: SortOrder
    kabupaten?: SortOrder
    kode_kab?: SortOrder
    _count?: WilayahCountOrderByAggregateInput
    _max?: WilayahMaxOrderByAggregateInput
    _min?: WilayahMinOrderByAggregateInput
  }

  export type WilayahScalarWhereWithAggregatesInput = {
    AND?: WilayahScalarWhereWithAggregatesInput | WilayahScalarWhereWithAggregatesInput[]
    OR?: WilayahScalarWhereWithAggregatesInput[]
    NOT?: WilayahScalarWhereWithAggregatesInput | WilayahScalarWhereWithAggregatesInput[]
    kode_wilayah?: StringWithAggregatesFilter<"Wilayah"> | string
    nama_desa?: StringWithAggregatesFilter<"Wilayah"> | string
    kode_kel?: StringWithAggregatesFilter<"Wilayah"> | string
    kecamatan?: StringWithAggregatesFilter<"Wilayah"> | string
    kode_kec?: StringWithAggregatesFilter<"Wilayah"> | string
    kabupaten?: StringWithAggregatesFilter<"Wilayah"> | string
    kode_kab?: StringWithAggregatesFilter<"Wilayah"> | string
  }

  export type LampiranDokumenCreateInput = {
    id_dokumen?: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
    transaksi: TransaksiSpopCreateNestedOneWithoutLampiranInput
    uploader: UserCreateNestedOneWithoutLampiran_diuploadInput
  }

  export type LampiranDokumenUncheckedCreateInput = {
    id_dokumen?: string
    id_transaksi: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
    uploaded_by: string
  }

  export type LampiranDokumenUpdateInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiSpopUpdateOneRequiredWithoutLampiranNestedInput
    uploader?: UserUpdateOneRequiredWithoutLampiran_diuploadNestedInput
  }

  export type LampiranDokumenUncheckedUpdateInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaded_by?: StringFieldUpdateOperationsInput | string
  }

  export type LampiranDokumenCreateManyInput = {
    id_dokumen?: string
    id_transaksi: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
    uploaded_by: string
  }

  export type LampiranDokumenUpdateManyMutationInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LampiranDokumenUncheckedUpdateManyInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaded_by?: StringFieldUpdateOperationsInput | string
  }

  export type ObjekPajakCreateInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    subjek_pajak: SubjekPajakCreateNestedOneWithoutObjek_pajakInput
    user_nonaktif?: UserCreateNestedOneWithoutObjek_nonaktifInput
    transaksi?: TransaksiSpopCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakUncheckedCreateInput = {
    nop: string
    nik_subjek: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_oleh?: string | null
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    transaksi?: TransaksiSpopUncheckedCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptUncheckedCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakUpdateInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak?: SubjekPajakUpdateOneRequiredWithoutObjek_pajakNestedInput
    user_nonaktif?: UserUpdateOneWithoutObjek_nonaktifNestedInput
    transaksi?: TransaksiSpopUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakUncheckedUpdateInput = {
    nop?: StringFieldUpdateOperationsInput | string
    nik_subjek?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_oleh?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakCreateManyInput = {
    nop: string
    nik_subjek: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_oleh?: string | null
    nonaktif_at?: Date | string | null
    created_at?: Date | string
  }

  export type ObjekPajakUpdateManyMutationInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjekPajakUncheckedUpdateManyInput = {
    nop?: StringFieldUpdateOperationsInput | string
    nik_subjek?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_oleh?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpptCreateInput = {
    id_sppt?: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_at?: Date | string
    objek_pajak: ObjekPajakCreateNestedOneWithoutSpptInput
    generator: UserCreateNestedOneWithoutSppt_digenerateInput
    transaksi_asal?: TransaksiSpopCreateNestedOneWithoutSpptInput
  }

  export type SpptUncheckedCreateInput = {
    id_sppt?: string
    nop: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_by: string
    generated_at?: Date | string
    id_transaksi_asal?: string | null
  }

  export type SpptUpdateInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    objek_pajak?: ObjekPajakUpdateOneRequiredWithoutSpptNestedInput
    generator?: UserUpdateOneRequiredWithoutSppt_digenerateNestedInput
    transaksi_asal?: TransaksiSpopUpdateOneWithoutSpptNestedInput
  }

  export type SpptUncheckedUpdateInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    nop?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_by?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id_transaksi_asal?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpptCreateManyInput = {
    id_sppt?: string
    nop: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_by: string
    generated_at?: Date | string
    id_transaksi_asal?: string | null
  }

  export type SpptUpdateManyMutationInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpptUncheckedUpdateManyInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    nop?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_by?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id_transaksi_asal?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubjekPajakCreateInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutSubjek_pajak_dibuatInput
    objek_pajak?: ObjekPajakCreateNestedManyWithoutSubjek_pajakInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutCalon_subjekInput
  }

  export type SubjekPajakUncheckedCreateInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
    objek_pajak?: ObjekPajakUncheckedCreateNestedManyWithoutSubjek_pajakInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutCalon_subjekInput
  }

  export type SubjekPajakUpdateInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubjek_pajak_dibuatNestedInput
    objek_pajak?: ObjekPajakUpdateManyWithoutSubjek_pajakNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutCalon_subjekNestedInput
  }

  export type SubjekPajakUncheckedUpdateInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
    objek_pajak?: ObjekPajakUncheckedUpdateManyWithoutSubjek_pajakNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutCalon_subjekNestedInput
  }

  export type SubjekPajakCreateManyInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
  }

  export type SubjekPajakUpdateManyMutationInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjekPajakUncheckedUpdateManyInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
  }

  export type TransaksiSpopCreateInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pengaju: UserCreateNestedOneWithoutTransaksi_diajukanInput
    verifikator?: UserCreateNestedOneWithoutTransaksi_diverifikasiInput
    objek_bersama?: ObjekPajakCreateNestedOneWithoutTransaksiInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenCreateNestedManyWithoutTransaksiInput
    sppt?: SpptCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUncheckedCreateInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput
    sppt?: SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUpdateInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pengaju?: UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput
    verifikator?: UserUpdateOneWithoutTransaksi_diverifikasiNestedInput
    objek_bersama?: ObjekPajakUpdateOneWithoutTransaksiNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopCreateManyInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TransaksiSpopUpdateManyMutationInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaksiSpopUncheckedUpdateManyInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailTransaksiAsalCreateInput = {
    id_detail_asal?: string
    nonaktifkan_saat_disetujui?: boolean
    transaksi: TransaksiSpopCreateNestedOneWithoutDetail_asalInput
    objek_asal?: ObjekPajakCreateNestedOneWithoutDetail_asalInput
  }

  export type DetailTransaksiAsalUncheckedCreateInput = {
    id_detail_asal?: string
    id_transaksi: string
    nop_asal?: string | null
    nonaktifkan_saat_disetujui?: boolean
  }

  export type DetailTransaksiAsalUpdateInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
    transaksi?: TransaksiSpopUpdateOneRequiredWithoutDetail_asalNestedInput
    objek_asal?: ObjekPajakUpdateOneWithoutDetail_asalNestedInput
  }

  export type DetailTransaksiAsalUncheckedUpdateInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    nop_asal?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DetailTransaksiAsalCreateManyInput = {
    id_detail_asal?: string
    id_transaksi: string
    nop_asal?: string | null
    nonaktifkan_saat_disetujui?: boolean
  }

  export type DetailTransaksiAsalUpdateManyMutationInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DetailTransaksiAsalUncheckedUpdateManyInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    nop_asal?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DetailTransaksiTujuanCreateInput = {
    id_detail_tujuan?: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
    transaksi: TransaksiSpopCreateNestedOneWithoutDetail_tujuanInput
    calon_subjek: SubjekPajakCreateNestedOneWithoutDetail_tujuanInput
  }

  export type DetailTransaksiTujuanUncheckedCreateInput = {
    id_detail_tujuan?: string
    id_transaksi: string
    nik_calon_subjek: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
  }

  export type DetailTransaksiTujuanUpdateInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
    transaksi?: TransaksiSpopUpdateOneRequiredWithoutDetail_tujuanNestedInput
    calon_subjek?: SubjekPajakUpdateOneRequiredWithoutDetail_tujuanNestedInput
  }

  export type DetailTransaksiTujuanUncheckedUpdateInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    nik_calon_subjek?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DetailTransaksiTujuanCreateManyInput = {
    id_detail_tujuan?: string
    id_transaksi: string
    nik_calon_subjek: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
  }

  export type DetailTransaksiTujuanUpdateManyMutationInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DetailTransaksiTujuanUncheckedUpdateManyInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    nik_calon_subjek?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    wilayah?: WilayahCreateNestedOneWithoutUsersInput
    subjek_pajak_dibuat?: SubjekPajakCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptCreateNestedManyWithoutGeneratorInput
  }

  export type UserUncheckedCreateInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptUncheckedCreateNestedManyWithoutGeneratorInput
  }

  export type UserUpdateInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    wilayah?: WilayahUpdateOneWithoutUsersNestedInput
    subjek_pajak_dibuat?: SubjekPajakUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUncheckedUpdateManyWithoutGeneratorNestedInput
  }

  export type UserCreateManyInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WilayahCreateInput = {
    kode_wilayah: string
    nama_desa: string
    kode_kel: string
    kecamatan: string
    kode_kec: string
    kabupaten: string
    kode_kab: string
    users?: UserCreateNestedManyWithoutWilayahInput
  }

  export type WilayahUncheckedCreateInput = {
    kode_wilayah: string
    nama_desa: string
    kode_kel: string
    kecamatan: string
    kode_kec: string
    kabupaten: string
    kode_kab: string
    users?: UserUncheckedCreateNestedManyWithoutWilayahInput
  }

  export type WilayahUpdateInput = {
    kode_wilayah?: StringFieldUpdateOperationsInput | string
    nama_desa?: StringFieldUpdateOperationsInput | string
    kode_kel?: StringFieldUpdateOperationsInput | string
    kecamatan?: StringFieldUpdateOperationsInput | string
    kode_kec?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_kab?: StringFieldUpdateOperationsInput | string
    users?: UserUpdateManyWithoutWilayahNestedInput
  }

  export type WilayahUncheckedUpdateInput = {
    kode_wilayah?: StringFieldUpdateOperationsInput | string
    nama_desa?: StringFieldUpdateOperationsInput | string
    kode_kel?: StringFieldUpdateOperationsInput | string
    kecamatan?: StringFieldUpdateOperationsInput | string
    kode_kec?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_kab?: StringFieldUpdateOperationsInput | string
    users?: UserUncheckedUpdateManyWithoutWilayahNestedInput
  }

  export type WilayahCreateManyInput = {
    kode_wilayah: string
    nama_desa: string
    kode_kel: string
    kecamatan: string
    kode_kec: string
    kabupaten: string
    kode_kab: string
  }

  export type WilayahUpdateManyMutationInput = {
    kode_wilayah?: StringFieldUpdateOperationsInput | string
    nama_desa?: StringFieldUpdateOperationsInput | string
    kode_kel?: StringFieldUpdateOperationsInput | string
    kecamatan?: StringFieldUpdateOperationsInput | string
    kode_kec?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_kab?: StringFieldUpdateOperationsInput | string
  }

  export type WilayahUncheckedUpdateManyInput = {
    kode_wilayah?: StringFieldUpdateOperationsInput | string
    nama_desa?: StringFieldUpdateOperationsInput | string
    kode_kel?: StringFieldUpdateOperationsInput | string
    kecamatan?: StringFieldUpdateOperationsInput | string
    kode_kec?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_kab?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumJenisDokumenFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisDokumen | EnumJenisDokumenFieldRefInput<$PrismaModel>
    in?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisDokumenFilter<$PrismaModel> | $Enums.JenisDokumen
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TransaksiSpopScalarRelationFilter = {
    is?: TransaksiSpopWhereInput
    isNot?: TransaksiSpopWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LampiranDokumenCountOrderByAggregateInput = {
    id_dokumen?: SortOrder
    id_transaksi?: SortOrder
    jenis_dokumen?: SortOrder
    keterangan_dokumen?: SortOrder
    url_file?: SortOrder
    uploaded_at?: SortOrder
    uploaded_by?: SortOrder
  }

  export type LampiranDokumenMaxOrderByAggregateInput = {
    id_dokumen?: SortOrder
    id_transaksi?: SortOrder
    jenis_dokumen?: SortOrder
    keterangan_dokumen?: SortOrder
    url_file?: SortOrder
    uploaded_at?: SortOrder
    uploaded_by?: SortOrder
  }

  export type LampiranDokumenMinOrderByAggregateInput = {
    id_dokumen?: SortOrder
    id_transaksi?: SortOrder
    jenis_dokumen?: SortOrder
    keterangan_dokumen?: SortOrder
    url_file?: SortOrder
    uploaded_at?: SortOrder
    uploaded_by?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumJenisDokumenWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisDokumen | EnumJenisDokumenFieldRefInput<$PrismaModel>
    in?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisDokumenWithAggregatesFilter<$PrismaModel> | $Enums.JenisDokumen
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisDokumenFilter<$PrismaModel>
    _max?: NestedEnumJenisDokumenFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumJenisTanahFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTanah | EnumJenisTanahFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTanahFilter<$PrismaModel> | $Enums.JenisTanah
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SubjekPajakScalarRelationFilter = {
    is?: SubjekPajakWhereInput
    isNot?: SubjekPajakWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TransaksiSpopListRelationFilter = {
    every?: TransaksiSpopWhereInput
    some?: TransaksiSpopWhereInput
    none?: TransaksiSpopWhereInput
  }

  export type DetailTransaksiAsalListRelationFilter = {
    every?: DetailTransaksiAsalWhereInput
    some?: DetailTransaksiAsalWhereInput
    none?: DetailTransaksiAsalWhereInput
  }

  export type SpptListRelationFilter = {
    every?: SpptWhereInput
    some?: SpptWhereInput
    none?: SpptWhereInput
  }

  export type TransaksiSpopOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DetailTransaksiAsalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SpptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ObjekPajakCountOrderByAggregateInput = {
    nop?: SortOrder
    nik_subjek?: SortOrder
    no_persil?: SortOrder
    jalan_op?: SortOrder
    blok_kav_no?: SortOrder
    rw_op?: SortOrder
    rt_op?: SortOrder
    kelurahan_op?: SortOrder
    kecamatan_op?: SortOrder
    luas_tanah?: SortOrder
    zona_nilai_tanah?: SortOrder
    jenis_tanah?: SortOrder
    jumlah_bangunan?: SortOrder
    luas_bangunan?: SortOrder
    njop_tanah?: SortOrder
    njop_bangunan?: SortOrder
    njop_total?: SortOrder
    tahun_penilaian?: SortOrder
    status_aktif?: SortOrder
    nonaktif_oleh?: SortOrder
    nonaktif_at?: SortOrder
    created_at?: SortOrder
  }

  export type ObjekPajakAvgOrderByAggregateInput = {
    luas_tanah?: SortOrder
    jumlah_bangunan?: SortOrder
    luas_bangunan?: SortOrder
    njop_tanah?: SortOrder
    njop_bangunan?: SortOrder
    njop_total?: SortOrder
    tahun_penilaian?: SortOrder
  }

  export type ObjekPajakMaxOrderByAggregateInput = {
    nop?: SortOrder
    nik_subjek?: SortOrder
    no_persil?: SortOrder
    jalan_op?: SortOrder
    blok_kav_no?: SortOrder
    rw_op?: SortOrder
    rt_op?: SortOrder
    kelurahan_op?: SortOrder
    kecamatan_op?: SortOrder
    luas_tanah?: SortOrder
    zona_nilai_tanah?: SortOrder
    jenis_tanah?: SortOrder
    jumlah_bangunan?: SortOrder
    luas_bangunan?: SortOrder
    njop_tanah?: SortOrder
    njop_bangunan?: SortOrder
    njop_total?: SortOrder
    tahun_penilaian?: SortOrder
    status_aktif?: SortOrder
    nonaktif_oleh?: SortOrder
    nonaktif_at?: SortOrder
    created_at?: SortOrder
  }

  export type ObjekPajakMinOrderByAggregateInput = {
    nop?: SortOrder
    nik_subjek?: SortOrder
    no_persil?: SortOrder
    jalan_op?: SortOrder
    blok_kav_no?: SortOrder
    rw_op?: SortOrder
    rt_op?: SortOrder
    kelurahan_op?: SortOrder
    kecamatan_op?: SortOrder
    luas_tanah?: SortOrder
    zona_nilai_tanah?: SortOrder
    jenis_tanah?: SortOrder
    jumlah_bangunan?: SortOrder
    luas_bangunan?: SortOrder
    njop_tanah?: SortOrder
    njop_bangunan?: SortOrder
    njop_total?: SortOrder
    tahun_penilaian?: SortOrder
    status_aktif?: SortOrder
    nonaktif_oleh?: SortOrder
    nonaktif_at?: SortOrder
    created_at?: SortOrder
  }

  export type ObjekPajakSumOrderByAggregateInput = {
    luas_tanah?: SortOrder
    jumlah_bangunan?: SortOrder
    luas_bangunan?: SortOrder
    njop_tanah?: SortOrder
    njop_bangunan?: SortOrder
    njop_total?: SortOrder
    tahun_penilaian?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumJenisTanahWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTanah | EnumJenisTanahFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTanahWithAggregatesFilter<$PrismaModel> | $Enums.JenisTanah
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTanahFilter<$PrismaModel>
    _max?: NestedEnumJenisTanahFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumStatusBayarFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBayar | EnumStatusBayarFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBayarFilter<$PrismaModel> | $Enums.StatusBayar
  }

  export type ObjekPajakScalarRelationFilter = {
    is?: ObjekPajakWhereInput
    isNot?: ObjekPajakWhereInput
  }

  export type TransaksiSpopNullableScalarRelationFilter = {
    is?: TransaksiSpopWhereInput | null
    isNot?: TransaksiSpopWhereInput | null
  }

  export type SpptCountOrderByAggregateInput = {
    id_sppt?: SortOrder
    nop?: SortOrder
    tahun_pajak?: SortOrder
    njop_kena_pajak?: SortOrder
    njoptkp?: SortOrder
    tarif_pbb?: SortOrder
    pbb_terutang?: SortOrder
    tgl_jatuh_tempo?: SortOrder
    status_bayar?: SortOrder
    tgl_bayar?: SortOrder
    generated_by?: SortOrder
    generated_at?: SortOrder
    id_transaksi_asal?: SortOrder
  }

  export type SpptAvgOrderByAggregateInput = {
    tahun_pajak?: SortOrder
    njop_kena_pajak?: SortOrder
    njoptkp?: SortOrder
    tarif_pbb?: SortOrder
    pbb_terutang?: SortOrder
  }

  export type SpptMaxOrderByAggregateInput = {
    id_sppt?: SortOrder
    nop?: SortOrder
    tahun_pajak?: SortOrder
    njop_kena_pajak?: SortOrder
    njoptkp?: SortOrder
    tarif_pbb?: SortOrder
    pbb_terutang?: SortOrder
    tgl_jatuh_tempo?: SortOrder
    status_bayar?: SortOrder
    tgl_bayar?: SortOrder
    generated_by?: SortOrder
    generated_at?: SortOrder
    id_transaksi_asal?: SortOrder
  }

  export type SpptMinOrderByAggregateInput = {
    id_sppt?: SortOrder
    nop?: SortOrder
    tahun_pajak?: SortOrder
    njop_kena_pajak?: SortOrder
    njoptkp?: SortOrder
    tarif_pbb?: SortOrder
    pbb_terutang?: SortOrder
    tgl_jatuh_tempo?: SortOrder
    status_bayar?: SortOrder
    tgl_bayar?: SortOrder
    generated_by?: SortOrder
    generated_at?: SortOrder
    id_transaksi_asal?: SortOrder
  }

  export type SpptSumOrderByAggregateInput = {
    tahun_pajak?: SortOrder
    njop_kena_pajak?: SortOrder
    njoptkp?: SortOrder
    tarif_pbb?: SortOrder
    pbb_terutang?: SortOrder
  }

  export type EnumStatusBayarWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBayar | EnumStatusBayarFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBayarWithAggregatesFilter<$PrismaModel> | $Enums.StatusBayar
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusBayarFilter<$PrismaModel>
    _max?: NestedEnumStatusBayarFilter<$PrismaModel>
  }

  export type EnumStatusWpFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusWp | EnumStatusWpFieldRefInput<$PrismaModel>
    in?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWpFilter<$PrismaModel> | $Enums.StatusWp
  }

  export type EnumPekerjaanFilter<$PrismaModel = never> = {
    equals?: $Enums.Pekerjaan | EnumPekerjaanFieldRefInput<$PrismaModel>
    in?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    not?: NestedEnumPekerjaanFilter<$PrismaModel> | $Enums.Pekerjaan
  }

  export type ObjekPajakListRelationFilter = {
    every?: ObjekPajakWhereInput
    some?: ObjekPajakWhereInput
    none?: ObjekPajakWhereInput
  }

  export type DetailTransaksiTujuanListRelationFilter = {
    every?: DetailTransaksiTujuanWhereInput
    some?: DetailTransaksiTujuanWhereInput
    none?: DetailTransaksiTujuanWhereInput
  }

  export type ObjekPajakOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DetailTransaksiTujuanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubjekPajakCountOrderByAggregateInput = {
    nik?: SortOrder
    nama_subjek?: SortOrder
    status_wp?: SortOrder
    pekerjaan?: SortOrder
    npwp?: SortOrder
    no_hp?: SortOrder
    alamat_jalan?: SortOrder
    blok_kav_no_subjek?: SortOrder
    rw?: SortOrder
    rt?: SortOrder
    kelurahan?: SortOrder
    kabupaten?: SortOrder
    kode_pos?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
  }

  export type SubjekPajakMaxOrderByAggregateInput = {
    nik?: SortOrder
    nama_subjek?: SortOrder
    status_wp?: SortOrder
    pekerjaan?: SortOrder
    npwp?: SortOrder
    no_hp?: SortOrder
    alamat_jalan?: SortOrder
    blok_kav_no_subjek?: SortOrder
    rw?: SortOrder
    rt?: SortOrder
    kelurahan?: SortOrder
    kabupaten?: SortOrder
    kode_pos?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
  }

  export type SubjekPajakMinOrderByAggregateInput = {
    nik?: SortOrder
    nama_subjek?: SortOrder
    status_wp?: SortOrder
    pekerjaan?: SortOrder
    npwp?: SortOrder
    no_hp?: SortOrder
    alamat_jalan?: SortOrder
    blok_kav_no_subjek?: SortOrder
    rw?: SortOrder
    rt?: SortOrder
    kelurahan?: SortOrder
    kabupaten?: SortOrder
    kode_pos?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    created_by?: SortOrder
  }

  export type EnumStatusWpWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusWp | EnumStatusWpFieldRefInput<$PrismaModel>
    in?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWpWithAggregatesFilter<$PrismaModel> | $Enums.StatusWp
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusWpFilter<$PrismaModel>
    _max?: NestedEnumStatusWpFilter<$PrismaModel>
  }

  export type EnumPekerjaanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Pekerjaan | EnumPekerjaanFieldRefInput<$PrismaModel>
    in?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    not?: NestedEnumPekerjaanWithAggregatesFilter<$PrismaModel> | $Enums.Pekerjaan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPekerjaanFilter<$PrismaModel>
    _max?: NestedEnumPekerjaanFilter<$PrismaModel>
  }

  export type EnumJenisTransaksiFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiFilter<$PrismaModel> | $Enums.JenisTransaksi
  }

  export type EnumStatusAjuanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAjuan | EnumStatusAjuanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAjuanFilter<$PrismaModel> | $Enums.StatusAjuan
  }

  export type ObjekPajakNullableScalarRelationFilter = {
    is?: ObjekPajakWhereInput | null
    isNot?: ObjekPajakWhereInput | null
  }

  export type LampiranDokumenListRelationFilter = {
    every?: LampiranDokumenWhereInput
    some?: LampiranDokumenWhereInput
    none?: LampiranDokumenWhereInput
  }

  export type LampiranDokumenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransaksiSpopCountOrderByAggregateInput = {
    id_transaksi?: SortOrder
    no_formulir?: SortOrder
    id_user?: SortOrder
    tahun_pajak?: SortOrder
    jenis_transaksi?: SortOrder
    nop_bersama?: SortOrder
    no_sppt_lama?: SortOrder
    nama_pengaju?: SortOrder
    menggunakan_kuasa?: SortOrder
    tanggal_pengajuan?: SortOrder
    status_ajuan?: SortOrder
    id_verifikator?: SortOrder
    verified_at?: SortOrder
    catatan_bakeuda?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TransaksiSpopAvgOrderByAggregateInput = {
    tahun_pajak?: SortOrder
  }

  export type TransaksiSpopMaxOrderByAggregateInput = {
    id_transaksi?: SortOrder
    no_formulir?: SortOrder
    id_user?: SortOrder
    tahun_pajak?: SortOrder
    jenis_transaksi?: SortOrder
    nop_bersama?: SortOrder
    no_sppt_lama?: SortOrder
    nama_pengaju?: SortOrder
    menggunakan_kuasa?: SortOrder
    tanggal_pengajuan?: SortOrder
    status_ajuan?: SortOrder
    id_verifikator?: SortOrder
    verified_at?: SortOrder
    catatan_bakeuda?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TransaksiSpopMinOrderByAggregateInput = {
    id_transaksi?: SortOrder
    no_formulir?: SortOrder
    id_user?: SortOrder
    tahun_pajak?: SortOrder
    jenis_transaksi?: SortOrder
    nop_bersama?: SortOrder
    no_sppt_lama?: SortOrder
    nama_pengaju?: SortOrder
    menggunakan_kuasa?: SortOrder
    tanggal_pengajuan?: SortOrder
    status_ajuan?: SortOrder
    id_verifikator?: SortOrder
    verified_at?: SortOrder
    catatan_bakeuda?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TransaksiSpopSumOrderByAggregateInput = {
    tahun_pajak?: SortOrder
  }

  export type EnumJenisTransaksiWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiWithAggregatesFilter<$PrismaModel> | $Enums.JenisTransaksi
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTransaksiFilter<$PrismaModel>
    _max?: NestedEnumJenisTransaksiFilter<$PrismaModel>
  }

  export type EnumStatusAjuanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAjuan | EnumStatusAjuanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAjuanWithAggregatesFilter<$PrismaModel> | $Enums.StatusAjuan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAjuanFilter<$PrismaModel>
    _max?: NestedEnumStatusAjuanFilter<$PrismaModel>
  }

  export type DetailTransaksiAsalCountOrderByAggregateInput = {
    id_detail_asal?: SortOrder
    id_transaksi?: SortOrder
    nop_asal?: SortOrder
    nonaktifkan_saat_disetujui?: SortOrder
  }

  export type DetailTransaksiAsalMaxOrderByAggregateInput = {
    id_detail_asal?: SortOrder
    id_transaksi?: SortOrder
    nop_asal?: SortOrder
    nonaktifkan_saat_disetujui?: SortOrder
  }

  export type DetailTransaksiAsalMinOrderByAggregateInput = {
    id_detail_asal?: SortOrder
    id_transaksi?: SortOrder
    nop_asal?: SortOrder
    nonaktifkan_saat_disetujui?: SortOrder
  }

  export type DetailTransaksiTujuanCountOrderByAggregateInput = {
    id_detail_tujuan?: SortOrder
    id_transaksi?: SortOrder
    nik_calon_subjek?: SortOrder
    luas_tanah_baru?: SortOrder
    luas_bangunan_baru?: SortOrder
    jumlah_bangunan_baru?: SortOrder
    jenis_tanah_baru?: SortOrder
    no_persil_baru?: SortOrder
    nop_generated?: SortOrder
  }

  export type DetailTransaksiTujuanAvgOrderByAggregateInput = {
    luas_tanah_baru?: SortOrder
    luas_bangunan_baru?: SortOrder
    jumlah_bangunan_baru?: SortOrder
  }

  export type DetailTransaksiTujuanMaxOrderByAggregateInput = {
    id_detail_tujuan?: SortOrder
    id_transaksi?: SortOrder
    nik_calon_subjek?: SortOrder
    luas_tanah_baru?: SortOrder
    luas_bangunan_baru?: SortOrder
    jumlah_bangunan_baru?: SortOrder
    jenis_tanah_baru?: SortOrder
    no_persil_baru?: SortOrder
    nop_generated?: SortOrder
  }

  export type DetailTransaksiTujuanMinOrderByAggregateInput = {
    id_detail_tujuan?: SortOrder
    id_transaksi?: SortOrder
    nik_calon_subjek?: SortOrder
    luas_tanah_baru?: SortOrder
    luas_bangunan_baru?: SortOrder
    jumlah_bangunan_baru?: SortOrder
    jenis_tanah_baru?: SortOrder
    no_persil_baru?: SortOrder
    nop_generated?: SortOrder
  }

  export type DetailTransaksiTujuanSumOrderByAggregateInput = {
    luas_tanah_baru?: SortOrder
    luas_bangunan_baru?: SortOrder
    jumlah_bangunan_baru?: SortOrder
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type WilayahNullableScalarRelationFilter = {
    is?: WilayahWhereInput | null
    isNot?: WilayahWhereInput | null
  }

  export type SubjekPajakListRelationFilter = {
    every?: SubjekPajakWhereInput
    some?: SubjekPajakWhereInput
    none?: SubjekPajakWhereInput
  }

  export type SubjekPajakOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id_user?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    nama_lengkap?: SortOrder
    role?: SortOrder
    kode_wilayah?: SortOrder
    nip?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id_user?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    nama_lengkap?: SortOrder
    role?: SortOrder
    kode_wilayah?: SortOrder
    nip?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id_user?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    nama_lengkap?: SortOrder
    role?: SortOrder
    kode_wilayah?: SortOrder
    nip?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WilayahCountOrderByAggregateInput = {
    kode_wilayah?: SortOrder
    nama_desa?: SortOrder
    kode_kel?: SortOrder
    kecamatan?: SortOrder
    kode_kec?: SortOrder
    kabupaten?: SortOrder
    kode_kab?: SortOrder
  }

  export type WilayahMaxOrderByAggregateInput = {
    kode_wilayah?: SortOrder
    nama_desa?: SortOrder
    kode_kel?: SortOrder
    kecamatan?: SortOrder
    kode_kec?: SortOrder
    kabupaten?: SortOrder
    kode_kab?: SortOrder
  }

  export type WilayahMinOrderByAggregateInput = {
    kode_wilayah?: SortOrder
    nama_desa?: SortOrder
    kode_kel?: SortOrder
    kecamatan?: SortOrder
    kode_kec?: SortOrder
    kabupaten?: SortOrder
    kode_kab?: SortOrder
  }

  export type TransaksiSpopCreateNestedOneWithoutLampiranInput = {
    create?: XOR<TransaksiSpopCreateWithoutLampiranInput, TransaksiSpopUncheckedCreateWithoutLampiranInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutLampiranInput
    connect?: TransaksiSpopWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutLampiran_diuploadInput = {
    create?: XOR<UserCreateWithoutLampiran_diuploadInput, UserUncheckedCreateWithoutLampiran_diuploadInput>
    connectOrCreate?: UserCreateOrConnectWithoutLampiran_diuploadInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumJenisDokumenFieldUpdateOperationsInput = {
    set?: $Enums.JenisDokumen
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TransaksiSpopUpdateOneRequiredWithoutLampiranNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutLampiranInput, TransaksiSpopUncheckedCreateWithoutLampiranInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutLampiranInput
    upsert?: TransaksiSpopUpsertWithoutLampiranInput
    connect?: TransaksiSpopWhereUniqueInput
    update?: XOR<XOR<TransaksiSpopUpdateToOneWithWhereWithoutLampiranInput, TransaksiSpopUpdateWithoutLampiranInput>, TransaksiSpopUncheckedUpdateWithoutLampiranInput>
  }

  export type UserUpdateOneRequiredWithoutLampiran_diuploadNestedInput = {
    create?: XOR<UserCreateWithoutLampiran_diuploadInput, UserUncheckedCreateWithoutLampiran_diuploadInput>
    connectOrCreate?: UserCreateOrConnectWithoutLampiran_diuploadInput
    upsert?: UserUpsertWithoutLampiran_diuploadInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLampiran_diuploadInput, UserUpdateWithoutLampiran_diuploadInput>, UserUncheckedUpdateWithoutLampiran_diuploadInput>
  }

  export type SubjekPajakCreateNestedOneWithoutObjek_pajakInput = {
    create?: XOR<SubjekPajakCreateWithoutObjek_pajakInput, SubjekPajakUncheckedCreateWithoutObjek_pajakInput>
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutObjek_pajakInput
    connect?: SubjekPajakWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutObjek_nonaktifInput = {
    create?: XOR<UserCreateWithoutObjek_nonaktifInput, UserUncheckedCreateWithoutObjek_nonaktifInput>
    connectOrCreate?: UserCreateOrConnectWithoutObjek_nonaktifInput
    connect?: UserWhereUniqueInput
  }

  export type TransaksiSpopCreateNestedManyWithoutObjek_bersamaInput = {
    create?: XOR<TransaksiSpopCreateWithoutObjek_bersamaInput, TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput> | TransaksiSpopCreateWithoutObjek_bersamaInput[] | TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput | TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput[]
    createMany?: TransaksiSpopCreateManyObjek_bersamaInputEnvelope
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
  }

  export type DetailTransaksiAsalCreateNestedManyWithoutObjek_asalInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput> | DetailTransaksiAsalCreateWithoutObjek_asalInput[] | DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput | DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput[]
    createMany?: DetailTransaksiAsalCreateManyObjek_asalInputEnvelope
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
  }

  export type SpptCreateNestedManyWithoutObjek_pajakInput = {
    create?: XOR<SpptCreateWithoutObjek_pajakInput, SpptUncheckedCreateWithoutObjek_pajakInput> | SpptCreateWithoutObjek_pajakInput[] | SpptUncheckedCreateWithoutObjek_pajakInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutObjek_pajakInput | SpptCreateOrConnectWithoutObjek_pajakInput[]
    createMany?: SpptCreateManyObjek_pajakInputEnvelope
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
  }

  export type TransaksiSpopUncheckedCreateNestedManyWithoutObjek_bersamaInput = {
    create?: XOR<TransaksiSpopCreateWithoutObjek_bersamaInput, TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput> | TransaksiSpopCreateWithoutObjek_bersamaInput[] | TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput | TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput[]
    createMany?: TransaksiSpopCreateManyObjek_bersamaInputEnvelope
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
  }

  export type DetailTransaksiAsalUncheckedCreateNestedManyWithoutObjek_asalInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput> | DetailTransaksiAsalCreateWithoutObjek_asalInput[] | DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput | DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput[]
    createMany?: DetailTransaksiAsalCreateManyObjek_asalInputEnvelope
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
  }

  export type SpptUncheckedCreateNestedManyWithoutObjek_pajakInput = {
    create?: XOR<SpptCreateWithoutObjek_pajakInput, SpptUncheckedCreateWithoutObjek_pajakInput> | SpptCreateWithoutObjek_pajakInput[] | SpptUncheckedCreateWithoutObjek_pajakInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutObjek_pajakInput | SpptCreateOrConnectWithoutObjek_pajakInput[]
    createMany?: SpptCreateManyObjek_pajakInputEnvelope
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumJenisTanahFieldUpdateOperationsInput = {
    set?: $Enums.JenisTanah
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type SubjekPajakUpdateOneRequiredWithoutObjek_pajakNestedInput = {
    create?: XOR<SubjekPajakCreateWithoutObjek_pajakInput, SubjekPajakUncheckedCreateWithoutObjek_pajakInput>
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutObjek_pajakInput
    upsert?: SubjekPajakUpsertWithoutObjek_pajakInput
    connect?: SubjekPajakWhereUniqueInput
    update?: XOR<XOR<SubjekPajakUpdateToOneWithWhereWithoutObjek_pajakInput, SubjekPajakUpdateWithoutObjek_pajakInput>, SubjekPajakUncheckedUpdateWithoutObjek_pajakInput>
  }

  export type UserUpdateOneWithoutObjek_nonaktifNestedInput = {
    create?: XOR<UserCreateWithoutObjek_nonaktifInput, UserUncheckedCreateWithoutObjek_nonaktifInput>
    connectOrCreate?: UserCreateOrConnectWithoutObjek_nonaktifInput
    upsert?: UserUpsertWithoutObjek_nonaktifInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutObjek_nonaktifInput, UserUpdateWithoutObjek_nonaktifInput>, UserUncheckedUpdateWithoutObjek_nonaktifInput>
  }

  export type TransaksiSpopUpdateManyWithoutObjek_bersamaNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutObjek_bersamaInput, TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput> | TransaksiSpopCreateWithoutObjek_bersamaInput[] | TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput | TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput[]
    upsert?: TransaksiSpopUpsertWithWhereUniqueWithoutObjek_bersamaInput | TransaksiSpopUpsertWithWhereUniqueWithoutObjek_bersamaInput[]
    createMany?: TransaksiSpopCreateManyObjek_bersamaInputEnvelope
    set?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    disconnect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    delete?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    update?: TransaksiSpopUpdateWithWhereUniqueWithoutObjek_bersamaInput | TransaksiSpopUpdateWithWhereUniqueWithoutObjek_bersamaInput[]
    updateMany?: TransaksiSpopUpdateManyWithWhereWithoutObjek_bersamaInput | TransaksiSpopUpdateManyWithWhereWithoutObjek_bersamaInput[]
    deleteMany?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
  }

  export type DetailTransaksiAsalUpdateManyWithoutObjek_asalNestedInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput> | DetailTransaksiAsalCreateWithoutObjek_asalInput[] | DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput | DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput[]
    upsert?: DetailTransaksiAsalUpsertWithWhereUniqueWithoutObjek_asalInput | DetailTransaksiAsalUpsertWithWhereUniqueWithoutObjek_asalInput[]
    createMany?: DetailTransaksiAsalCreateManyObjek_asalInputEnvelope
    set?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    disconnect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    delete?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    update?: DetailTransaksiAsalUpdateWithWhereUniqueWithoutObjek_asalInput | DetailTransaksiAsalUpdateWithWhereUniqueWithoutObjek_asalInput[]
    updateMany?: DetailTransaksiAsalUpdateManyWithWhereWithoutObjek_asalInput | DetailTransaksiAsalUpdateManyWithWhereWithoutObjek_asalInput[]
    deleteMany?: DetailTransaksiAsalScalarWhereInput | DetailTransaksiAsalScalarWhereInput[]
  }

  export type SpptUpdateManyWithoutObjek_pajakNestedInput = {
    create?: XOR<SpptCreateWithoutObjek_pajakInput, SpptUncheckedCreateWithoutObjek_pajakInput> | SpptCreateWithoutObjek_pajakInput[] | SpptUncheckedCreateWithoutObjek_pajakInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutObjek_pajakInput | SpptCreateOrConnectWithoutObjek_pajakInput[]
    upsert?: SpptUpsertWithWhereUniqueWithoutObjek_pajakInput | SpptUpsertWithWhereUniqueWithoutObjek_pajakInput[]
    createMany?: SpptCreateManyObjek_pajakInputEnvelope
    set?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    disconnect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    delete?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    update?: SpptUpdateWithWhereUniqueWithoutObjek_pajakInput | SpptUpdateWithWhereUniqueWithoutObjek_pajakInput[]
    updateMany?: SpptUpdateManyWithWhereWithoutObjek_pajakInput | SpptUpdateManyWithWhereWithoutObjek_pajakInput[]
    deleteMany?: SpptScalarWhereInput | SpptScalarWhereInput[]
  }

  export type TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutObjek_bersamaInput, TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput> | TransaksiSpopCreateWithoutObjek_bersamaInput[] | TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput | TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput[]
    upsert?: TransaksiSpopUpsertWithWhereUniqueWithoutObjek_bersamaInput | TransaksiSpopUpsertWithWhereUniqueWithoutObjek_bersamaInput[]
    createMany?: TransaksiSpopCreateManyObjek_bersamaInputEnvelope
    set?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    disconnect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    delete?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    update?: TransaksiSpopUpdateWithWhereUniqueWithoutObjek_bersamaInput | TransaksiSpopUpdateWithWhereUniqueWithoutObjek_bersamaInput[]
    updateMany?: TransaksiSpopUpdateManyWithWhereWithoutObjek_bersamaInput | TransaksiSpopUpdateManyWithWhereWithoutObjek_bersamaInput[]
    deleteMany?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
  }

  export type DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalNestedInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput> | DetailTransaksiAsalCreateWithoutObjek_asalInput[] | DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput | DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput[]
    upsert?: DetailTransaksiAsalUpsertWithWhereUniqueWithoutObjek_asalInput | DetailTransaksiAsalUpsertWithWhereUniqueWithoutObjek_asalInput[]
    createMany?: DetailTransaksiAsalCreateManyObjek_asalInputEnvelope
    set?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    disconnect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    delete?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    update?: DetailTransaksiAsalUpdateWithWhereUniqueWithoutObjek_asalInput | DetailTransaksiAsalUpdateWithWhereUniqueWithoutObjek_asalInput[]
    updateMany?: DetailTransaksiAsalUpdateManyWithWhereWithoutObjek_asalInput | DetailTransaksiAsalUpdateManyWithWhereWithoutObjek_asalInput[]
    deleteMany?: DetailTransaksiAsalScalarWhereInput | DetailTransaksiAsalScalarWhereInput[]
  }

  export type SpptUncheckedUpdateManyWithoutObjek_pajakNestedInput = {
    create?: XOR<SpptCreateWithoutObjek_pajakInput, SpptUncheckedCreateWithoutObjek_pajakInput> | SpptCreateWithoutObjek_pajakInput[] | SpptUncheckedCreateWithoutObjek_pajakInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutObjek_pajakInput | SpptCreateOrConnectWithoutObjek_pajakInput[]
    upsert?: SpptUpsertWithWhereUniqueWithoutObjek_pajakInput | SpptUpsertWithWhereUniqueWithoutObjek_pajakInput[]
    createMany?: SpptCreateManyObjek_pajakInputEnvelope
    set?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    disconnect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    delete?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    update?: SpptUpdateWithWhereUniqueWithoutObjek_pajakInput | SpptUpdateWithWhereUniqueWithoutObjek_pajakInput[]
    updateMany?: SpptUpdateManyWithWhereWithoutObjek_pajakInput | SpptUpdateManyWithWhereWithoutObjek_pajakInput[]
    deleteMany?: SpptScalarWhereInput | SpptScalarWhereInput[]
  }

  export type ObjekPajakCreateNestedOneWithoutSpptInput = {
    create?: XOR<ObjekPajakCreateWithoutSpptInput, ObjekPajakUncheckedCreateWithoutSpptInput>
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutSpptInput
    connect?: ObjekPajakWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSppt_digenerateInput = {
    create?: XOR<UserCreateWithoutSppt_digenerateInput, UserUncheckedCreateWithoutSppt_digenerateInput>
    connectOrCreate?: UserCreateOrConnectWithoutSppt_digenerateInput
    connect?: UserWhereUniqueInput
  }

  export type TransaksiSpopCreateNestedOneWithoutSpptInput = {
    create?: XOR<TransaksiSpopCreateWithoutSpptInput, TransaksiSpopUncheckedCreateWithoutSpptInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutSpptInput
    connect?: TransaksiSpopWhereUniqueInput
  }

  export type EnumStatusBayarFieldUpdateOperationsInput = {
    set?: $Enums.StatusBayar
  }

  export type ObjekPajakUpdateOneRequiredWithoutSpptNestedInput = {
    create?: XOR<ObjekPajakCreateWithoutSpptInput, ObjekPajakUncheckedCreateWithoutSpptInput>
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutSpptInput
    upsert?: ObjekPajakUpsertWithoutSpptInput
    connect?: ObjekPajakWhereUniqueInput
    update?: XOR<XOR<ObjekPajakUpdateToOneWithWhereWithoutSpptInput, ObjekPajakUpdateWithoutSpptInput>, ObjekPajakUncheckedUpdateWithoutSpptInput>
  }

  export type UserUpdateOneRequiredWithoutSppt_digenerateNestedInput = {
    create?: XOR<UserCreateWithoutSppt_digenerateInput, UserUncheckedCreateWithoutSppt_digenerateInput>
    connectOrCreate?: UserCreateOrConnectWithoutSppt_digenerateInput
    upsert?: UserUpsertWithoutSppt_digenerateInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSppt_digenerateInput, UserUpdateWithoutSppt_digenerateInput>, UserUncheckedUpdateWithoutSppt_digenerateInput>
  }

  export type TransaksiSpopUpdateOneWithoutSpptNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutSpptInput, TransaksiSpopUncheckedCreateWithoutSpptInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutSpptInput
    upsert?: TransaksiSpopUpsertWithoutSpptInput
    disconnect?: TransaksiSpopWhereInput | boolean
    delete?: TransaksiSpopWhereInput | boolean
    connect?: TransaksiSpopWhereUniqueInput
    update?: XOR<XOR<TransaksiSpopUpdateToOneWithWhereWithoutSpptInput, TransaksiSpopUpdateWithoutSpptInput>, TransaksiSpopUncheckedUpdateWithoutSpptInput>
  }

  export type UserCreateNestedOneWithoutSubjek_pajak_dibuatInput = {
    create?: XOR<UserCreateWithoutSubjek_pajak_dibuatInput, UserUncheckedCreateWithoutSubjek_pajak_dibuatInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubjek_pajak_dibuatInput
    connect?: UserWhereUniqueInput
  }

  export type ObjekPajakCreateNestedManyWithoutSubjek_pajakInput = {
    create?: XOR<ObjekPajakCreateWithoutSubjek_pajakInput, ObjekPajakUncheckedCreateWithoutSubjek_pajakInput> | ObjekPajakCreateWithoutSubjek_pajakInput[] | ObjekPajakUncheckedCreateWithoutSubjek_pajakInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutSubjek_pajakInput | ObjekPajakCreateOrConnectWithoutSubjek_pajakInput[]
    createMany?: ObjekPajakCreateManySubjek_pajakInputEnvelope
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
  }

  export type DetailTransaksiTujuanCreateNestedManyWithoutCalon_subjekInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput> | DetailTransaksiTujuanCreateWithoutCalon_subjekInput[] | DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput | DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput[]
    createMany?: DetailTransaksiTujuanCreateManyCalon_subjekInputEnvelope
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
  }

  export type ObjekPajakUncheckedCreateNestedManyWithoutSubjek_pajakInput = {
    create?: XOR<ObjekPajakCreateWithoutSubjek_pajakInput, ObjekPajakUncheckedCreateWithoutSubjek_pajakInput> | ObjekPajakCreateWithoutSubjek_pajakInput[] | ObjekPajakUncheckedCreateWithoutSubjek_pajakInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutSubjek_pajakInput | ObjekPajakCreateOrConnectWithoutSubjek_pajakInput[]
    createMany?: ObjekPajakCreateManySubjek_pajakInputEnvelope
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
  }

  export type DetailTransaksiTujuanUncheckedCreateNestedManyWithoutCalon_subjekInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput> | DetailTransaksiTujuanCreateWithoutCalon_subjekInput[] | DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput | DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput[]
    createMany?: DetailTransaksiTujuanCreateManyCalon_subjekInputEnvelope
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
  }

  export type EnumStatusWpFieldUpdateOperationsInput = {
    set?: $Enums.StatusWp
  }

  export type EnumPekerjaanFieldUpdateOperationsInput = {
    set?: $Enums.Pekerjaan
  }

  export type UserUpdateOneRequiredWithoutSubjek_pajak_dibuatNestedInput = {
    create?: XOR<UserCreateWithoutSubjek_pajak_dibuatInput, UserUncheckedCreateWithoutSubjek_pajak_dibuatInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubjek_pajak_dibuatInput
    upsert?: UserUpsertWithoutSubjek_pajak_dibuatInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubjek_pajak_dibuatInput, UserUpdateWithoutSubjek_pajak_dibuatInput>, UserUncheckedUpdateWithoutSubjek_pajak_dibuatInput>
  }

  export type ObjekPajakUpdateManyWithoutSubjek_pajakNestedInput = {
    create?: XOR<ObjekPajakCreateWithoutSubjek_pajakInput, ObjekPajakUncheckedCreateWithoutSubjek_pajakInput> | ObjekPajakCreateWithoutSubjek_pajakInput[] | ObjekPajakUncheckedCreateWithoutSubjek_pajakInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutSubjek_pajakInput | ObjekPajakCreateOrConnectWithoutSubjek_pajakInput[]
    upsert?: ObjekPajakUpsertWithWhereUniqueWithoutSubjek_pajakInput | ObjekPajakUpsertWithWhereUniqueWithoutSubjek_pajakInput[]
    createMany?: ObjekPajakCreateManySubjek_pajakInputEnvelope
    set?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    disconnect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    delete?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    update?: ObjekPajakUpdateWithWhereUniqueWithoutSubjek_pajakInput | ObjekPajakUpdateWithWhereUniqueWithoutSubjek_pajakInput[]
    updateMany?: ObjekPajakUpdateManyWithWhereWithoutSubjek_pajakInput | ObjekPajakUpdateManyWithWhereWithoutSubjek_pajakInput[]
    deleteMany?: ObjekPajakScalarWhereInput | ObjekPajakScalarWhereInput[]
  }

  export type DetailTransaksiTujuanUpdateManyWithoutCalon_subjekNestedInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput> | DetailTransaksiTujuanCreateWithoutCalon_subjekInput[] | DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput | DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput[]
    upsert?: DetailTransaksiTujuanUpsertWithWhereUniqueWithoutCalon_subjekInput | DetailTransaksiTujuanUpsertWithWhereUniqueWithoutCalon_subjekInput[]
    createMany?: DetailTransaksiTujuanCreateManyCalon_subjekInputEnvelope
    set?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    disconnect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    delete?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    update?: DetailTransaksiTujuanUpdateWithWhereUniqueWithoutCalon_subjekInput | DetailTransaksiTujuanUpdateWithWhereUniqueWithoutCalon_subjekInput[]
    updateMany?: DetailTransaksiTujuanUpdateManyWithWhereWithoutCalon_subjekInput | DetailTransaksiTujuanUpdateManyWithWhereWithoutCalon_subjekInput[]
    deleteMany?: DetailTransaksiTujuanScalarWhereInput | DetailTransaksiTujuanScalarWhereInput[]
  }

  export type ObjekPajakUncheckedUpdateManyWithoutSubjek_pajakNestedInput = {
    create?: XOR<ObjekPajakCreateWithoutSubjek_pajakInput, ObjekPajakUncheckedCreateWithoutSubjek_pajakInput> | ObjekPajakCreateWithoutSubjek_pajakInput[] | ObjekPajakUncheckedCreateWithoutSubjek_pajakInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutSubjek_pajakInput | ObjekPajakCreateOrConnectWithoutSubjek_pajakInput[]
    upsert?: ObjekPajakUpsertWithWhereUniqueWithoutSubjek_pajakInput | ObjekPajakUpsertWithWhereUniqueWithoutSubjek_pajakInput[]
    createMany?: ObjekPajakCreateManySubjek_pajakInputEnvelope
    set?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    disconnect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    delete?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    update?: ObjekPajakUpdateWithWhereUniqueWithoutSubjek_pajakInput | ObjekPajakUpdateWithWhereUniqueWithoutSubjek_pajakInput[]
    updateMany?: ObjekPajakUpdateManyWithWhereWithoutSubjek_pajakInput | ObjekPajakUpdateManyWithWhereWithoutSubjek_pajakInput[]
    deleteMany?: ObjekPajakScalarWhereInput | ObjekPajakScalarWhereInput[]
  }

  export type DetailTransaksiTujuanUncheckedUpdateManyWithoutCalon_subjekNestedInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput> | DetailTransaksiTujuanCreateWithoutCalon_subjekInput[] | DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput | DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput[]
    upsert?: DetailTransaksiTujuanUpsertWithWhereUniqueWithoutCalon_subjekInput | DetailTransaksiTujuanUpsertWithWhereUniqueWithoutCalon_subjekInput[]
    createMany?: DetailTransaksiTujuanCreateManyCalon_subjekInputEnvelope
    set?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    disconnect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    delete?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    update?: DetailTransaksiTujuanUpdateWithWhereUniqueWithoutCalon_subjekInput | DetailTransaksiTujuanUpdateWithWhereUniqueWithoutCalon_subjekInput[]
    updateMany?: DetailTransaksiTujuanUpdateManyWithWhereWithoutCalon_subjekInput | DetailTransaksiTujuanUpdateManyWithWhereWithoutCalon_subjekInput[]
    deleteMany?: DetailTransaksiTujuanScalarWhereInput | DetailTransaksiTujuanScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTransaksi_diajukanInput = {
    create?: XOR<UserCreateWithoutTransaksi_diajukanInput, UserUncheckedCreateWithoutTransaksi_diajukanInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransaksi_diajukanInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTransaksi_diverifikasiInput = {
    create?: XOR<UserCreateWithoutTransaksi_diverifikasiInput, UserUncheckedCreateWithoutTransaksi_diverifikasiInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransaksi_diverifikasiInput
    connect?: UserWhereUniqueInput
  }

  export type ObjekPajakCreateNestedOneWithoutTransaksiInput = {
    create?: XOR<ObjekPajakCreateWithoutTransaksiInput, ObjekPajakUncheckedCreateWithoutTransaksiInput>
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutTransaksiInput
    connect?: ObjekPajakWhereUniqueInput
  }

  export type DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutTransaksiInput, DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput> | DetailTransaksiAsalCreateWithoutTransaksiInput[] | DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput | DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput[]
    createMany?: DetailTransaksiAsalCreateManyTransaksiInputEnvelope
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
  }

  export type DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput> | DetailTransaksiTujuanCreateWithoutTransaksiInput[] | DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput | DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput[]
    createMany?: DetailTransaksiTujuanCreateManyTransaksiInputEnvelope
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
  }

  export type LampiranDokumenCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<LampiranDokumenCreateWithoutTransaksiInput, LampiranDokumenUncheckedCreateWithoutTransaksiInput> | LampiranDokumenCreateWithoutTransaksiInput[] | LampiranDokumenUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutTransaksiInput | LampiranDokumenCreateOrConnectWithoutTransaksiInput[]
    createMany?: LampiranDokumenCreateManyTransaksiInputEnvelope
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
  }

  export type SpptCreateNestedManyWithoutTransaksi_asalInput = {
    create?: XOR<SpptCreateWithoutTransaksi_asalInput, SpptUncheckedCreateWithoutTransaksi_asalInput> | SpptCreateWithoutTransaksi_asalInput[] | SpptUncheckedCreateWithoutTransaksi_asalInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutTransaksi_asalInput | SpptCreateOrConnectWithoutTransaksi_asalInput[]
    createMany?: SpptCreateManyTransaksi_asalInputEnvelope
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
  }

  export type DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutTransaksiInput, DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput> | DetailTransaksiAsalCreateWithoutTransaksiInput[] | DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput | DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput[]
    createMany?: DetailTransaksiAsalCreateManyTransaksiInputEnvelope
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
  }

  export type DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput> | DetailTransaksiTujuanCreateWithoutTransaksiInput[] | DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput | DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput[]
    createMany?: DetailTransaksiTujuanCreateManyTransaksiInputEnvelope
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
  }

  export type LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<LampiranDokumenCreateWithoutTransaksiInput, LampiranDokumenUncheckedCreateWithoutTransaksiInput> | LampiranDokumenCreateWithoutTransaksiInput[] | LampiranDokumenUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutTransaksiInput | LampiranDokumenCreateOrConnectWithoutTransaksiInput[]
    createMany?: LampiranDokumenCreateManyTransaksiInputEnvelope
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
  }

  export type SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput = {
    create?: XOR<SpptCreateWithoutTransaksi_asalInput, SpptUncheckedCreateWithoutTransaksi_asalInput> | SpptCreateWithoutTransaksi_asalInput[] | SpptUncheckedCreateWithoutTransaksi_asalInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutTransaksi_asalInput | SpptCreateOrConnectWithoutTransaksi_asalInput[]
    createMany?: SpptCreateManyTransaksi_asalInputEnvelope
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
  }

  export type EnumJenisTransaksiFieldUpdateOperationsInput = {
    set?: $Enums.JenisTransaksi
  }

  export type EnumStatusAjuanFieldUpdateOperationsInput = {
    set?: $Enums.StatusAjuan
  }

  export type UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput = {
    create?: XOR<UserCreateWithoutTransaksi_diajukanInput, UserUncheckedCreateWithoutTransaksi_diajukanInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransaksi_diajukanInput
    upsert?: UserUpsertWithoutTransaksi_diajukanInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransaksi_diajukanInput, UserUpdateWithoutTransaksi_diajukanInput>, UserUncheckedUpdateWithoutTransaksi_diajukanInput>
  }

  export type UserUpdateOneWithoutTransaksi_diverifikasiNestedInput = {
    create?: XOR<UserCreateWithoutTransaksi_diverifikasiInput, UserUncheckedCreateWithoutTransaksi_diverifikasiInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransaksi_diverifikasiInput
    upsert?: UserUpsertWithoutTransaksi_diverifikasiInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransaksi_diverifikasiInput, UserUpdateWithoutTransaksi_diverifikasiInput>, UserUncheckedUpdateWithoutTransaksi_diverifikasiInput>
  }

  export type ObjekPajakUpdateOneWithoutTransaksiNestedInput = {
    create?: XOR<ObjekPajakCreateWithoutTransaksiInput, ObjekPajakUncheckedCreateWithoutTransaksiInput>
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutTransaksiInput
    upsert?: ObjekPajakUpsertWithoutTransaksiInput
    disconnect?: ObjekPajakWhereInput | boolean
    delete?: ObjekPajakWhereInput | boolean
    connect?: ObjekPajakWhereUniqueInput
    update?: XOR<XOR<ObjekPajakUpdateToOneWithWhereWithoutTransaksiInput, ObjekPajakUpdateWithoutTransaksiInput>, ObjekPajakUncheckedUpdateWithoutTransaksiInput>
  }

  export type DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutTransaksiInput, DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput> | DetailTransaksiAsalCreateWithoutTransaksiInput[] | DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput | DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput[]
    upsert?: DetailTransaksiAsalUpsertWithWhereUniqueWithoutTransaksiInput | DetailTransaksiAsalUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: DetailTransaksiAsalCreateManyTransaksiInputEnvelope
    set?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    disconnect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    delete?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    update?: DetailTransaksiAsalUpdateWithWhereUniqueWithoutTransaksiInput | DetailTransaksiAsalUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: DetailTransaksiAsalUpdateManyWithWhereWithoutTransaksiInput | DetailTransaksiAsalUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: DetailTransaksiAsalScalarWhereInput | DetailTransaksiAsalScalarWhereInput[]
  }

  export type DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput> | DetailTransaksiTujuanCreateWithoutTransaksiInput[] | DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput | DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput[]
    upsert?: DetailTransaksiTujuanUpsertWithWhereUniqueWithoutTransaksiInput | DetailTransaksiTujuanUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: DetailTransaksiTujuanCreateManyTransaksiInputEnvelope
    set?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    disconnect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    delete?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    update?: DetailTransaksiTujuanUpdateWithWhereUniqueWithoutTransaksiInput | DetailTransaksiTujuanUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: DetailTransaksiTujuanUpdateManyWithWhereWithoutTransaksiInput | DetailTransaksiTujuanUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: DetailTransaksiTujuanScalarWhereInput | DetailTransaksiTujuanScalarWhereInput[]
  }

  export type LampiranDokumenUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<LampiranDokumenCreateWithoutTransaksiInput, LampiranDokumenUncheckedCreateWithoutTransaksiInput> | LampiranDokumenCreateWithoutTransaksiInput[] | LampiranDokumenUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutTransaksiInput | LampiranDokumenCreateOrConnectWithoutTransaksiInput[]
    upsert?: LampiranDokumenUpsertWithWhereUniqueWithoutTransaksiInput | LampiranDokumenUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: LampiranDokumenCreateManyTransaksiInputEnvelope
    set?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    disconnect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    delete?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    update?: LampiranDokumenUpdateWithWhereUniqueWithoutTransaksiInput | LampiranDokumenUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: LampiranDokumenUpdateManyWithWhereWithoutTransaksiInput | LampiranDokumenUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: LampiranDokumenScalarWhereInput | LampiranDokumenScalarWhereInput[]
  }

  export type SpptUpdateManyWithoutTransaksi_asalNestedInput = {
    create?: XOR<SpptCreateWithoutTransaksi_asalInput, SpptUncheckedCreateWithoutTransaksi_asalInput> | SpptCreateWithoutTransaksi_asalInput[] | SpptUncheckedCreateWithoutTransaksi_asalInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutTransaksi_asalInput | SpptCreateOrConnectWithoutTransaksi_asalInput[]
    upsert?: SpptUpsertWithWhereUniqueWithoutTransaksi_asalInput | SpptUpsertWithWhereUniqueWithoutTransaksi_asalInput[]
    createMany?: SpptCreateManyTransaksi_asalInputEnvelope
    set?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    disconnect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    delete?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    update?: SpptUpdateWithWhereUniqueWithoutTransaksi_asalInput | SpptUpdateWithWhereUniqueWithoutTransaksi_asalInput[]
    updateMany?: SpptUpdateManyWithWhereWithoutTransaksi_asalInput | SpptUpdateManyWithWhereWithoutTransaksi_asalInput[]
    deleteMany?: SpptScalarWhereInput | SpptScalarWhereInput[]
  }

  export type DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<DetailTransaksiAsalCreateWithoutTransaksiInput, DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput> | DetailTransaksiAsalCreateWithoutTransaksiInput[] | DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput | DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput[]
    upsert?: DetailTransaksiAsalUpsertWithWhereUniqueWithoutTransaksiInput | DetailTransaksiAsalUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: DetailTransaksiAsalCreateManyTransaksiInputEnvelope
    set?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    disconnect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    delete?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    connect?: DetailTransaksiAsalWhereUniqueInput | DetailTransaksiAsalWhereUniqueInput[]
    update?: DetailTransaksiAsalUpdateWithWhereUniqueWithoutTransaksiInput | DetailTransaksiAsalUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: DetailTransaksiAsalUpdateManyWithWhereWithoutTransaksiInput | DetailTransaksiAsalUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: DetailTransaksiAsalScalarWhereInput | DetailTransaksiAsalScalarWhereInput[]
  }

  export type DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<DetailTransaksiTujuanCreateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput> | DetailTransaksiTujuanCreateWithoutTransaksiInput[] | DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput | DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput[]
    upsert?: DetailTransaksiTujuanUpsertWithWhereUniqueWithoutTransaksiInput | DetailTransaksiTujuanUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: DetailTransaksiTujuanCreateManyTransaksiInputEnvelope
    set?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    disconnect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    delete?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    connect?: DetailTransaksiTujuanWhereUniqueInput | DetailTransaksiTujuanWhereUniqueInput[]
    update?: DetailTransaksiTujuanUpdateWithWhereUniqueWithoutTransaksiInput | DetailTransaksiTujuanUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: DetailTransaksiTujuanUpdateManyWithWhereWithoutTransaksiInput | DetailTransaksiTujuanUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: DetailTransaksiTujuanScalarWhereInput | DetailTransaksiTujuanScalarWhereInput[]
  }

  export type LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<LampiranDokumenCreateWithoutTransaksiInput, LampiranDokumenUncheckedCreateWithoutTransaksiInput> | LampiranDokumenCreateWithoutTransaksiInput[] | LampiranDokumenUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutTransaksiInput | LampiranDokumenCreateOrConnectWithoutTransaksiInput[]
    upsert?: LampiranDokumenUpsertWithWhereUniqueWithoutTransaksiInput | LampiranDokumenUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: LampiranDokumenCreateManyTransaksiInputEnvelope
    set?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    disconnect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    delete?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    update?: LampiranDokumenUpdateWithWhereUniqueWithoutTransaksiInput | LampiranDokumenUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: LampiranDokumenUpdateManyWithWhereWithoutTransaksiInput | LampiranDokumenUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: LampiranDokumenScalarWhereInput | LampiranDokumenScalarWhereInput[]
  }

  export type SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput = {
    create?: XOR<SpptCreateWithoutTransaksi_asalInput, SpptUncheckedCreateWithoutTransaksi_asalInput> | SpptCreateWithoutTransaksi_asalInput[] | SpptUncheckedCreateWithoutTransaksi_asalInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutTransaksi_asalInput | SpptCreateOrConnectWithoutTransaksi_asalInput[]
    upsert?: SpptUpsertWithWhereUniqueWithoutTransaksi_asalInput | SpptUpsertWithWhereUniqueWithoutTransaksi_asalInput[]
    createMany?: SpptCreateManyTransaksi_asalInputEnvelope
    set?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    disconnect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    delete?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    update?: SpptUpdateWithWhereUniqueWithoutTransaksi_asalInput | SpptUpdateWithWhereUniqueWithoutTransaksi_asalInput[]
    updateMany?: SpptUpdateManyWithWhereWithoutTransaksi_asalInput | SpptUpdateManyWithWhereWithoutTransaksi_asalInput[]
    deleteMany?: SpptScalarWhereInput | SpptScalarWhereInput[]
  }

  export type TransaksiSpopCreateNestedOneWithoutDetail_asalInput = {
    create?: XOR<TransaksiSpopCreateWithoutDetail_asalInput, TransaksiSpopUncheckedCreateWithoutDetail_asalInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutDetail_asalInput
    connect?: TransaksiSpopWhereUniqueInput
  }

  export type ObjekPajakCreateNestedOneWithoutDetail_asalInput = {
    create?: XOR<ObjekPajakCreateWithoutDetail_asalInput, ObjekPajakUncheckedCreateWithoutDetail_asalInput>
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutDetail_asalInput
    connect?: ObjekPajakWhereUniqueInput
  }

  export type TransaksiSpopUpdateOneRequiredWithoutDetail_asalNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutDetail_asalInput, TransaksiSpopUncheckedCreateWithoutDetail_asalInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutDetail_asalInput
    upsert?: TransaksiSpopUpsertWithoutDetail_asalInput
    connect?: TransaksiSpopWhereUniqueInput
    update?: XOR<XOR<TransaksiSpopUpdateToOneWithWhereWithoutDetail_asalInput, TransaksiSpopUpdateWithoutDetail_asalInput>, TransaksiSpopUncheckedUpdateWithoutDetail_asalInput>
  }

  export type ObjekPajakUpdateOneWithoutDetail_asalNestedInput = {
    create?: XOR<ObjekPajakCreateWithoutDetail_asalInput, ObjekPajakUncheckedCreateWithoutDetail_asalInput>
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutDetail_asalInput
    upsert?: ObjekPajakUpsertWithoutDetail_asalInput
    disconnect?: ObjekPajakWhereInput | boolean
    delete?: ObjekPajakWhereInput | boolean
    connect?: ObjekPajakWhereUniqueInput
    update?: XOR<XOR<ObjekPajakUpdateToOneWithWhereWithoutDetail_asalInput, ObjekPajakUpdateWithoutDetail_asalInput>, ObjekPajakUncheckedUpdateWithoutDetail_asalInput>
  }

  export type TransaksiSpopCreateNestedOneWithoutDetail_tujuanInput = {
    create?: XOR<TransaksiSpopCreateWithoutDetail_tujuanInput, TransaksiSpopUncheckedCreateWithoutDetail_tujuanInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutDetail_tujuanInput
    connect?: TransaksiSpopWhereUniqueInput
  }

  export type SubjekPajakCreateNestedOneWithoutDetail_tujuanInput = {
    create?: XOR<SubjekPajakCreateWithoutDetail_tujuanInput, SubjekPajakUncheckedCreateWithoutDetail_tujuanInput>
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutDetail_tujuanInput
    connect?: SubjekPajakWhereUniqueInput
  }

  export type TransaksiSpopUpdateOneRequiredWithoutDetail_tujuanNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutDetail_tujuanInput, TransaksiSpopUncheckedCreateWithoutDetail_tujuanInput>
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutDetail_tujuanInput
    upsert?: TransaksiSpopUpsertWithoutDetail_tujuanInput
    connect?: TransaksiSpopWhereUniqueInput
    update?: XOR<XOR<TransaksiSpopUpdateToOneWithWhereWithoutDetail_tujuanInput, TransaksiSpopUpdateWithoutDetail_tujuanInput>, TransaksiSpopUncheckedUpdateWithoutDetail_tujuanInput>
  }

  export type SubjekPajakUpdateOneRequiredWithoutDetail_tujuanNestedInput = {
    create?: XOR<SubjekPajakCreateWithoutDetail_tujuanInput, SubjekPajakUncheckedCreateWithoutDetail_tujuanInput>
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutDetail_tujuanInput
    upsert?: SubjekPajakUpsertWithoutDetail_tujuanInput
    connect?: SubjekPajakWhereUniqueInput
    update?: XOR<XOR<SubjekPajakUpdateToOneWithWhereWithoutDetail_tujuanInput, SubjekPajakUpdateWithoutDetail_tujuanInput>, SubjekPajakUncheckedUpdateWithoutDetail_tujuanInput>
  }

  export type WilayahCreateNestedOneWithoutUsersInput = {
    create?: XOR<WilayahCreateWithoutUsersInput, WilayahUncheckedCreateWithoutUsersInput>
    connectOrCreate?: WilayahCreateOrConnectWithoutUsersInput
    connect?: WilayahWhereUniqueInput
  }

  export type SubjekPajakCreateNestedManyWithoutUserInput = {
    create?: XOR<SubjekPajakCreateWithoutUserInput, SubjekPajakUncheckedCreateWithoutUserInput> | SubjekPajakCreateWithoutUserInput[] | SubjekPajakUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutUserInput | SubjekPajakCreateOrConnectWithoutUserInput[]
    createMany?: SubjekPajakCreateManyUserInputEnvelope
    connect?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
  }

  export type ObjekPajakCreateNestedManyWithoutUser_nonaktifInput = {
    create?: XOR<ObjekPajakCreateWithoutUser_nonaktifInput, ObjekPajakUncheckedCreateWithoutUser_nonaktifInput> | ObjekPajakCreateWithoutUser_nonaktifInput[] | ObjekPajakUncheckedCreateWithoutUser_nonaktifInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutUser_nonaktifInput | ObjekPajakCreateOrConnectWithoutUser_nonaktifInput[]
    createMany?: ObjekPajakCreateManyUser_nonaktifInputEnvelope
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
  }

  export type TransaksiSpopCreateNestedManyWithoutPengajuInput = {
    create?: XOR<TransaksiSpopCreateWithoutPengajuInput, TransaksiSpopUncheckedCreateWithoutPengajuInput> | TransaksiSpopCreateWithoutPengajuInput[] | TransaksiSpopUncheckedCreateWithoutPengajuInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutPengajuInput | TransaksiSpopCreateOrConnectWithoutPengajuInput[]
    createMany?: TransaksiSpopCreateManyPengajuInputEnvelope
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
  }

  export type TransaksiSpopCreateNestedManyWithoutVerifikatorInput = {
    create?: XOR<TransaksiSpopCreateWithoutVerifikatorInput, TransaksiSpopUncheckedCreateWithoutVerifikatorInput> | TransaksiSpopCreateWithoutVerifikatorInput[] | TransaksiSpopUncheckedCreateWithoutVerifikatorInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutVerifikatorInput | TransaksiSpopCreateOrConnectWithoutVerifikatorInput[]
    createMany?: TransaksiSpopCreateManyVerifikatorInputEnvelope
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
  }

  export type LampiranDokumenCreateNestedManyWithoutUploaderInput = {
    create?: XOR<LampiranDokumenCreateWithoutUploaderInput, LampiranDokumenUncheckedCreateWithoutUploaderInput> | LampiranDokumenCreateWithoutUploaderInput[] | LampiranDokumenUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutUploaderInput | LampiranDokumenCreateOrConnectWithoutUploaderInput[]
    createMany?: LampiranDokumenCreateManyUploaderInputEnvelope
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
  }

  export type SpptCreateNestedManyWithoutGeneratorInput = {
    create?: XOR<SpptCreateWithoutGeneratorInput, SpptUncheckedCreateWithoutGeneratorInput> | SpptCreateWithoutGeneratorInput[] | SpptUncheckedCreateWithoutGeneratorInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutGeneratorInput | SpptCreateOrConnectWithoutGeneratorInput[]
    createMany?: SpptCreateManyGeneratorInputEnvelope
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
  }

  export type SubjekPajakUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SubjekPajakCreateWithoutUserInput, SubjekPajakUncheckedCreateWithoutUserInput> | SubjekPajakCreateWithoutUserInput[] | SubjekPajakUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutUserInput | SubjekPajakCreateOrConnectWithoutUserInput[]
    createMany?: SubjekPajakCreateManyUserInputEnvelope
    connect?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
  }

  export type ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput = {
    create?: XOR<ObjekPajakCreateWithoutUser_nonaktifInput, ObjekPajakUncheckedCreateWithoutUser_nonaktifInput> | ObjekPajakCreateWithoutUser_nonaktifInput[] | ObjekPajakUncheckedCreateWithoutUser_nonaktifInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutUser_nonaktifInput | ObjekPajakCreateOrConnectWithoutUser_nonaktifInput[]
    createMany?: ObjekPajakCreateManyUser_nonaktifInputEnvelope
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
  }

  export type TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput = {
    create?: XOR<TransaksiSpopCreateWithoutPengajuInput, TransaksiSpopUncheckedCreateWithoutPengajuInput> | TransaksiSpopCreateWithoutPengajuInput[] | TransaksiSpopUncheckedCreateWithoutPengajuInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutPengajuInput | TransaksiSpopCreateOrConnectWithoutPengajuInput[]
    createMany?: TransaksiSpopCreateManyPengajuInputEnvelope
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
  }

  export type TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput = {
    create?: XOR<TransaksiSpopCreateWithoutVerifikatorInput, TransaksiSpopUncheckedCreateWithoutVerifikatorInput> | TransaksiSpopCreateWithoutVerifikatorInput[] | TransaksiSpopUncheckedCreateWithoutVerifikatorInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutVerifikatorInput | TransaksiSpopCreateOrConnectWithoutVerifikatorInput[]
    createMany?: TransaksiSpopCreateManyVerifikatorInputEnvelope
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
  }

  export type LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput = {
    create?: XOR<LampiranDokumenCreateWithoutUploaderInput, LampiranDokumenUncheckedCreateWithoutUploaderInput> | LampiranDokumenCreateWithoutUploaderInput[] | LampiranDokumenUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutUploaderInput | LampiranDokumenCreateOrConnectWithoutUploaderInput[]
    createMany?: LampiranDokumenCreateManyUploaderInputEnvelope
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
  }

  export type SpptUncheckedCreateNestedManyWithoutGeneratorInput = {
    create?: XOR<SpptCreateWithoutGeneratorInput, SpptUncheckedCreateWithoutGeneratorInput> | SpptCreateWithoutGeneratorInput[] | SpptUncheckedCreateWithoutGeneratorInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutGeneratorInput | SpptCreateOrConnectWithoutGeneratorInput[]
    createMany?: SpptCreateManyGeneratorInputEnvelope
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type WilayahUpdateOneWithoutUsersNestedInput = {
    create?: XOR<WilayahCreateWithoutUsersInput, WilayahUncheckedCreateWithoutUsersInput>
    connectOrCreate?: WilayahCreateOrConnectWithoutUsersInput
    upsert?: WilayahUpsertWithoutUsersInput
    disconnect?: WilayahWhereInput | boolean
    delete?: WilayahWhereInput | boolean
    connect?: WilayahWhereUniqueInput
    update?: XOR<XOR<WilayahUpdateToOneWithWhereWithoutUsersInput, WilayahUpdateWithoutUsersInput>, WilayahUncheckedUpdateWithoutUsersInput>
  }

  export type SubjekPajakUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubjekPajakCreateWithoutUserInput, SubjekPajakUncheckedCreateWithoutUserInput> | SubjekPajakCreateWithoutUserInput[] | SubjekPajakUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutUserInput | SubjekPajakCreateOrConnectWithoutUserInput[]
    upsert?: SubjekPajakUpsertWithWhereUniqueWithoutUserInput | SubjekPajakUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubjekPajakCreateManyUserInputEnvelope
    set?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    disconnect?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    delete?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    connect?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    update?: SubjekPajakUpdateWithWhereUniqueWithoutUserInput | SubjekPajakUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubjekPajakUpdateManyWithWhereWithoutUserInput | SubjekPajakUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubjekPajakScalarWhereInput | SubjekPajakScalarWhereInput[]
  }

  export type ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput = {
    create?: XOR<ObjekPajakCreateWithoutUser_nonaktifInput, ObjekPajakUncheckedCreateWithoutUser_nonaktifInput> | ObjekPajakCreateWithoutUser_nonaktifInput[] | ObjekPajakUncheckedCreateWithoutUser_nonaktifInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutUser_nonaktifInput | ObjekPajakCreateOrConnectWithoutUser_nonaktifInput[]
    upsert?: ObjekPajakUpsertWithWhereUniqueWithoutUser_nonaktifInput | ObjekPajakUpsertWithWhereUniqueWithoutUser_nonaktifInput[]
    createMany?: ObjekPajakCreateManyUser_nonaktifInputEnvelope
    set?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    disconnect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    delete?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    update?: ObjekPajakUpdateWithWhereUniqueWithoutUser_nonaktifInput | ObjekPajakUpdateWithWhereUniqueWithoutUser_nonaktifInput[]
    updateMany?: ObjekPajakUpdateManyWithWhereWithoutUser_nonaktifInput | ObjekPajakUpdateManyWithWhereWithoutUser_nonaktifInput[]
    deleteMany?: ObjekPajakScalarWhereInput | ObjekPajakScalarWhereInput[]
  }

  export type TransaksiSpopUpdateManyWithoutPengajuNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutPengajuInput, TransaksiSpopUncheckedCreateWithoutPengajuInput> | TransaksiSpopCreateWithoutPengajuInput[] | TransaksiSpopUncheckedCreateWithoutPengajuInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutPengajuInput | TransaksiSpopCreateOrConnectWithoutPengajuInput[]
    upsert?: TransaksiSpopUpsertWithWhereUniqueWithoutPengajuInput | TransaksiSpopUpsertWithWhereUniqueWithoutPengajuInput[]
    createMany?: TransaksiSpopCreateManyPengajuInputEnvelope
    set?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    disconnect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    delete?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    update?: TransaksiSpopUpdateWithWhereUniqueWithoutPengajuInput | TransaksiSpopUpdateWithWhereUniqueWithoutPengajuInput[]
    updateMany?: TransaksiSpopUpdateManyWithWhereWithoutPengajuInput | TransaksiSpopUpdateManyWithWhereWithoutPengajuInput[]
    deleteMany?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
  }

  export type TransaksiSpopUpdateManyWithoutVerifikatorNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutVerifikatorInput, TransaksiSpopUncheckedCreateWithoutVerifikatorInput> | TransaksiSpopCreateWithoutVerifikatorInput[] | TransaksiSpopUncheckedCreateWithoutVerifikatorInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutVerifikatorInput | TransaksiSpopCreateOrConnectWithoutVerifikatorInput[]
    upsert?: TransaksiSpopUpsertWithWhereUniqueWithoutVerifikatorInput | TransaksiSpopUpsertWithWhereUniqueWithoutVerifikatorInput[]
    createMany?: TransaksiSpopCreateManyVerifikatorInputEnvelope
    set?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    disconnect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    delete?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    update?: TransaksiSpopUpdateWithWhereUniqueWithoutVerifikatorInput | TransaksiSpopUpdateWithWhereUniqueWithoutVerifikatorInput[]
    updateMany?: TransaksiSpopUpdateManyWithWhereWithoutVerifikatorInput | TransaksiSpopUpdateManyWithWhereWithoutVerifikatorInput[]
    deleteMany?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
  }

  export type LampiranDokumenUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<LampiranDokumenCreateWithoutUploaderInput, LampiranDokumenUncheckedCreateWithoutUploaderInput> | LampiranDokumenCreateWithoutUploaderInput[] | LampiranDokumenUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutUploaderInput | LampiranDokumenCreateOrConnectWithoutUploaderInput[]
    upsert?: LampiranDokumenUpsertWithWhereUniqueWithoutUploaderInput | LampiranDokumenUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: LampiranDokumenCreateManyUploaderInputEnvelope
    set?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    disconnect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    delete?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    update?: LampiranDokumenUpdateWithWhereUniqueWithoutUploaderInput | LampiranDokumenUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: LampiranDokumenUpdateManyWithWhereWithoutUploaderInput | LampiranDokumenUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: LampiranDokumenScalarWhereInput | LampiranDokumenScalarWhereInput[]
  }

  export type SpptUpdateManyWithoutGeneratorNestedInput = {
    create?: XOR<SpptCreateWithoutGeneratorInput, SpptUncheckedCreateWithoutGeneratorInput> | SpptCreateWithoutGeneratorInput[] | SpptUncheckedCreateWithoutGeneratorInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutGeneratorInput | SpptCreateOrConnectWithoutGeneratorInput[]
    upsert?: SpptUpsertWithWhereUniqueWithoutGeneratorInput | SpptUpsertWithWhereUniqueWithoutGeneratorInput[]
    createMany?: SpptCreateManyGeneratorInputEnvelope
    set?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    disconnect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    delete?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    update?: SpptUpdateWithWhereUniqueWithoutGeneratorInput | SpptUpdateWithWhereUniqueWithoutGeneratorInput[]
    updateMany?: SpptUpdateManyWithWhereWithoutGeneratorInput | SpptUpdateManyWithWhereWithoutGeneratorInput[]
    deleteMany?: SpptScalarWhereInput | SpptScalarWhereInput[]
  }

  export type SubjekPajakUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubjekPajakCreateWithoutUserInput, SubjekPajakUncheckedCreateWithoutUserInput> | SubjekPajakCreateWithoutUserInput[] | SubjekPajakUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubjekPajakCreateOrConnectWithoutUserInput | SubjekPajakCreateOrConnectWithoutUserInput[]
    upsert?: SubjekPajakUpsertWithWhereUniqueWithoutUserInput | SubjekPajakUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubjekPajakCreateManyUserInputEnvelope
    set?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    disconnect?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    delete?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    connect?: SubjekPajakWhereUniqueInput | SubjekPajakWhereUniqueInput[]
    update?: SubjekPajakUpdateWithWhereUniqueWithoutUserInput | SubjekPajakUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubjekPajakUpdateManyWithWhereWithoutUserInput | SubjekPajakUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubjekPajakScalarWhereInput | SubjekPajakScalarWhereInput[]
  }

  export type ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput = {
    create?: XOR<ObjekPajakCreateWithoutUser_nonaktifInput, ObjekPajakUncheckedCreateWithoutUser_nonaktifInput> | ObjekPajakCreateWithoutUser_nonaktifInput[] | ObjekPajakUncheckedCreateWithoutUser_nonaktifInput[]
    connectOrCreate?: ObjekPajakCreateOrConnectWithoutUser_nonaktifInput | ObjekPajakCreateOrConnectWithoutUser_nonaktifInput[]
    upsert?: ObjekPajakUpsertWithWhereUniqueWithoutUser_nonaktifInput | ObjekPajakUpsertWithWhereUniqueWithoutUser_nonaktifInput[]
    createMany?: ObjekPajakCreateManyUser_nonaktifInputEnvelope
    set?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    disconnect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    delete?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    connect?: ObjekPajakWhereUniqueInput | ObjekPajakWhereUniqueInput[]
    update?: ObjekPajakUpdateWithWhereUniqueWithoutUser_nonaktifInput | ObjekPajakUpdateWithWhereUniqueWithoutUser_nonaktifInput[]
    updateMany?: ObjekPajakUpdateManyWithWhereWithoutUser_nonaktifInput | ObjekPajakUpdateManyWithWhereWithoutUser_nonaktifInput[]
    deleteMany?: ObjekPajakScalarWhereInput | ObjekPajakScalarWhereInput[]
  }

  export type TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutPengajuInput, TransaksiSpopUncheckedCreateWithoutPengajuInput> | TransaksiSpopCreateWithoutPengajuInput[] | TransaksiSpopUncheckedCreateWithoutPengajuInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutPengajuInput | TransaksiSpopCreateOrConnectWithoutPengajuInput[]
    upsert?: TransaksiSpopUpsertWithWhereUniqueWithoutPengajuInput | TransaksiSpopUpsertWithWhereUniqueWithoutPengajuInput[]
    createMany?: TransaksiSpopCreateManyPengajuInputEnvelope
    set?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    disconnect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    delete?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    update?: TransaksiSpopUpdateWithWhereUniqueWithoutPengajuInput | TransaksiSpopUpdateWithWhereUniqueWithoutPengajuInput[]
    updateMany?: TransaksiSpopUpdateManyWithWhereWithoutPengajuInput | TransaksiSpopUpdateManyWithWhereWithoutPengajuInput[]
    deleteMany?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
  }

  export type TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput = {
    create?: XOR<TransaksiSpopCreateWithoutVerifikatorInput, TransaksiSpopUncheckedCreateWithoutVerifikatorInput> | TransaksiSpopCreateWithoutVerifikatorInput[] | TransaksiSpopUncheckedCreateWithoutVerifikatorInput[]
    connectOrCreate?: TransaksiSpopCreateOrConnectWithoutVerifikatorInput | TransaksiSpopCreateOrConnectWithoutVerifikatorInput[]
    upsert?: TransaksiSpopUpsertWithWhereUniqueWithoutVerifikatorInput | TransaksiSpopUpsertWithWhereUniqueWithoutVerifikatorInput[]
    createMany?: TransaksiSpopCreateManyVerifikatorInputEnvelope
    set?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    disconnect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    delete?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    connect?: TransaksiSpopWhereUniqueInput | TransaksiSpopWhereUniqueInput[]
    update?: TransaksiSpopUpdateWithWhereUniqueWithoutVerifikatorInput | TransaksiSpopUpdateWithWhereUniqueWithoutVerifikatorInput[]
    updateMany?: TransaksiSpopUpdateManyWithWhereWithoutVerifikatorInput | TransaksiSpopUpdateManyWithWhereWithoutVerifikatorInput[]
    deleteMany?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
  }

  export type LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<LampiranDokumenCreateWithoutUploaderInput, LampiranDokumenUncheckedCreateWithoutUploaderInput> | LampiranDokumenCreateWithoutUploaderInput[] | LampiranDokumenUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: LampiranDokumenCreateOrConnectWithoutUploaderInput | LampiranDokumenCreateOrConnectWithoutUploaderInput[]
    upsert?: LampiranDokumenUpsertWithWhereUniqueWithoutUploaderInput | LampiranDokumenUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: LampiranDokumenCreateManyUploaderInputEnvelope
    set?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    disconnect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    delete?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    connect?: LampiranDokumenWhereUniqueInput | LampiranDokumenWhereUniqueInput[]
    update?: LampiranDokumenUpdateWithWhereUniqueWithoutUploaderInput | LampiranDokumenUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: LampiranDokumenUpdateManyWithWhereWithoutUploaderInput | LampiranDokumenUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: LampiranDokumenScalarWhereInput | LampiranDokumenScalarWhereInput[]
  }

  export type SpptUncheckedUpdateManyWithoutGeneratorNestedInput = {
    create?: XOR<SpptCreateWithoutGeneratorInput, SpptUncheckedCreateWithoutGeneratorInput> | SpptCreateWithoutGeneratorInput[] | SpptUncheckedCreateWithoutGeneratorInput[]
    connectOrCreate?: SpptCreateOrConnectWithoutGeneratorInput | SpptCreateOrConnectWithoutGeneratorInput[]
    upsert?: SpptUpsertWithWhereUniqueWithoutGeneratorInput | SpptUpsertWithWhereUniqueWithoutGeneratorInput[]
    createMany?: SpptCreateManyGeneratorInputEnvelope
    set?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    disconnect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    delete?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    connect?: SpptWhereUniqueInput | SpptWhereUniqueInput[]
    update?: SpptUpdateWithWhereUniqueWithoutGeneratorInput | SpptUpdateWithWhereUniqueWithoutGeneratorInput[]
    updateMany?: SpptUpdateManyWithWhereWithoutGeneratorInput | SpptUpdateManyWithWhereWithoutGeneratorInput[]
    deleteMany?: SpptScalarWhereInput | SpptScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutWilayahInput = {
    create?: XOR<UserCreateWithoutWilayahInput, UserUncheckedCreateWithoutWilayahInput> | UserCreateWithoutWilayahInput[] | UserUncheckedCreateWithoutWilayahInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWilayahInput | UserCreateOrConnectWithoutWilayahInput[]
    createMany?: UserCreateManyWilayahInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutWilayahInput = {
    create?: XOR<UserCreateWithoutWilayahInput, UserUncheckedCreateWithoutWilayahInput> | UserCreateWithoutWilayahInput[] | UserUncheckedCreateWithoutWilayahInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWilayahInput | UserCreateOrConnectWithoutWilayahInput[]
    createMany?: UserCreateManyWilayahInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutWilayahNestedInput = {
    create?: XOR<UserCreateWithoutWilayahInput, UserUncheckedCreateWithoutWilayahInput> | UserCreateWithoutWilayahInput[] | UserUncheckedCreateWithoutWilayahInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWilayahInput | UserCreateOrConnectWithoutWilayahInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutWilayahInput | UserUpsertWithWhereUniqueWithoutWilayahInput[]
    createMany?: UserCreateManyWilayahInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutWilayahInput | UserUpdateWithWhereUniqueWithoutWilayahInput[]
    updateMany?: UserUpdateManyWithWhereWithoutWilayahInput | UserUpdateManyWithWhereWithoutWilayahInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutWilayahNestedInput = {
    create?: XOR<UserCreateWithoutWilayahInput, UserUncheckedCreateWithoutWilayahInput> | UserCreateWithoutWilayahInput[] | UserUncheckedCreateWithoutWilayahInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWilayahInput | UserCreateOrConnectWithoutWilayahInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutWilayahInput | UserUpsertWithWhereUniqueWithoutWilayahInput[]
    createMany?: UserCreateManyWilayahInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutWilayahInput | UserUpdateWithWhereUniqueWithoutWilayahInput[]
    updateMany?: UserUpdateManyWithWhereWithoutWilayahInput | UserUpdateManyWithWhereWithoutWilayahInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumJenisDokumenFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisDokumen | EnumJenisDokumenFieldRefInput<$PrismaModel>
    in?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisDokumenFilter<$PrismaModel> | $Enums.JenisDokumen
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumJenisDokumenWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisDokumen | EnumJenisDokumenFieldRefInput<$PrismaModel>
    in?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisDokumen[] | ListEnumJenisDokumenFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisDokumenWithAggregatesFilter<$PrismaModel> | $Enums.JenisDokumen
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisDokumenFilter<$PrismaModel>
    _max?: NestedEnumJenisDokumenFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumJenisTanahFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTanah | EnumJenisTanahFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTanahFilter<$PrismaModel> | $Enums.JenisTanah
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumJenisTanahWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTanah | EnumJenisTanahFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTanah[] | ListEnumJenisTanahFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTanahWithAggregatesFilter<$PrismaModel> | $Enums.JenisTanah
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTanahFilter<$PrismaModel>
    _max?: NestedEnumJenisTanahFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumStatusBayarFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBayar | EnumStatusBayarFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBayarFilter<$PrismaModel> | $Enums.StatusBayar
  }

  export type NestedEnumStatusBayarWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusBayar | EnumStatusBayarFieldRefInput<$PrismaModel>
    in?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusBayar[] | ListEnumStatusBayarFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusBayarWithAggregatesFilter<$PrismaModel> | $Enums.StatusBayar
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusBayarFilter<$PrismaModel>
    _max?: NestedEnumStatusBayarFilter<$PrismaModel>
  }

  export type NestedEnumStatusWpFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusWp | EnumStatusWpFieldRefInput<$PrismaModel>
    in?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWpFilter<$PrismaModel> | $Enums.StatusWp
  }

  export type NestedEnumPekerjaanFilter<$PrismaModel = never> = {
    equals?: $Enums.Pekerjaan | EnumPekerjaanFieldRefInput<$PrismaModel>
    in?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    not?: NestedEnumPekerjaanFilter<$PrismaModel> | $Enums.Pekerjaan
  }

  export type NestedEnumStatusWpWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusWp | EnumStatusWpFieldRefInput<$PrismaModel>
    in?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusWp[] | ListEnumStatusWpFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWpWithAggregatesFilter<$PrismaModel> | $Enums.StatusWp
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusWpFilter<$PrismaModel>
    _max?: NestedEnumStatusWpFilter<$PrismaModel>
  }

  export type NestedEnumPekerjaanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Pekerjaan | EnumPekerjaanFieldRefInput<$PrismaModel>
    in?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pekerjaan[] | ListEnumPekerjaanFieldRefInput<$PrismaModel>
    not?: NestedEnumPekerjaanWithAggregatesFilter<$PrismaModel> | $Enums.Pekerjaan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPekerjaanFilter<$PrismaModel>
    _max?: NestedEnumPekerjaanFilter<$PrismaModel>
  }

  export type NestedEnumJenisTransaksiFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiFilter<$PrismaModel> | $Enums.JenisTransaksi
  }

  export type NestedEnumStatusAjuanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAjuan | EnumStatusAjuanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAjuanFilter<$PrismaModel> | $Enums.StatusAjuan
  }

  export type NestedEnumJenisTransaksiWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiWithAggregatesFilter<$PrismaModel> | $Enums.JenisTransaksi
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTransaksiFilter<$PrismaModel>
    _max?: NestedEnumJenisTransaksiFilter<$PrismaModel>
  }

  export type NestedEnumStatusAjuanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAjuan | EnumStatusAjuanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAjuan[] | ListEnumStatusAjuanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAjuanWithAggregatesFilter<$PrismaModel> | $Enums.StatusAjuan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAjuanFilter<$PrismaModel>
    _max?: NestedEnumStatusAjuanFilter<$PrismaModel>
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type TransaksiSpopCreateWithoutLampiranInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pengaju: UserCreateNestedOneWithoutTransaksi_diajukanInput
    verifikator?: UserCreateNestedOneWithoutTransaksi_diverifikasiInput
    objek_bersama?: ObjekPajakCreateNestedOneWithoutTransaksiInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput
    sppt?: SpptCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUncheckedCreateWithoutLampiranInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput
    sppt?: SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopCreateOrConnectWithoutLampiranInput = {
    where: TransaksiSpopWhereUniqueInput
    create: XOR<TransaksiSpopCreateWithoutLampiranInput, TransaksiSpopUncheckedCreateWithoutLampiranInput>
  }

  export type UserCreateWithoutLampiran_diuploadInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    wilayah?: WilayahCreateNestedOneWithoutUsersInput
    subjek_pajak_dibuat?: SubjekPajakCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopCreateNestedManyWithoutVerifikatorInput
    sppt_digenerate?: SpptCreateNestedManyWithoutGeneratorInput
  }

  export type UserUncheckedCreateWithoutLampiran_diuploadInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput
    sppt_digenerate?: SpptUncheckedCreateNestedManyWithoutGeneratorInput
  }

  export type UserCreateOrConnectWithoutLampiran_diuploadInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLampiran_diuploadInput, UserUncheckedCreateWithoutLampiran_diuploadInput>
  }

  export type TransaksiSpopUpsertWithoutLampiranInput = {
    update: XOR<TransaksiSpopUpdateWithoutLampiranInput, TransaksiSpopUncheckedUpdateWithoutLampiranInput>
    create: XOR<TransaksiSpopCreateWithoutLampiranInput, TransaksiSpopUncheckedCreateWithoutLampiranInput>
    where?: TransaksiSpopWhereInput
  }

  export type TransaksiSpopUpdateToOneWithWhereWithoutLampiranInput = {
    where?: TransaksiSpopWhereInput
    data: XOR<TransaksiSpopUpdateWithoutLampiranInput, TransaksiSpopUncheckedUpdateWithoutLampiranInput>
  }

  export type TransaksiSpopUpdateWithoutLampiranInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pengaju?: UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput
    verifikator?: UserUpdateOneWithoutTransaksi_diverifikasiNestedInput
    objek_bersama?: ObjekPajakUpdateOneWithoutTransaksiNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateWithoutLampiranInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type UserUpsertWithoutLampiran_diuploadInput = {
    update: XOR<UserUpdateWithoutLampiran_diuploadInput, UserUncheckedUpdateWithoutLampiran_diuploadInput>
    create: XOR<UserCreateWithoutLampiran_diuploadInput, UserUncheckedCreateWithoutLampiran_diuploadInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLampiran_diuploadInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLampiran_diuploadInput, UserUncheckedUpdateWithoutLampiran_diuploadInput>
  }

  export type UserUpdateWithoutLampiran_diuploadInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    wilayah?: WilayahUpdateOneWithoutUsersNestedInput
    subjek_pajak_dibuat?: SubjekPajakUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUpdateManyWithoutVerifikatorNestedInput
    sppt_digenerate?: SpptUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateWithoutLampiran_diuploadInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput
    sppt_digenerate?: SpptUncheckedUpdateManyWithoutGeneratorNestedInput
  }

  export type SubjekPajakCreateWithoutObjek_pajakInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutSubjek_pajak_dibuatInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutCalon_subjekInput
  }

  export type SubjekPajakUncheckedCreateWithoutObjek_pajakInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutCalon_subjekInput
  }

  export type SubjekPajakCreateOrConnectWithoutObjek_pajakInput = {
    where: SubjekPajakWhereUniqueInput
    create: XOR<SubjekPajakCreateWithoutObjek_pajakInput, SubjekPajakUncheckedCreateWithoutObjek_pajakInput>
  }

  export type UserCreateWithoutObjek_nonaktifInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    wilayah?: WilayahCreateNestedOneWithoutUsersInput
    subjek_pajak_dibuat?: SubjekPajakCreateNestedManyWithoutUserInput
    transaksi_diajukan?: TransaksiSpopCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptCreateNestedManyWithoutGeneratorInput
  }

  export type UserUncheckedCreateWithoutObjek_nonaktifInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedCreateNestedManyWithoutUserInput
    transaksi_diajukan?: TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptUncheckedCreateNestedManyWithoutGeneratorInput
  }

  export type UserCreateOrConnectWithoutObjek_nonaktifInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutObjek_nonaktifInput, UserUncheckedCreateWithoutObjek_nonaktifInput>
  }

  export type TransaksiSpopCreateWithoutObjek_bersamaInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pengaju: UserCreateNestedOneWithoutTransaksi_diajukanInput
    verifikator?: UserCreateNestedOneWithoutTransaksi_diverifikasiInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenCreateNestedManyWithoutTransaksiInput
    sppt?: SpptCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput
    sppt?: SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopCreateOrConnectWithoutObjek_bersamaInput = {
    where: TransaksiSpopWhereUniqueInput
    create: XOR<TransaksiSpopCreateWithoutObjek_bersamaInput, TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput>
  }

  export type TransaksiSpopCreateManyObjek_bersamaInputEnvelope = {
    data: TransaksiSpopCreateManyObjek_bersamaInput | TransaksiSpopCreateManyObjek_bersamaInput[]
    skipDuplicates?: boolean
  }

  export type DetailTransaksiAsalCreateWithoutObjek_asalInput = {
    id_detail_asal?: string
    nonaktifkan_saat_disetujui?: boolean
    transaksi: TransaksiSpopCreateNestedOneWithoutDetail_asalInput
  }

  export type DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput = {
    id_detail_asal?: string
    id_transaksi: string
    nonaktifkan_saat_disetujui?: boolean
  }

  export type DetailTransaksiAsalCreateOrConnectWithoutObjek_asalInput = {
    where: DetailTransaksiAsalWhereUniqueInput
    create: XOR<DetailTransaksiAsalCreateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput>
  }

  export type DetailTransaksiAsalCreateManyObjek_asalInputEnvelope = {
    data: DetailTransaksiAsalCreateManyObjek_asalInput | DetailTransaksiAsalCreateManyObjek_asalInput[]
    skipDuplicates?: boolean
  }

  export type SpptCreateWithoutObjek_pajakInput = {
    id_sppt?: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_at?: Date | string
    generator: UserCreateNestedOneWithoutSppt_digenerateInput
    transaksi_asal?: TransaksiSpopCreateNestedOneWithoutSpptInput
  }

  export type SpptUncheckedCreateWithoutObjek_pajakInput = {
    id_sppt?: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_by: string
    generated_at?: Date | string
    id_transaksi_asal?: string | null
  }

  export type SpptCreateOrConnectWithoutObjek_pajakInput = {
    where: SpptWhereUniqueInput
    create: XOR<SpptCreateWithoutObjek_pajakInput, SpptUncheckedCreateWithoutObjek_pajakInput>
  }

  export type SpptCreateManyObjek_pajakInputEnvelope = {
    data: SpptCreateManyObjek_pajakInput | SpptCreateManyObjek_pajakInput[]
    skipDuplicates?: boolean
  }

  export type SubjekPajakUpsertWithoutObjek_pajakInput = {
    update: XOR<SubjekPajakUpdateWithoutObjek_pajakInput, SubjekPajakUncheckedUpdateWithoutObjek_pajakInput>
    create: XOR<SubjekPajakCreateWithoutObjek_pajakInput, SubjekPajakUncheckedCreateWithoutObjek_pajakInput>
    where?: SubjekPajakWhereInput
  }

  export type SubjekPajakUpdateToOneWithWhereWithoutObjek_pajakInput = {
    where?: SubjekPajakWhereInput
    data: XOR<SubjekPajakUpdateWithoutObjek_pajakInput, SubjekPajakUncheckedUpdateWithoutObjek_pajakInput>
  }

  export type SubjekPajakUpdateWithoutObjek_pajakInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubjek_pajak_dibuatNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutCalon_subjekNestedInput
  }

  export type SubjekPajakUncheckedUpdateWithoutObjek_pajakInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutCalon_subjekNestedInput
  }

  export type UserUpsertWithoutObjek_nonaktifInput = {
    update: XOR<UserUpdateWithoutObjek_nonaktifInput, UserUncheckedUpdateWithoutObjek_nonaktifInput>
    create: XOR<UserCreateWithoutObjek_nonaktifInput, UserUncheckedCreateWithoutObjek_nonaktifInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutObjek_nonaktifInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutObjek_nonaktifInput, UserUncheckedUpdateWithoutObjek_nonaktifInput>
  }

  export type UserUpdateWithoutObjek_nonaktifInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    wilayah?: WilayahUpdateOneWithoutUsersNestedInput
    subjek_pajak_dibuat?: SubjekPajakUpdateManyWithoutUserNestedInput
    transaksi_diajukan?: TransaksiSpopUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateWithoutObjek_nonaktifInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedUpdateManyWithoutUserNestedInput
    transaksi_diajukan?: TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUncheckedUpdateManyWithoutGeneratorNestedInput
  }

  export type TransaksiSpopUpsertWithWhereUniqueWithoutObjek_bersamaInput = {
    where: TransaksiSpopWhereUniqueInput
    update: XOR<TransaksiSpopUpdateWithoutObjek_bersamaInput, TransaksiSpopUncheckedUpdateWithoutObjek_bersamaInput>
    create: XOR<TransaksiSpopCreateWithoutObjek_bersamaInput, TransaksiSpopUncheckedCreateWithoutObjek_bersamaInput>
  }

  export type TransaksiSpopUpdateWithWhereUniqueWithoutObjek_bersamaInput = {
    where: TransaksiSpopWhereUniqueInput
    data: XOR<TransaksiSpopUpdateWithoutObjek_bersamaInput, TransaksiSpopUncheckedUpdateWithoutObjek_bersamaInput>
  }

  export type TransaksiSpopUpdateManyWithWhereWithoutObjek_bersamaInput = {
    where: TransaksiSpopScalarWhereInput
    data: XOR<TransaksiSpopUpdateManyMutationInput, TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaInput>
  }

  export type TransaksiSpopScalarWhereInput = {
    AND?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
    OR?: TransaksiSpopScalarWhereInput[]
    NOT?: TransaksiSpopScalarWhereInput | TransaksiSpopScalarWhereInput[]
    id_transaksi?: StringFilter<"TransaksiSpop"> | string
    no_formulir?: StringNullableFilter<"TransaksiSpop"> | string | null
    id_user?: StringFilter<"TransaksiSpop"> | string
    tahun_pajak?: IntFilter<"TransaksiSpop"> | number
    jenis_transaksi?: EnumJenisTransaksiFilter<"TransaksiSpop"> | $Enums.JenisTransaksi
    nop_bersama?: StringNullableFilter<"TransaksiSpop"> | string | null
    no_sppt_lama?: StringNullableFilter<"TransaksiSpop"> | string | null
    nama_pengaju?: StringNullableFilter<"TransaksiSpop"> | string | null
    menggunakan_kuasa?: BoolFilter<"TransaksiSpop"> | boolean
    tanggal_pengajuan?: DateTimeFilter<"TransaksiSpop"> | Date | string
    status_ajuan?: EnumStatusAjuanFilter<"TransaksiSpop"> | $Enums.StatusAjuan
    id_verifikator?: StringNullableFilter<"TransaksiSpop"> | string | null
    verified_at?: DateTimeNullableFilter<"TransaksiSpop"> | Date | string | null
    catatan_bakeuda?: StringNullableFilter<"TransaksiSpop"> | string | null
    created_at?: DateTimeFilter<"TransaksiSpop"> | Date | string
    updated_at?: DateTimeFilter<"TransaksiSpop"> | Date | string
  }

  export type DetailTransaksiAsalUpsertWithWhereUniqueWithoutObjek_asalInput = {
    where: DetailTransaksiAsalWhereUniqueInput
    update: XOR<DetailTransaksiAsalUpdateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedUpdateWithoutObjek_asalInput>
    create: XOR<DetailTransaksiAsalCreateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedCreateWithoutObjek_asalInput>
  }

  export type DetailTransaksiAsalUpdateWithWhereUniqueWithoutObjek_asalInput = {
    where: DetailTransaksiAsalWhereUniqueInput
    data: XOR<DetailTransaksiAsalUpdateWithoutObjek_asalInput, DetailTransaksiAsalUncheckedUpdateWithoutObjek_asalInput>
  }

  export type DetailTransaksiAsalUpdateManyWithWhereWithoutObjek_asalInput = {
    where: DetailTransaksiAsalScalarWhereInput
    data: XOR<DetailTransaksiAsalUpdateManyMutationInput, DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalInput>
  }

  export type DetailTransaksiAsalScalarWhereInput = {
    AND?: DetailTransaksiAsalScalarWhereInput | DetailTransaksiAsalScalarWhereInput[]
    OR?: DetailTransaksiAsalScalarWhereInput[]
    NOT?: DetailTransaksiAsalScalarWhereInput | DetailTransaksiAsalScalarWhereInput[]
    id_detail_asal?: StringFilter<"DetailTransaksiAsal"> | string
    id_transaksi?: StringFilter<"DetailTransaksiAsal"> | string
    nop_asal?: StringNullableFilter<"DetailTransaksiAsal"> | string | null
    nonaktifkan_saat_disetujui?: BoolFilter<"DetailTransaksiAsal"> | boolean
  }

  export type SpptUpsertWithWhereUniqueWithoutObjek_pajakInput = {
    where: SpptWhereUniqueInput
    update: XOR<SpptUpdateWithoutObjek_pajakInput, SpptUncheckedUpdateWithoutObjek_pajakInput>
    create: XOR<SpptCreateWithoutObjek_pajakInput, SpptUncheckedCreateWithoutObjek_pajakInput>
  }

  export type SpptUpdateWithWhereUniqueWithoutObjek_pajakInput = {
    where: SpptWhereUniqueInput
    data: XOR<SpptUpdateWithoutObjek_pajakInput, SpptUncheckedUpdateWithoutObjek_pajakInput>
  }

  export type SpptUpdateManyWithWhereWithoutObjek_pajakInput = {
    where: SpptScalarWhereInput
    data: XOR<SpptUpdateManyMutationInput, SpptUncheckedUpdateManyWithoutObjek_pajakInput>
  }

  export type SpptScalarWhereInput = {
    AND?: SpptScalarWhereInput | SpptScalarWhereInput[]
    OR?: SpptScalarWhereInput[]
    NOT?: SpptScalarWhereInput | SpptScalarWhereInput[]
    id_sppt?: StringFilter<"Sppt"> | string
    nop?: StringFilter<"Sppt"> | string
    tahun_pajak?: IntFilter<"Sppt"> | number
    njop_kena_pajak?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFilter<"Sppt"> | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFilter<"Sppt"> | Date | string
    status_bayar?: EnumStatusBayarFilter<"Sppt"> | $Enums.StatusBayar
    tgl_bayar?: DateTimeNullableFilter<"Sppt"> | Date | string | null
    generated_by?: StringFilter<"Sppt"> | string
    generated_at?: DateTimeFilter<"Sppt"> | Date | string
    id_transaksi_asal?: StringNullableFilter<"Sppt"> | string | null
  }

  export type ObjekPajakCreateWithoutSpptInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    subjek_pajak: SubjekPajakCreateNestedOneWithoutObjek_pajakInput
    user_nonaktif?: UserCreateNestedOneWithoutObjek_nonaktifInput
    transaksi?: TransaksiSpopCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutObjek_asalInput
  }

  export type ObjekPajakUncheckedCreateWithoutSpptInput = {
    nop: string
    nik_subjek: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_oleh?: string | null
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    transaksi?: TransaksiSpopUncheckedCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutObjek_asalInput
  }

  export type ObjekPajakCreateOrConnectWithoutSpptInput = {
    where: ObjekPajakWhereUniqueInput
    create: XOR<ObjekPajakCreateWithoutSpptInput, ObjekPajakUncheckedCreateWithoutSpptInput>
  }

  export type UserCreateWithoutSppt_digenerateInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    wilayah?: WilayahCreateNestedOneWithoutUsersInput
    subjek_pajak_dibuat?: SubjekPajakCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenCreateNestedManyWithoutUploaderInput
  }

  export type UserUncheckedCreateWithoutSppt_digenerateInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput
  }

  export type UserCreateOrConnectWithoutSppt_digenerateInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSppt_digenerateInput, UserUncheckedCreateWithoutSppt_digenerateInput>
  }

  export type TransaksiSpopCreateWithoutSpptInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pengaju: UserCreateNestedOneWithoutTransaksi_diajukanInput
    verifikator?: UserCreateNestedOneWithoutTransaksi_diverifikasiInput
    objek_bersama?: ObjekPajakCreateNestedOneWithoutTransaksiInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiSpopUncheckedCreateWithoutSpptInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiSpopCreateOrConnectWithoutSpptInput = {
    where: TransaksiSpopWhereUniqueInput
    create: XOR<TransaksiSpopCreateWithoutSpptInput, TransaksiSpopUncheckedCreateWithoutSpptInput>
  }

  export type ObjekPajakUpsertWithoutSpptInput = {
    update: XOR<ObjekPajakUpdateWithoutSpptInput, ObjekPajakUncheckedUpdateWithoutSpptInput>
    create: XOR<ObjekPajakCreateWithoutSpptInput, ObjekPajakUncheckedCreateWithoutSpptInput>
    where?: ObjekPajakWhereInput
  }

  export type ObjekPajakUpdateToOneWithWhereWithoutSpptInput = {
    where?: ObjekPajakWhereInput
    data: XOR<ObjekPajakUpdateWithoutSpptInput, ObjekPajakUncheckedUpdateWithoutSpptInput>
  }

  export type ObjekPajakUpdateWithoutSpptInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak?: SubjekPajakUpdateOneRequiredWithoutObjek_pajakNestedInput
    user_nonaktif?: UserUpdateOneWithoutObjek_nonaktifNestedInput
    transaksi?: TransaksiSpopUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutObjek_asalNestedInput
  }

  export type ObjekPajakUncheckedUpdateWithoutSpptInput = {
    nop?: StringFieldUpdateOperationsInput | string
    nik_subjek?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_oleh?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalNestedInput
  }

  export type UserUpsertWithoutSppt_digenerateInput = {
    update: XOR<UserUpdateWithoutSppt_digenerateInput, UserUncheckedUpdateWithoutSppt_digenerateInput>
    create: XOR<UserCreateWithoutSppt_digenerateInput, UserUncheckedCreateWithoutSppt_digenerateInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSppt_digenerateInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSppt_digenerateInput, UserUncheckedUpdateWithoutSppt_digenerateInput>
  }

  export type UserUpdateWithoutSppt_digenerateInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    wilayah?: WilayahUpdateOneWithoutUsersNestedInput
    subjek_pajak_dibuat?: SubjekPajakUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUpdateManyWithoutUploaderNestedInput
  }

  export type UserUncheckedUpdateWithoutSppt_digenerateInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput
  }

  export type TransaksiSpopUpsertWithoutSpptInput = {
    update: XOR<TransaksiSpopUpdateWithoutSpptInput, TransaksiSpopUncheckedUpdateWithoutSpptInput>
    create: XOR<TransaksiSpopCreateWithoutSpptInput, TransaksiSpopUncheckedCreateWithoutSpptInput>
    where?: TransaksiSpopWhereInput
  }

  export type TransaksiSpopUpdateToOneWithWhereWithoutSpptInput = {
    where?: TransaksiSpopWhereInput
    data: XOR<TransaksiSpopUpdateWithoutSpptInput, TransaksiSpopUncheckedUpdateWithoutSpptInput>
  }

  export type TransaksiSpopUpdateWithoutSpptInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pengaju?: UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput
    verifikator?: UserUpdateOneWithoutTransaksi_diverifikasiNestedInput
    objek_bersama?: ObjekPajakUpdateOneWithoutTransaksiNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUpdateManyWithoutTransaksiNestedInput
  }

  export type TransaksiSpopUncheckedUpdateWithoutSpptInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput
  }

  export type UserCreateWithoutSubjek_pajak_dibuatInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    wilayah?: WilayahCreateNestedOneWithoutUsersInput
    objek_nonaktif?: ObjekPajakCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptCreateNestedManyWithoutGeneratorInput
  }

  export type UserUncheckedCreateWithoutSubjek_pajak_dibuatInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    objek_nonaktif?: ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptUncheckedCreateNestedManyWithoutGeneratorInput
  }

  export type UserCreateOrConnectWithoutSubjek_pajak_dibuatInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubjek_pajak_dibuatInput, UserUncheckedCreateWithoutSubjek_pajak_dibuatInput>
  }

  export type ObjekPajakCreateWithoutSubjek_pajakInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    user_nonaktif?: UserCreateNestedOneWithoutObjek_nonaktifInput
    transaksi?: TransaksiSpopCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakUncheckedCreateWithoutSubjek_pajakInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_oleh?: string | null
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    transaksi?: TransaksiSpopUncheckedCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptUncheckedCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakCreateOrConnectWithoutSubjek_pajakInput = {
    where: ObjekPajakWhereUniqueInput
    create: XOR<ObjekPajakCreateWithoutSubjek_pajakInput, ObjekPajakUncheckedCreateWithoutSubjek_pajakInput>
  }

  export type ObjekPajakCreateManySubjek_pajakInputEnvelope = {
    data: ObjekPajakCreateManySubjek_pajakInput | ObjekPajakCreateManySubjek_pajakInput[]
    skipDuplicates?: boolean
  }

  export type DetailTransaksiTujuanCreateWithoutCalon_subjekInput = {
    id_detail_tujuan?: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
    transaksi: TransaksiSpopCreateNestedOneWithoutDetail_tujuanInput
  }

  export type DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput = {
    id_detail_tujuan?: string
    id_transaksi: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
  }

  export type DetailTransaksiTujuanCreateOrConnectWithoutCalon_subjekInput = {
    where: DetailTransaksiTujuanWhereUniqueInput
    create: XOR<DetailTransaksiTujuanCreateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput>
  }

  export type DetailTransaksiTujuanCreateManyCalon_subjekInputEnvelope = {
    data: DetailTransaksiTujuanCreateManyCalon_subjekInput | DetailTransaksiTujuanCreateManyCalon_subjekInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSubjek_pajak_dibuatInput = {
    update: XOR<UserUpdateWithoutSubjek_pajak_dibuatInput, UserUncheckedUpdateWithoutSubjek_pajak_dibuatInput>
    create: XOR<UserCreateWithoutSubjek_pajak_dibuatInput, UserUncheckedCreateWithoutSubjek_pajak_dibuatInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubjek_pajak_dibuatInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubjek_pajak_dibuatInput, UserUncheckedUpdateWithoutSubjek_pajak_dibuatInput>
  }

  export type UserUpdateWithoutSubjek_pajak_dibuatInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    wilayah?: WilayahUpdateOneWithoutUsersNestedInput
    objek_nonaktif?: ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateWithoutSubjek_pajak_dibuatInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    objek_nonaktif?: ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUncheckedUpdateManyWithoutGeneratorNestedInput
  }

  export type ObjekPajakUpsertWithWhereUniqueWithoutSubjek_pajakInput = {
    where: ObjekPajakWhereUniqueInput
    update: XOR<ObjekPajakUpdateWithoutSubjek_pajakInput, ObjekPajakUncheckedUpdateWithoutSubjek_pajakInput>
    create: XOR<ObjekPajakCreateWithoutSubjek_pajakInput, ObjekPajakUncheckedCreateWithoutSubjek_pajakInput>
  }

  export type ObjekPajakUpdateWithWhereUniqueWithoutSubjek_pajakInput = {
    where: ObjekPajakWhereUniqueInput
    data: XOR<ObjekPajakUpdateWithoutSubjek_pajakInput, ObjekPajakUncheckedUpdateWithoutSubjek_pajakInput>
  }

  export type ObjekPajakUpdateManyWithWhereWithoutSubjek_pajakInput = {
    where: ObjekPajakScalarWhereInput
    data: XOR<ObjekPajakUpdateManyMutationInput, ObjekPajakUncheckedUpdateManyWithoutSubjek_pajakInput>
  }

  export type ObjekPajakScalarWhereInput = {
    AND?: ObjekPajakScalarWhereInput | ObjekPajakScalarWhereInput[]
    OR?: ObjekPajakScalarWhereInput[]
    NOT?: ObjekPajakScalarWhereInput | ObjekPajakScalarWhereInput[]
    nop?: StringFilter<"ObjekPajak"> | string
    nik_subjek?: StringFilter<"ObjekPajak"> | string
    no_persil?: StringNullableFilter<"ObjekPajak"> | string | null
    jalan_op?: StringFilter<"ObjekPajak"> | string
    blok_kav_no?: StringNullableFilter<"ObjekPajak"> | string | null
    rw_op?: StringNullableFilter<"ObjekPajak"> | string | null
    rt_op?: StringNullableFilter<"ObjekPajak"> | string | null
    kelurahan_op?: StringFilter<"ObjekPajak"> | string
    kecamatan_op?: StringFilter<"ObjekPajak"> | string
    luas_tanah?: DecimalFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: StringNullableFilter<"ObjekPajak"> | string | null
    jenis_tanah?: EnumJenisTanahFilter<"ObjekPajak"> | $Enums.JenisTanah
    jumlah_bangunan?: IntFilter<"ObjekPajak"> | number
    luas_bangunan?: DecimalFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string
    njop_tanah?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    njop_total?: DecimalNullableFilter<"ObjekPajak"> | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: IntNullableFilter<"ObjekPajak"> | number | null
    status_aktif?: BoolFilter<"ObjekPajak"> | boolean
    nonaktif_oleh?: StringNullableFilter<"ObjekPajak"> | string | null
    nonaktif_at?: DateTimeNullableFilter<"ObjekPajak"> | Date | string | null
    created_at?: DateTimeFilter<"ObjekPajak"> | Date | string
  }

  export type DetailTransaksiTujuanUpsertWithWhereUniqueWithoutCalon_subjekInput = {
    where: DetailTransaksiTujuanWhereUniqueInput
    update: XOR<DetailTransaksiTujuanUpdateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedUpdateWithoutCalon_subjekInput>
    create: XOR<DetailTransaksiTujuanCreateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedCreateWithoutCalon_subjekInput>
  }

  export type DetailTransaksiTujuanUpdateWithWhereUniqueWithoutCalon_subjekInput = {
    where: DetailTransaksiTujuanWhereUniqueInput
    data: XOR<DetailTransaksiTujuanUpdateWithoutCalon_subjekInput, DetailTransaksiTujuanUncheckedUpdateWithoutCalon_subjekInput>
  }

  export type DetailTransaksiTujuanUpdateManyWithWhereWithoutCalon_subjekInput = {
    where: DetailTransaksiTujuanScalarWhereInput
    data: XOR<DetailTransaksiTujuanUpdateManyMutationInput, DetailTransaksiTujuanUncheckedUpdateManyWithoutCalon_subjekInput>
  }

  export type DetailTransaksiTujuanScalarWhereInput = {
    AND?: DetailTransaksiTujuanScalarWhereInput | DetailTransaksiTujuanScalarWhereInput[]
    OR?: DetailTransaksiTujuanScalarWhereInput[]
    NOT?: DetailTransaksiTujuanScalarWhereInput | DetailTransaksiTujuanScalarWhereInput[]
    id_detail_tujuan?: StringFilter<"DetailTransaksiTujuan"> | string
    id_transaksi?: StringFilter<"DetailTransaksiTujuan"> | string
    nik_calon_subjek?: StringFilter<"DetailTransaksiTujuan"> | string
    luas_tanah_baru?: DecimalFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFilter<"DetailTransaksiTujuan"> | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFilter<"DetailTransaksiTujuan"> | number
    jenis_tanah_baru?: EnumJenisTanahFilter<"DetailTransaksiTujuan"> | $Enums.JenisTanah
    no_persil_baru?: StringNullableFilter<"DetailTransaksiTujuan"> | string | null
    nop_generated?: StringNullableFilter<"DetailTransaksiTujuan"> | string | null
  }

  export type UserCreateWithoutTransaksi_diajukanInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    wilayah?: WilayahCreateNestedOneWithoutUsersInput
    subjek_pajak_dibuat?: SubjekPajakCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diverifikasi?: TransaksiSpopCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptCreateNestedManyWithoutGeneratorInput
  }

  export type UserUncheckedCreateWithoutTransaksi_diajukanInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptUncheckedCreateNestedManyWithoutGeneratorInput
  }

  export type UserCreateOrConnectWithoutTransaksi_diajukanInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransaksi_diajukanInput, UserUncheckedCreateWithoutTransaksi_diajukanInput>
  }

  export type UserCreateWithoutTransaksi_diverifikasiInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    wilayah?: WilayahCreateNestedOneWithoutUsersInput
    subjek_pajak_dibuat?: SubjekPajakCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopCreateNestedManyWithoutPengajuInput
    lampiran_diupload?: LampiranDokumenCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptCreateNestedManyWithoutGeneratorInput
  }

  export type UserUncheckedCreateWithoutTransaksi_diverifikasiInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    kode_wilayah?: string | null
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput
    lampiran_diupload?: LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptUncheckedCreateNestedManyWithoutGeneratorInput
  }

  export type UserCreateOrConnectWithoutTransaksi_diverifikasiInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransaksi_diverifikasiInput, UserUncheckedCreateWithoutTransaksi_diverifikasiInput>
  }

  export type ObjekPajakCreateWithoutTransaksiInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    subjek_pajak: SubjekPajakCreateNestedOneWithoutObjek_pajakInput
    user_nonaktif?: UserCreateNestedOneWithoutObjek_nonaktifInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakUncheckedCreateWithoutTransaksiInput = {
    nop: string
    nik_subjek: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_oleh?: string | null
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptUncheckedCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakCreateOrConnectWithoutTransaksiInput = {
    where: ObjekPajakWhereUniqueInput
    create: XOR<ObjekPajakCreateWithoutTransaksiInput, ObjekPajakUncheckedCreateWithoutTransaksiInput>
  }

  export type DetailTransaksiAsalCreateWithoutTransaksiInput = {
    id_detail_asal?: string
    nonaktifkan_saat_disetujui?: boolean
    objek_asal?: ObjekPajakCreateNestedOneWithoutDetail_asalInput
  }

  export type DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput = {
    id_detail_asal?: string
    nop_asal?: string | null
    nonaktifkan_saat_disetujui?: boolean
  }

  export type DetailTransaksiAsalCreateOrConnectWithoutTransaksiInput = {
    where: DetailTransaksiAsalWhereUniqueInput
    create: XOR<DetailTransaksiAsalCreateWithoutTransaksiInput, DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput>
  }

  export type DetailTransaksiAsalCreateManyTransaksiInputEnvelope = {
    data: DetailTransaksiAsalCreateManyTransaksiInput | DetailTransaksiAsalCreateManyTransaksiInput[]
    skipDuplicates?: boolean
  }

  export type DetailTransaksiTujuanCreateWithoutTransaksiInput = {
    id_detail_tujuan?: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
    calon_subjek: SubjekPajakCreateNestedOneWithoutDetail_tujuanInput
  }

  export type DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput = {
    id_detail_tujuan?: string
    nik_calon_subjek: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
  }

  export type DetailTransaksiTujuanCreateOrConnectWithoutTransaksiInput = {
    where: DetailTransaksiTujuanWhereUniqueInput
    create: XOR<DetailTransaksiTujuanCreateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput>
  }

  export type DetailTransaksiTujuanCreateManyTransaksiInputEnvelope = {
    data: DetailTransaksiTujuanCreateManyTransaksiInput | DetailTransaksiTujuanCreateManyTransaksiInput[]
    skipDuplicates?: boolean
  }

  export type LampiranDokumenCreateWithoutTransaksiInput = {
    id_dokumen?: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
    uploader: UserCreateNestedOneWithoutLampiran_diuploadInput
  }

  export type LampiranDokumenUncheckedCreateWithoutTransaksiInput = {
    id_dokumen?: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
    uploaded_by: string
  }

  export type LampiranDokumenCreateOrConnectWithoutTransaksiInput = {
    where: LampiranDokumenWhereUniqueInput
    create: XOR<LampiranDokumenCreateWithoutTransaksiInput, LampiranDokumenUncheckedCreateWithoutTransaksiInput>
  }

  export type LampiranDokumenCreateManyTransaksiInputEnvelope = {
    data: LampiranDokumenCreateManyTransaksiInput | LampiranDokumenCreateManyTransaksiInput[]
    skipDuplicates?: boolean
  }

  export type SpptCreateWithoutTransaksi_asalInput = {
    id_sppt?: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_at?: Date | string
    objek_pajak: ObjekPajakCreateNestedOneWithoutSpptInput
    generator: UserCreateNestedOneWithoutSppt_digenerateInput
  }

  export type SpptUncheckedCreateWithoutTransaksi_asalInput = {
    id_sppt?: string
    nop: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_by: string
    generated_at?: Date | string
  }

  export type SpptCreateOrConnectWithoutTransaksi_asalInput = {
    where: SpptWhereUniqueInput
    create: XOR<SpptCreateWithoutTransaksi_asalInput, SpptUncheckedCreateWithoutTransaksi_asalInput>
  }

  export type SpptCreateManyTransaksi_asalInputEnvelope = {
    data: SpptCreateManyTransaksi_asalInput | SpptCreateManyTransaksi_asalInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTransaksi_diajukanInput = {
    update: XOR<UserUpdateWithoutTransaksi_diajukanInput, UserUncheckedUpdateWithoutTransaksi_diajukanInput>
    create: XOR<UserCreateWithoutTransaksi_diajukanInput, UserUncheckedCreateWithoutTransaksi_diajukanInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransaksi_diajukanInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransaksi_diajukanInput, UserUncheckedUpdateWithoutTransaksi_diajukanInput>
  }

  export type UserUpdateWithoutTransaksi_diajukanInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    wilayah?: WilayahUpdateOneWithoutUsersNestedInput
    subjek_pajak_dibuat?: SubjekPajakUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diverifikasi?: TransaksiSpopUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateWithoutTransaksi_diajukanInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUncheckedUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUpsertWithoutTransaksi_diverifikasiInput = {
    update: XOR<UserUpdateWithoutTransaksi_diverifikasiInput, UserUncheckedUpdateWithoutTransaksi_diverifikasiInput>
    create: XOR<UserCreateWithoutTransaksi_diverifikasiInput, UserUncheckedCreateWithoutTransaksi_diverifikasiInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransaksi_diverifikasiInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransaksi_diverifikasiInput, UserUncheckedUpdateWithoutTransaksi_diverifikasiInput>
  }

  export type UserUpdateWithoutTransaksi_diverifikasiInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    wilayah?: WilayahUpdateOneWithoutUsersNestedInput
    subjek_pajak_dibuat?: SubjekPajakUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUpdateManyWithoutPengajuNestedInput
    lampiran_diupload?: LampiranDokumenUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateWithoutTransaksi_diverifikasiInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    kode_wilayah?: NullableStringFieldUpdateOperationsInput | string | null
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput
    lampiran_diupload?: LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUncheckedUpdateManyWithoutGeneratorNestedInput
  }

  export type ObjekPajakUpsertWithoutTransaksiInput = {
    update: XOR<ObjekPajakUpdateWithoutTransaksiInput, ObjekPajakUncheckedUpdateWithoutTransaksiInput>
    create: XOR<ObjekPajakCreateWithoutTransaksiInput, ObjekPajakUncheckedCreateWithoutTransaksiInput>
    where?: ObjekPajakWhereInput
  }

  export type ObjekPajakUpdateToOneWithWhereWithoutTransaksiInput = {
    where?: ObjekPajakWhereInput
    data: XOR<ObjekPajakUpdateWithoutTransaksiInput, ObjekPajakUncheckedUpdateWithoutTransaksiInput>
  }

  export type ObjekPajakUpdateWithoutTransaksiInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak?: SubjekPajakUpdateOneRequiredWithoutObjek_pajakNestedInput
    user_nonaktif?: UserUpdateOneWithoutObjek_nonaktifNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakUncheckedUpdateWithoutTransaksiInput = {
    nop?: StringFieldUpdateOperationsInput | string
    nik_subjek?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_oleh?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutObjek_pajakNestedInput
  }

  export type DetailTransaksiAsalUpsertWithWhereUniqueWithoutTransaksiInput = {
    where: DetailTransaksiAsalWhereUniqueInput
    update: XOR<DetailTransaksiAsalUpdateWithoutTransaksiInput, DetailTransaksiAsalUncheckedUpdateWithoutTransaksiInput>
    create: XOR<DetailTransaksiAsalCreateWithoutTransaksiInput, DetailTransaksiAsalUncheckedCreateWithoutTransaksiInput>
  }

  export type DetailTransaksiAsalUpdateWithWhereUniqueWithoutTransaksiInput = {
    where: DetailTransaksiAsalWhereUniqueInput
    data: XOR<DetailTransaksiAsalUpdateWithoutTransaksiInput, DetailTransaksiAsalUncheckedUpdateWithoutTransaksiInput>
  }

  export type DetailTransaksiAsalUpdateManyWithWhereWithoutTransaksiInput = {
    where: DetailTransaksiAsalScalarWhereInput
    data: XOR<DetailTransaksiAsalUpdateManyMutationInput, DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiInput>
  }

  export type DetailTransaksiTujuanUpsertWithWhereUniqueWithoutTransaksiInput = {
    where: DetailTransaksiTujuanWhereUniqueInput
    update: XOR<DetailTransaksiTujuanUpdateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedUpdateWithoutTransaksiInput>
    create: XOR<DetailTransaksiTujuanCreateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedCreateWithoutTransaksiInput>
  }

  export type DetailTransaksiTujuanUpdateWithWhereUniqueWithoutTransaksiInput = {
    where: DetailTransaksiTujuanWhereUniqueInput
    data: XOR<DetailTransaksiTujuanUpdateWithoutTransaksiInput, DetailTransaksiTujuanUncheckedUpdateWithoutTransaksiInput>
  }

  export type DetailTransaksiTujuanUpdateManyWithWhereWithoutTransaksiInput = {
    where: DetailTransaksiTujuanScalarWhereInput
    data: XOR<DetailTransaksiTujuanUpdateManyMutationInput, DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiInput>
  }

  export type LampiranDokumenUpsertWithWhereUniqueWithoutTransaksiInput = {
    where: LampiranDokumenWhereUniqueInput
    update: XOR<LampiranDokumenUpdateWithoutTransaksiInput, LampiranDokumenUncheckedUpdateWithoutTransaksiInput>
    create: XOR<LampiranDokumenCreateWithoutTransaksiInput, LampiranDokumenUncheckedCreateWithoutTransaksiInput>
  }

  export type LampiranDokumenUpdateWithWhereUniqueWithoutTransaksiInput = {
    where: LampiranDokumenWhereUniqueInput
    data: XOR<LampiranDokumenUpdateWithoutTransaksiInput, LampiranDokumenUncheckedUpdateWithoutTransaksiInput>
  }

  export type LampiranDokumenUpdateManyWithWhereWithoutTransaksiInput = {
    where: LampiranDokumenScalarWhereInput
    data: XOR<LampiranDokumenUpdateManyMutationInput, LampiranDokumenUncheckedUpdateManyWithoutTransaksiInput>
  }

  export type LampiranDokumenScalarWhereInput = {
    AND?: LampiranDokumenScalarWhereInput | LampiranDokumenScalarWhereInput[]
    OR?: LampiranDokumenScalarWhereInput[]
    NOT?: LampiranDokumenScalarWhereInput | LampiranDokumenScalarWhereInput[]
    id_dokumen?: StringFilter<"LampiranDokumen"> | string
    id_transaksi?: StringFilter<"LampiranDokumen"> | string
    jenis_dokumen?: EnumJenisDokumenFilter<"LampiranDokumen"> | $Enums.JenisDokumen
    keterangan_dokumen?: StringNullableFilter<"LampiranDokumen"> | string | null
    url_file?: StringFilter<"LampiranDokumen"> | string
    uploaded_at?: DateTimeFilter<"LampiranDokumen"> | Date | string
    uploaded_by?: StringFilter<"LampiranDokumen"> | string
  }

  export type SpptUpsertWithWhereUniqueWithoutTransaksi_asalInput = {
    where: SpptWhereUniqueInput
    update: XOR<SpptUpdateWithoutTransaksi_asalInput, SpptUncheckedUpdateWithoutTransaksi_asalInput>
    create: XOR<SpptCreateWithoutTransaksi_asalInput, SpptUncheckedCreateWithoutTransaksi_asalInput>
  }

  export type SpptUpdateWithWhereUniqueWithoutTransaksi_asalInput = {
    where: SpptWhereUniqueInput
    data: XOR<SpptUpdateWithoutTransaksi_asalInput, SpptUncheckedUpdateWithoutTransaksi_asalInput>
  }

  export type SpptUpdateManyWithWhereWithoutTransaksi_asalInput = {
    where: SpptScalarWhereInput
    data: XOR<SpptUpdateManyMutationInput, SpptUncheckedUpdateManyWithoutTransaksi_asalInput>
  }

  export type TransaksiSpopCreateWithoutDetail_asalInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pengaju: UserCreateNestedOneWithoutTransaksi_diajukanInput
    verifikator?: UserCreateNestedOneWithoutTransaksi_diverifikasiInput
    objek_bersama?: ObjekPajakCreateNestedOneWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenCreateNestedManyWithoutTransaksiInput
    sppt?: SpptCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUncheckedCreateWithoutDetail_asalInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput
    sppt?: SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopCreateOrConnectWithoutDetail_asalInput = {
    where: TransaksiSpopWhereUniqueInput
    create: XOR<TransaksiSpopCreateWithoutDetail_asalInput, TransaksiSpopUncheckedCreateWithoutDetail_asalInput>
  }

  export type ObjekPajakCreateWithoutDetail_asalInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    subjek_pajak: SubjekPajakCreateNestedOneWithoutObjek_pajakInput
    user_nonaktif?: UserCreateNestedOneWithoutObjek_nonaktifInput
    transaksi?: TransaksiSpopCreateNestedManyWithoutObjek_bersamaInput
    sppt?: SpptCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakUncheckedCreateWithoutDetail_asalInput = {
    nop: string
    nik_subjek: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_oleh?: string | null
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    transaksi?: TransaksiSpopUncheckedCreateNestedManyWithoutObjek_bersamaInput
    sppt?: SpptUncheckedCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakCreateOrConnectWithoutDetail_asalInput = {
    where: ObjekPajakWhereUniqueInput
    create: XOR<ObjekPajakCreateWithoutDetail_asalInput, ObjekPajakUncheckedCreateWithoutDetail_asalInput>
  }

  export type TransaksiSpopUpsertWithoutDetail_asalInput = {
    update: XOR<TransaksiSpopUpdateWithoutDetail_asalInput, TransaksiSpopUncheckedUpdateWithoutDetail_asalInput>
    create: XOR<TransaksiSpopCreateWithoutDetail_asalInput, TransaksiSpopUncheckedCreateWithoutDetail_asalInput>
    where?: TransaksiSpopWhereInput
  }

  export type TransaksiSpopUpdateToOneWithWhereWithoutDetail_asalInput = {
    where?: TransaksiSpopWhereInput
    data: XOR<TransaksiSpopUpdateWithoutDetail_asalInput, TransaksiSpopUncheckedUpdateWithoutDetail_asalInput>
  }

  export type TransaksiSpopUpdateWithoutDetail_asalInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pengaju?: UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput
    verifikator?: UserUpdateOneWithoutTransaksi_diverifikasiNestedInput
    objek_bersama?: ObjekPajakUpdateOneWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateWithoutDetail_asalInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type ObjekPajakUpsertWithoutDetail_asalInput = {
    update: XOR<ObjekPajakUpdateWithoutDetail_asalInput, ObjekPajakUncheckedUpdateWithoutDetail_asalInput>
    create: XOR<ObjekPajakCreateWithoutDetail_asalInput, ObjekPajakUncheckedCreateWithoutDetail_asalInput>
    where?: ObjekPajakWhereInput
  }

  export type ObjekPajakUpdateToOneWithWhereWithoutDetail_asalInput = {
    where?: ObjekPajakWhereInput
    data: XOR<ObjekPajakUpdateWithoutDetail_asalInput, ObjekPajakUncheckedUpdateWithoutDetail_asalInput>
  }

  export type ObjekPajakUpdateWithoutDetail_asalInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak?: SubjekPajakUpdateOneRequiredWithoutObjek_pajakNestedInput
    user_nonaktif?: UserUpdateOneWithoutObjek_nonaktifNestedInput
    transaksi?: TransaksiSpopUpdateManyWithoutObjek_bersamaNestedInput
    sppt?: SpptUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakUncheckedUpdateWithoutDetail_asalInput = {
    nop?: StringFieldUpdateOperationsInput | string
    nik_subjek?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_oleh?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutObjek_pajakNestedInput
  }

  export type TransaksiSpopCreateWithoutDetail_tujuanInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pengaju: UserCreateNestedOneWithoutTransaksi_diajukanInput
    verifikator?: UserCreateNestedOneWithoutTransaksi_diverifikasiInput
    objek_bersama?: ObjekPajakCreateNestedOneWithoutTransaksiInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenCreateNestedManyWithoutTransaksiInput
    sppt?: SpptCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUncheckedCreateWithoutDetail_tujuanInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput
    sppt?: SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopCreateOrConnectWithoutDetail_tujuanInput = {
    where: TransaksiSpopWhereUniqueInput
    create: XOR<TransaksiSpopCreateWithoutDetail_tujuanInput, TransaksiSpopUncheckedCreateWithoutDetail_tujuanInput>
  }

  export type SubjekPajakCreateWithoutDetail_tujuanInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutSubjek_pajak_dibuatInput
    objek_pajak?: ObjekPajakCreateNestedManyWithoutSubjek_pajakInput
  }

  export type SubjekPajakUncheckedCreateWithoutDetail_tujuanInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    created_by: string
    objek_pajak?: ObjekPajakUncheckedCreateNestedManyWithoutSubjek_pajakInput
  }

  export type SubjekPajakCreateOrConnectWithoutDetail_tujuanInput = {
    where: SubjekPajakWhereUniqueInput
    create: XOR<SubjekPajakCreateWithoutDetail_tujuanInput, SubjekPajakUncheckedCreateWithoutDetail_tujuanInput>
  }

  export type TransaksiSpopUpsertWithoutDetail_tujuanInput = {
    update: XOR<TransaksiSpopUpdateWithoutDetail_tujuanInput, TransaksiSpopUncheckedUpdateWithoutDetail_tujuanInput>
    create: XOR<TransaksiSpopCreateWithoutDetail_tujuanInput, TransaksiSpopUncheckedCreateWithoutDetail_tujuanInput>
    where?: TransaksiSpopWhereInput
  }

  export type TransaksiSpopUpdateToOneWithWhereWithoutDetail_tujuanInput = {
    where?: TransaksiSpopWhereInput
    data: XOR<TransaksiSpopUpdateWithoutDetail_tujuanInput, TransaksiSpopUncheckedUpdateWithoutDetail_tujuanInput>
  }

  export type TransaksiSpopUpdateWithoutDetail_tujuanInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pengaju?: UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput
    verifikator?: UserUpdateOneWithoutTransaksi_diverifikasiNestedInput
    objek_bersama?: ObjekPajakUpdateOneWithoutTransaksiNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateWithoutDetail_tujuanInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type SubjekPajakUpsertWithoutDetail_tujuanInput = {
    update: XOR<SubjekPajakUpdateWithoutDetail_tujuanInput, SubjekPajakUncheckedUpdateWithoutDetail_tujuanInput>
    create: XOR<SubjekPajakCreateWithoutDetail_tujuanInput, SubjekPajakUncheckedCreateWithoutDetail_tujuanInput>
    where?: SubjekPajakWhereInput
  }

  export type SubjekPajakUpdateToOneWithWhereWithoutDetail_tujuanInput = {
    where?: SubjekPajakWhereInput
    data: XOR<SubjekPajakUpdateWithoutDetail_tujuanInput, SubjekPajakUncheckedUpdateWithoutDetail_tujuanInput>
  }

  export type SubjekPajakUpdateWithoutDetail_tujuanInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubjek_pajak_dibuatNestedInput
    objek_pajak?: ObjekPajakUpdateManyWithoutSubjek_pajakNestedInput
  }

  export type SubjekPajakUncheckedUpdateWithoutDetail_tujuanInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_by?: StringFieldUpdateOperationsInput | string
    objek_pajak?: ObjekPajakUncheckedUpdateManyWithoutSubjek_pajakNestedInput
  }

  export type WilayahCreateWithoutUsersInput = {
    kode_wilayah: string
    nama_desa: string
    kode_kel: string
    kecamatan: string
    kode_kec: string
    kabupaten: string
    kode_kab: string
  }

  export type WilayahUncheckedCreateWithoutUsersInput = {
    kode_wilayah: string
    nama_desa: string
    kode_kel: string
    kecamatan: string
    kode_kec: string
    kabupaten: string
    kode_kab: string
  }

  export type WilayahCreateOrConnectWithoutUsersInput = {
    where: WilayahWhereUniqueInput
    create: XOR<WilayahCreateWithoutUsersInput, WilayahUncheckedCreateWithoutUsersInput>
  }

  export type SubjekPajakCreateWithoutUserInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    objek_pajak?: ObjekPajakCreateNestedManyWithoutSubjek_pajakInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutCalon_subjekInput
  }

  export type SubjekPajakUncheckedCreateWithoutUserInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    objek_pajak?: ObjekPajakUncheckedCreateNestedManyWithoutSubjek_pajakInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutCalon_subjekInput
  }

  export type SubjekPajakCreateOrConnectWithoutUserInput = {
    where: SubjekPajakWhereUniqueInput
    create: XOR<SubjekPajakCreateWithoutUserInput, SubjekPajakUncheckedCreateWithoutUserInput>
  }

  export type SubjekPajakCreateManyUserInputEnvelope = {
    data: SubjekPajakCreateManyUserInput | SubjekPajakCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ObjekPajakCreateWithoutUser_nonaktifInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    subjek_pajak: SubjekPajakCreateNestedOneWithoutObjek_pajakInput
    transaksi?: TransaksiSpopCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakUncheckedCreateWithoutUser_nonaktifInput = {
    nop: string
    nik_subjek: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
    transaksi?: TransaksiSpopUncheckedCreateNestedManyWithoutObjek_bersamaInput
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutObjek_asalInput
    sppt?: SpptUncheckedCreateNestedManyWithoutObjek_pajakInput
  }

  export type ObjekPajakCreateOrConnectWithoutUser_nonaktifInput = {
    where: ObjekPajakWhereUniqueInput
    create: XOR<ObjekPajakCreateWithoutUser_nonaktifInput, ObjekPajakUncheckedCreateWithoutUser_nonaktifInput>
  }

  export type ObjekPajakCreateManyUser_nonaktifInputEnvelope = {
    data: ObjekPajakCreateManyUser_nonaktifInput | ObjekPajakCreateManyUser_nonaktifInput[]
    skipDuplicates?: boolean
  }

  export type TransaksiSpopCreateWithoutPengajuInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    verifikator?: UserCreateNestedOneWithoutTransaksi_diverifikasiInput
    objek_bersama?: ObjekPajakCreateNestedOneWithoutTransaksiInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenCreateNestedManyWithoutTransaksiInput
    sppt?: SpptCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUncheckedCreateWithoutPengajuInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput
    sppt?: SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopCreateOrConnectWithoutPengajuInput = {
    where: TransaksiSpopWhereUniqueInput
    create: XOR<TransaksiSpopCreateWithoutPengajuInput, TransaksiSpopUncheckedCreateWithoutPengajuInput>
  }

  export type TransaksiSpopCreateManyPengajuInputEnvelope = {
    data: TransaksiSpopCreateManyPengajuInput | TransaksiSpopCreateManyPengajuInput[]
    skipDuplicates?: boolean
  }

  export type TransaksiSpopCreateWithoutVerifikatorInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pengaju: UserCreateNestedOneWithoutTransaksi_diajukanInput
    objek_bersama?: ObjekPajakCreateNestedOneWithoutTransaksiInput
    detail_asal?: DetailTransaksiAsalCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenCreateNestedManyWithoutTransaksiInput
    sppt?: SpptCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopUncheckedCreateWithoutVerifikatorInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    detail_asal?: DetailTransaksiAsalUncheckedCreateNestedManyWithoutTransaksiInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedCreateNestedManyWithoutTransaksiInput
    lampiran?: LampiranDokumenUncheckedCreateNestedManyWithoutTransaksiInput
    sppt?: SpptUncheckedCreateNestedManyWithoutTransaksi_asalInput
  }

  export type TransaksiSpopCreateOrConnectWithoutVerifikatorInput = {
    where: TransaksiSpopWhereUniqueInput
    create: XOR<TransaksiSpopCreateWithoutVerifikatorInput, TransaksiSpopUncheckedCreateWithoutVerifikatorInput>
  }

  export type TransaksiSpopCreateManyVerifikatorInputEnvelope = {
    data: TransaksiSpopCreateManyVerifikatorInput | TransaksiSpopCreateManyVerifikatorInput[]
    skipDuplicates?: boolean
  }

  export type LampiranDokumenCreateWithoutUploaderInput = {
    id_dokumen?: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
    transaksi: TransaksiSpopCreateNestedOneWithoutLampiranInput
  }

  export type LampiranDokumenUncheckedCreateWithoutUploaderInput = {
    id_dokumen?: string
    id_transaksi: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
  }

  export type LampiranDokumenCreateOrConnectWithoutUploaderInput = {
    where: LampiranDokumenWhereUniqueInput
    create: XOR<LampiranDokumenCreateWithoutUploaderInput, LampiranDokumenUncheckedCreateWithoutUploaderInput>
  }

  export type LampiranDokumenCreateManyUploaderInputEnvelope = {
    data: LampiranDokumenCreateManyUploaderInput | LampiranDokumenCreateManyUploaderInput[]
    skipDuplicates?: boolean
  }

  export type SpptCreateWithoutGeneratorInput = {
    id_sppt?: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_at?: Date | string
    objek_pajak: ObjekPajakCreateNestedOneWithoutSpptInput
    transaksi_asal?: TransaksiSpopCreateNestedOneWithoutSpptInput
  }

  export type SpptUncheckedCreateWithoutGeneratorInput = {
    id_sppt?: string
    nop: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_at?: Date | string
    id_transaksi_asal?: string | null
  }

  export type SpptCreateOrConnectWithoutGeneratorInput = {
    where: SpptWhereUniqueInput
    create: XOR<SpptCreateWithoutGeneratorInput, SpptUncheckedCreateWithoutGeneratorInput>
  }

  export type SpptCreateManyGeneratorInputEnvelope = {
    data: SpptCreateManyGeneratorInput | SpptCreateManyGeneratorInput[]
    skipDuplicates?: boolean
  }

  export type WilayahUpsertWithoutUsersInput = {
    update: XOR<WilayahUpdateWithoutUsersInput, WilayahUncheckedUpdateWithoutUsersInput>
    create: XOR<WilayahCreateWithoutUsersInput, WilayahUncheckedCreateWithoutUsersInput>
    where?: WilayahWhereInput
  }

  export type WilayahUpdateToOneWithWhereWithoutUsersInput = {
    where?: WilayahWhereInput
    data: XOR<WilayahUpdateWithoutUsersInput, WilayahUncheckedUpdateWithoutUsersInput>
  }

  export type WilayahUpdateWithoutUsersInput = {
    kode_wilayah?: StringFieldUpdateOperationsInput | string
    nama_desa?: StringFieldUpdateOperationsInput | string
    kode_kel?: StringFieldUpdateOperationsInput | string
    kecamatan?: StringFieldUpdateOperationsInput | string
    kode_kec?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_kab?: StringFieldUpdateOperationsInput | string
  }

  export type WilayahUncheckedUpdateWithoutUsersInput = {
    kode_wilayah?: StringFieldUpdateOperationsInput | string
    nama_desa?: StringFieldUpdateOperationsInput | string
    kode_kel?: StringFieldUpdateOperationsInput | string
    kecamatan?: StringFieldUpdateOperationsInput | string
    kode_kec?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_kab?: StringFieldUpdateOperationsInput | string
  }

  export type SubjekPajakUpsertWithWhereUniqueWithoutUserInput = {
    where: SubjekPajakWhereUniqueInput
    update: XOR<SubjekPajakUpdateWithoutUserInput, SubjekPajakUncheckedUpdateWithoutUserInput>
    create: XOR<SubjekPajakCreateWithoutUserInput, SubjekPajakUncheckedCreateWithoutUserInput>
  }

  export type SubjekPajakUpdateWithWhereUniqueWithoutUserInput = {
    where: SubjekPajakWhereUniqueInput
    data: XOR<SubjekPajakUpdateWithoutUserInput, SubjekPajakUncheckedUpdateWithoutUserInput>
  }

  export type SubjekPajakUpdateManyWithWhereWithoutUserInput = {
    where: SubjekPajakScalarWhereInput
    data: XOR<SubjekPajakUpdateManyMutationInput, SubjekPajakUncheckedUpdateManyWithoutUserInput>
  }

  export type SubjekPajakScalarWhereInput = {
    AND?: SubjekPajakScalarWhereInput | SubjekPajakScalarWhereInput[]
    OR?: SubjekPajakScalarWhereInput[]
    NOT?: SubjekPajakScalarWhereInput | SubjekPajakScalarWhereInput[]
    nik?: StringFilter<"SubjekPajak"> | string
    nama_subjek?: StringFilter<"SubjekPajak"> | string
    status_wp?: EnumStatusWpFilter<"SubjekPajak"> | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFilter<"SubjekPajak"> | $Enums.Pekerjaan
    npwp?: StringNullableFilter<"SubjekPajak"> | string | null
    no_hp?: StringNullableFilter<"SubjekPajak"> | string | null
    alamat_jalan?: StringFilter<"SubjekPajak"> | string
    blok_kav_no_subjek?: StringNullableFilter<"SubjekPajak"> | string | null
    rw?: StringNullableFilter<"SubjekPajak"> | string | null
    rt?: StringNullableFilter<"SubjekPajak"> | string | null
    kelurahan?: StringFilter<"SubjekPajak"> | string
    kabupaten?: StringFilter<"SubjekPajak"> | string
    kode_pos?: StringNullableFilter<"SubjekPajak"> | string | null
    created_at?: DateTimeFilter<"SubjekPajak"> | Date | string
    updated_at?: DateTimeFilter<"SubjekPajak"> | Date | string
    created_by?: StringFilter<"SubjekPajak"> | string
  }

  export type ObjekPajakUpsertWithWhereUniqueWithoutUser_nonaktifInput = {
    where: ObjekPajakWhereUniqueInput
    update: XOR<ObjekPajakUpdateWithoutUser_nonaktifInput, ObjekPajakUncheckedUpdateWithoutUser_nonaktifInput>
    create: XOR<ObjekPajakCreateWithoutUser_nonaktifInput, ObjekPajakUncheckedCreateWithoutUser_nonaktifInput>
  }

  export type ObjekPajakUpdateWithWhereUniqueWithoutUser_nonaktifInput = {
    where: ObjekPajakWhereUniqueInput
    data: XOR<ObjekPajakUpdateWithoutUser_nonaktifInput, ObjekPajakUncheckedUpdateWithoutUser_nonaktifInput>
  }

  export type ObjekPajakUpdateManyWithWhereWithoutUser_nonaktifInput = {
    where: ObjekPajakScalarWhereInput
    data: XOR<ObjekPajakUpdateManyMutationInput, ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifInput>
  }

  export type TransaksiSpopUpsertWithWhereUniqueWithoutPengajuInput = {
    where: TransaksiSpopWhereUniqueInput
    update: XOR<TransaksiSpopUpdateWithoutPengajuInput, TransaksiSpopUncheckedUpdateWithoutPengajuInput>
    create: XOR<TransaksiSpopCreateWithoutPengajuInput, TransaksiSpopUncheckedCreateWithoutPengajuInput>
  }

  export type TransaksiSpopUpdateWithWhereUniqueWithoutPengajuInput = {
    where: TransaksiSpopWhereUniqueInput
    data: XOR<TransaksiSpopUpdateWithoutPengajuInput, TransaksiSpopUncheckedUpdateWithoutPengajuInput>
  }

  export type TransaksiSpopUpdateManyWithWhereWithoutPengajuInput = {
    where: TransaksiSpopScalarWhereInput
    data: XOR<TransaksiSpopUpdateManyMutationInput, TransaksiSpopUncheckedUpdateManyWithoutPengajuInput>
  }

  export type TransaksiSpopUpsertWithWhereUniqueWithoutVerifikatorInput = {
    where: TransaksiSpopWhereUniqueInput
    update: XOR<TransaksiSpopUpdateWithoutVerifikatorInput, TransaksiSpopUncheckedUpdateWithoutVerifikatorInput>
    create: XOR<TransaksiSpopCreateWithoutVerifikatorInput, TransaksiSpopUncheckedCreateWithoutVerifikatorInput>
  }

  export type TransaksiSpopUpdateWithWhereUniqueWithoutVerifikatorInput = {
    where: TransaksiSpopWhereUniqueInput
    data: XOR<TransaksiSpopUpdateWithoutVerifikatorInput, TransaksiSpopUncheckedUpdateWithoutVerifikatorInput>
  }

  export type TransaksiSpopUpdateManyWithWhereWithoutVerifikatorInput = {
    where: TransaksiSpopScalarWhereInput
    data: XOR<TransaksiSpopUpdateManyMutationInput, TransaksiSpopUncheckedUpdateManyWithoutVerifikatorInput>
  }

  export type LampiranDokumenUpsertWithWhereUniqueWithoutUploaderInput = {
    where: LampiranDokumenWhereUniqueInput
    update: XOR<LampiranDokumenUpdateWithoutUploaderInput, LampiranDokumenUncheckedUpdateWithoutUploaderInput>
    create: XOR<LampiranDokumenCreateWithoutUploaderInput, LampiranDokumenUncheckedCreateWithoutUploaderInput>
  }

  export type LampiranDokumenUpdateWithWhereUniqueWithoutUploaderInput = {
    where: LampiranDokumenWhereUniqueInput
    data: XOR<LampiranDokumenUpdateWithoutUploaderInput, LampiranDokumenUncheckedUpdateWithoutUploaderInput>
  }

  export type LampiranDokumenUpdateManyWithWhereWithoutUploaderInput = {
    where: LampiranDokumenScalarWhereInput
    data: XOR<LampiranDokumenUpdateManyMutationInput, LampiranDokumenUncheckedUpdateManyWithoutUploaderInput>
  }

  export type SpptUpsertWithWhereUniqueWithoutGeneratorInput = {
    where: SpptWhereUniqueInput
    update: XOR<SpptUpdateWithoutGeneratorInput, SpptUncheckedUpdateWithoutGeneratorInput>
    create: XOR<SpptCreateWithoutGeneratorInput, SpptUncheckedCreateWithoutGeneratorInput>
  }

  export type SpptUpdateWithWhereUniqueWithoutGeneratorInput = {
    where: SpptWhereUniqueInput
    data: XOR<SpptUpdateWithoutGeneratorInput, SpptUncheckedUpdateWithoutGeneratorInput>
  }

  export type SpptUpdateManyWithWhereWithoutGeneratorInput = {
    where: SpptScalarWhereInput
    data: XOR<SpptUpdateManyMutationInput, SpptUncheckedUpdateManyWithoutGeneratorInput>
  }

  export type UserCreateWithoutWilayahInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptCreateNestedManyWithoutGeneratorInput
  }

  export type UserUncheckedCreateWithoutWilayahInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedCreateNestedManyWithoutUserInput
    objek_nonaktif?: ObjekPajakUncheckedCreateNestedManyWithoutUser_nonaktifInput
    transaksi_diajukan?: TransaksiSpopUncheckedCreateNestedManyWithoutPengajuInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedCreateNestedManyWithoutVerifikatorInput
    lampiran_diupload?: LampiranDokumenUncheckedCreateNestedManyWithoutUploaderInput
    sppt_digenerate?: SpptUncheckedCreateNestedManyWithoutGeneratorInput
  }

  export type UserCreateOrConnectWithoutWilayahInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWilayahInput, UserUncheckedCreateWithoutWilayahInput>
  }

  export type UserCreateManyWilayahInputEnvelope = {
    data: UserCreateManyWilayahInput | UserCreateManyWilayahInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutWilayahInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutWilayahInput, UserUncheckedUpdateWithoutWilayahInput>
    create: XOR<UserCreateWithoutWilayahInput, UserUncheckedCreateWithoutWilayahInput>
  }

  export type UserUpdateWithWhereUniqueWithoutWilayahInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutWilayahInput, UserUncheckedUpdateWithoutWilayahInput>
  }

  export type UserUpdateManyWithWhereWithoutWilayahInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutWilayahInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id_user?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    nama_lengkap?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    kode_wilayah?: StringNullableFilter<"User"> | string | null
    nip?: StringNullableFilter<"User"> | string | null
    is_active?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
  }

  export type TransaksiSpopCreateManyObjek_bersamaInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DetailTransaksiAsalCreateManyObjek_asalInput = {
    id_detail_asal?: string
    id_transaksi: string
    nonaktifkan_saat_disetujui?: boolean
  }

  export type SpptCreateManyObjek_pajakInput = {
    id_sppt?: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_by: string
    generated_at?: Date | string
    id_transaksi_asal?: string | null
  }

  export type TransaksiSpopUpdateWithoutObjek_bersamaInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pengaju?: UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput
    verifikator?: UserUpdateOneWithoutTransaksi_diverifikasiNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateWithoutObjek_bersamaInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailTransaksiAsalUpdateWithoutObjek_asalInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
    transaksi?: TransaksiSpopUpdateOneRequiredWithoutDetail_asalNestedInput
  }

  export type DetailTransaksiAsalUncheckedUpdateWithoutObjek_asalInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SpptUpdateWithoutObjek_pajakInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    generator?: UserUpdateOneRequiredWithoutSppt_digenerateNestedInput
    transaksi_asal?: TransaksiSpopUpdateOneWithoutSpptNestedInput
  }

  export type SpptUncheckedUpdateWithoutObjek_pajakInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_by?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id_transaksi_asal?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpptUncheckedUpdateManyWithoutObjek_pajakInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_by?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id_transaksi_asal?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ObjekPajakCreateManySubjek_pajakInput = {
    nop: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_oleh?: string | null
    nonaktif_at?: Date | string | null
    created_at?: Date | string
  }

  export type DetailTransaksiTujuanCreateManyCalon_subjekInput = {
    id_detail_tujuan?: string
    id_transaksi: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
  }

  export type ObjekPajakUpdateWithoutSubjek_pajakInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_nonaktif?: UserUpdateOneWithoutObjek_nonaktifNestedInput
    transaksi?: TransaksiSpopUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakUncheckedUpdateWithoutSubjek_pajakInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_oleh?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakUncheckedUpdateManyWithoutSubjek_pajakInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_oleh?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailTransaksiTujuanUpdateWithoutCalon_subjekInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
    transaksi?: TransaksiSpopUpdateOneRequiredWithoutDetail_tujuanNestedInput
  }

  export type DetailTransaksiTujuanUncheckedUpdateWithoutCalon_subjekInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DetailTransaksiTujuanUncheckedUpdateManyWithoutCalon_subjekInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DetailTransaksiAsalCreateManyTransaksiInput = {
    id_detail_asal?: string
    nop_asal?: string | null
    nonaktifkan_saat_disetujui?: boolean
  }

  export type DetailTransaksiTujuanCreateManyTransaksiInput = {
    id_detail_tujuan?: string
    nik_calon_subjek: string
    luas_tanah_baru: Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: number
    jenis_tanah_baru: $Enums.JenisTanah
    no_persil_baru?: string | null
    nop_generated?: string | null
  }

  export type LampiranDokumenCreateManyTransaksiInput = {
    id_dokumen?: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
    uploaded_by: string
  }

  export type SpptCreateManyTransaksi_asalInput = {
    id_sppt?: string
    nop: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_by: string
    generated_at?: Date | string
  }

  export type DetailTransaksiAsalUpdateWithoutTransaksiInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
    objek_asal?: ObjekPajakUpdateOneWithoutDetail_asalNestedInput
  }

  export type DetailTransaksiAsalUncheckedUpdateWithoutTransaksiInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    nop_asal?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiInput = {
    id_detail_asal?: StringFieldUpdateOperationsInput | string
    nop_asal?: NullableStringFieldUpdateOperationsInput | string | null
    nonaktifkan_saat_disetujui?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DetailTransaksiTujuanUpdateWithoutTransaksiInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
    calon_subjek?: SubjekPajakUpdateOneRequiredWithoutDetail_tujuanNestedInput
  }

  export type DetailTransaksiTujuanUncheckedUpdateWithoutTransaksiInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    nik_calon_subjek?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiInput = {
    id_detail_tujuan?: StringFieldUpdateOperationsInput | string
    nik_calon_subjek?: StringFieldUpdateOperationsInput | string
    luas_tanah_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    luas_bangunan_baru?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    jumlah_bangunan_baru?: IntFieldUpdateOperationsInput | number
    jenis_tanah_baru?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    no_persil_baru?: NullableStringFieldUpdateOperationsInput | string | null
    nop_generated?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LampiranDokumenUpdateWithoutTransaksiInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uploader?: UserUpdateOneRequiredWithoutLampiran_diuploadNestedInput
  }

  export type LampiranDokumenUncheckedUpdateWithoutTransaksiInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaded_by?: StringFieldUpdateOperationsInput | string
  }

  export type LampiranDokumenUncheckedUpdateManyWithoutTransaksiInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaded_by?: StringFieldUpdateOperationsInput | string
  }

  export type SpptUpdateWithoutTransaksi_asalInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    objek_pajak?: ObjekPajakUpdateOneRequiredWithoutSpptNestedInput
    generator?: UserUpdateOneRequiredWithoutSppt_digenerateNestedInput
  }

  export type SpptUncheckedUpdateWithoutTransaksi_asalInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    nop?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_by?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpptUncheckedUpdateManyWithoutTransaksi_asalInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    nop?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_by?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjekPajakCreateManyUserInput = {
    nik: string
    nama_subjek: string
    status_wp: $Enums.StatusWp
    pekerjaan: $Enums.Pekerjaan
    npwp?: string | null
    no_hp?: string | null
    alamat_jalan: string
    blok_kav_no_subjek?: string | null
    rw?: string | null
    rt?: string | null
    kelurahan: string
    kabupaten: string
    kode_pos?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ObjekPajakCreateManyUser_nonaktifInput = {
    nop: string
    nik_subjek: string
    no_persil?: string | null
    jalan_op: string
    blok_kav_no?: string | null
    rw_op?: string | null
    rt_op?: string | null
    kelurahan_op: string
    kecamatan_op: string
    luas_tanah: Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: string | null
    jenis_tanah: $Enums.JenisTanah
    jumlah_bangunan?: number
    luas_bangunan?: Decimal | DecimalJsLike | number | string
    njop_tanah?: Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: Decimal | DecimalJsLike | number | string | null
    njop_total?: Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: number | null
    status_aktif?: boolean
    nonaktif_at?: Date | string | null
    created_at?: Date | string
  }

  export type TransaksiSpopCreateManyPengajuInput = {
    id_transaksi?: string
    no_formulir?: string | null
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    id_verifikator?: string | null
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TransaksiSpopCreateManyVerifikatorInput = {
    id_transaksi?: string
    no_formulir?: string | null
    id_user: string
    tahun_pajak: number
    jenis_transaksi: $Enums.JenisTransaksi
    nop_bersama?: string | null
    no_sppt_lama?: string | null
    nama_pengaju?: string | null
    menggunakan_kuasa?: boolean
    tanggal_pengajuan: Date | string
    status_ajuan?: $Enums.StatusAjuan
    verified_at?: Date | string | null
    catatan_bakeuda?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type LampiranDokumenCreateManyUploaderInput = {
    id_dokumen?: string
    id_transaksi: string
    jenis_dokumen: $Enums.JenisDokumen
    keterangan_dokumen?: string | null
    url_file: string
    uploaded_at?: Date | string
  }

  export type SpptCreateManyGeneratorInput = {
    id_sppt?: string
    nop: string
    tahun_pajak: number
    njop_kena_pajak: Decimal | DecimalJsLike | number | string
    njoptkp: Decimal | DecimalJsLike | number | string
    tarif_pbb: Decimal | DecimalJsLike | number | string
    pbb_terutang: Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo: Date | string
    status_bayar?: $Enums.StatusBayar
    tgl_bayar?: Date | string | null
    generated_at?: Date | string
    id_transaksi_asal?: string | null
  }

  export type SubjekPajakUpdateWithoutUserInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    objek_pajak?: ObjekPajakUpdateManyWithoutSubjek_pajakNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutCalon_subjekNestedInput
  }

  export type SubjekPajakUncheckedUpdateWithoutUserInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    objek_pajak?: ObjekPajakUncheckedUpdateManyWithoutSubjek_pajakNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutCalon_subjekNestedInput
  }

  export type SubjekPajakUncheckedUpdateManyWithoutUserInput = {
    nik?: StringFieldUpdateOperationsInput | string
    nama_subjek?: StringFieldUpdateOperationsInput | string
    status_wp?: EnumStatusWpFieldUpdateOperationsInput | $Enums.StatusWp
    pekerjaan?: EnumPekerjaanFieldUpdateOperationsInput | $Enums.Pekerjaan
    npwp?: NullableStringFieldUpdateOperationsInput | string | null
    no_hp?: NullableStringFieldUpdateOperationsInput | string | null
    alamat_jalan?: StringFieldUpdateOperationsInput | string
    blok_kav_no_subjek?: NullableStringFieldUpdateOperationsInput | string | null
    rw?: NullableStringFieldUpdateOperationsInput | string | null
    rt?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan?: StringFieldUpdateOperationsInput | string
    kabupaten?: StringFieldUpdateOperationsInput | string
    kode_pos?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObjekPajakUpdateWithoutUser_nonaktifInput = {
    nop?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak?: SubjekPajakUpdateOneRequiredWithoutObjek_pajakNestedInput
    transaksi?: TransaksiSpopUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakUncheckedUpdateWithoutUser_nonaktifInput = {
    nop?: StringFieldUpdateOperationsInput | string
    nik_subjek?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiSpopUncheckedUpdateManyWithoutObjek_bersamaNestedInput
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutObjek_asalNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutObjek_pajakNestedInput
  }

  export type ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifInput = {
    nop?: StringFieldUpdateOperationsInput | string
    nik_subjek?: StringFieldUpdateOperationsInput | string
    no_persil?: NullableStringFieldUpdateOperationsInput | string | null
    jalan_op?: StringFieldUpdateOperationsInput | string
    blok_kav_no?: NullableStringFieldUpdateOperationsInput | string | null
    rw_op?: NullableStringFieldUpdateOperationsInput | string | null
    rt_op?: NullableStringFieldUpdateOperationsInput | string | null
    kelurahan_op?: StringFieldUpdateOperationsInput | string
    kecamatan_op?: StringFieldUpdateOperationsInput | string
    luas_tanah?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    zona_nilai_tanah?: NullableStringFieldUpdateOperationsInput | string | null
    jenis_tanah?: EnumJenisTanahFieldUpdateOperationsInput | $Enums.JenisTanah
    jumlah_bangunan?: IntFieldUpdateOperationsInput | number
    luas_bangunan?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njop_tanah?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_bangunan?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    njop_total?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    tahun_penilaian?: NullableIntFieldUpdateOperationsInput | number | null
    status_aktif?: BoolFieldUpdateOperationsInput | boolean
    nonaktif_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaksiSpopUpdateWithoutPengajuInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    verifikator?: UserUpdateOneWithoutTransaksi_diverifikasiNestedInput
    objek_bersama?: ObjekPajakUpdateOneWithoutTransaksiNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateWithoutPengajuInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateManyWithoutPengajuInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    id_verifikator?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaksiSpopUpdateWithoutVerifikatorInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pengaju?: UserUpdateOneRequiredWithoutTransaksi_diajukanNestedInput
    objek_bersama?: ObjekPajakUpdateOneWithoutTransaksiNestedInput
    detail_asal?: DetailTransaksiAsalUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateWithoutVerifikatorInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    detail_asal?: DetailTransaksiAsalUncheckedUpdateManyWithoutTransaksiNestedInput
    detail_tujuan?: DetailTransaksiTujuanUncheckedUpdateManyWithoutTransaksiNestedInput
    lampiran?: LampiranDokumenUncheckedUpdateManyWithoutTransaksiNestedInput
    sppt?: SpptUncheckedUpdateManyWithoutTransaksi_asalNestedInput
  }

  export type TransaksiSpopUncheckedUpdateManyWithoutVerifikatorInput = {
    id_transaksi?: StringFieldUpdateOperationsInput | string
    no_formulir?: NullableStringFieldUpdateOperationsInput | string | null
    id_user?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    jenis_transaksi?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    nop_bersama?: NullableStringFieldUpdateOperationsInput | string | null
    no_sppt_lama?: NullableStringFieldUpdateOperationsInput | string | null
    nama_pengaju?: NullableStringFieldUpdateOperationsInput | string | null
    menggunakan_kuasa?: BoolFieldUpdateOperationsInput | boolean
    tanggal_pengajuan?: DateTimeFieldUpdateOperationsInput | Date | string
    status_ajuan?: EnumStatusAjuanFieldUpdateOperationsInput | $Enums.StatusAjuan
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    catatan_bakeuda?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LampiranDokumenUpdateWithoutUploaderInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiSpopUpdateOneRequiredWithoutLampiranNestedInput
  }

  export type LampiranDokumenUncheckedUpdateWithoutUploaderInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LampiranDokumenUncheckedUpdateManyWithoutUploaderInput = {
    id_dokumen?: StringFieldUpdateOperationsInput | string
    id_transaksi?: StringFieldUpdateOperationsInput | string
    jenis_dokumen?: EnumJenisDokumenFieldUpdateOperationsInput | $Enums.JenisDokumen
    keterangan_dokumen?: NullableStringFieldUpdateOperationsInput | string | null
    url_file?: StringFieldUpdateOperationsInput | string
    uploaded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpptUpdateWithoutGeneratorInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    objek_pajak?: ObjekPajakUpdateOneRequiredWithoutSpptNestedInput
    transaksi_asal?: TransaksiSpopUpdateOneWithoutSpptNestedInput
  }

  export type SpptUncheckedUpdateWithoutGeneratorInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    nop?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id_transaksi_asal?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SpptUncheckedUpdateManyWithoutGeneratorInput = {
    id_sppt?: StringFieldUpdateOperationsInput | string
    nop?: StringFieldUpdateOperationsInput | string
    tahun_pajak?: IntFieldUpdateOperationsInput | number
    njop_kena_pajak?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    njoptkp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tarif_pbb?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pbb_terutang?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tgl_jatuh_tempo?: DateTimeFieldUpdateOperationsInput | Date | string
    status_bayar?: EnumStatusBayarFieldUpdateOperationsInput | $Enums.StatusBayar
    tgl_bayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    id_transaksi_asal?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyWilayahInput = {
    id_user?: string
    username: string
    password_hash: string
    nama_lengkap: string
    role: $Enums.Role
    nip?: string | null
    is_active?: boolean
    created_at?: Date | string
  }

  export type UserUpdateWithoutWilayahInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateWithoutWilayahInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    subjek_pajak_dibuat?: SubjekPajakUncheckedUpdateManyWithoutUserNestedInput
    objek_nonaktif?: ObjekPajakUncheckedUpdateManyWithoutUser_nonaktifNestedInput
    transaksi_diajukan?: TransaksiSpopUncheckedUpdateManyWithoutPengajuNestedInput
    transaksi_diverifikasi?: TransaksiSpopUncheckedUpdateManyWithoutVerifikatorNestedInput
    lampiran_diupload?: LampiranDokumenUncheckedUpdateManyWithoutUploaderNestedInput
    sppt_digenerate?: SpptUncheckedUpdateManyWithoutGeneratorNestedInput
  }

  export type UserUncheckedUpdateManyWithoutWilayahInput = {
    id_user?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    nama_lengkap?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    nip?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}