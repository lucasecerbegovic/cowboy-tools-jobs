import type { Metadata } from 'next';
import { PostJobForm } from '@/components/post-job-form';
import { monoUi, muted } from '@/lib/brand-type';

export const metadata: Metadata = {
  title: 'Post a job',
  description: 'List a role in the skilled trades.',
};

export default function PostJobPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-12 md:px-8">
      <p className={`${monoUi} ${muted}`}>For employers</p>
      <h1 className="mt-3 text-page-title">Post a job</h1>
      <p className={`mt-4 max-w-[60ch] text-body ${muted}`}>
        Listings go live immediately. Posting pay is optional but it is the
        single strongest predictor of applications.
      </p>
      <div className="mt-12">
        <PostJobForm />
      </div>
    </main>
  );
}
