import { Resource, Subject } from '@/types/resource';

export const SUBJECTS: Subject[] = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Mathematics' },
  { id: 3, name: 'Physics' },
  { id: 4, name: 'Chemistry' },
  { id: 5, name: 'Biology' },
  { id: 6, name: 'Other' },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'Data Structures and Algorithms',
    type: 'Video Course',
    subject: 'Computer Science',
    rating: 4.9,
    reviews: 152,
    description: 'Complete DSA course by FreeCodeCamp covering arrays, linked lists, trees, graphs, and algorithms',
    difficulty: 'Beginner',
    duration: '5 hours',
    links: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', title: 'Full DSA Course (FreeCodeCamp)' },
      { type: 'notes', url: 'https://www.geeksforgeeks.org/data-structures/', title: 'GeeksForGeeks DSA Notes' }
    ]
  },
  {
    id: 2,
    title: 'Python Programming Complete Course',
    type: 'Video Course',
    subject: 'Computer Science',
    rating: 4.8,
    reviews: 203,
    description: 'Learn Python from scratch - variables, functions, OOP, and real projects',
    difficulty: 'Beginner',
    duration: '4.5 hours',
    links: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', title: 'Python Full Course (Programming with Mosh)' },
      { type: 'notes', url: 'https://docs.python.org/3/tutorial/', title: 'Official Python Tutorial' }
    ]
  },
  {
    id: 3,
    title: 'Web Development - HTML, CSS, JavaScript',
    type: 'Video Course',
    subject: 'Computer Science',
    rating: 4.7,
    reviews: 189,
    description: 'Complete web development course covering HTML5, CSS3, and JavaScript ES6+',
    difficulty: 'Beginner',
    duration: '6 hours',
    links: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', title: 'HTML & CSS Full Course' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', title: 'JavaScript Full Course' },
      { type: 'notes', url: 'https://developer.mozilla.org/en-US/docs/Learn', title: 'MDN Web Docs' }
    ]
  },
  {
    id: 4,
    title: 'Calculus 1 - Complete Course',
    type: 'Video Course',
    subject: 'Mathematics',
    rating: 4.9,
    reviews: 178,
    description: 'Master limits, derivatives, and integrals with clear explanations and examples',
    difficulty: 'Intermediate',
    duration: '12 hours',
    links: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM', title: 'Calculus 1 Full Course (FreeCodeCamp)' },
      { type: 'notes', url: 'https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx', title: "Paul's Online Math Notes" }
    ]
  },
  {
    id: 5,
    title: 'Linear Algebra Complete Course',
    type: 'Video Course',
    subject: 'Mathematics',
    rating: 4.8,
    reviews: 145,
    description: 'Comprehensive coverage of vectors, matrices, eigenvalues, and transformations',
    difficulty: 'Advanced',
    duration: '8 hours',
    links: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=JnTa9XtvmfI', title: 'Linear Algebra (3Blue1Brown)' },
      { type: 'notes', url: 'https://www.khanacademy.org/math/linear-algebra', title: 'Khan Academy Linear Algebra' }
    ]
  },
  {
    id: 6,
    title: 'Physics 1 - Mechanics',
    type: 'Video Course',
    subject: 'Physics',
    rating: 4.8,
    reviews: 167,
    description: 'Classical mechanics covering motion, forces, energy, and momentum',
    difficulty: 'Intermediate',
    duration: '10 hours',
    links: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE', title: 'Physics 1 Full Course' },
      { type: 'notes', url: 'https://www.feynmanlectures.caltech.edu/', title: 'Feynman Lectures on Physics' }
    ]
  },
  {
    id: 7,
    title: 'General Chemistry - Complete Course',
    type: 'Video Course',
    subject: 'Chemistry',
    rating: 4.8,
    reviews: 156,
    description: 'Comprehensive chemistry course covering atoms, bonding, reactions, and stoichiometry',
    difficulty: 'Beginner',
    duration: '9 hours',
    links: [
      { type: 'video', url: 'https://www.youtube.com/watch?v=bka20Q9TN6M', title: 'Chemistry Full Course (FreeCodeCamp)' },
      { type: 'notes', url: 'https://chem.libretexts.org/', title: 'LibreTexts Chemistry' }
    ]
  },
];
