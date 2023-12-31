import {
  appendKey,
  getLastKeyPart,
  removeLastKeyPart,
  recursivleyIterate,
  notNullFilter,
  notNullOrUndefinedFilter,
} from "@/utils";

describe("appendKey", () => {
  it("appends key to part when key is not null", () => {
    const key = "parent";
    const part = "child";
    const result = appendKey(key, part);
    expect(result).toBe(`${key}.${part}`);
  });

  it("returns part when key is null", () => {
    const key = null;
    const part = "child";
    const result = appendKey(key, part);
    expect(result).toBe(part);
  });
});

describe("getLastKeyPart", () => {
  it("gets last part in a key", () => {
    const key = "parent.child";
    const result = getLastKeyPart(key);
    expect(result).toBe("child");
  });

  it('returns key when string doesn\'t have a "."', () => {
    const key = "parent";
    const result = getLastKeyPart(key);
    expect(result).toBe("parent");
  });
});

describe("removeLastKeyPart", () => {
  it("removes last part of a key", () => {
    const key = "parent.child";
    const result = removeLastKeyPart(key);
    expect(result).toBe("parent");
  });

  it('returns key when string doesn\'t have a "."', () => {
    const key = "parent";
    const result = removeLastKeyPart(key);
    expect(result).toBe("parent");
  });

  it("returns empty string when key is null", () => {
    const key = null;
    const result = removeLastKeyPart(key);
    expect(result).toBe("");
  });
});

describe("recursivleyIterate", () => {
  it("iterates arrays", () => {
    const callback = jest.fn();
    const array = [1, 2, 3];
    recursivleyIterate(array, callback);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("iterates objects", () => {
    const callback = jest.fn();
    const object = {
      key1: "v1",
      key2: "v2",
      key3: "v3",
    };
    recursivleyIterate(object, callback);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("calls callback function", () => {
    let called = false;
    const callback = (value: string, key: string) => {
      called = value === "value" && key === "key";
    };
    const object = {
      key: "value",
    };
    recursivleyIterate(object, callback);
    expect(called).toBeTruthy;
  });

  it("recursivley iterates when value is array", () => {
    const callback = jest.fn();
    const object = {
      array: [1, 2, 3],
    };
    recursivleyIterate(object, callback);
    expect(callback).toHaveBeenCalledTimes(4);
  });

  it("recursivley iterates when value is object", () => {
    const callback = jest.fn();
    const object = {
      child: {
        key1: "v1",
        key2: "v2",
        key3: "v3",
      },
    };
    recursivleyIterate(object, callback);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe("notNullFilter", () => {
  it("filters null from array", () => {
    const arr = [1, null, "str"];
    const result = arr.filter(notNullFilter);
    expect(result).toEqual([1, "str"]);
  });
});

describe("notNullOrUndefinedFilter", () => {
  it("filters null and undefined from array", () => {
    const arr = [1, null, undefined, "str"];
    const result = arr.filter(notNullOrUndefinedFilter);
    expect(result).toEqual([1, "str"]);
  });
});
