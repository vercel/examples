import { StaticStatsigProvider } from '@/components/statsig/statsig-provider';
import { productFlags } from '@/flags';
import { type FlagValuesType, encrypt } from 'flags';
import { deserialize, generatePermutations } from 'flags/next';
import { FlagValues } from 'flags/react';
import { Suspense } from 'react';

async function ConfidentialFlagValues({ values }: { values: FlagValuesType }) {
  const encryptedFlagValues = await encrypt(values);
  return <FlagValues values={encryptedFlagValues} />;
}

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
        <ConfidentialFlagValues values={values} />
      </Suspense>
    </StaticStatsigProvider>
  );
}
