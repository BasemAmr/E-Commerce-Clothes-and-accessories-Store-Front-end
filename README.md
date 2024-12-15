# E-commerce Store Front
A modern, full-stack e-commerce store built with Next.js 15, React, and Tailwind CSS. This application serves as the customer-facing storefront connected to an admin dashboard for a complete e-commerce solution.

## Features
🛍️ Browse and search products
🛒 Shopping cart functionality
💳 Secure checkout process
🏷️ Filter products by category
📱 Fully responsive design
🎨 Beautiful product galleries

## Tech Stack
- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **UI Components:** 
    - headlessui/react
- **State Management:** Zustand
- **Query Handling:** @tanstack/react-query
- **Payment Processing:** Paymob Integration
- **Image Optimization:** Next.js Image Component

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- **Backend Admin Dashboard running**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BasemAmr/e-commerce-store
cd e-commerce-store
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file:
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_PAYMOB_API_KEY=
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the store.

## Project Structure
```
├── app/                # Next.js pages and routes
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├──  actions/           # fetch data from the Backend Admin Dashboard APIs
└── types/            # TypeScript type definitions
```

## Features in Detail

### Shopping Experience
- Responsive product grid
- Product filtering and search
- Size and color selection
- Add to cart functionality
- Real-time cart updates

### Checkout Process
- Secure payment integration
- Order summary
- Shipping information
- Order confirmation

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License

## Support
For support, email [basemsleem652@gmail.com] or open an issue in the repository.

## Related Projects
- [E-commerce Admin Dashboard](https://github.com/BasemAmr/CMS---E-Commerce-Admin-Dashboard) - The backend admin dashboard for this store

## Acknowledgments
- Thanks to [Code With Antonio](https://www.youtube.com/watch?v=5miHyP6lExg) for the project guidance! ❤
- Vercel for hosting
