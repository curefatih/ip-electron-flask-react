import * as React from 'react';
import './ErrorPop.scss';
import cx from 'classnames';

export interface ErrorPopProps {
  message: string,
  error: string,
  show: boolean,
  onClose: Function
}

const ErrorPop: React.SFC<ErrorPopProps> = (props: ErrorPopProps) => {
  const body = React.useRef(null);
  const [showDetail, setShowDetail] = React.useState(false);

  React.useEffect(() => {
    if (body.current)
      //@ts-expect-error
      body.current.innerHTML = props.error
  })
  return (
    <div className={cx("error-pop", props.show ? "is-flex" : "is-hidden")}>
      <article className="message is-warning">
        <div className="message-header">
          <p>Hata</p>
          <button className="delete" aria-label="delete" onClick={() => props.onClose()}></button>
        </div>
        <div className="message-body">
          <p>{props.message}</p>
        </div>
        <a onClick={() => setShowDetail(!showDetail)} >hatayı {showDetail ? "gizle" : "göster"}</a>
        {showDetail ?
          <div
            className="detail"
            style={{
              height: "300px",
              overflow: "auto",
            }}
            ref={body}>
            {props.error}
          </div> : null
        }
      </article>
    </div>
  );
}

export default ErrorPop;