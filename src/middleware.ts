// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import acceptLanguage from 'accept-language'

import { lngCookieName, lngs, getLng, getPathnameLng, getPathnameWihoutLng, getRedirectedLngUrl } from '@/lib/i18n';


const DEBUG_I18N = true;


// --------------------- i18n init ----------------------

acceptLanguage.languages(lngs);

// --------------------- middleware config ----------------------

export const config = {
  // All Routes except API, static, image, favicon
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)']

  // From https://locize.com/blog/next-13-app-dir-i18n/
  // matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']


  // Everything
  // matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|public|sw.js|i18n).*)']
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|public|sw.js|i18n).*)']
}



// --------------------- middleware ----------------------


export async function middleware(req: NextRequest) {

  // -----------------------------------------------------------
  //  Handle i18n redirect
  // -----------------------------------------------------------
  // Following: https://locize.com/blog/next-13-app-dir-i18n/

  const pathname = req.nextUrl.pathname;
  const lng = getLng(req);

  // Get response (with if necessary)
  const res = (lng == getPathnameLng(pathname))
    ? NextResponse.next()
    : NextResponse.redirect(new URL(getRedirectedLngUrl(pathname, lng), req.url));


  if (DEBUG_I18N) {
    console.log("\n\n ================================== i18n ==================================");
    req.headers.forEach((value, name) => {
      console.log(" - Headers " + name + ":      ", value);
    });

    console.log(" - purpose:      ", req.headers.get('purpose'));
    console.log(" - x-middleware-prefetch:      ", req.headers.get('x-middleware-prefetch'));
    console.log(" - x-nextjs-data:      ", req.headers.get('x-nextjs-data'));
    console.log(" - x-is-prefetch:      ", req.headers.get('x-is-prefetch'));
    console.log(" - pathname:           ", req.nextUrl.pathname);
    console.log(" - cookie:             ", req.cookies.get(lngCookieName)?.value);
    console.log(" ============== ");
    console.log(" - url lng:            ", getPathnameLng(pathname));
    console.log(" - valid lng:          ", lng);
    if (lng !== getPathnameLng(pathname)) {
      console.log(" ============== ");
      console.log(" => clean pathname:    ", getPathnameWihoutLng(pathname));
      console.log(" => Redirect to:       ", new URL(getRedirectedLngUrl(pathname, lng), req.url).toString());
    }
  }

  // Update Cookie if different then stored values
  if (req.cookies.get(lngCookieName)?.value != lng) {
    res.cookies.set(lngCookieName, lng, { path: '/' });


    DEBUG_I18N && console.log(" ============== ");
    DEBUG_I18N && console.log(" => Set cookie:        ", `${lngCookieName}:${lng}`);
  }
  res.headers.set('x-middleware-cache', 'no-cache');

  DEBUG_I18N && console.log(" ===========================================================================\n\n");

  return res;
}
