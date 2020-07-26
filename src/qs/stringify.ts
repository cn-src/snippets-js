/**
 * 将对象字符串化成 application/x-www-form-urlencoded 所需的格式
 */
function stringify(object): string {
  if (typeof object !== "object") {
    throw new TypeError(
      `Expect: 'object' type, Actual: '${typeof object}' type`
    );
  }
  const rs: string[] = [];
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      rs.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`);
    }
  }
  return rs.join("&").replace(/%20/g, "+");
}

export default stringify;
