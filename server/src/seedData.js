const seedProducts = [
  { id: 1, name: "Cap", category: "Hats", price: 828, stock: 25 },
  { id: 2, name: "2 Color T-Shirt", category: "Hats", price: 144, stock: 43 },
  { id: 3, name: "Polo Tshirt", category: "Men's cloths", price: 28, stock: 123 },
  { id: 4, name: "Couple Set", category: "Men's cloths", price: 85, stock: 33 },
  { id: 5, name: "Collection", category: "Collection", price: 113, stock: 11 },
  { id: 6, name: "Balt Bag", category: "Collection", price: 28, stock: 123 },
  { id: 20, name: "Female T-Shirt", category: "Women's cloths", price: 25, stock: 10 },
  { id: 7, name: "Female Polo T-Shirt", category: "Women's cloths", price: 92, stock: 323 },
  { id: 8, name: "Half Pant", category: "Women's cloths", price: 35, stock: 52 },
  { id: 9, name: "Bag", category: "Accessories", price: 13, stock: 25 },
  { id: 10, name: "Glasses", category: "Glases", price: 828, stock: 30 },
  { id: 11, name: "Nike Hat", category: "Hats", price: 144, stock: 20 },
  { id: 12, name: "Addidas Shoes", category: "Shoes", price: 28, stock: 19 },
  { id: 13, name: "Luis glasses", category: "Glasses", price: 85, stock: 30 },
  { id: 14, name: "kids T-Shirt", category: "T-Shirts", price: 113, stock: 75 },
  { id: 15, name: "Sandals", category: "Shoes", price: 28, stock: 12 },
  { id: 16, name: "Gucci Bag", category: "Accessories", price: 25, stock: 13 },
  { id: 17, name: "Sport Shoes", category: "Shoes", price: 92, stock: 18 },
  { id: 18, name: "Nasa T-Shirt", category: "T-Shirts", price: 35, stock: 27 },
  { id: 19, name: "American Pants", category: "Pants", price: 13, stock: 43 }
];

const seedCustomers = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  firstName: "ADMI",
  lastName: "ZAKARYAE",
  position: "Software Engineer",
  mobile: "+212 6 51 88 61 51"
}));

const seedOrders = [
  { id: 1, customerId: 1, items: [{ productId: 1, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 2, customerId: 2, items: [{ productId: 2, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 3, customerId: 3, items: [{ productId: 3, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 4, customerId: 4, items: [{ productId: 4, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 5, customerId: 5, items: [{ productId: 5, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 6, customerId: 6, items: [{ productId: 6, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 7, customerId: 7, items: [{ productId: 20, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 8, customerId: 8, items: [{ productId: 7, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 9, customerId: 9, items: [{ productId: 8, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 10, customerId: 10, items: [{ productId: 9, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 11, customerId: 11, items: [{ productId: 10, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 12, customerId: 12, items: [{ productId: 11, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 13, customerId: 13, items: [{ productId: 12, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 14, customerId: 14, items: [{ productId: 1, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 15, customerId: 15, items: [{ productId: 12, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 16, customerId: 16, items: [{ productId: 4, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 17, customerId: 17, items: [{ productId: 6, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 18, customerId: 18, items: [{ productId: 20, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] },
  { id: 19, customerId: 19, items: [{ productId: 8, quantity: 5 }, { productId: 2, quantity: 5 }, { productId: 3, quantity: 5 }] }
];

module.exports = { seedProducts, seedCustomers, seedOrders };
