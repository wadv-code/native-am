/**
 * 字符串类型对象
 */
type Recordable<T> = Record<string, T>;

/**
 *  T | null 包装
 */
type Nullable<T> = null | T;

/**
 * T | Not null 包装
 */
type NonNullable<T> = T extends null | undefined ? never : T;
