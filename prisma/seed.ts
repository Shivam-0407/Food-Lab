import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuItems = [
  {
    name: "Paneer Butter Masala",
    description: "Cottage cheese in a rich tomato-butter gravy",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop",
    category: "Curries",
  },
  {
    name: "Samosa (2 pcs)",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 69,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
    category: "Snacks",
  },
  {
    name: "Idli Sambar",
    description: "Steamed rice cakes with coconut chutney and sambar",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop",
    category: "South Indian",
  },

  {
    name: "Chicken Tikka",
    description: "Tandoor naan topped with garlic and coriander",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&h=400&fit=crop",
    category: "Breads",
  },
  {
    name: "Paneer Tikka",
    description: "Char-grilled paneer marinated in tandoori spices",
    price: 279,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop",
    category: "Snacks",
  },
  {
    name: "Mawa Gulab Jamun (2 pcs)",
    description: "Soft milk dumplings soaked in rose syrup",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?w=600&h=400&fit=crop",
    category: "Sweets",
  },
  {
    name: "Masala Chai",
    description: "Hot spiced Indian tea with milk",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop",
    category: "Drinks",
  },
];

async function main() {
  console.log("Seeding Indian vegetarian menu (INR)...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();

  await prisma.menuItem.createMany({ data: menuItems });

  const count = await prisma.menuItem.count();
  console.log(`Seeded ${count} menu items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
