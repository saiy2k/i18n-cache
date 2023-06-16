'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import styles from '../../page.module.css'

import { useTranslation } from '@/hooks/useTranslation';
import { getPathnameWihoutLng, url } from '@/lib/i18n';

import LinkSection from '../LinkSection';

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
        <h1> Baz </h1>
      </div>

      <LinkSection t={t} />

    </main>
  )
}
