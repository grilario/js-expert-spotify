import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import { Controller } from "../../../server/controller.js";
import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";

describe("#Controller", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const controller = new Controller();

  test("should return an object containing a stream and type", async () => {
    const filename = "/index.html";

    const mockReadableStream = TestUtil.genereateReadableStream([
      "<h1>Hello</h1>",
    ]);
    const expectedType = ".html";

    jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockReadableStream,
        type: expectedType,
      });

    const result = await controller.getFileStream(filename);

    expect(Service.prototype.getFileStream).toHaveBeenCalledWith(filename);
    expect(result).toEqual({ stream: mockReadableStream, type: expectedType });
  });

  test("should return an error if file does not exist", async () => {
    const filename = "/auuuu.html";

    jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockRejectedValue(new Error("Error: ENOENT"));

    await expect(controller.getFileStream(filename)).rejects.toThrow()
    expect(Service.prototype.getFileStream).toHaveBeenCalledWith(filename);
  });
});
