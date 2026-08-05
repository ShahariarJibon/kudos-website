// Central site configuration — all real KUDOS business content, no third-party spam.
export const SITE = {
  name: 'KUDOS',
  tagline: 'As Good As It Gets',
  established: 2020,
  email: 'kudoseat@gmail.com',
  phone: '+88-01750-209096',
  phoneHref: 'tel:+8801750209096',
  orderUrl: 'https://kudos.engaze.ai/',
  deliveryFee: 49, // estimated flat delivery fee (৳)
  deliveryEta: '30–45 min',
  pickupEta: '15–20 min',
  socials: {
    facebook: {
      label: 'Facebook',
      url: 'https://www.facebook.com/kudoseat',
      handle: 'facebook.com/kudoseat',
    },
    instagram: {
      label: 'Instagram',
      url: 'https://www.instagram.com/kudos_eat/',
      handle: 'instagram.com/kudos_eat',
    },
    youtube: {
      label: 'YouTube',
      url: 'https://www.youtube.com/@kudosbd',
      handle: 'youtube.com/@kudosbd',
    },
  },
  hours: [
    { days: 'Saturday – Thursday', open: '12:00 PM', close: '10:30 PM' },
    { days: 'Friday', open: '3:00 PM', close: '11:00 PM' },
  ],
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'KudoCafe', to: '/kudocafe' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Outlet Location', to: '/outlets' },
  { label: 'About', to: '/about' },
  { label: 'Board of Directors', to: '/board' },
];

export const STATS = [
  { label: 'Year Established', value: 2020, suffix: '' },
  { label: 'Active Branches', value: 18, suffix: '+' },
  { label: 'Districts Served', value: 5, suffix: '' },
  { label: 'Menu Items', value: 60, suffix: '+' },
];