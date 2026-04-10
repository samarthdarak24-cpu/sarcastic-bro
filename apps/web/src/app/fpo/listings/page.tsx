import { redirect } from 'next/navigation';

export default function ListingsPage() {
  redirect('/fpo/dashboard?section=listings');
}
