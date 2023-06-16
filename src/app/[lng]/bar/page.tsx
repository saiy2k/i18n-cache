'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import styles from '../../page.module.css'

import { useTranslation } from '@/hooks/useTranslation';
import { getPathnameWihoutLng, url } from '@/lib/i18n';

export default function Home({ params: { lng } }: any) {

  const pathname = usePathname();
  const { t, T } = useTranslation(['common']);
  const { push } = useRouter();

  const langs = ['en', 'fr', 'es'];

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Selected Language
          <code className={styles.code}> { lng } </code>
        </p>
        <div>
          <select value={lng} onChange={ (e: any) => {
            const path = pathname && getPathnameWihoutLng(pathname) || '';
            console.log('pathname', pathname);
            console.log('pathnameWithoutLang', getPathnameWihoutLng(lng));
            console.log('path', path);
            push(url(e.target.value, path));
            console.log('e.target.value', e.target.value);
          }}>
            { langs.map((lang: string) => <option value={lang}> {lang} </option>) }
          </select>
        </div>
      </div>

      <div className={styles.center}>
        <h1> Bar </h1>
      </div>

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

        <Link href='/foo' className={styles.card}>
          <h2>
            To Foo <span>-&gt;</span>
          </h2>
        </Link>

        <Link href='/bar' className={styles.card}>
          <h2>
            To Bar <span>-&gt;</span>
          </h2>
        </Link>

        <Link href='/baz' className={styles.card}>
          <h2>
            To Baz <span>-&gt;</span>
          </h2>
        </Link>

      </div>
    </main>
  )
}
