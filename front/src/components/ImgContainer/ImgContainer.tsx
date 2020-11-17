import * as React from 'react';
import './ImgContainer.scss';
import cx from 'classnames';

export interface ImgContainerProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadImage?: Function
}

const ImgContainer: React.SFC<ImgContainerProps> = (props: ImgContainerProps) => {
  const [percentage, setPercentage] = React.useState(0);
  const { className, ...rest } = props

 
  
  return (
    <div className={cx("image_container", className)}>
      <img
        onLoad={(e: any) => {
          // const currentWidth = e.target.clientWidth
          // const naturalWidth = e.target.naturalWidth
          // console.log("percent: ", Math.floor((currentWidth / naturalWidth)  * 100));
          
          // setPercentage( Math.floor((currentWidth / naturalWidth)  * 100))
          if (props.onLoadImage)
            props.onLoadImage(e)
        }}
        {...rest} />
    </div>
  );
}

export default ImgContainer;