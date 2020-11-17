import * as React from 'react';
import './Dragable.scss';
import cx from 'classnames';
import { isPropertySignature } from 'typescript';

export interface DragableProps extends React.HTMLAttributes<HTMLDivElement> {
  showInstruction?: boolean
}

const Dragable: React.SFC<DragableProps> = (props: DragableProps) => {
  const [showOverlay, setShowOverlay] = React.useState(false);

  React.useEffect(() => {
    if (props.showInstruction)
      setShowOverlay(props.showInstruction)
  }, [props.showInstruction])

  return (
    <>
      <div className={cx("dashed", showOverlay ? "active" : "")}>
        <div className="drag_here">
          <h5>Görüntüyü buraya bırakın...</h5>
        </div>
      </div>
      <div
        className="drag_space"
        onDragEnter={() => {
          console.log('File is in the Drop Space');
          setShowOverlay(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={() => {
          console.log('File is leave the Drop Space');
          setShowOverlay(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (props.onDrop)
            props.onDrop(e);
          setShowOverlay(false);
        }}

        onScroll={(e) => {
          console.log(e);

        }}
      >
      </div>
    </>
  );
}

export default Dragable;