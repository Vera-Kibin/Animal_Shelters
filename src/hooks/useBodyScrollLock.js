import { useLayoutEffect } from "react";

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

function lockBodyScroll() {
  const { body, documentElement } = document;

  if (lockCount === 0) {
    savedOverflow = body.style.overflow;
    savedPaddingRight = body.style.paddingRight;

    // Pomiar musi nastąpić przed ustawieniem overflow: hidden.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const currentPaddingRight =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
    body.style.overflow = "hidden";
  }

  lockCount += 1;
}

function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);

  // Nie odblokowujemy strony, jeżeli inne okno nadal jest otwarte.
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
  }
}

export default function useBodyScrollLock() {
  useLayoutEffect(() => {
    lockBodyScroll();
    return unlockBodyScroll;
  }, []);
}
