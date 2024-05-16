import React from 'react';

export const scrollToSection = (sectionRef: React.MutableRefObject<any>) => {
  if (sectionRef?.current) {
    const rect = sectionRef.current.getBoundingClientRect();
    const offsetTop = window.scrollY + rect.top - 64;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  }
};

export enum InputState {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  DEFAULT = 'DEFAULT',
}
