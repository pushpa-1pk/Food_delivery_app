import bcrypt from "bcryptjs";
import { PrismaClient, Role, RestaurantStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@jaymalhar.com" },
    update: {},
    create: {
      name: "Jay Malhar Admin",
      email: "admin@jaymalhar.com",
      password,
      role: Role.ADMIN,
      isEmailVerified: true
    }
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@jaymalhar.com" },
    update: {},
    create: {
      name: "Jay Malhar Owner",
      email: "seller@jaymalhar.com",
      password,
      role: Role.SELLER,
      isEmailVerified: true
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      password,
      role: Role.CUSTOMER,
      isEmailVerified: true
    }
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "jay-malhar-main" },
    update: {
      sellerId: seller.id,
      name: "Jay Malhar",
      description: "Authentic Jay Malhar restaurant menu with morning specials, veg and nonveg dishes, Chinese favorites, and thali meals.",
      address: "Goregaon Tiroda Main Road, Kurhadi",
      city: "Goregaon",
      images: [],
      categories: ["Morning Special", "Veg Special", "Nonveg Special", "Chinese Special", "Thali Special"],
      deliveryFee: 40,
      deliveryRadius: 8,
      openingHours: "08:00 AM - 11:00 PM",
      status: RestaurantStatus.APPROVED,
      isOpen: true
    },
    create: {
      sellerId: seller.id,
      name: "Jay Malhar",
      slug: "jay-malhar-main",
      description: "Authentic Jay Malhar restaurant menu with morning specials, veg and nonveg dishes, Chinese favorites, and thali meals.",
      address: "Goregaon Tiroda Main Road, Kurhadi",
      city: "Goregaon",
      images: [],
      categories: ["Morning Special", "Veg Special", "Nonveg Special", "Chinese Special", "Thali Special"],
      deliveryFee: 40,
      deliveryRadius: 8,
      openingHours: "08:00 AM - 11:00 PM",
      status: RestaurantStatus.APPROVED,
      isOpen: true
    }
  });

  await prisma.menuItem.deleteMany({
    where: { restaurantId: restaurant.id }
  });

  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        name: "Veg Thali",
        description: "2 roti, rice, dal fry, sabzi, gravy, salad, pickle, kadi, and papad.",
        price: 160,
        category: "Thali Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Nonveg Thali",
        description: "Chicken curry, fish curry, chilli chicken, dal fry, papad, pickle, salad, and curd.",
        price: 200,
        category: "Thali Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Idli",
        description: "Soft idli served as a light morning special.",
        price: 20,
        category: "Morning Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Masala Dosa",
        description: "Classic masala dosa with chutney and sambar.",
        price: 50,
        category: "Morning Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Egg Dosa",
        description: "Egg dosa prepared fresh for breakfast service.",
        price: 60,
        category: "Morning Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Paneer Butter Masala",
        description: "Paneer in rich buttery tomato gravy.",
        price: 120,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Kadhai Paneer",
        description: "Paneer tossed with peppers and kadhai masala.",
        price: 130,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Mix Veg Paneer",
        description: "Mixed vegetables and paneer in house gravy.",
        price: 90,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Shahi Paneer",
        description: "Creamy shahi paneer with aromatic spices.",
        price: 120,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Tandoori Roti",
        description: "Fresh tandoori roti from the tandoor.",
        price: 20,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chapati",
        description: "Soft chapati served fresh.",
        price: 15,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Roti",
        description: "Daily fresh roti.",
        price: 10,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Veg Pulao Plate",
        description: "Fragrant veg pulao served as a full plate.",
        price: 120,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Paneer Mutter Mix Veg",
        description: "Paneer, peas, and mixed vegetables in a savory curry.",
        price: 120,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Dal Tadka",
        description: "Dal finished with a hot tadka.",
        price: 70,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Aloo Gobi Masala",
        description: "Potato and cauliflower cooked with masala.",
        price: 70,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Plain Rice",
        description: "Steamed plain rice.",
        price: 60,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Jeera Garlic Rice",
        description: "Rice flavored with jeera and garlic.",
        price: 70,
        category: "Veg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Manchurian",
        description: "Chinese special chicken manchurian in spicy sauce.",
        price: 100,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Chilli",
        description: "Spicy chicken chilli tossed with peppers.",
        price: 120,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Chops",
        description: "Crispy chicken chops with bold seasoning.",
        price: 120,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Lollipop",
        description: "Popular chicken lollipop starter.",
        price: 120,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Paneer Chilli",
        description: "Paneer chilli with onions and capsicum.",
        price: 100,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Rice",
        description: "Chinese style chicken rice.",
        price: 90,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Egg Rice",
        description: "Egg fried rice with house seasoning.",
        price: 80,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Paneer Schezwan",
        description: "Paneer tossed in spicy schezwan sauce.",
        price: 120,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Aloo Jeera",
        description: "Crisp aloo jeera with Chinese-style seasoning.",
        price: 60,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chilli Potato",
        description: "Potato strips cooked in chilli sauce.",
        price: 70,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Finger Chips",
        description: "Classic finger chips.",
        price: 60,
        category: "Chinese Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Tandoori Chicken Fry",
        description: "Large tandoori chicken fry platter.",
        price: 450,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Egg Curry Plate",
        description: "Egg curry served as a plate meal.",
        price: 80,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Omelette",
        description: "Fresh omelette made to order.",
        price: 50,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chilli Chicken",
        description: "Spicy nonveg special chilli chicken.",
        price: 120,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Tikka",
        description: "Tandoori chicken tikka with smoky flavor.",
        price: 180,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Tandoori Pahadi",
        description: "Pahadi style chicken tandoori.",
        price: 170,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Tandoori Tangdi",
        description: "Juicy tandoori tangdi.",
        price: 110,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Lajawab Kebab",
        description: "Signature chicken lajawab kebab.",
        price: 150,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Tambda Rassa",
        description: "Spicy chicken tambda rassa.",
        price: 150,
        category: "Nonveg Special",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Kolhapuri Kala Chicken",
        description: "Kolhapuri style kala chicken with rich masala.",
        price: 200,
        category: "Nonveg Special",
        isAvailable: true
      }
    ]
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: { discountPercent: 10, isActive: true },
    create: {
      code: "WELCOME10",
      discountPercent: 10,
      isActive: true
    }
  });

  await prisma.coupon.upsert({
    where: { code: "FESTIVE15" },
    update: { discountPercent: 15, isActive: true },
    create: {
      code: "FESTIVE15",
      discountPercent: 15,
      isActive: true
    }
  });

  console.log({ admin: admin.email, seller: seller.email, customer: customer.email, restaurant: restaurant.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });