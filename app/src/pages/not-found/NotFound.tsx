import { Link } from 'react-router';
import { ROUTES } from '@/config';
import { t } from '@/lib';

export const NotFound = () => {
  return (
    <>
      <h1>{t('notFoundTitle')}</h1>
      <Link to={ROUTES.HOME}>{t('backHome')}</Link>
    </>
  );
};
