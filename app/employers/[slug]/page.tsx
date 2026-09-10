import { redirect } from 'next/navigation';

/** Directory is parked — jobs board is the product for now. */
export default function EmployerProfile() {
  redirect('/jobs');
}
