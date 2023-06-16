'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import Image from 'next/image'
import styles from '../../page.module.css'

import { useTranslation } from '@/hooks/useTranslation';
import { LngContext, LngContextType } from '@/contexts/LngContext';
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
        <h1> Foo </h1>
      </div>

      <div className={styles.grid}>
        <a
          className={styles.card}
        >
          <h2>
            Test Common
          </h2>
          <p> { t('TestCommon') } </p>
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


      </div>
    </main>
  )
}
