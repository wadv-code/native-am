import { isStringifiedJSON } from "@/utils/lib";
import { isObject } from "@/utils/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageManager {
  version: string;

  constructor(version?: string) {
    this.version = version ?? "0.0.0";
  }

  // 存储数据
  public async set(key: string, value: any) {
    try {
      if (isObject(value) || Array.isArray(value)) {
        value = JSON.stringify(value);
      }
      await AsyncStorage.setItem(this.getKey(key), value);
    } catch (error) {
      // 处理错误
      console.error("Error saving data: ", error);
    }
  }

  // 获取数据
  public async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(this.getKey(key));
      if (isStringifiedJSON(value)) {
        return JSON.parse(value || "") || null;
      } else {
        return value as T;
      }
    } catch (error) {
      // 处理错误
      console.error("Error retrieving data: ", error);
      return null;
    }
  }

  // 删除数据
  public async remove(key: string) {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
    } catch (error) {
      // 处理错误
      console.error("Error removing data: ", error);
    }
  }

  // 清除缓存
  public async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      // 处理错误
      console.error("Error clear data: ", error);
    }
  }

  // 存储key
  public getKey(key: string) {
    return `${this.version}_${key}`;
  }
}

// 版本
const storageManager = new StorageManager("1.0.0");

export { storageManager };
