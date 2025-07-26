'use client';
import { useEffect, useState } from 'react';
import { fetchUser } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchUser().then(data => {
      if (!data.user) router.replace('/');
      else setReady(true);
    });
  }, [router]);

  if (!ready) return <p className="p-8">Loading…</p>;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Protected content for authenticated users.</p>
    </div>
  );
}
