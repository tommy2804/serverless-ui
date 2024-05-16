import React from 'react';
import { OutlinedTextFieldProps } from '@mui/material';
import { InputState } from './helpers';

export interface SectionProps {
  sectionRef?: React.MutableRefObject<any>;
  sectionId?: string;
}

export interface CustomTextFieldProps extends OutlinedTextFieldProps {
  iconComponent?: React.ReactNode;
  isLeftIcon?: boolean;
  isNonMobile: boolean;
  customWidth?: string;
  customHeight?: boolean;
  inputState?: InputState;
}
export interface CssTextFieldProps extends OutlinedTextFieldProps {
  customHeight?: string | null;
  customWidth?: string;
  isNonMobile?: boolean;
  inputState?: InputState;
}
