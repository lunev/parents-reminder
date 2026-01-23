import { Link } from 'react-router';
import { ROUTES } from '@/config';

export const Settings = () => {
  return (
    <>
      <header>
        <Link to={ROUTES.HOME}>Logo</Link>
      </header>
      <p>Settings</p>
    </>
  );
};
