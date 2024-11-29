import { isStringifiedJSON } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageManager {
  version: string;

  constructor(version?: string) {
    this.version = version ?? "0.0.0";
  }

  // 存储数据
  public async set(key: string, value: any) {
    try {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      await AsyncStorage.setItem(this.getKey(key), value);
    } catch (error) {
      // 处理错误
      console.error("Error saving data: ", error);
    }
  }

  // 获取数据
  public async get(key: string) {
    try {
      const value = await AsyncStorage.getItem(this.getKey(key));
      if (isStringifiedJSON(value)) {
        return JSON.parse(value || "") || null;
      } else {
        return value;
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

  // 存储key
  public getKey(key: string) {
    return `${this.version}_${key}`;
  }
}

// 版本
const storageManager = new StorageManager("1.0.0");

export { storageManager };
