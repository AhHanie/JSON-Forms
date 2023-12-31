import { isArray, isPlainObject, each, isUndefined, isNull } from "lodash-es";

export function appendKey(key: string | null, part: string): string {
  if (!key) {
    return part;
  }
  return `${key}.${part}`;
}

export function getLastKeyPart(key: string): string {
  if (!key.includes(".")) return key;
  return key.substring(key.lastIndexOf(".") + 1);
}

export function removeLastKeyPart(key: string | null): string {
  if (!key) {
    return "";
  }

  const lastIndexOfDot = key.lastIndexOf(".");
  if (lastIndexOfDot === -1) {
    return key;
  }

  return key.substring(0, lastIndexOfDot);
}

export function recursivleyIterate(
  object: any,
  callback: (value: any, key: string, path: string) => void,
  path: string = ""
): void {
  each(object, function (value, key) {
    if (isArray(value) || isPlainObject(value)) {
      recursivleyIterate(value, callback, appendKey(path, key));
    }
    callback(value, key, path);
  });
}

export function notNullFilter<T>(val: T | null): val is T {
  return val !== null;
}

export function notNullOrUndefinedFilter<T>(val: T) {
  return !isUndefined(val) && !isNull(val);
}
