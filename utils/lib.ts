import type { MaterialIconsName } from "@/types";
import dayjs, { type ConfigType } from "dayjs";
import { isString } from "./helper";

// token
export const TokenKey = "Authorization";

/**
 * 毫秒转时分秒格式
 * @param ms 毫秒
 * @returns
 */
export function formatMilliseconds(ms?: number): string {
  if (!ms) return "00:00";
  // 1 second is 1000 milliseconds
  const seconds = Math.floor((ms / 1000) % 60);
  // 1 minute is 60 seconds
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  // 1 hour is 60 minutes
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  // Format hours, minutes, and seconds with leading zeros if needed
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // return string
  const result: string[] = [formattedMinutes, formattedSeconds];
  // hours
  if (hours) result.unshift(formattedHours);
  return result.join(":");
}

/**
 * 计算音乐时长和进度
 * @param position
 * @param duration
 * @returns
 */
export function formatAudioPosition(
  position: number = 0,
  duration: number = 0
) {
  const progress = parseFloat((position / duration).toFixed(2));
  const currentFormat = formatMilliseconds(position);
  const durationFormat = formatMilliseconds(duration);
  return {
    progress,
    currentFormat,
    durationFormat,
  };
}

/**
 * 判断一个字符串是否是通过JSON.stringify转换而来
 * @param str
 * @returns
 */
export function isStringifiedJSON(str: string | null) {
  try {
    if (!str) return null;
    const jsonObj = JSON.parse(str);
    // 检查解析结果是否为对象或数组，因为JSON.stringify通常将对象或数组转为字符串
    return jsonObj && (typeof jsonObj === "object" || Array.isArray(jsonObj));
  } catch {
    // 如果解析失败，说明不是有效的JSON字符串
    return false;
  }
}

/**
 * 定义一个函数来计算并格式化时间差
 * @param date
 * @returns
 */
export function formatTimeAgo(date: ConfigType) {
  const now = dayjs(); // 当前时间
  const past = dayjs(date); // 过去的时间
  const diffInSeconds = now.diff(past, "second"); // 计算时间差（秒）

  // 根据时间差的大小来返回不同的字符串
  if (diffInSeconds < 60) {
    return "刚刚";
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`;
  } else if (diffInSeconds < 2592000) {
    // 30天以内
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  } else if (diffInSeconds < 31536000) {
    // 1年以内
    return `${Math.floor(diffInSeconds / (86400 * 30))}个月前`;
  } else {
    return `${Math.floor(diffInSeconds / 31536000)}年前`;
  }
}

/**
 * 是否是图片格式
 * @param fileName
 * @returns
 */
export function isImageFile(fileName: string): boolean {
  // 定义一个正则表达式，匹配常见的图片文件扩展名（不区分大小写）
  const imageRegex = /\.(jpeg|jpg|png|gif|bmp|svg|tiff|webp)$/i;

  // 使用正则表达式的 test 方法来检查文件名
  return imageRegex.test(fileName);
}

/**
 * 是否是音频格式
 * @param fileName
 * @returns
 */
export function isAudioFile(fileName: string): boolean {
  // 定义一个正则表达式，匹配常见的音频文件扩展名（不区分大小写）
  const audioRegex = /\.(mp3|wav|ogg|flac|aac|m4a|wma|aiff|au)$/i;

  // 使用正则表达式的 test 方法来检查文件名
  return audioRegex.test(fileName);
}

/**
 * 是否是音频格式
 * @param fileName
 * @returns
 */
export function isVideoFile(fileName: string): boolean {
  // 定义一个正则表达式，匹配常见的音频文件扩展名（不区分大小写）
  const videoRegex =
    /\.(mp4|avi|mov|wmv|flv|mkv|webm|m4v|mpg|mpeg|ts|m2ts|vob|divx|xvid)$/i;

  // 使用正则表达式的 test 方法来检查文件名
  return videoRegex.test(fileName);
}

export type FnIconSymbol = (
  name: string,
  is_dir?: boolean
) => MaterialIconsName;

/**
 * 根据名称后缀获取图标
 * @returns  SymbolViewProps['name']
 */
export const getIconSymbol: FnIconSymbol = (name: string, is_dir?: boolean) => {
  if (is_dir) {
    return "folder";
  } else if (isImageFile(name)) {
    return "photo";
  } else if (isAudioFile(name)) {
    return "music-note";
  } else if (isVideoFile(name)) {
    return "ondemand-video";
  } else {
    return "file-present";
  }
};

/**
 * 文件大小转换
 * @param bytes size
 * @param decimal 保留小数
 * @returns
 */
export function formatFileSize(
  bytes: number | undefined,
  decimal: number = 2
): string {
  if (!bytes || bytes === 0) {
    return "0 Bytes";
  }

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  let i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }

  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(decimal))} ${
    sizes[i]
  }`;
}

/**
 * 格式化路径，将多个路径片段合并成一个标准化的路径
 *
 * @param {string[]} segments 路径片段数组
 * @returns {string} 标准化后的路径
 */
export function formatPath(...segments: string[]): string {
  // 合并所有路径片段，并用 '/' 分隔
  let path = segments.join("/");

  // 使用正则表达式处理冗余的斜杠和其他特殊情况
  path = path
    .replace(/\/\/+/g, "/") // 替换多个连续的斜杠为单个斜杠
    .replace(/\/+$/, ""); // 去掉路径结尾的斜杠

  return path;
}

/**
 * 去掉路径最后一个斜杠的内容
 * @param path
 * @returns
 */
export function removeLastPath(path: string) {
  const index = path.lastIndexOf("/");
  return path.replace(path.substring(index, path.length), "");
}

/**
 * 首字母大写
 * @param str
 * @returns
 */
export function capitalizeFirstLetter(str?: string) {
  if (!str || typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @description 随机数（闭区间）
 * @param num
 */
export const randomNum = (num: number) => Math.floor(Math.random() * (num + 1));

/**
 * 找出所有网址
 * @param obj
 * @param urls
 * @returns
 */
export function findAllUrls(obj: any, urls: string[] = []): string[] {
  if (isString(obj) && isValidUrl(obj)) {
    urls.push(obj);
  } else if (typeof obj === "object") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        findAllUrls(obj[key], urls);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((element) => findAllUrls(element, urls));
  }
  return urls;
}

/**
 * 是否是网址
 * @param str
 * @returns
 */
export function isValidUrl(str: string): boolean {
  const urlPattern =
    /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
  return urlPattern.test(str);
}

/**
 * 防抖
 * @param func
 * @param wait
 * @returns
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * 节流
 * @param func
 * @param limit
 * @returns
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number = 0;
  return function (...args: Parameters<T>) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
