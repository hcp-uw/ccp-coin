import { renderHook } from "@testing-library/react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useOutsideClick } from "@/hooks/useOutsideClick";

describe("useEscapeKey", () => {
  it("calls handler when Escape is pressed and enabled", () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler, true));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when disabled", () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler, false));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call handler for non-Escape keys", () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler, true));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("cleans up listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEscapeKey(handler, true));
    unmount();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("useOutsideClick", () => {
  it("calls handler when clicking outside ref element", () => {
    const handler = vi.fn();
    const ref = { current: document.createElement("div") };
    document.body.appendChild(ref.current);

    renderHook(() => useOutsideClick(ref, handler, true));

    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(ref.current);
  });

  it("does not call handler when clicking inside ref element", () => {
    const handler = vi.fn();
    const ref = { current: document.createElement("div") };
    document.body.appendChild(ref.current);

    renderHook(() => useOutsideClick(ref, handler, true));

    ref.current.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
  });

  it("does not call handler when disabled", () => {
    const handler = vi.fn();
    const ref = { current: document.createElement("div") };

    renderHook(() => useOutsideClick(ref, handler, false));

    document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });
});
