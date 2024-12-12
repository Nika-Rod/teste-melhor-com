'use client'

import TableProducts from "../../components/TableProducts/TableProducts";
import { AppProps } from "next/app";

export default function Home({ Component, pageProps }: AppProps) {
  return (
        <TableProducts/>
  );
}
