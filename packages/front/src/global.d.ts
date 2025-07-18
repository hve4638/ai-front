
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    inert?: boolean;
  }
}

declare global {
  type RefLike<T> = { current: T };
}