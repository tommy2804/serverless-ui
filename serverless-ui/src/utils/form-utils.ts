import React from "react";

export const inputLengthDisplayHandler = (
  e: React.FormEvent<HTMLDivElement>,
  maxLength: number
) => {
  const { value } = e.target as HTMLTextAreaElement;
  const targetParent = (e.target as HTMLTextAreaElement).parentElement;
  if (value.length >= 20) {
    targetParent?.setAttribute("data-maxLength", String(maxLength));
    targetParent?.setAttribute("data-length", String(value.length));
  } else {
    targetParent?.removeAttribute("data-length");
  }
};

export const inputValidationHandler = (value: string, matcher: string | RegExp) =>
  !(value.length <= 0 || value.match(matcher) !== null);
