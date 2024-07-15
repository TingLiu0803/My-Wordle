import React, { forwardRef } from 'react';
import { inputBoxStyle } from '../styleConstants';

type InputBoxProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled: boolean;
  style: string;
};

export const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
  ({ value, onChange, onKeyDown, disabled, style }, ref) => {
    return (
      <input
        ref={ref}
        className={`${inputBoxStyle} ${style}`}
        maxLength={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
    );
  }
);
