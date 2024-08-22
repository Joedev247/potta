import "../index.css";
import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "remixicon/fonts/remixicon.css";
import "react-phone-input-2/lib/style.css";
import { AuthProvider } from "../contexts/authContext";
import { DataProvider } from "../contexts/verificationContext";
import { ReactQueryClientProvider } from "../contexts/reactQueryContext";
import { Toast } from "@instanvi/ui-components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryClientProvider>
      <DataProvider>
        <AuthProvider>
          <Head>
            <title>Instanvi - Super App</title>
            <meta name="description" content="Your page description" />
            <link rel="icon" type="image/svg+xml" href="/icons/instanvi.svg" />
          </Head>
          <Component {...pageProps} />
          <Toast />
        </AuthProvider>
      </DataProvider>
    </ReactQueryClientProvider>
  );
}
