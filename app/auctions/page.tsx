import { redirect } from 'next/navigation';

export default function AuctionsIndex() {
  redirect('/auctions/live');
}
