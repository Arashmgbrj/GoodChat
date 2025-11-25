import Link from 'next/link';
import styles from './Success.module.css';

const Success = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎉 موفقیت!</h1>
        <p className={styles.message}>عملیات شما با موفقیت انجام شد.</p>
        <Link href="/chat" className={styles.button}>
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default Success;
