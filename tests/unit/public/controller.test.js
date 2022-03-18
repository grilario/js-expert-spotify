import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import Service from "../../../public/controller/js/service.js";
import View from "../../../public/controller/js/view.js";
import Controller from "../../../public/controller/js/controller.js";

describe("#Services", () => {
  const view = new View();
  const service = new Service({ url: "http://localhost:3000" });

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("#Initialize", async () => {
    const onLoad = jest
      .spyOn(Controller.prototype, Controller.prototype.onLoad.name)
      .mockReturnValue();

    const result = Controller.initialize({ view, service });

    expect(onLoad).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Controller);
  });

  test("#CommandReceived", async () => {
    const controller = new Controller({ view, service });
    const text = "start";

    const makeRequest = jest
      .spyOn(Service.prototype, Service.prototype.makeRequest.name)
      .mockResolvedValue({ result: "ok" });

    const result = await controller.commandReceived(text);

    expect(makeRequest).toHaveBeenCalledWith({ command: text });
    expect(result).toStrictEqual({ result: "ok" });
  });

  test("#onLoad", async () => {
    const controller = new Controller({ view, service });
    const bind = jest.fn().bind();

    jest.spyOn(controller.commandReceived, "bind").mockReturnValue(bind);

    controller.view.configureOnBtnClick = jest.fn();
    controller.view.onLoad = jest.fn();

    controller.onLoad();

    expect(controller.view.configureOnBtnClick).toHaveBeenCalledWith(bind);
    expect(controller.view.onLoad).toHaveBeenCalled();
  });
});
