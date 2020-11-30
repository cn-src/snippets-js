import axios from "axios";
import ServerMock from "mock-http-server";
import AxiosClient from "@/AxiosClient";
import FormData from "form-data";

interface DemoModel {
    p1: number;
}

let mockServer;
const client = new AxiosClient(
    axios,
    {
        onDelete: {
            preRequest() {
                console.log("## beforeDelete ##");
                return true;
            },
            onThen() {
                console.log("## afterDelete ##");
            },
        },
    },
    {
        extractData: true,
        extractCatchData: true,
    }
);

const api = {
    getDemo: client.get<DemoModel>("http://localhost:6666/{pv}/getDemo"),
    getError: client.get("http://localhost:6666/error"),
    postDemo: client.post("http://localhost:6666/postDemo"),
    postFormDemo: client.postForm("http://localhost:6666/postDemo"),
    postFormDataDemo: client.postFormData("http://localhost:6666/postDemo"),
    deleteDemo: client.delete("http://localhost:6666/deleteDemo"),
    deleteDemo2: client.delete("http://localhost:6666/deleteDemo", {
        handler: {
            preRequest(reqData) {
                console.log("deleteDemo2 beforeRequest", reqData);
                return true;
            },
            onThen(reqData) {
                console.log("deleteDemo2 afterResponse", reqData);
            },
        },
    }),
};

test("get", (done) => {
    api.getDemo({ p1: 1 }, { pathVariables: { pv: "demo" } }).then(function (data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

test("error", (done) => {
    api.getError()
        .then(function () {
            done();
        })
        .catch(function (data) {
            expect(data).toBe('Not Found');
            done();
        });
});

test("post", (done) => {
    api.postDemo().then(function (data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

test("post_HasData", (done) => {
    api.postDemo({ d1: "d1" }).then(function (data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

test("postForm", (done) => {
    api.postFormDemo({ d1: "d1" }).then(function (data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

test("postFormData", (done) => {
    // @ts-ignore
    global.FormData = FormData;

    api.postFormDataDemo({ d1: "d1" }).then(function (data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

test("delete", (done) => {
    api.deleteDemo().then(function (data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

test("delete_2", (done) => {
    api.deleteDemo2().then(function (data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

beforeEach((done) => {
    mockServer = new ServerMock({ host: "localhost", port: 6666 });
    mockServer.start(done);

    mockServer.on({
        method: "GET",
        path: "/demo/getDemo",
        reply: {
            status: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" }),
        },
    });
    mockServer.on({
        method: "GET",
        path: "/error",
        reply: {
            status: 400,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" }),
        },
    });

    mockServer.on({
        method: "POST",
        path: "/postDemo",
        reply: {
            status: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" }),
        },
    });

    mockServer.on({
        method: "DELETE",
        path: "/deleteDemo",
        reply: {
            status: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" }),
        },
    });
});

afterEach((done) => {
    mockServer.stop(done);
});
