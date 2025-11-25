import Link from 'next/link';
import styles from './Fail.module.css';

const Fail = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>❌ عملیات ناموفق!</h1>
        <p className={styles.message}>متأسفانه عملیات شما با خطا مواجه شد.</p>
        <Link href="/" className={styles.button}>
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default Fail;
