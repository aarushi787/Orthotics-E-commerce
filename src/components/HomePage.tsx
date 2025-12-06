import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface HomePageProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Get featured products (first 6 with discount)
    const featured = products
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .slice(0, 6);
    setFeaturedProducts(featured);

    // Get top rated products
    const topRated = products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    setTopRatedProducts(topRated);

    // Get unique categories
    const cats = [
      ...new Set(products.map((p) => p.category)),
    ].map((cat) => ({
      name: cat,
      count: products.filter((p) => p.category === cat).length,
      icon: '🏥',
    }));
    setCategories(cats.slice(0, 6));
  }, [products]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');

  const resolveImg = (u?: string) => {
    if (!u) return '/images/no-image.png';
    if (/^(https?:)?\/\//.test(u) || u.startsWith('/')) return u;
    return `/${u}`;
  };

  const ProductPreview = ({ product }: { product: Product }) => {
    const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    const isWishlisted = wishlist.includes(product.id);

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-3 flex flex-col h-full">
        <div className="relative mb-2 flex items-center justify-center bg-gray-50 rounded overflow-hidden" style={{minHeight:160}}>
          <a href={`#/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
            <img
              src={resolveImg(product.imageUrls?.[0])}
              alt={product.name}
              className="max-h-[140px] mx-auto object-contain"
              onError={(e)=>{
                const img = e.currentTarget as HTMLImageElement;
                if (img.dataset.attempt === '1') { img.src = '/images/no-image.png'; return; }
                const s = (product.sku || '').toString().toUpperCase();
                if (s) { img.dataset.attempt = '1'; img.src = `/images/${s}/${s}-1.jpg`; return; }
                img.src = '/images/no-image.png';
              }}
            />
          </a>
          {discount > 5 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              {discount}% OFF
            </span>
          )}
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-red-50"
          >
            <span className="text-lg">{isWishlisted ? '❤️' : '🤍'}</span>
          </button>
        </div>
        <a href={`#/product/${product.id}`} className="font-semibold text-sm hover:text-blue-600 line-clamp-2">
          {product.name}
        </a>
        <div className="flex items-center gap-1 my-1">
          <span className="text-xs bg-amber-300 text-white px-1.5 py-0.5 rounded">⭐ {product.rating || 0}</span>
          <span className="text-xs text-gray-500">{product.moq} MOQ</span>
        </div>
        <div className="flex items-center gap-2 mt-auto mb-2">
          <span className="text-lg font-bold text-blue-700">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through text-gray-400">₹{product.originalPrice}</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product, 50)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold shadow-sm hover:shadow-md transition"
        >
          Add to Cart
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* ============ HERO BANNER ============ */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Premium Orthopedic Solutions</h1>
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                Quality orthopedic products for better health and comfort. Shop our exclusive collection of medical-grade supports and braces.
              </p>
              <div className="flex gap-4">
                <a
                  href="#/products"
                  className="bg-yellow-400 text-blue-800 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  Shop Now
                </a>
                <a
                  href="#/dealer"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition"
                >
                  Bulk Orders
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://via.placeholder.com/400x300?text=Premium+Orthotics"
                alt="Hero"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============ CATEGORIES GRID ============ */}
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`#/category/${slugify(cat.name)}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-sm md:text-base line-clamp-2">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.count} products</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ============ FEATURED DEALS ============ */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">🔥 Featured Deals</h2>
            <a href="#/products" className="text-blue-600 hover:text-blue-800 font-semibold">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductPreview product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ PROMOTIONAL BANNER ============ */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Limited Time Offer</h2>
          <p className="text-lg mb-6">Get up to 50% OFF on selected orthopedic products this month!</p>
          <a
            href="#/"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Explore Offers
          </a>
        </div>
      </div>

      {/* ============ TOP RATED PRODUCTS ============ */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">⭐ Top Rated Products</h2>
            <a href="#/products" className="text-blue-600 hover:text-blue-800 font-semibold">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topRatedProducts.map((product) => (
              <div key={product.id}>
                <ProductPreview product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold mb-2">100% Genuine</h3>
              <p className="text-sm text-gray-600">Authentic medical-grade products</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Pan-India shipping available</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Safe and encrypted transactions</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive rates guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TESTIMONIALS ============ */}
      <div className="bg-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                role: 'Verified Buyer',
                text: 'Excellent quality products and fast delivery. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Rajesh Kumar',
                role: 'Medical Professional',
                text: 'Great range of orthopedic solutions. Perfect for my clinic.',
                rating: 5,
              },
              {
                name: 'Anita Patel',
                role: 'Verified Buyer',
                text: 'Best prices compared to other retailers. Will order again!',
                rating: 4.5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400">
                      {j < Math.floor(testimonial.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CTA SECTION ============ */}
      <div className="bg-blue-600 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of Satisfied Customers</h2>
          <p className="text-lg mb-8 text-blue-100">Start shopping for premium orthopedic solutions today</p>
          <a
            href="#/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
