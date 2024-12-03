// https://www.npmjs.com/package/mitt
import type { MittType } from "@/types/mitt";
import mitt from "mitt";

// 类型
const emitter = mitt<MittType>();

// 导出
export { emitter };
