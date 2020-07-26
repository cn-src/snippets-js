import qs from "@/qs";

test("stringify", () => {
  const rs = qs.stringify({ k1: "v1", k2: " !@#$%^&*()-=<>:'" });
  expect(rs).toBe("k1=v1&k2=+!%40%23%24%25%5E%26*()-%3D%3C%3E%3A'");
});
