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

    const mockReadableStream = TestUtil.generateReadableStream([
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

  test("it should handle start command", async () => {
    const command = { command: "start" };
    const expectedResult = { result: "ok" };

    const startStreamming = jest.spyOn(
      Service.prototype,
      Service.prototype.startStreamming.name
    ).mockResolvedValue();

    const result = await controller.handleCommand(command);

    expect(result).toStrictEqual(expectedResult);
    expect(startStreamming).toBeCalled();
  });

  test("it should handle stop command", async () => {
    const command = { command: "stop" };
    const expectedResult = { result: "ok" };

    const startStreamming = jest.spyOn(
      Service.prototype,
      Service.prototype.stopStreamming.name
    );

    const result = await controller.handleCommand(command);

    expect(result).toStrictEqual(expectedResult);
    expect(startStreamming).toBeCalled();
  });

  test("it should creating clientStream", async () => {
    const id = "asd123asd12";
    const mockReadableStream = TestUtil.generateReadableStream(["Hello"]);

    const createClientStream = jest
      .spyOn(Service.prototype, Service.prototype.createClientStream.name)
      .mockReturnValue({ id, clientStream: mockReadableStream });
    const removeClientStream = jest.spyOn(
      Service.prototype,
      Service.prototype.removeClientStream.name
    );

    const result = controller.createClientStream();
    result.onClose()

    expect(createClientStream).toHaveBeenCalled();
    expect(result).toMatchObject({ stream: mockReadableStream })
    expect(removeClientStream).toHaveBeenCalledWith(id)
  });

  test("it should handle command to add fx", async () => {
    const command = { command: "fair" };
    const expectedResult = { result: "ok" };
    const chosenFx = "fx/fair.mp3" 

    const readFxByName = jest.spyOn(
      Service.prototype,
      Service.prototype.readFxByName.name
    ).mockResolvedValue(chosenFx);

    const appendFxStream = jest.spyOn(
      Service.prototype,
      Service.prototype.appendFxStream.name
    ).mockReturnValue();

    const result = await controller.handleCommand(command);

    expect(readFxByName).toHaveBeenCalledWith(command.command);
    expect(appendFxStream).toHaveBeenCalledWith(chosenFx)
    expect(result).toStrictEqual(expectedResult);
  })

  describe("#Exceptions", () => {
    test("should return an error if file does not exist", async () => {
      const filename = "/auuuu.html";

      jest
        .spyOn(Service.prototype, Service.prototype.getFileStream.name)
        .mockRejectedValue(new Error("Error: ENOENT"));

      await expect(controller.getFileStream(filename)).rejects.toThrow();
      expect(Service.prototype.getFileStream).toHaveBeenCalledWith(filename);
    });

    test("it should not handle commnad", async () => {
      const command = { command: "zuumm" };

      expect(controller.handleCommand(command)).rejects.toThrow()
    })
  });
});
