import axios from "axios";
import ServerMock from "mock-http-server";
import AxiosClient, { Json } from "@/AxiosClient";
import FormData from "form-data";

interface DemoModel {
    p1: number;
}

const host = "localhost";
const port = 9898;
const protocol = `http://${host}:${port}`;
const mockServer = new ServerMock({ host, port });
const client = new AxiosClient(
    axios,
    {
        extractData: true,
        extractCatchData: true,
        onDelete: {
            preRequest() {
                console.log("## beforeDelete ##");
                return true;
            },
            onThen() {
                console.log("## afterDelete ##");
            }
        }
    }
);

const api = {
    getDemo: client.get<Json, DemoModel>(protocol + "/{pv}/getDemo"),
    getError: client.get(protocol + "/error"),
    postDemo: client.post(protocol + "/postDemo"),
    postFormDemo: client.postForm(protocol + "/postDemo"),
    postFormDataDemo: client.postFormData(protocol + "/postDemo"),
    deleteDemo: client.delete(protocol + "/deleteDemo"),
    deleteDemo2: client.delete(protocol + "/deleteDemo", {
        preRequest(reqData) {
            console.log("deleteDemo2 beforeRequest", reqData);
            return true;
        },
        onThen(reqData) {
            console.log("deleteDemo2 afterResponse", reqData);
        }
    })
};

test("get", (done) => {
    api.getDemo
        .pathParams({ pv: "demo" })
        .params({ p1: 1 })
        .fetch()
        .then(function(data) {
            expect(data).toStrictEqual({ hello: "world" });
            done();
        });
});

test("error", (done) => {
    api.getError
        .fetch()
        .then(function() {
            done();
        })
        .catch(function(data) {
            expect(data).toStrictEqual({ hello: "world" });
            done();
        });
});

test("post", (done) => {
    api.postDemo
        .fetch()
        .then(function(data) {
            expect(data).toStrictEqual({ hello: "world" });
            done();
        });
});

test("post_HasData", (done) => {
    api.postDemo
        .data({ d1: "d1" })
        .fetch()
        .then(function(data) {
            expect(data).toStrictEqual({ hello: "world" });
            done();
        });
});

test("postForm", (done) => {
    api.postFormDemo
        .data({ d1: "d1" })
        .fetch()
        .then(function(data) {
            expect(data).toStrictEqual({ hello: "world" });
            done();
        });
});

test("postFormData", (done) => {
    // @ts-ignore
    global.FormData = FormData;

    api.postFormDataDemo
        .data({ d1: "d1" })
        .fetch()
        .then(function(data) {
            expect(data).toStrictEqual({ hello: "world" });
            done();
        });
});

test("delete", (done) => {
    api.deleteDemo
        .fetch()
        .then(function(data) {
            expect(data).toStrictEqual({ hello: "world" });
            done();
        });
});

test("delete_2", (done) => {
    api.deleteDemo2.fetch().then(function(data) {
        expect(data).toStrictEqual({ hello: "world" });
        done();
    });
});

beforeAll((done) => {
    mockServer.start(done);

    mockServer.on({
        method: "GET",
        path: "/demo/getDemo",
        reply: {
            status: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" })
        }
    });
    mockServer.on({
        method: "GET",
        path: "/error",
        reply: {
            status: 400,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" })
        }
    });

    mockServer.on({
        method: "POST",
        path: "/postDemo",
        reply: {
            status: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" })
        }
    });

    mockServer.on({
        method: "DELETE",
        path: "/deleteDemo",
        reply: {
            status: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ hello: "world" })
        }
    });
});

afterAll((done) => {
    mockServer.stop(done);
});
