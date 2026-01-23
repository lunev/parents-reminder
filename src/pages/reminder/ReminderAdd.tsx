import { Link } from 'react-router';
import { ROUTES } from '@/config';

export const ReminderAdd = () => {
  return (
    <>
      <header>
        <Link to={ROUTES.HOME}>Logo</Link>
      </header>
      <p>Add</p>
    </>
  );
};
