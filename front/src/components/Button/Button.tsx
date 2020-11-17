import * as React from 'react';
import './Button.scss';
import cx from 'classnames';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {

}

const Button: React.SFC<ButtonProps> = (props: ButtonProps) => {
  const [active, setActive] = React.useState(false)

  const { className, ...rest } = props
  return (
    <button
      className={cx("button", className, active ? "active" : "")}
      onClick={(e) => {
        setActive(!active)
        if (props.onClick)
          props.onClick(e)
      }}
      {...rest}
    >
      {props.children}
    </button>
  );
}

export default Button;