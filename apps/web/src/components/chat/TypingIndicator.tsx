/* ========================================================================
   Typing Indicator Component - Shows "typing..." animation
   ======================================================================== */

'use client';

import React from 'react';
import styles from './TypingIndicator.module.css';

export const TypingIndicator: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dotsContainer}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
      <span className={styles.text}>typing</span>
    </div>
  );
};

export default TypingIndicator;
