import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";
import config from "../../../server/config.js";
import fs from "fs";
import fsPromises from "fs/promises";
import { join } from "path";

describe("#Services", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const service = new Service();

  describe("getFileStream", () => {
    test("should return an object containing a stream and type", async () => {
      const filename = "/index.html";

      const mockReadableStream = TestUtil.genereateReadableStream([
        "<h1>Hello</h1>",
      ]);
      const expectedType = ".html";

      jest
        .spyOn(Service.prototype, Service.prototype.getFileInfo.name)
        .mockReturnValue({
          type: expectedType,
          name: filename,
        });

      jest
        .spyOn(Service.prototype, Service.prototype.createFileStream.name)
        .mockReturnValue(mockReadableStream);

      const result = await service.getFileStream(filename);

      expect(Service.prototype.createFileStream).toHaveBeenCalledWith(filename);
      expect(result).toEqual({
        stream: mockReadableStream,
        type: expectedType,
      });
    });

    test("should return an error if file does not exis", async () => {
      const filename = "/zaaum.html";

      jest
        .spyOn(Service.prototype, Service.prototype.getFileInfo.name)
        .mockRejectedValue(new Error("Error: ENOENT"));

      await expect(service.getFileStream(filename)).rejects.toThrow();
      expect(Service.prototype.getFileInfo).toHaveBeenCalledWith(filename);
    });
  });

  describe("getFileInfo", () => {
    test("should return an object containing a name and type", async () => {
      const filename = "/index.html";
      const expectedfullFilePath = join(config.dir.publicDirectory, filename);
      const expectedResult = {
        type: ".html",
        name: expectedfullFilePath,
      };

      jest.spyOn(fsPromises, fsPromises.access.name).mockReturnValue();
      const result = await service.getFileInfo(filename);

      expect(fsPromises.access).toHaveBeenCalledWith(expectedfullFilePath);
      expect(result).toEqual(expectedResult);
    });

    test("should return an error if file does not exis", async () => {
      const filename = "/zaaum.html";
      const expectedfullFilePath = join(config.dir.publicDirectory, filename);

      jest
        .spyOn(fsPromises, fsPromises.access.name)
        .mockRejectedValue(new Error("ENOENT"));

      await expect(service.getFileInfo(filename)).rejects.toThrow();
      expect(fsPromises.access).toHaveBeenCalledWith(expectedfullFilePath);
    });
  });

  describe("createFileStream", () => {
    test("should return a fileStream", async () => {
      const filename = "help-ukraine.html";

      const mockReadableStream = TestUtil.genereateReadableStream([
        "<h1>Help</h1>",
      ]);

      jest
        .spyOn(fs, fs.createReadStream.name)
        .mockReturnValue(mockReadableStream);

      const result = await service.createFileStream(filename);

      expect(fs.createReadStream).toHaveBeenCalledWith(filename);
      expect(result).toEqual(mockReadableStream);
    });
  });
});
