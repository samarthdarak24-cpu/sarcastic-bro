import { redirect } from 'next/navigation';

export default function FarmersPage() {
  redirect('/fpo/dashboard?section=management');
}
