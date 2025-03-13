import { describe, expect, test } from "bun:test";
import { keyboard, Key } from '../index';

describe('Keyboard', () => {
  test('should initialize keyboard manager', () => {
    expect(keyboard).toBeDefined();
    expect(keyboard.init).toBeDefined();
    expect(keyboard.down).toBeDefined();
    expect(keyboard.up).toBeDefined();
  });

  test('should handle key events', () => {
    keyboard.init();
    let pressed = false;
    keyboard.down([Key.All], () => {
      pressed = true;
    });
    expect(pressed).toBe(false);
    keyboard.clear();
  });
}); 