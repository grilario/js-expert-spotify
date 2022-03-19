import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import superTest from "supertest";
import portFinder from "portfinder";
import fs from "fs";
import { Transform } from "stream";
import { setTimeout } from "timers/promises";
import Server from "../../../server/server.js";
import config from "../../../server/config.js";

const getAvaliablePort = portFinder.getPortPromise;
const RETENTION_DATA_PERIOD = 200;
const {
  dir: { publicDirectory },
  pages: { homeHTML, controllerHTML },
} = config;

describe("API E2E Suit Test", () => {
  let testServer = superTest(Server());

  function pipeAndReadStreamData(stream, onChunk) {
    const transform = new Transform({
      transform(chunk, encoding, cb) {
        onChunk(chunk);

        cb(null, chunk);
      },
    });
    return stream.pipe(transform);
  }

  const commandResponse = JSON.stringify({ result: "ok" });
  const possibleCommands = {
    start: "start",
    stop: "stop",
    fart: "fart",
    boo: "boo!",
    applause: "applause"
  };

  test("it should redirect to /home in GET /", async () => {
    const { header, status } = await testServer.get("/");

    expect(status).toBe(302);
    expect(header.location).toBe("/home");
  });

  test("it should receive home html in GET /home", async () => {
    const url = "/home";
    const { status, text } = await testServer.get(url);
    const homePage = await fs.promises.readFile(
      `${publicDirectory}/${homeHTML}`
    );

    expect(status).toBe(200);
    expect(text).toBe(homePage.toString());
  });

  test("it should receive controller html in GET /controller", async () => {
    const url = "/controller";
    const { status, text } = await testServer.get(url);
    const homePage = await fs.promises.readFile(
      `${publicDirectory}/${controllerHTML}`
    );

    expect(status).toBe(200);
    expect(text).toBe(homePage.toString());
  });

  test("it should receive 404 in POST /", async () => {
    const url = "/";
    const { status } = await testServer.post(url);
    expect(status).toBe(404);
  });

  describe("Static files", () => {
    test("it should receive styles.css in GET /home/css/styles.css", async () => {
      const file = "/home/css/styles.css";
      const expectedText = await fs.promises.readFile(
        `${publicDirectory}/${file}`
      );
      const { status, header, text } = await testServer.get(file);

      expect(status).toStrictEqual(200);
      expect(header["content-type"]).toStrictEqual("text/css");
      expect(text).toStrictEqual(expectedText.toString());
    });

    test("it should receive animation.js in GET /home/js/animation.js", async () => {
      const file = "/home/js/animation.js";
      const expectedText = await fs.promises.readFile(
        `${publicDirectory}/${file}`
      );
      const { status, header, text } = await testServer.get(file);

      expect(status).toStrictEqual(200);
      expect(header["content-type"]).toStrictEqual("text/javascript");
      expect(text).toStrictEqual(expectedText.toString());
    });

    test("it should receive index.html in GET /home/index.html", async () => {
      const file = "/home/index.html";
      const expectedText = await fs.promises.readFile(
        `${publicDirectory}/${file}`
      );
      const { status, header, text } = await testServer.get(file);

      expect(status).toStrictEqual(200);
      expect(header["content-type"]).toStrictEqual("text/html");
      expect(text).toStrictEqual(expectedText.toString());
    });

    test("it should receive 404 in GET /home/css/unknown.css", async () => {
      const file = "/home/css/unknown.css";
      const { status } = await testServer.get(file);
      expect(status).toBe(404);
    });
  });

  describe("Client Workflow", () => {
    async function getTestServer() {
      const getSuperTest = (port) => superTest(`http://localhost:${port}`);
      const port = await getAvaliablePort();

      return new Promise((resolve, reject) => {
        const server = Server()
          .listen(port)
          .once("listening", () => {
            const testServer = getSuperTest(port);
            const response = {
              testServer,
              kill() {
                server.close();
              },
            };

            return resolve(response);
          })
          .once("error", reject);
      });
    }

    function commandSender(testServer) {
      return {
        async send(command) {
          const response = await testServer
            .post("/controller")
            .send({ command });

          expect(response.text).toStrictEqual(commandResponse);
        },
      };
    }

    test("it should not received data stream if the process is not playing", async () => {
      const server = await getTestServer();
      const onChunk = jest.fn();
      pipeAndReadStreamData(server.testServer.get("/stream"), onChunk);

      await setTimeout(RETENTION_DATA_PERIOD);
      server.kill();

      expect(onChunk).not.toHaveBeenCalled();
    });

    test("it should received data stream if the process is playing", async () => {
      const server = await getTestServer();
      const onChunk = jest.fn();
      const { send } = commandSender(server.testServer);
      pipeAndReadStreamData(server.testServer.get("/stream"), onChunk);

      await send(possibleCommands.start);
      await setTimeout(RETENTION_DATA_PERIOD);
      await send(possibleCommands.stop);

      const [[buffer]] = onChunk.mock.calls;

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(500);

      server.kill();
    });

    test("it should received data stream if the process is playing and added fx", async () => {
      const server = await getTestServer();
      const onChunk = jest.fn();
      const { send } = commandSender(server.testServer);
      pipeAndReadStreamData(server.testServer.get("/stream"), onChunk);

      await send(possibleCommands.start);
      await send(possibleCommands.fart);
      await setTimeout(RETENTION_DATA_PERIOD);
      await send(possibleCommands.stop);

      const [[buffer]] = onChunk.mock.calls;

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(500);

      server.kill();
    });

    test("it should received data stream if the process is playing and added multiples fx", async () => {
      const server = await getTestServer();
      const onChunk = jest.fn();
      const { send } = commandSender(server.testServer);
      pipeAndReadStreamData(server.testServer.get("/stream"), onChunk);

      await send(possibleCommands.start);
      await send(possibleCommands.fart);
      await send(possibleCommands.boo);
      await send(possibleCommands.applause);
      await setTimeout(RETENTION_DATA_PERIOD);
      await send(possibleCommands.stop);

      const [[buffer]] = onChunk.mock.calls;

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(500);

      server.kill();
    });
  });
});
