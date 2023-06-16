

//
// /!\ Utils file WITHOUT Frontend (!React)
//    - Should be usable on Edge Function (like middleware)
//

import { NextRequest } from "next/server";
import acceptLanguage from 'accept-language'


// ----------------------- Settings -----------------------

export const lngs = (process?.env?.NEXT_PUBLIC_I18N_LNGS as string)?.split(',') || ['en', 'fr', 'es'] as const;
export type LngType = typeof lngs[number]; // string // ?? instead of `typeof lngs[number];` in case we want to override the list on another app (to add or remove a lng)

export const defaultLng: LngType = process.env?.NEXT_PUBLIC_I18N_DEFAULT_LNG || 'en';
export const defaultI18nNamespace: string = process.env?.NEXT_PUBLIC_I18N_DEFAULT_NS || 'common';
export const allLngs = ["ab", "aa", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae", "ay", "az", "bm", "ba", "eu", "be", "bn", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "ny", "zh", "cu", "cv", "kw", "co", "cr", "hr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "fy", "ff", "gd", "gl", "lg", "ka", "de", "el", "kl", "gn", "gu", "ht", "ha", "he", "hz", "hi", "ho", "hu", "is", "io", "ig", "id", "ia", "ie", "iu", "ik", "ga", "it", "ja", "jv", "kn", "kr", "ks", "kk", "km", "ki", "rw", "ky", "kv", "kg", "ko", "kj", "ku", "lo", "la", "lv", "li", "ln", "lt", "lu", "lb", "mk", "mg", "ms", "ml", "mt", "gv", "mi", "mr", "mh", "mn", "na", "nv", "nd", "nr", "ng", "ne", "no", "nb", "nn", "ii", "oc", "oj", "or", "om", "os", "pi", "ps", "fa", "pl", "pt", "pa", "qu", "ro", "rm", "rn", "ru", "se", "sm", "sg", "sa", "sc", "sr", "sn", "sd", "si", "sk", "sl", "so", "st", "es", "su", "sw", "ss", "sv", "tl", "ty", "tg", "ta", "tt", "te", "th", "bo", "ti", "to", "ts", "tn", "tr", "tk", "tw", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "cy", "wo", "xh", "yi", "yo", "za", "zu"];
export const lngCookieName = 'i18n-lng'

export function url(lng: LngType = 'en', url: string): string {
  return `/${lng}/${url}`;
}

export type GetI18nOptionsProps = {
  lng?: LngType,
  ns?: string,
  lngs?: [LngType],
}
export function getI18nOptions(props: GetI18nOptionsProps = {}) {

  /*
  console.log("GET OPTION ", {
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: props.lngs || lngs,
    fallbackLng: defaultLng,
    lng: props.lng || defaultLng,
    fallbackNS: defaultI18nNamespace,
    defaultNS: defaultI18nNamespace,
    ns: props.ns || defaultI18nNamespace,
  })
  */
  return {
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: props.lngs || lngs,
    fallbackLng: defaultLng,
    lng: props.lng || defaultLng,
    fallbackNS: defaultI18nNamespace,
    defaultNS: defaultI18nNamespace,
    ns: props.ns || defaultI18nNamespace,
  };
}

// ----------------------- Helpers -----------------------

export const isSupportedLng = (lng: string | null | undefined): boolean => {
  return lng && (lngs as unknown as string[]).includes(lng) || false;
}


// Return only the Lng argument on the url (supported or not)
export const getPathnameLng = (pathname: string): string | undefined => {

  // const pathname = (req:NextRequest).nextUrl.pathname;

  // Can be `/en` || `/en/pages`
  //  But `/engagement/` should not return 'en`

  return allLngs.find((lng) => pathname === `/${lng}` || pathname.startsWith(`/${lng}/`))
}

// Return the pathname wihtout lng (supported or not)
// Allow us to redirect in the future to
//  * Add lng if Url didn't have one
//  * Rewrite with supported lng
export const getPathnameWihoutLng = (pathname: string): string => {
  // const pathname = (req:NextRequest).nextUrl.pathname;
  const lng = getPathnameLng(pathname);

  // console.log("pathname => ", pathname)
  // console.log("lng => ", lng)
  // console.log("nani => ", lng && pathname.slice(lng.length + 1))

  return lng
    ? pathname.slice(lng.length + 1) // Remove the start `/lng` (+1 because /)
    : pathname;
}

// Return an url with lng we want to render (can already have another lng, or none)
export const getRedirectedLngUrl = (pathname: string, lng: LngType): string => {
  return `/${lng}${getPathnameWihoutLng(pathname)}`
}

// Will return a Supported Language based on the first Supported Langugage founded
export const getLng = (req: NextRequest): LngType => {

  let lng: string | null | undefined;
  const pathname = req.nextUrl.pathname;

  // 1. Check in URL first
  lng = getPathnameLng(pathname);
  if (isSupportedLng(lng)) {
    return lng as LngType;
  }

  // 2. Then in cookies
  lng = req.cookies.get(lngCookieName)?.value;
  if (isSupportedLng(lng)) {
    return lng as LngType;
  }

  // 3. Ask for user prefered language value
  //
  // @TODO (call api to know the stored value of user prefered langugae, if connected, ...)
  //

  // 4. Finally in request headers
  lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (isSupportedLng(lng)) {
    return lng as LngType;
  }

  // 5. Fallback to default language
  return defaultLng;
}
