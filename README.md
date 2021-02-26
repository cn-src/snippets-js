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
* 支持回调函数：比如 delete 请求时，可自定义请求前，后，异常时的处理。
* 支持自动提取响应结果的 data。
* 支持链式传参
* 支持参数自动处理，比如将 js 对象转换成 FormData，相同 key 参数多值情况。

AxiosClient 构造函数支持3个参数:

* `axios`: axios 原始对象

* `handlers?: Handlers`: 生命周期处理函数，可在请求前，请求成功，请求失败等情况下处理相应的逻辑。
生命周期函数会传入请求数据和响应结果，在请求数据中可以传入 ui 对象。

* `config?: AxiosClientConfig`: 可配置 `extractData: true` 和 `extractCatchData: true` 自动提取响应和错误的 data 部分。
以及其它 axios 原生配置。

AxiosClient 封装的 get, post 等方法参数:

* `url`: url 或 url 模板，如: /demo/{id}

* `config?: AxiosClientMethodConfig`: 与 AxiosClient 配置基本一致，采用就近原则，优先使用此配置，没有则使用 AxiosClient 的配置。 

```js
const client = new AxiosClient(
    axios,
    {
        onDelete: {
            preRequest(requestData) {
                // 可以获取自定义传入的 ui 组件对象
                requestData.message.show()
                // 请求前置处理, 返回 false 可取消请求
                return true;
            },
            onThen(requestData, response) {
                // 请求成功后 then 处理
            },
        },
    },
    {
        extractData: true,
        extractCatchData: true,
        /* 其它 axios 原生配置 */
    }
);
// 统一声明 API
const api = {
    getDemo: client.get<DemoModel>("http://localhost:6666/{pv}/getDemo")
}
// 调用 API, pathVariables: url 上的参数变量
api.getDemo({ p1: 1 }, { pathVariables: { pv: "demo" }, uiComponent: message }).then(function (data) {
        // data 就是后端结果无需 res.data 提取
});
```