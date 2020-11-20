import * as React from 'react';
import './Loading.scss';
import cx from 'classnames';
export interface LoadingProps {
  show: boolean
}

const Loading: React.SFC<LoadingProps> = (props: LoadingProps) => {
  return (
    <div className={cx("loading-wrapper", props.show ? "show" : "hide")}>
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  );
}

export default Loading;