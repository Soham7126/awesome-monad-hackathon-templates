'use client';

import { ConnectWallet } from '@thirdweb-dev/react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <ConnectWallet theme='dark' />
    </div>
  );
}
