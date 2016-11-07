import React from 'react';
import styles from './style.css'
const Card = ({children}) => {
  return (
    <div className={styles.card}>
      {children}
    </div>
  );
};

export default Card;