import { Link } from 'react-router';
import { ROUTES } from '@/config';

export const NotFound = () => {
  return (
    <>
      <h1>Page not found</h1>
      <Link to={ROUTES.HOME}>Back Home</Link>
    </>
  );
};
