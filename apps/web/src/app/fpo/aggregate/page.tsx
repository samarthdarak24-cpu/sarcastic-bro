import { redirect } from 'next/navigation';

export default function AggregatePage() {
  redirect('/fpo/dashboard?section=aggregation');
}
