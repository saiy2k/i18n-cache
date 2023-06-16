'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import styles from '../page.module.css'


export default function LinkSection({ t }: any) {

  const lng = getCookie('i18n-lng');
  console.log('Link section: ', lng);

  return (

      <div className={styles.grid}>
        <a
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Hello world
          </h2>
          <p> { t('HelloWorld') } </p>
        </a>

        <Link href={`/${lng}/foo`} className={styles.card} locale={false}>
          <h2>
            To Foo <span>-&gt;</span>
          </h2>
        </Link>

        <Link href={`/${lng}/bar`}  className={styles.card}>
          <h2>
            To Bar <span>-&gt;</span>
          </h2>
        </Link>

        <Link href={`/${lng}/baz`}  className={styles.card} locale={lng}>
          <h2>
            To Baz <span>-&gt;</span>
          </h2>
        </Link>

      </div>
  );

}

function getCookie(name: string) {
  const value = `; ${window.document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
}
