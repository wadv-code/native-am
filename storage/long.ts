import { isArray } from "@/utils/helper";
import { storage } from "./storage";

export const storageVersion = "1.1.2";

export const getStorageKey = (key: string) => {
  return `${storageVersion}${key}`;
};

/**
 * 获取数据
 * @param key storage key(必填)
 * @param defaultValue 默认值（必填）
 * @returns T
 */
export async function getStorage<T = unknown>(
  key: string,
  defaultValue: T
): Promise<T> {
  return await new Promise((resolve) => {
    storage
      .load<T>({ key: getStorageKey(key) })
      .then((ret) => {
        if (isArray(defaultValue)) {
          resolve(JSON.parse(ret as string));
        } else {
          resolve(ret);
        }
      })
      .catch(() => {
        resolve(defaultValue as T);
      });
  });
}

/**
 * 保存数据
 * @param key storage key(必填)
 * @param defaultValue 默认值（必填）
 * @returns boolean 成功或失败
 */
export async function setStorage<T = unknown>(
  key: string,
  data: T
): Promise<boolean> {
  return await new Promise((resolve) => {
    storage
      .save({
        key: getStorageKey(key),
        data: isArray(data) ? JSON.stringify(data) : data,
      })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

/**
 * 删除数据
 * @param key storage key(必填)
 * @returns boolean 成功或失败
 */
export async function removeStorage(key: string): Promise<boolean> {
  return await new Promise((resolve) => {
    storage
      .remove({ key: getStorageKey(key) })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

/**
 * 删除数据
 * @returns boolean 成功或失败
 */
export async function clearStorage(): Promise<boolean> {
  return await new Promise((resolve) => {
    storage
      .clearMap()
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}
