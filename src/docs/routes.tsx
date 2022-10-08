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
import LogoAndSlogan from './pages/TableLogoAndSlogan';
import ContactUs from './pages/TableContactUs';

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
  hidden: boolean;
};

export const routes: RouteProps[] = [
  {
    title: 'Inicio',
    icon: HiHome,
    href: '/',
    component: <DashboardPage />,
    group: false,
    hidden: false
  },
  {
    title: 'Carousel',
    icon: HiCollection,
    href: '/carousel',
    component: <TableCarousel />,
    group: false,
    card: {
      className: 'w-36', 
      images: { light: 'carousel-light.svg', dark: 'carousel-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Productos',
    icon: HiArchive,
    href: '/products',
    component: <TableProducts />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'buttons.svg', dark: 'buttons.svg' },
    },
    hidden: false
  },
  {
    title: 'Nuestra Misión',
    icon: HiAnnotation,
    href: '/ourmission',
    component: <TableOurMission />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'card-light.svg', dark: 'card-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Clientes y Ns. Equipo',
    icon: HiAnnotation,
    href: '/clientTestimonials',
    component: <TableClientTestimonials />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'card-light.svg', dark: 'card-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Especiales y Servicios',
    icon: HiNewspaper,
    href: '/OurServices',
    component: <TableOurServices />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'rating-light.svg', dark: 'rating-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Sobre Nosotros',
    icon: HiUsers,
    href: '/aboutUs',
    component: <TableAboutCompany />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'modal-light.svg', dark: 'modal-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Metodos De Envio',
    icon: HiOutlineCurrencyDollar,
    href: '/shippingMethods',
    component: <TableSendMethods />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'list-group-light.svg', dark: 'list-group-dark.svg' },
    },
    hidden: false
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
    hidden: false
  },
  {
    title: 'Ubicación',
    icon: HiLocationMarker,
    href: '/location',
    component: <TableLocation />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'tooltips-light.svg', dark: 'tooltips-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Login',
    icon: HiTable,
    href: '/login',
    component: <LoginPage />,
    group: false,
    hidden: true
  },
  {
    title: 'Descripción de Ubicación',
    icon: HiLocationMarker,
    href: '/descriptionLocation',
    component: <TableDescriptionLocation />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'tooltips-light.svg', dark: 'tooltips-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Logos y slogan',
    icon: HiNewspaper,
    href: '/logoAndSlogan',
    component: <LogoAndSlogan />,
    group: false,
    card: {
      className: 'w-36',
      images: { light: 'card-light.svg', dark: 'card-dark.svg' },
    },
    hidden: false
  },
  {
    title: 'Contactanos',
    icon: HiNewspaper,
    href: '/contactUs',
    component: <ContactUs />,
    group: false,
    card: {
      className: 'w-36' ,
      images: { light: 'alerts-light.svg', dark: 'alerts-dark.svg' },
    },
    hidden: false
  }
];
