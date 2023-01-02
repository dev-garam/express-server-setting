import {
  assignInWith,
  isBoolean,
  isEmpty as _isEmpty,
  isObject as _isObject,
  isNumber,
  partialRight,
  isArray,
  isFunction,
} from "lodash";

const customizer = (objValue?: any, srcValue?: any) =>
  !srcValue ? objValue : srcValue;

// object exnted 값이 있는 것 우선
export const assignInByExistence = partialRight(assignInWith, customizer);

export const isEmpty = (value: any) =>
  _isEmpty(value) && !(isNumber(value) || isBoolean(value));

// 빈 value key 제거
export const removeEmpty = (obj: any) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => !isEmpty(v)));

// object deep check
export const isObject = (data: any) =>
  _isObject(data) && !isArray(data) && !isFunction(data);
