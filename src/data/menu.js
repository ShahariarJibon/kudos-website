// Full KUDOS menu — names and images from the official site (kudos.com.bd).
// Prices: verified from customer reviews where available; the rest are demo
// prices for the rebuild (confirm with the business before launch).
const img = (file) => `/images/${file}`;

export const MENU_CATEGORIES = [
  {
    id: 'burgers',
    label: 'Burgers',
    blurb: 'Flame-kissed patties, loaded toppings, unmistakable KUDOS taste.',
    items: [
      { name: '90s Classic Chicken Burger', image: img('90s-classic-burger.jpg'), price: '৳169', desc: 'The original KUDOS classic — crispy chicken, fresh veggies and secret house sauce.' },
      { name: 'Chick Room Burger', image: img('chickroom-burger.jpg'), price: '৳189', desc: 'Two juicy chicken patties with our signature smoky chick-room glaze.' },
      { name: 'Chicken Cheese Burger', image: img('chicken-cheese-burger.jpg'), price: '৳199', desc: 'Crispy chicken fillet topped with molten cheese in a soft toasted bun.' },
      { name: 'Baconator Burger', image: img('baconator.jpg'), price: '৳219', desc: 'Double chicken, smoky bacon strips and cheese — a meat lover’s dream.' },
      { name: 'Loaded Sausage Burger', image: img('loaded-sausage-burger.jpg'), price: '৳209', desc: 'Grilled sausage loaded with cheese, pickles and house sauce.' },
      { name: 'Meat Madness', image: img('meat-madness.jpg'), price: '৳249', desc: 'Triple-stacked meaty layers built for a serious appetite.' },
      { name: 'Nugget Monster', image: img('nugget-monster.jpg'), price: '৳229', desc: 'A tower of golden chicken nuggets smothered in cheese sauce.' },
    ],
  },
  {
    id: 'wings-tenders',
    label: 'Wings & Tenders',
    blurb: 'Crispy, juicy and dangerously spicy — a KUDOS signature.',
    items: [
      { name: 'Hot & Crispy Wings', image: img('hot-crispy-wings.jpg'), price: '৳179', desc: 'Crispy, juicy wings tossed in our fiery house seasoning.' },
      { name: 'Naga Wings (6 pcs)', image: img('naga-wings.jpg'), price: '৳189', desc: 'The legendary Naga wings — dangerously spicy, 6 pieces per serving.' },
      { name: 'Chicken Tenders', image: img('chicken-tenders.jpg'), price: '৳225', desc: 'Golden-fried tender strips, crunchy outside, juicy inside.' },
      { name: 'Chilli Tenders', image: img('chilli-tenders.jpg'), price: '৳199', desc: 'Tender strips wok-tossed in sweet chilli and garlic.' },
      { name: 'Chicken Nuggets', image: img('chicken-nuggets.jpg'), price: '৳159', desc: 'Bite-sized crispy nuggets — the perfect combo partner.' },
      { name: 'Chicken Lollipop', image: img('chicken-lollipop.jpg'), price: '৳189', desc: 'Frenched chicken lollipops, glazed and extra crispy.' },
    ],
  },
  {
    id: 'wraps',
    label: 'Wraps',
    blurb: 'Hand-rolled wraps packed with flavour in every bite.',
    items: [
      { name: 'Crunchy Wrap', image: img('crunchy-wrap.jpg'), price: '৳159', desc: 'Crispy chicken wrapped with lettuce, mayo and tangy house sauce.' },
      { name: 'Tandoori Wrap', image: img('tandoori-wrap.jpg'), price: '৳169', desc: 'Smoky tandoori chicken wrapped fresh with mint chutney.' },
    ],
  },
  {
    id: 'rice',
    label: 'Rice Meals',
    blurb: 'Rich, smoky rice bowls with grilled chicken perfection.',
    items: [
      { name: 'Lemon Smoked Rice with Peri Peri Chicken', image: img('lemon-smoked-rice-peri-peri.jpg'), price: '৳239', desc: 'Smoky lemon rice served with flame-grilled peri peri chicken.' },
      { name: 'Lemon Smoked Rice with Hot Cube Chicken', image: img('lemon-smoked-rice-hot-cube.jpg'), price: '৳239', desc: 'Smoky lemon rice topped with crispy hot cube chicken bites.' },
      { name: 'Korean Ginger Orangey Chicken Meal', image: img('korean-ginger-chicken.jpg'), price: '৳269', desc: 'Korean-style chicken with a sweet ginger-orangey glaze over rice.' },
      { name: 'Loaded Meatbox', image: img('loaded-meatbox.jpg'), price: '৳299', desc: 'A box packed with rice, grilled meats and loaded toppings.' },
    ],
  },
  {
    id: 'sandwiches',
    label: 'Sandwiches',
    blurb: 'Subs and sandwiches made live, toasted and stacked tall.',
    items: [
      { name: 'Chicken Sub-Sandwich', image: img('chicken-sub.jpg'), price: '৳179', desc: 'Freshly toasted sub loaded with tender chicken.' },
      { name: 'Smokey Chicken Sandwich', image: img('smokey-chicken-sandwich.jpg'), price: '৳179', desc: 'Smoky grilled chicken cheese sandwich, made live in front of you.' },
      { name: 'Roasted Beef Sub-Sandwich', image: img('roasted-beef.jpg'), price: '৳189', desc: 'Slow-roasted beef, fresh veg and creamy sauce in a toasted sub.' },
      { name: 'Tandoori Sandwich', image: img('tandoori-sandwich.jpg'), price: '৳149', desc: 'Tandoori-spiced chicken between golden toasted bread.' },
    ],
  },
  {
    id: 'sides',
    label: 'Fries & Sides',
    blurb: 'Golden, crunchy sides made for sharing (or not).',
    items: [
      { name: 'Handcrafted Fries', image: img('handcrafted-fries.jpg'), price: '৳99', desc: 'Thick-cut handcrafted fries, fried golden and seasoned.' },
      { name: 'Masala Potatoes', image: img('masala-potatoes.jpg'), price: '৳119', desc: 'Spiced potato bites tossed in tangy masala.' },
      { name: 'Hot Chips', image: img('hot-chips.jpg'), price: '৳89', desc: 'Extra crispy hot chips with a sprinkle of seasoning.' },
    ],
  },
  {
    id: 'drinks',
    label: 'Drinks & Freezes',
    blurb: 'Ice-cold freezes and punches to beat the Dhaka heat.',
    items: [
      { name: 'Choco Coffee Freeze (Small)', image: img('choco-coffee-freeze-s.jpg'), price: '৳79', desc: 'Our famous blended choco coffee freeze — small size.' },
      { name: 'Choco Coffee Freeze (Large)', image: img('choco-coffee-freeze-l.jpg'), price: '৳129', desc: 'Our famous blended choco coffee freeze — large size.' },
      { name: 'Fruit Punch', image: img('fruit-punch.jpg'), price: '৳99', desc: 'A refreshing blend of seasonal fruits, served ice cold.' },
      { name: 'Apple Punch', image: img('apple-punch.jpg'), price: '৳79', desc: 'Crisp apple punch, chilled and refreshing.' },
      { name: 'Orange Citrus', image: img('orange-citrus.jpg'), price: '৳89', desc: 'Zesty orange citrus drink with a tangy kick.' },
      { name: 'Pink Lady', image: img('pink-lady.jpg'), price: '৳109', desc: 'Sweet pink freeze with a fruity finish.' },
    ],
  },
];

// Flat list used by the Home showcase carousel
export const ALL_ITEMS = MENU_CATEGORIES.flatMap((c) => c.items.map((item) => ({ ...item, category: c.label })));

// Helpers used by cart/checkout
export const priceToNumber = (priceStr) =>
  priceStr ? parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10) : 0;

export const MENU_POSTERS = [
  { src: '/images/menu-poster-1.jpg', alt: 'KUDOS full menu page 1' },
  { src: '/images/menu-poster-2.jpg', alt: 'KUDOS full menu page 2' },
  { src: '/images/menu-poster-3.jpg', alt: 'KUDOS full menu page 3' },
];