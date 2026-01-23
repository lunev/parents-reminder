import { ROUTES } from '@/config';
import { Link, useParams } from 'react-router';

export const ReminderEdit = () => {
  const { id } = useParams();

  return (
    <>
      <header>
        <Link to={ROUTES.HOME}>Logo</Link>
      </header>
      <p>Edit {id}</p>
    </>
  );
};
