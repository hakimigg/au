// Utility functions for Product Plaza

// Generate unique mock ID
export function generateMockId() {
  return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createPageUrl(page) {
  // Since Router has basename="/testt", we don't need to add it here
  // Simple page URL creator - in a real app this might be more complex
  const url = page === "Home" ? "/" : `/${page}`;
  console.log('createPageUrl:', page, '->', url);
  return url;
}

// Mock data for development
export const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    company: "nokia",
    price: 199.99,
    stock: 50,
    tags: ["electronics", "audio", "wireless"],
    specs: [
      { spec: "Battery Life", value: "30 hours" },
      { spec: "Connectivity", value: "Bluetooth 5.0" },
      { spec: "Weight", value: "250g" }
    ]
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health monitoring",
    company: "samsung",
    price: 299.99,
    stock: 25,
    tags: ["electronics", "wearable", "health"],
    specs: [
      { spec: "Display", value: "1.4 inch OLED" },
      { spec: "Battery", value: "7 days" },
      { spec: "Water Resistance", value: "IP68" }
    ]
  },
  {
    id: "3",
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX graphics",
    company: "apple",
    price: 1299.99,
    stock: 10,
    tags: ["electronics", "gaming", "laptop"],
    specs: [
      { spec: "Processor", value: "Intel i7-12700H" },
      { spec: "Graphics", value: "RTX 3070" },
      { spec: "RAM", value: "16GB DDR4" }
    ]
  },
  {
    id: "4",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse for productivity",
    company: "nokia",
    price: 49.99,
    stock: 100,
    tags: ["electronics", "accessories", "wireless"],
    specs: [
      { spec: "DPI", value: "1600" },
      { spec: "Battery", value: "6 months" },
      { spec: "Connectivity", value: "USB-A receiver" }
    ]
  },
  {
    id: "5",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with premium sound",
    company: "premium",
    price: 79.99,
    stock: 75,
    tags: ["electronics", "audio", "portable"],
    specs: [
      { spec: "Battery Life", value: "12 hours" },
      { spec: "Water Rating", value: "IPX7" },
      { spec: "Output", value: "20W" }
    ]
  },
  {
    id: "6",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard for gaming and typing",
    company: "samsung",
    price: 129.99,
    stock: 40,
    tags: ["electronics", "gaming", "keyboard"],
    specs: [
      { spec: "Switch Type", value: "Cherry MX Blue" },
      { spec: "Backlight", value: "RGB" },
      { spec: "Layout", value: "Full Size" }
    ]
  }
];

export const mockUsers = [
  {
    id: "user1",
    email: "demo@example.com",
    name: "Demo User"
  }
];

export const mockWishlist = [
  { id: "w1", user_email: "demo@example.com", product_id: "1" },
  { id: "w2", user_email: "demo@example.com", product_id: "3" }
];
