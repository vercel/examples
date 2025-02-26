import { StaticStatsigProvider } from '@/components/statsig/statsig-provider';
import { productFlags } from '@/flags';
import { deserialize, generatePermutations } from 'flags/next';
import { FlagValues } from 'flags/react';
import { Suspense } from 'react';

export async function generateStaticParams() {
  // Returning an empty array here is important as it enables ISR, so
  // the various combinations stay cached after they first time they were rendered.
  //
  // return [];

  // Instead of returning an empty array you could also call generatePermutations
  // to generate the permutations upfront.
  const codes = await generatePermutations(productFlags);
  return codes.map((code) => ({ code }));
}

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    code: string;
  }>;
}) {
  const params = await props.params;
  const values = await deserialize(productFlags, params.code);

  return (
    <StaticStatsigProvider>
      {props.children}
      <Suspense fallback={null}>
        <FlagValues values={values} />
      </Suspense>
    </StaticStatsigProvider>
  );
}
