import * as React from 'react';
import './Accordion.scss'
import Button from '../Button/Button';
import cx from 'classnames';

export interface AccordionProps {
  children: React.ReactNode,
  title: string
}

const Accordion: React.SFC<AccordionProps> = (props) => {
  const [showContent, setShowContent] = React.useState(false);

  return (
    <div className="accordion">
      <Button
        className="accordion_button"
        onClick={() => {
          setShowContent(!showContent);
        }}
      >{props.title}</Button>
      <div className={cx("accordion_content", showContent ? "active" : null)}>
        {props.children}
      </div>
    </div>
  );
}

export default Accordion;