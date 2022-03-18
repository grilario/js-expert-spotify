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
const { dir: { publicDirectory }, pages: { homeHTML, controllerHTML } } = config

describe("API E2E Suit Test", () => {
  function pipeAndReadStreamData(stream, onChunk) {
    const transform = new Transform({
      transform(chunk, encoding, cb) {
        onChunk(chunk);

        cb(null, chunk);
      },
    });
    return stream.pipe(transform);
  }

  describe("Client wokflow", () => {
    const commandResponse = JSON.stringify({ result: "ok" });
    const possibleCommands = {
      start: "start",
      stop: "stop",
    };
    async function getTestServer() {
      const getSuperTest = (port) => superTest(`http://localhost:${port}`);
      const port = await getAvaliablePort();

      return new Promise((resolve, reject) => {
        const server = Server.listen(port)
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

    test("it should redirect to /home in GET /", async () => {
      const server = await getTestServer();
      const { header, status } = await server.testServer.get("/");

      await setTimeout(RETENTION_DATA_PERIOD);
      server.kill();

      expect(status).toBe(302);
      expect(header.location).toBe("/home");
    });

    test("it should receive home html in GET /home", async () => {
      const server = await getTestServer();
      const url = "/home";
      const { status, text } = await server.testServer.get(url);
      const homePage = fs.readFileSync(`${publicDirectory}/${homeHTML}`)

      await setTimeout(RETENTION_DATA_PERIOD);
      server.kill();

      expect(status).toBe(200);
      expect(text).toBe(homePage.toString())
    });

    test("it should receive controller html in GET /controller", async () => {
      const server = await getTestServer();
      const url = "/controller";
      const { status, text } = await server.testServer.get(url);
      const homePage = fs.readFileSync(`${publicDirectory}/${controllerHTML}`)

      await setTimeout(RETENTION_DATA_PERIOD);
      server.kill();

      expect(status).toBe(200);
      expect(text).toBe(homePage.toString())
    });

    test("it should receive styles.css in GET /home/css/styles.css", async () => {
      const server = await getTestServer();
      const url = "/home/css/styles.css";
      const { status, header } = await server.testServer.get(url);
      const onChunk = jest.fn();

      pipeAndReadStreamData(server.testServer.get(url), onChunk);

      await setTimeout(RETENTION_DATA_PERIOD);
      server.kill();

      expect(status).toBe(200);
      expect(header["content-type"]).toBe("text/css");
      expect(onChunk).toHaveBeenCalled();
    });

    test("it should receive 404 in GET /home/css/unknown.css", async () => {
      const server = await getTestServer();
      const url = "/home/css/unknown.css";
      const { status } = await server.testServer.get(url);

      await setTimeout(RETENTION_DATA_PERIOD);
      server.kill();

      expect(status).toBe(404);
    });

    test("it should receive 404 in POST /", async () => {
      const server = await getTestServer();
      const url = "/";
      const { status } = await server.testServer.post(url);

      await setTimeout(RETENTION_DATA_PERIOD);
      server.kill();

      expect(status).toBe(404);
    });

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
      expect(buffer.length).toBeGreaterThan(1000);

      server.kill();
    });
  });
});
