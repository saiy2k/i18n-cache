
// import React, { useEffect, useMemo, useState } from 'react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import i18n, { TOptions } from 'i18next';
import { initReactI18next, useTranslation as useTranslationOriginal } from 'react-i18next';
import { Text } from '@chakra-ui/react';
import { LngContext, LngContextType } from '../contexts/LngContext';
import { getI18nOptions } from '../lib/i18n';


// Can be initied here,
//    or into LayoutProvider (So each project an override Options)
// i18n.use(initReactI18next).init(getI18nOptions());

i18n.use(initReactI18next).init(getI18nOptions());

export function useTranslation(
  namespaces: string[] = ['common'],
  language?: string,
) {

  const { t: originalT } = useTranslationOriginal(namespaces);
  const [isLoading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const { lng } = useContext(LngContext) as LngContextType;

  const finalLng = language || lng;

  const changeLanguage = async () => {
    setLoading(true);
    const loadedNamespaces = namespaces.map(async (namespace) => {
      if (!i18n.hasResourceBundle(finalLng, namespace)) {
        if (process.env.NODE_ENV === 'development') {
          console.log(` *** IMPORT i18n Namespace: ${finalLng}/${namespace}`, { path: process?.env?.NEXT_PUBLIC_I18N_LOCALES_RELATIVE_PATH, fall: '../../../../src/i18n/locales' })
        }

        let resources;
        try {
          // Do not works.... why ?!
          // resources = await import(`${(process?.env?.NEXT_PUBLIC_I18N_LOCALES_RELATIVE_PATH) || '../../../../src/i18n/locales'}/${finalLng}/${namespace}`);
          resources = await import(`../i18n/locales/${finalLng}/${namespace}`);
        }
        catch (e) {
          console.error("i18n Resources not found\n==========================\n", e);
        }
        // In the case we cannot load resources we should still add it (or i18n.exists() will not works and think the key exist.. )
        i18n.addResourceBundle(finalLng, namespace, resources?.default || {});
      }
    });

    await Promise.all(loadedNamespaces);
    if (!language) {
      console.log('finalLng :: useTranslation :: changeLanguage :: changing i18n lang to ', lng, finalLng, language);
      await i18n.changeLanguage(finalLng);
    }
    setLoading(false);
  };

  useEffect(() => {
    changeLanguage();
    setKey((prevKey) => prevKey + 1);
  }, [finalLng]);

  const memoizedT = useMemo(() => originalT, [key]);

  const customT = (key: string, options: TOptions = {}) => {
    const existsInCurrentLanguage = i18n.exists(key, { ...options, lng: finalLng, ns: namespaces, fallbackLng: [] });

    if (process.env.NODE_ENV === 'development' && !existsInCurrentLanguage && !isLoading) {
      return (
        <span style={{ color: 'red' }}>
          {key}
        </span>
      );
    }

    return !isLoading && memoizedT(key, options);
  };

  return {
    isLoading,
    t: customT,
    // <T> as component. /!\ key is reserved for React, so use `_key` instead.. :/
    T: ({ _key, options = {} }: { _key: string, options?: TOptions }) => <Text children={customT(_key, options)} />,
  };
};
