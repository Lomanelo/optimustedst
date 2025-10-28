import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface CanonicalURLProps {
  path?: string;
}

export default function CanonicalURL({ path }: CanonicalURLProps) {
  const pathname = usePathname();
  const canonicalPath = path || pathname;
  const canonicalURL = `https://optimusksa.com${canonicalPath}`;

  return (
    <Head>
      <link rel="canonical" href={canonicalURL} />
    </Head>
  );
} 