export type ContactUsFormState = {
  fullName: string;
  email: string;
  subject: string;
  phoneNumber: string;
  message: string;
};

export enum setFieldTypes {
  fullName = 'SET_FULL_NAME',
  email = 'SET_EMAIL',
  subject = 'SET_SUBJECT',
  phoneNumber = 'SET_PHONE_NUMBER',
  message = 'SET_MESSAGE',
  clear = 'CLEAR',
}

export type ActionType =
  | { type: setFieldTypes.fullName; payload: string }
  | { type: setFieldTypes.email; payload: string }
  | { type: setFieldTypes.subject; payload: string }
  | { type: setFieldTypes.phoneNumber; payload: string }
  | { type: setFieldTypes.message; payload: string }
  | { type: setFieldTypes.clear };

export const formReducer = (state: ContactUsFormState, action: ActionType): ContactUsFormState => {
  switch (action.type) {
    case setFieldTypes.fullName:
      return { ...state, fullName: action.payload };
    case setFieldTypes.email:
      return { ...state, email: action.payload };
    case setFieldTypes.message:
      return { ...state, message: action.payload };
    case setFieldTypes.subject:
      return { ...state, subject: action.payload };
    case setFieldTypes.phoneNumber:
      return { ...state, phoneNumber: action.payload };
    case setFieldTypes.clear:
      return {
        fullName: '',
        email: '',
        subject: '',
        phoneNumber: '',
        message: '',
      };
    default:
      return state;
  }
};
