import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { AppProps } from "next/app";

// TODO: Replace with your actual Convex deployment URL
const convex = new ConvexReactClient("https://expert-meadowlark-636.convex.cloud");

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
} 