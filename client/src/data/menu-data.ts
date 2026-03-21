import dosa from "public/assets/dosa.jpg";
import chines from "public/assets/chines.png";
import nonveg from "public/assets/nonveg.jpg";
import veg from "public/assets/veg.png";
import thali from "public/assets/thali.jpg";
import morning from "public/assets/morning.jpeg";

export type MenuCategory = "Morning Special" | "Veg Special" | "Nonveg Special" | "Chinese Special" | "Thali Special" | "South Indian Special";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  description: string;
  imageLabel: string;
  image?: string;
  isVeg: boolean;
  rating: number;
  isAvailable: boolean;
  isBestSeller?: boolean;
  spicyLevel?: "Mild" | "Medium" | "Spicy";
};

export const menuCategories: Array<{ label: string; value: "All" | MenuCategory; image?: any }> = [
  { label: "All", value: "All", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" },
  { label: "Morning Special", value: "Morning Special", image: morning },
  { label: "Veg Special", value: "Veg Special", image: veg },
  { label: "Nonveg Special", value: "Nonveg Special", image: nonveg },
  { label: "Chinese Special", value: "Chinese Special", image: chines },
  { label: "Thali Special", value: "Thali Special", image: thali },
  { label: "South Indian Special", value: "South Indian Special", image: dosa }
];

export const menuItems: MenuItem[] = [
  {
    id: "veg-thali",
    name: "Veg Thali",
    price: 160,
    category: "Thali Special",
    description: "2 roti, rice, dal fry, sabzi, gravy, salad, pickle, kadi, and papad.",
    imageLabel: "VT",
    image: "https://images.unsplash.com/photo-1546833999-b14569af22b5?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    rating: 4.7,
    isAvailable: true,
    isBestSeller: true,
    spicyLevel: "Medium"
  },
  {
    id: "nonveg-thali",
    name: "Nonveg Thali",
    price: 200,
    category: "Thali Special",
    description: "Chicken curry, fish curry, chilli chicken, dal fry, papad, pickle, salad, and curd.",
    imageLabel: "NT",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800",
    isVeg: false,
    rating: 4.8,
    isAvailable: true,
    isBestSeller: true,
    spicyLevel: "Spicy"
  },
  {
    id: "idli",
    name: "Idli",
    price: 20,
    category: "Morning Special",
    description: "Soft idli served as a light morning special.",
    imageLabel: "ID",
    image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    rating: 4.4,
    isAvailable: true,
    spicyLevel: "Mild"
  },
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    price: 50,
    category: "Morning Special",
    description: "Classic masala dosa with chutney and sambar.",
    imageLabel: "MD",
    image: "https://images.unsplash.com/photo-1551881192-002d08ab6dcc?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    rating: 4.6,
    isAvailable: true,
    isBestSeller: true,
    spicyLevel: "Medium"
  },
  {
    id: "egg-dosa",
    name: "Egg Dosa",
    price: 60,
    category: "Morning Special",
    description: "Egg dosa prepared fresh for breakfast service.",
    imageLabel: "ED",
    image: "https://images.unsplash.com/photo-1551881192-002d08ab6dcc?auto=format&fit=crop&q=80&w=800",
    isVeg: false,
    rating: 4.5,
    isAvailable: true,
    spicyLevel: "Medium"
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    price: 120,
    category: "Veg Special",
    description: "Paneer in rich buttery tomato gravy.",
    imageLabel: "PB",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    rating: 4.7,
    isAvailable: true,
    isBestSeller: true,
    spicyLevel: "Medium"
  },
  {
    id: "kadhai-paneer",
    name: "Kadhai Paneer",
    price: 130,
    category: "Veg Special",
    description: "Paneer tossed with peppers and kadhai masala.",
    imageLabel: "KP",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    rating: 4.6,
    isAvailable: true,
    spicyLevel: "Spicy"
  },
  {
    id: "dal-tadka",
    name: "Dal Tadka",
    price: 70,
    category: "Veg Special",
    description: "Dal finished with a hot tadka.",
    imageLabel: "DT",
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    rating: 4.4,
    isAvailable: true,
    spicyLevel: "Medium"
  },
  {
    id: "chicken-chilli",
    name: "Chicken Chilli",
    price: 120,
    category: "Chinese Special",
    description: "Spicy chicken chilli tossed with peppers.",
    imageLabel: "CC",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800",
    isVeg: false,
    rating: 4.7,
    isAvailable: true,
    isBestSeller: true,
    spicyLevel: "Spicy"
  },
  {
    id: "chicken-lollipop",
    name: "Chicken Lollipop",
    price: 120,
    category: "Chinese Special",
    description: "Popular chicken lollipop starter.",
    imageLabel: "CL",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800",
    isVeg: false,
    rating: 4.6,
    isAvailable: true,
    isBestSeller: true,
    spicyLevel: "Spicy"
  },
  {
    id: "paneer-chilli",
    name: "Paneer Chilli",
    price: 100,
    category: "Chinese Special",
    description: "Paneer chilli with onions and capsicum.",
    imageLabel: "PC",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    rating: 4.5,
    isAvailable: true,
    spicyLevel: "Spicy"
  },
  {
    id: "tandoori-chicken-fry",
    name: "Tandoori Chicken Fry",
    price: 450,
    category: "Nonveg Special",
    description: "Large tandoori chicken fry platter.",
    imageLabel: "TC",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800",
    isVeg: false,
    rating: 4.8,
    isAvailable: true,
    isBestSeller: true,
    spicyLevel: "Spicy"
  },
  {
    id: "egg-curry-plate",
    name: "Egg Curry Plate",
    price: 80,
    category: "Nonveg Special",
    description: "Egg curry served as a plate meal.",
    imageLabel: "EC",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    isVeg: false,
    rating: 4.4,
    isAvailable: true,
    spicyLevel: "Medium"
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    price: 180,
    category: "Nonveg Special",
    description: "Tandoori chicken tikka with smoky flavor.",
    imageLabel: "CT",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800",
    isVeg: false,
    rating: 4.7,
    isAvailable: true,
    spicyLevel: "Spicy"
  }
];