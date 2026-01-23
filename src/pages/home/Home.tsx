import { ROUTES } from '@/config';
import { Link } from 'react-router';

export const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <nav className='flex gap-3'>
        <Link to={ROUTES.REMINDER_ADD}>Add</Link>
        <Link to={ROUTES.REMINDER_EDIT}>Edit #2</Link>
        <Link to={ROUTES.SETTINGS}>SETTINGS</Link>
      </nav>
    </>
  );
};
