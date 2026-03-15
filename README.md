# Green Earth

## 🌴 API Endpoints

## 1. Get 🌴 All Categories

```bash
https://openapi.programming-hero.com/api/categories
```

**Response:**

```json
{
  "status": true,
  "message": "successfully fetched categories data",
  "categories": [
    {
      "id": 1,
      "category_name": "Fruit Tree",
      "small_description": "Trees that bear edible fruits like mango, guava, and jackfruit."
    },
    {
      "id": 2,
      "category_name": "Flowering Tree",
      "small_description": "Trees grown for their beautiful and fragrant flowers."
    }
  ]
}
```

---

## 2. Get 🌴 All Plants

```bash
https://openapi.programming-hero.com/api/plants
```

**Response:**

```json
{
  "status": true,
  "message": "successfully fetched plants data",
  "plants": [
    {
      "id": 1,
      "image": "https://i.ibb.co.com/cSQdg7tf/mango-min.jpg",
      "name": "Mango Tree",
      "description": "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green canopy offers shade, while its sweet fruits are rich in vitamins and minerals.",
      "category": "Fruit Tree",
      "price": 500
    },
    {
      "id": 2,
      "image": "https://i.ibb.co.com/WNbbx3rn/guava-min.jpg",
      "name": "Guava Tree",
      "description": "A hardy fruit tree that grows in various climates, yielding guavas packed with Vitamin C. Its low maintenance nature makes it a favorite for home gardens.",
      "category": "Fruit Tree",
      "price": 350
    },
    {
      "id": 3,
      "image": "https://i.ibb.co.com/xt98PwZq/jackfruit-min.jpg",
      "name": "Jackfruit Tree",
      "description": "A large tropical tree that bears the world's biggest fruit, the jackfruit. Its sweet and aromatic flesh is both nutritious and filling, and the tree itself provides generous shade.",
      "category": "Fruit Tree",
      "price": 800
    },
    {
      "id": 4,
      "image": "https://i.ibb.co.com/1YzsVWjm/Gulmohar-min.jpg",
      "name": "Gulmohar",
      "description": "Known as the 'Flame of the Forest', this tree bursts into a vibrant display of red flowers every summer. Perfect for beautifying avenues and gardens.",
      "category": "Flowering Tree",
      "price": 400
    },
    {
      "id": 5,
      "image": "https://i.ibb.co.com/qY8qS7YN/champa-min.jpg",
      "name": "Champa",
      "description": "A fragrant flowering tree that adorns gardens with its delicate white blossoms. Widely cherished in traditional rituals and perfumery.",
      "category": "Flowering Tree",
      "price": 300
    }
  ]
}
```

---

## 3. Get 🌴 Plants by Category

```bash
https://openapi.programming-hero.com/api/category/${id}
```

Example:

```bash
https://openapi.programming-hero.com/api/category/1
```

**Response:**

```json
{
  "status": true,
  "message": "successfully fetched plants data filtered by category",
  "plants": [
    {
      "id": 1,
      "image": "https://i.ibb.co.com/cSQdg7tf/mango-min.jpg",
      "name": "Mango Tree",
      "description": "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green canopy offers shade, while its sweet fruits are rich in vitamins and minerals.",
      "category": "Fruit Tree",
      "price": 500
    },
    {
      "id": 2,
      "image": "https://i.ibb.co.com/WNbbx3rn/guava-min.jpg",
      "name": "Guava Tree",
      "description": "A hardy fruit tree that grows in various climates, yielding guavas packed with Vitamin C. Its low maintenance nature makes it a favorite for home gardens.",
      "category": "Fruit Tree",
      "price": 350
    }
  ]
}
```

---

## 4. Get 🌴 Plant Details

```bash
https://openapi.programming-hero.com/api/plant/${id}
```

Example:

```bash
https://openapi.programming-hero.com/api/plant/1
```

**Response:**

```json
{
  "status": true,
  "message": "successfully fetched plant data",
  "plants": {
    "id": 1,
    "image": "https://i.ibb.co.com/cSQdg7tf/mango-min.jpg",
    "name": "Mango Tree",
    "description": "A fast-growing tropical tree that produces delicious, juicy mangoes during summer. Its dense green canopy offers shade, while its sweet fruits are rich in vitamins and minerals.",
    "category": "Fruit Tree",
    "price": 500
  }
}
```
