// ============================================
// PRINCE — Product Data
// ============================================
// Управление размерами:
// sizes — массив объектов { name: "S", available: true/false }
// available: true  — размер в наличии
// available: false — размера нет в наличии
//
// Наличие товара определяется автоматически:
// если все размеры available: false — товара нет в наличии

const products = [
  {
    id: 1,
    name: "Вещь #1",
    price: "25 000 ₸",
    description:
      "Элегантная рубашка из премиального хлопка. Идеально подходит для деловых встреч и повседневной носки. Мягкая ткань обеспечивает комфорт в течение всего дня.",
    sizes: [
      { name: "XS", available: true },
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: false },
      { name: "XL", available: true },
      { name: "XXL", available: false },
    ],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736e10?w=800&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    ],
    whatsappMessage: "Здравствуйте! Меня интересует товар Вещь #1.",
  },
  {
    id: 2,
    name: "Вещь #2",
    price: "32 000 ₸",
    description:
      "Стильный пиджак из итальянской шерсти. Безупречный крой и премиальные материалы для уверенного образа.",
    sizes: [
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: false },
      { name: "XXL", available: false },
    ],
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80",
    ],
    whatsappMessage: "Здравствуйте! Меня интересует товар Вещь #2.",
  },
  {
    id: 3,
    name: "Вещь #3",
    price: "18 000 ₸",
    description:
      "Классические брюки прямого кроя из плотного хлопка. Универсальный выбор для любого гардероба.",
    sizes: [
      { name: "XS", available: false },
      { name: "S", available: false },
      { name: "M", available: false },
      { name: "L", available: false },
      { name: "XL", available: false },
    ],
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    whatsappMessage: "Здравствуйте! Меня интересует товар Вещь #3.",
  },
  {
    id: 4,
    name: "Вещь #4",
    price: "15 000 ₸",
    description:
      "Лёгкая льняная рубашка с коротким рукавом. Идеальный выбор для летнего сезона.",
    sizes: [
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: true },
      { name: "XXL", available: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    ],
    whatsappMessage: "Здравствуйте! Меня интересует товар Вещь #4.",
  },
];
