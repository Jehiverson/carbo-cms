import type { ComponentProps, FC, ReactNode } from 'react';
import {
  HiHome,
  HiTable,
  HiCollection,
  HiArchive,
  HiAnnotation,
  HiNewspaper,
  HiUsers,
  HiOutlineCurrencyDollar,
  HiOutlineTable,
  HiLocationMarker
} from 'react-icons/hi';

import DashboardPage from './pages/DashboardPage';
import TableCarousel from './pages/TableCarousel';
import TableProducts from './pages/TableProducts';
import TableOurMission from './pages/TableOurMission'
import TableClientTestimonials from './pages/TableClientTestimonials';
import TableOurServices from './pages/TableOurServices';
import TableAboutCompany from './pages/TableAboutUs';
import TableSendMethods from './pages/TableSendMethods';
import TableFooter from './pages/TableFooter';
import TableLocation from './pages/TableLocation';
import TableDescriptionLocation from './pages/TableDescriptionLocation';
import LoginPage from './pages/LoginPage';

export type ComponentCardItem = {
  className: string;
  images: { light: string; dark: string };
};

export type RouteProps = {
  title: string;
  icon: FC<ComponentProps<'svg'>>;
  href: string;
  component: ReactNode;
  group: boolean;
  card?: ComponentCardItem;
};

export const routes: RouteProps[] = [
  {
    title: 'Principal',
    icon: HiHome,
    href: '/',
    component: <DashboardPage />,
    group: false,
  },
  {
    title: 'Carousel',
    icon: HiCollection,
    href: '/tables',
    component: <TableCarousel />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'carousel-light.svg', dark: 'carousel-dark.svg' },
    },
  },
  {
    title: 'Products',
    icon: HiArchive,
    href: '/products',
    component: <TableProducts />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'buttons.svg', dark: 'buttons.svg' },
    },
  },
  {
    title: 'Our Mission',
    icon: HiAnnotation,
    href: '/ourmission',
    component: <TableOurMission />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'card-light.svg', dark: 'card-dark.svg' },
    },
  },
  {
    title: 'Client Testimonials',
    icon: HiAnnotation,
    href: '/clientTestimonials',
    component: <TableClientTestimonials />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'card-light.svg', dark: 'card-dark.svg' },
    },
  },
  {
    title: 'Our Services',
    icon: HiNewspaper,
    href: '/OurServices',
    component: <TableOurServices />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'rating-light.svg', dark: 'rating-dark.svg' },
    },
  },
  {
    title: 'About Us',
    icon: HiUsers,
    href: '/aboutUs',
    component: <TableAboutCompany />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'modal-light.svg', dark: 'modal-dark.svg' },
    },
  },
  {
    title: 'Shipping Methods',
    icon: HiOutlineCurrencyDollar,
    href: '/sendMethods',
    component: <TableSendMethods />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'list-group-light.svg', dark: 'list-group-dark.svg' },
    },
  },
  {
    title: 'Footer',
    icon: HiOutlineTable,
    href: '/footer',
    component: <TableFooter />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'button-group-light.svg', dark: 'button-group-dark.svg' },
    },
  },
  {
    title: 'Location',
    icon: HiLocationMarker,
    href: '/location',
    component: <TableLocation />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'tooltips-light.svg', dark: 'tooltips-dark.svg' },
    },
  },
  {
    title: 'Login',
    icon: HiTable,
    href: '/login',
    component: <LoginPage />,
    group: false
  },
  {
    title: 'Location Description',
    icon: HiLocationMarker,
    href: '/descriptionLocation',
    component: <TableDescriptionLocation />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'tooltips-light.svg', dark: 'tooltips-dark.svg' },
    },
  }
];
