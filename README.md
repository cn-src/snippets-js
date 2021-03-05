![GitHub](https://img.shields.io/github/license/cn-src/snippets-js)
![CI](https://github.com/cn-src/snippets-js/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/cn-src/snippets-js/branch/master/graph/badge.svg)](https://codecov.io/gh/cn-src/snippets-js)

# snippets-js

> - 一些 js 代码片段
> - src 为 ts 版, js 版在 lib 目录
> - 用法可参考 `__tests__` 目录里的测试样例。

- assert
  - 参数校验
- AxiosClient
  - axios 简单封装

# AxiosClient
特性
* 支持配置项与参数分离：比如可以将 URL 和传入的参数分开，便于集中式管理 API。
* 支持统一回调函数：比如 delete 请求时，可自定义请求前，后，异常时的处理。
* 支持自动提取响应结果的 data。
* 支持链式传参
* 支持参数自动处理，比如在文件上传情况下将 js 对象转换成 FormData
* 支持相同 key 参数多值情况，可用数组来传递多值。