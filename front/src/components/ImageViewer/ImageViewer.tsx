import * as React from 'react';
import ImgContainer from '../ImgContainer/ImgContainer';
import './ImageViewer.scss';

import cx from 'classnames';
import Button from '../Button/Button';

export interface ImageViewerProps {
  show: boolean,
  src: string,
  onClose: Function
}

const ImageViewer: React.SFC<ImageViewerProps> = (props: ImageViewerProps) => {
  return (
    <div className={cx("image_viewer", props.show ? "active" : "")}>

      <ImgContainer
        style={{
          height: "100%"
      }}
        src={props.src}
      />

      <div className="close-button">
        <Button
          onClick={() => {
            props.onClose()
          }}
        >Kapat</Button>
      </div>
    </div>
  );
}

export default ImageViewer;