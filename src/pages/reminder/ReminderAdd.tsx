import { Link } from 'react-router';
import { ROUTES } from '@/config';
import { ReminderForm } from './ReminderForm';

export const ReminderAdd = () => {
  return (
    <>
      <header>
        <Link to={ROUTES.HOME}>Logo</Link>
      </header>
      <p>Add</p>
      <ReminderForm />
    </>
  );
};
