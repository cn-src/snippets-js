import axios from "axios";
import ServerMock from "mock-http-server";
import AxiosClient from "@/AxiosClient";
import FormData from "form-data";

interface DemoModel {
  p1: number;
}

let mockServer;
const client = new AxiosClient(axios);
const api = {
  getDemo: client.get<DemoModel>("http://localhost:6666/{pv}/getDemo"),
  getError: client.get("http://localhost:6666//error"),
  postDemo: client.post("http://localhost:6666/postDemo"),
  postFormDemo: client.postForm("http://localhost:6666/postDemo"),
  postFormDataDemo: client.postFormData("http://localhost:6666/postDemo"),
};

test("get", (done) => {
  api.getDemo({ p1: 1 }, { pv: "demo" }).then(function () {
    done();
  });
});

test("post", (done) => {
  api.postDemo().then(function () {
    done();
  });
});

test("post_HasData", (done) => {
  api.postDemo({ d1: "d1" }).then(function () {
    done();
  });
});

test("postForm", (done) => {
  api.postFormDemo({ d1: "d1" }).then(function () {
    done();
  });
});

test("postFormData", (done) => {
  // @ts-ignore
  global.FormData = FormData;

  api.postFormDataDemo({ d1: "d1" }).then(function () {
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
    method: "POST",
    path: "/postDemo",
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
