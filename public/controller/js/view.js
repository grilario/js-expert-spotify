export default class View {
  constructor() {
    this.btnStart = document.getElementById("start");
    this.btnStop = document.getElementById("stop");
    this.buttons = () => Array.from(document.querySelectorAll("button"));

    this.ignoreButtons = new Set(["unassigned"]);
    async function onBtnClick() {}
    this.onBtnClick = onBtnClick;

    this.DISABLE_BTN_TIMEOUT = 800
  }

  onLoad() {
    this.changeCommandBtnsVisibility();
    this.btnStart.onclick = this.onStartClick.bind(this);
  }

  changeCommandBtnsVisibility(hide = true) {
    Array.from(document.querySelectorAll("[name=command]")).forEach((btn) => {
      const fn = hide ? "add" : "remove";
      btn.classList[fn]("unassigned");

      function onClickReset() {}
      btn.onclick = onClickReset;
    });
  }

  configureOnBtnClick(fn) {
    this.onBtnClick = fn;
  }

  async onStartClick({ srcElement: { innerText } }) {
    const btnText = innerText;
    await this.onBtnClick(btnText);
    this.toggleBtnStart();
    this.changeCommandBtnsVisibility(false);

    this.buttons()
      .filter((btn) => this.notIsUnassignedButton(btn))
      .forEach(this.setupBtnAction.bind(this));
  }

  setupBtnAction(btn) {
    const text = btn.innerText.toLowerCase();
    if (text.includes("start")) return;

    if (text.includes("stop")) {
      btn.onclick = this.onStopBtn.bind(this);
      return;
    }

    btn.onclick = this.onCommandClick.bind(this);
  }

  async onCommandClick(btn) {
    const {
      srcElement: { classList, innerText },
    } = btn;

    this.toggleDisableCommnadBtn(classList)
    await this.onBtnClick(innerText)
    setTimeout(
      () => this.toggleDisableCommnadBtn(classList),
      this.DISABLE_BTN_TIMEOUT
    )
  }

  toggleDisableCommnadBtn(classList) {
    if (!classList.contains("active")) {
      classList.add("active");
      return;
    }

    classList.remove("active")
  }

  async onStopBtn({ srcElement: { innerText } }) {
    await this.onBtnClick(innerText);
    this.toggleBtnStart(false);
    this.changeCommandBtnsVisibility();
  }

  notIsUnassignedButton(btn) {
    const classList = Array.from(btn.classList);

    return !!!classList.find((item) => this.ignoreButtons.has(item));
  }

  toggleBtnStart(active = true) {
    if (active) {
      this.btnStart.classList.add("hidden");
      this.btnStop.classList.remove("hidden");
      return;
    }

    this.btnStart.classList.remove("hidden");
    this.btnStop.classList.add("hidden");
  }
}
