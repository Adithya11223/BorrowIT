// mockData.js - Empty database registers for BorrowIT (removing all demo items and users)

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'Cpu', count: 0 },
  { id: 'books', name: 'Books', icon: 'BookOpen', count: 0 },
  { id: 'cameras', name: 'Cameras', icon: 'Camera', count: 0 },
  { id: 'sports', name: 'Sports', icon: 'Activity', count: 0 },
  { id: 'tools', name: 'Tools', icon: 'Wrench', count: 0 },
  { id: 'home', name: 'Home Appliances', icon: 'Home', count: 0 }
];

export const initialUsers = {};
export const initialItems = [];
export const initialRequests = [];
export const initialReviews = [];
export const initialNotifications = [];
export const initialChats = {};

export const faqs = [
  {
    q: 'How does borrowing work on BorrowIT?',
    a: 'Simply browse available items, select the dates you need, and send a borrow request. Once the owner accepts, you coordinate the pickup. All communications occur securely on our platform.'
  },
  {
    q: 'Is there a security deposit required?',
    a: 'Some owners might request a security deposit, which is fully refundable upon returning the item in its original condition. The deposit requirements are stated on each item details page.'
  },
  {
    q: 'What if an item gets damaged?',
    a: 'We encourage honest and respectful usage. In case of accidental damage, please coordinate with the owner immediately. Both parties are covered by our Community Trust Guidelines.'
  },
  {
    q: 'How is the Trust Score calculated?',
    a: 'Trust score is calculated dynamically based on feedback rating, successful borrowing/lending transactions, and account verification status.'
  }
];

export const testimonials = [
  {
    quote: 'BorrowIT has completely changed how I think about ownership. I rented a high-end projector for a movie night for 5% of its retail cost. Easy and sustainable!',
    author: 'Sunita Rao',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
  },
  {
    quote: 'Lending my tools has allowed me to offset my initial purchase costs while helping neighbors complete their DIY projects. The trust score system is highly accurate.',
    author: 'Karan Malhotra',
    role: 'Home DIY Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'
  }
];
