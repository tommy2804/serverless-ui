export const isEmailValid = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

export const isUsernameLengthValid = (username: string): boolean =>
  username.length > 2 && username.length < 20;

export const isUsernameCharsValid = (username: string): boolean =>
  /^[a-zA-Z0-9._-]+$/.test(username);

export interface PasswordValidationState {
  isEmpty: string | ((value: string) => boolean);
  isEightChar: string | ((value: string) => boolean);
  hasLower: string | ((value: string) => boolean);
  hasUpper: string | ((value: string) => boolean);
  hasNumber: string | ((value: string) => boolean);
  hasSpecial: string | ((value: string) => boolean);
}
