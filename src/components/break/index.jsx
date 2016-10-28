import React, {PropTypes} from 'react';
import style from './index.css'

const Rule = ({width,thickness}) => {
  let classNames = `${style.rule} ${style[width]} ${style[thickness]}`
  return (
    <hr className={classNames}/>
  )
};

Rule.propTypes = {
  width: PropTypes.string,
  thickness: PropTypes.string
}
export default Rule;
