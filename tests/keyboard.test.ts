import { useKeyboard } from "@waradu/keyboard";
import { test, expect, mock } from 'bun:test';

const prepare = () => {
  const keyboard = useKeyboard();
  keyboard.init();

  const spy = mock(() => { });

  return { keyboard, spy };
};

const down = (key: string) => {
  const event = new KeyboardEvent("keydown", { key: key });
  window.dispatchEvent(event);
};

const up = (key: string) => {
  const event = new KeyboardEvent("keyup", { key: key });
  window.dispatchEvent(event);
};

test("keyboard handler fires on 'a' press", () => {
  const { keyboard, spy } = prepare();

  keyboard.listen({
    keys: ["a"],
    run: spy,
  });

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  keyboard.destroy();
});

test("any keyboard handler fires on any press", () => {
  const { keyboard, spy } = prepare();

  keyboard.listen({
    keys: ["any"],
    run: spy,
  });

  down("x");
  down("o");
  down("Control");
  down("3");
  down(" ");

  expect(spy).toHaveBeenCalledTimes(5);

  keyboard.destroy();
});

test("one-time keyboard handler only fires once", () => {
  const { keyboard, spy } = prepare();

  keyboard.listen({
    keys: ["a"],
    run: spy,
    config: { once: true }
  });

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  keyboard.destroy();
});

test("keyboard handler ignores editable if set", () => {
  const { keyboard, spy } = prepare();

  keyboard.listen({
    keys: ["a"],
    run: spy,
    config: { ignoreIfEditable: true }
  });

  const ele = document.createElement("input");
  document.body.appendChild(ele);
  ele.focus();

  down("a");

  expect(spy).toHaveBeenCalledTimes(0);

  ele.blur();

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  ele.remove();
  keyboard.destroy();
});

test("keyboard handler runs only if runIfFocused element is focused", () => {
  const { keyboard, spy } = prepare();

  const ele = document.createElement("input");
  document.body.appendChild(ele);

  keyboard.listen({
    keys: ["a"],
    run: spy,
    config: { runIfFocused: [ele] }
  });

  ele.focus();

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  ele.blur();

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  ele.remove();
  keyboard.destroy();
});

test("keyboard handler stops when signal is aborted", () => {
  const { keyboard, spy } = prepare();

  const ac = new AbortController();

  keyboard.listen({
    keys: ["a"],
    run: spy,
    config: { signal: ac.signal }
  });

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  ac.abort();

  down("a");

  expect(spy).toHaveBeenCalledTimes(1);

  keyboard.destroy();
});

test("keyboard handler only fires if all keys have been pressed", () => {
  const { keyboard, spy } = prepare();

  keyboard.listen({
    keys: ["control_y"],
    run: spy,
  });

  down("Control");

  expect(spy).toHaveBeenCalledTimes(0);

  down("y");

  expect(spy).toHaveBeenCalledTimes(1);
});

test("keyboard handler only fires if all keys are being pressed together", () => {
  const { keyboard, spy } = prepare();

  keyboard.listen({
    keys: ["control_y"],
    run: spy,
  });

  down("Control");
  up("Control");

  down("y");

  expect(spy).toHaveBeenCalledTimes(0);

  keyboard.destroy();
});

test("keyboard handler can handle complex keybinds", () => {
  const { keyboard, spy } = prepare();

  keyboard.listen({
    keys: ["meta_control_alt_shift_arrow-up"],
    run: spy,
  });

  down("Meta");
  down("Control");
  down("Alt");
  down("Shift");
  down("ArrowUp");

  expect(spy).toHaveBeenCalledTimes(1);

  keyboard.destroy();
});