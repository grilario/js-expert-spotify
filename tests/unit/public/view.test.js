import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import { JSDOM } from "jsdom";
import View from "../../../public/controller/js/view.js";

describe("#View - test suite for presentation layer", () => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  global.window = dom.window;

  function makeBtnElement(
    { text, classList } = {
      text: "",
      classList: { add: jest.fn(), remove: jest.fn() },
    }
  ) {
    return {
      onclick: jest.fn(),
      classList,
      innerText: text,
    };
  }

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    jest
      .spyOn(document, document.getElementById.name)
      .mockReturnValue(makeBtnElement());
  });

  test("#changeCommadVisibility - given hide=true it should add unassigned class and reset onClick", async () => {
    const view = new View();
    const btn = makeBtnElement();
    jest.spyOn(document, document.querySelectorAll.name).mockReturnValue([btn]);

    view.changeCommandBtnsVisibility();

    expect(btn.classList.add).toHaveBeenCalledWith("unassigned");
    expect(btn.onclick.name).toStrictEqual("onClickReset");
    expect(() => btn.onclick()).not.toThrow();
  });

  test("#changeCommadVisibility - given hide=false it should remove unassigned class and reset onClick", async () => {
    const view = new View();
    const btn = makeBtnElement();
    jest.spyOn(document, document.querySelectorAll.name).mockReturnValue([btn]);

    view.changeCommandBtnsVisibility(false);

    expect(btn.classList.add).not.toHaveBeenCalled();
    expect(btn.classList.remove).toHaveBeenCalledWith("unassigned");
    expect(btn.onclick.name).toStrictEqual("onClickReset");
    expect(() => btn.onclick()).not.toThrow();
  });

  test("#onLoad", async () => {
    const view = new View();
    jest.spyOn(view, view.changeCommandBtnsVisibility.name).mockReturnValue();

    view.onLoad();

    expect(view.changeCommandBtnsVisibility).toHaveBeenCalled();
  });

  test("#configureOnBtnClick", async () => {
    const view = new View();
    const fn = jest.fn();
    view.onBtnClick()

    view.configureOnBtnClick(fn);

    expect(view.onBtnClick).toStrictEqual(fn);
  });

  test("#onStartClick", async () => {
    const view = new View();
    const btn = makeBtnElement();
    const innerText = "Tutis";

    jest.spyOn(document, document.querySelectorAll.name).mockReturnValue([btn]);
    const onBtnClick = jest.spyOn(view, "onBtnClick").mockResolvedValue();
    const toggleBtnStart = jest
      .spyOn(view, view.toggleBtnStart.name)
      .mockReturnValue();
    const changeCommandBtnVisibility = jest
      .spyOn(view, view.changeCommandBtnsVisibility.name)
      .mockReturnValue();
    const buttons = jest.spyOn(view, "buttons");
    const notIsUnassignedButton = jest
      .spyOn(view, view.notIsUnassignedButton.name)
      .mockReturnValue(true);
    const setupBtnAction = jest
      .spyOn(view, view.setupBtnAction.name)
      .mockReturnValue();

    await view.onStartClick({ srcElement: { innerText } });

    expect(onBtnClick).toHaveBeenCalledWith(innerText);
    expect(toggleBtnStart).toHaveBeenCalled();
    expect(changeCommandBtnVisibility).toHaveBeenCalledWith(false);
    expect(buttons).toHaveBeenCalled();
    expect(notIsUnassignedButton).toHaveBeenCalledWith(btn);
    expect(setupBtnAction).toHaveBeenCalled();
  });

  test("#setupButtonAction - given innerText=start do not do anything", async () => {
    const view = new View();
    const btn = makeBtnElement();
    const onclick = jest.fn();
    btn.innerText = "start";
    btn.onclick = onclick;

    view.setupBtnAction(btn);

    expect(btn.onclick).toBe(onclick);
  });

  test("#setupButtonAction - given innerText=stop onclick receive function", async () => {
    const view = new View();
    const btn = makeBtnElement();
    const onclick = jest.fn();
    btn.innerText = "stop";

    view.onStopBtn = onclick;
    jest.spyOn(view.onStopBtn, "bind").mockReturnValue(onclick);

    view.setupBtnAction(btn);

    expect(btn.onclick).toBe(onclick);
  });

  test("#setupButtonAction - given innerText='any' onclick receive function", async () => {
    const view = new View();
    const btn = makeBtnElement();
    const onclick = jest.fn();
    btn.innerText = "any";

    view.onCommandClick = onclick;
    jest.spyOn(view.onCommandClick, "bind").mockReturnValue(onclick);

    view.setupBtnAction(btn);

    expect(btn.onclick).toBe(onclick);
  });

  test("#onCommandClick", async () => {
    const view = new View();
    const btn = makeBtnElement();
    const innerText = "fair";
    const classList = ["active"];

    btn.innerText = innerText;
    btn.classList = classList;

    const toggleDisableCommnadBtn = jest
      .spyOn(view, view.toggleDisableCommnadBtn.name)
      .mockReturnValue();
    const onBtnClick = jest
      .spyOn(view, view.onBtnClick.name)
      .mockResolvedValue();

    jest.useFakeTimers();
    await view.onCommandClick({ srcElement: btn });
    jest.runAllTimers();

    expect(toggleDisableCommnadBtn).toHaveBeenCalledTimes(2);
    expect(toggleDisableCommnadBtn).toHaveBeenCalledWith(classList);
    expect(onBtnClick).toHaveBeenCalledWith(innerText);
  });

  test("#toggleDisableCommnadBtn - given classlist contains active, remove active", async () => {
    const view = new View();
    const contains = jest.fn().mockReturnValue(true);
    const remove = jest.fn();
    const classList = { contains, remove };

    view.toggleDisableCommnadBtn(classList);

    expect(contains).toHaveBeenCalledWith("active");
    expect(remove).toHaveBeenCalledWith("active");
  });

  test("#toggleDisableCommnadBtn - given classlist not contains active, add active", async () => {
    const view = new View();
    const contains = jest.fn().mockReturnValue(false);
    const add = jest.fn();
    const classList = { contains, add };

    view.toggleDisableCommnadBtn(classList);

    expect(contains).toHaveBeenCalledWith("active");
    expect(add).toHaveBeenCalledWith("active");
  });

  test("#onStopBtn", async () => {
    const view = new View();
    const innerText = "fair";

    const onBtnClick = jest
      .spyOn(view, view.onBtnClick.name)
      .mockResolvedValue();
    const toggleBtnStart = jest
      .spyOn(view, view.toggleBtnStart.name)
      .mockReturnValue();
    const changeCommandBtnsVisibility = jest
      .spyOn(view, view.changeCommandBtnsVisibility.name)
      .mockReturnValue();

    await view.onStopBtn({ srcElement: { innerText } });

    expect(onBtnClick).toHaveBeenCalledWith(innerText);
    expect(toggleBtnStart).toHaveBeenCalledWith(false);
    expect(changeCommandBtnsVisibility).toHaveBeenCalled();
  });

  test("#notIsUnassignedButton - given true add hidden class in startBtn and remove in stopBtn", async () => {
    const view = new View();
    const btn = makeBtnElement();
    const item = "unassined";

    btn.classList = [item];

    const ignoreHas = jest
      .spyOn(view.ignoreButtons, view.ignoreButtons.has.name)
      .mockReturnValue(true);

    const result = view.notIsUnassignedButton(btn);

    expect(result).toBe(false);
    expect(ignoreHas).toBeCalledWith(item);
  });

  test("#toggleBtnStart", async () => {
    const view = new View();

    const btnStartAdd = jest.spyOn(
      view.btnStart.classList,
      "add"
    ).mockReturnValue()
    const btnStopRemove = jest.spyOn(
      view.btnStop.classList,
      "remove"
    ).mockReturnValue()

    view.toggleBtnStart()

    expect(btnStartAdd).toHaveBeenCalledWith("hidden")
    expect(btnStopRemove).toHaveBeenCalledWith("hidden")
  });


  test("#toggleBtnStart - given false remove hidden class in startBtn and add in stopBtn", async () => {
    const view = new View();

    const btnStartRemove = jest.spyOn(
      view.btnStart.classList,
      "remove"
    ).mockReturnValue()
    const btnStopAdd = jest.spyOn(
      view.btnStop.classList,
      "add"
    ).mockReturnValue()

    view.toggleBtnStart(false)

    expect(btnStartRemove).toHaveBeenCalledWith("hidden")
    expect(btnStopAdd).toHaveBeenCalledWith("hidden")
  });
});
