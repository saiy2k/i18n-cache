'use client';

import { useContext } from "react";
import { LngContext, LngContextType } from "@/contexts/LngContext";

export default function Layout({
  children,
  params: { lng }
}: {
  children: React.ReactNode
  params: any
}) {

  const { lng: lang, setLng } = useContext(LngContext) as LngContextType;

  if (lng !== lang) {
    setLng(lng);
  }

  return children;
}
