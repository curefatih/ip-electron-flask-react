import * as React from 'react';
import './SuccessPop.scss';
import cx from 'classnames';

export interface SuccessPopProps {
  message: string,
  success: string,
  show: boolean,
  onClose: Function
}

const SuccessPop: React.SFC<SuccessPopProps> = (props: SuccessPopProps) => {
  const body = React.useRef(null);
  const [showDetail, setShowDetail] = React.useState(false);

  React.useEffect(() => {
    if (body.current)
      //@ts-expect-error
      body.current.innerHTML = props.success
  })
  return (
    <div className={cx("success-pop", props.show ? "is-flex" : "is-hidden")}>
      <article className="message is-success">
        <div className="message-header">
          <p>Başarılı</p>
          <button className="delete" aria-label="delete" onClick={() => props.onClose()}></button>
        </div>
        <div className="message-body">
          <p>{props.message}</p>
        </div>
        <a onClick={() => setShowDetail(!showDetail)} >mesajı {showDetail ? "gizle":  "göster"}</a>
        {showDetail ?
          <div style={{
            height: "300px",
            overflow: "auto",
          }}
            ref={body}>
            {props.success}
          </div> : null
        }
      </article>
    </div>
  );
}

export default SuccessPop;