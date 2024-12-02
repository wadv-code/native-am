export const isObject = (val: unknown) =>
  val !== null && typeof val === "object";
export const isArray = Array.isArray;

// const NO = () => false;
// const isOn = (key) =>
//   key.charCodeAt(0) === 111 &&
//   key.charCodeAt(1) === 110 && // uppercase letter
//   (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
// const isModelListener = (key) => key.startsWith("onUpdate:");
// const extend = Object.assign;
// const remove = (arr, el) => {
//   const i = arr.indexOf(el);
//   if (i > -1) {
//     arr.splice(i, 1);
//   }
// };
// const hasOwnProperty = Object.prototype.hasOwnProperty;
// const hasOwn = (val, key) => hasOwnProperty.call(val, key);
// const isArray = Array.isArray;
// const isMap = (val) => toTypeString(val) === "[object Map]";
// const isSet = (val) => toTypeString(val) === "[object Set]";
// const isDate = (val) => toTypeString(val) === "[object Date]";
// const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
// const isFunction = (val) => typeof val === "function";
// const isString = (val) => typeof val === "string";
// const isSymbol = (val) => typeof val === "symbol";
// const isPromise = (val) => {
//   return (
//     (isObject(val) || isFunction(val)) &&
//     isFunction(val.then) &&
//     isFunction(val.catch)
//   );
// };
// const objectToString = Object.prototype.toString;
// const toTypeString = (value) => objectToString.call(value);
// const toRawType = (value) => {
//   return toTypeString(value).slice(8, -1);
// };
// const isPlainObject = (val) => toTypeString(val) === "[object Object]";
// const isIntegerKey = (key) =>
//   isString(key) &&
//   key !== "NaN" &&
//   key[0] !== "-" &&
//   "" + parseInt(key, 10) === key;
// const isReservedProp = /* @__PURE__ */ makeMap(
//   // the leading comma is intentional so empty string "" is also included
//   ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
// );
// const isBuiltInDirective = /* @__PURE__ */ makeMap(
//   "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
// );
