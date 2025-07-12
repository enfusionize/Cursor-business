export interface BookPage {
  slug: string;
  title: string;
  image: any;
  excerpt?: string;
}

export const PAGES: BookPage[] = [
  { slug: 'front-cover',   title: 'Awakening — Front Cover',  image: require('../../assets/pages/front-cover.png') },
  { slug: 'inside-portal', title: 'Mirror-Side Portal',      image: require('../../assets/pages/inside-portal.png') },
  { slug: 'back-cover',    title: 'Back Cover',              image: require('../../assets/pages/back-cover.png') },
  { slug: 'preface',       title: 'Preface — The Process',   image: require('../../assets/pages/preface.png') },
  { slug: 'entrypoint',    title: 'Entrypoint Mechanics',    image: require('../../assets/pages/entrypoint.png') },
  { slug: 'week1',         title: 'Week-1 Foundations',      image: require('../../assets/pages/week1.png') },
  { slug: 'week2',         title: 'Week-2 Architecture',     image: require('../../assets/pages/week2.png') },
  { slug: 'week3',         title: 'Week-3 Activations',      image: require('../../assets/pages/week3.png') },
  { slug: 'day22',         title: 'Day-22 Introspection',    image: require('../../assets/pages/day22.png') },
  { slug: 'week4',         title: 'Week-4 Unraveling',       image: require('../../assets/pages/week4.png') },
  { slug: 'week5',         title: 'Week-5 Triumphant',       image: require('../../assets/pages/week5.png') },
  { slug: 'week6',         title: 'Week-6 Experimental',     image: require('../../assets/pages/week6.png') },
  { slug: 'day44',         title: 'Day-44 Meditative',       image: require('../../assets/pages/day44.png') },
  { slug: 'week7',         title: 'Week-7 Ignited',          image: require('../../assets/pages/week7.png') },
  { slug: 'week8',         title: 'Week-8 Launched',         image: require('../../assets/pages/week8.png') },
  { slug: 'week9',         title: 'Week-9 Future-casting',   image: require('../../assets/pages/week9.png') },
  { slug: 'day66',         title: 'Day-66 Integration',      image: require('../../assets/pages/day66.png') },
  { slug: 'day67',         title: 'Day-67 Ascendancy',       image: require('../../assets/pages/day67.png') },
  { slug: 'bonus',         title: 'Bonus Meditation',        image: require('../../assets/pages/bonus-meditation.png') },
  { slug: 'universal',     title: 'Universal Circuits',      image: require('../../assets/pages/universal-circuits.png') }
];