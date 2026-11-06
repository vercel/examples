import Chat from './chat';
import { isConfigured } from '@/lib/config';

// Read env at request time so a keyless demo deploy renders "preview mode".
export const dynamic = 'force-dynamic';

export default function Home() {
  return <Chat configured={isConfigured()} />;
}
