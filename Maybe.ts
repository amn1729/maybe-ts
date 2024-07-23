// import { ReactElement, Fragment, createElement } from "react";

export type Just<T> = { value: T; _t: "just" };
export type Nothing = { _t: "nothing" };

export class Maybe<T> {
  private data: Just<T> | Nothing;

  constructor(value?: T) {
    this.data = value === undefined ? { _t: "nothing" } : { value, _t: "just" };
  }

  get isJust() {
    return this.data._t === "just";
  }

  get isNothing() {
    return this.data._t === "nothing";
  }

  run<U>(fn: (val: T) => U): Maybe<NonNullable<U>> {
    if (this.isJust)
      return new Maybe(fn((this.data as Just<T>).value) as NonNullable<U>);
    return new Maybe<NonNullable<U>>();
  }

  prop<U extends NonNullable<T[K]>, K extends keyof T = keyof T>(key: K) {
    return this.run<U>((v) => v[key] as U);
  }

  get(msg?: string): T {
    if (this.isJust) return (this.data as Just<T>).value;
    throw Error(msg ?? "No value to get");
  }

  getOr(fallback: T): T {
    return this.isJust ? (this.data as Just<T>).value : fallback;
  }

  getOrUndef(): T | undefined {
    return this.isJust ? (this.data as Just<T>).value : undefined;
  }

  or(otherMaybe: Maybe<T>) {
    return this.isJust ? this : otherMaybe;
  }

  // Render(fn: (val: T) => ReactElement): ReactElement {
  //   return this.isJust
  //     ? fn((this.data as Just<T>).value)
  //     : createElement(Fragment);
  // }
}

export function maybe<T>(val?: T | null) {
  return new Maybe<T>(val || undefined);
}
