import * as React from 'react';
import './Input.scss';
import cx from 'classnames'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

const Input: React.SFC<InputProps> = (props: InputProps) => {
  const { className, ...rest } = props
  return (
    <input
      className={cx("input", className)} {...rest} />
  );
}

export default Input;