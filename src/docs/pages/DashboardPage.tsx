import classNames from 'classnames';
import type { FC } from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../lib/helpers/getImageUrl';
import { routes } from '../routes';

const DashboardPage: FC = () => {
  return (
    <div className="mx-auto max-w-screen-xl p-4 lg:p-12 lg:text-center">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map(({ title, href, card }, index) => {
          if (!card) return;
          const { className, images } = card;
          return (
            <Link
              key={index}
              className="h-64 rounded-xl border border-gray-100 bg-white shadow transition hover:border-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-800 dark:hover:border-gray-600"
              to={href}
            >
              <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 py-2.5 px-5 dark:border-gray-700 dark:bg-gray-700">
                <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{title}</span>
                <HiExternalLink className="h-5 w-5 text-gray-900 dark:text-white" />
              </div>
              <div className="flex h-52 items-center justify-center">
                <img className={classNames(className, 'dark:hidden')} src={getImageUrl(images.light)} alt="Alerts" />
                <img
                  className={classNames(className, 'hidden dark:block')}
                  src={getImageUrl(images.dark)}
                  alt="Alerts"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
