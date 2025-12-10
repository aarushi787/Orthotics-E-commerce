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
        <a href={`#/product/${product.id}`} className="font-semibold text-sm hover:text-brand-blue line-clamp-2">
          {product.name}
        </a>
        <div className="flex items-center gap-1 my-1">
          <span className="text-xs bg-amber-300 text-white px-1.5 py-0.5 rounded">⭐ {product.rating || 0}</span>
          <span className="text-xs text-gray-500">{product.moq} MOQ</span>
        </div>
        <div className="flex items-center gap-2 mt-auto mb-2">
          <span className="text-lg font-bold text-brand-blue">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through text-gray-400">₹{product.originalPrice}</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product, 50)}
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white py-2 rounded text-sm font-semibold shadow-sm hover:shadow-md transition"
        >
          Add to Cart
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* ============ HERO SLIDER WITH POSTERS ============ */}
      <div className="relative bg-gradient-to-r from-brand-blue to-brand-accent text-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Premium Orthopedic Solutions</h1>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                Quality orthopedic products for better health and comfort. Shop our exclusive collection of medical-grade supports and braces.
              </p>
              <div className="flex gap-4">
                <a
                  href="#/products"
                  className="bg-brand-accent text-brand-blue-dark px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-brand-light-cyan transform hover:-translate-y-0.5 transition-all"
                >
                  Shop Now
                </a>
                <a
                  href="#/dealer"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-brand-blue transition"
                >
                  Bulk Orders
                </a>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/e-commerce-61d74.appspot.com/o/images%2FSlider-poster.jpg?alt=media"
                alt="Premium Orthotics"
                className="w-full rounded-lg shadow-xl object-cover max-h-[300px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============ CATEGORIES GRID ============ */}
      <div className="bg-brand-light-cyan py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brand-blue-dark">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`#/category/${slugify(cat.name)}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg hover:scale-105 transition-all hover:border-2 hover:border-brand-blue"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-sm md:text-base line-clamp-2">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.count} products</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ============ COMBO DEAL POSTER ============ */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/e-commerce-61d74.appspot.com/o/images%2FCombo.jpg?alt=media"
              alt="Combo Deals"
              className="w-full h-auto object-cover max-h-96"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <a
                href="#/products"
                className="bg-brand-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-blue transition-all shadow-lg"
              >
                Explore Combo Deals
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FEATURED DEALS ============ */}
      <div className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue-dark">🔥 Featured Deals</h2>
            <a href="#/products" className="text-brand-blue hover:text-brand-blue-dark font-semibold">
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

      {/* ============ DEAL POSTER ============ */}
      <div className="py-8 md:py-12 bg-brand-light-cyan">
        <div className="container mx-auto px-4">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/e-commerce-61d74.appspot.com/o/images%2FDeal.jpg?alt=media"
              alt="Special Deals"
              className="w-full h-auto object-cover max-h-96"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <a
                href="#/products"
                className="bg-brand-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-blue transition-all shadow-lg"
              >
                Shop Special Deals
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TOP RATED PRODUCTS ============ */}
      <div className="py-12 md:py-16 bg-brand-light-cyan">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-blue-dark">⭐ Top Rated Products</h2>
            <a href="#/products" className="text-brand-blue hover:text-brand-blue-dark font-semibold">
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
      <div className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-brand-light-cyan p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold mb-2 text-brand-blue-dark">100% Genuine</h3>
              <p className="text-sm text-gray-600">Authentic medical-grade products</p>
            </div>
            <div className="bg-brand-light-cyan p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold mb-2 text-brand-blue-dark">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Pan-India shipping available</p>
            </div>
            <div className="bg-brand-light-cyan p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold mb-2 text-brand-blue-dark">Secure Payment</h3>
              <p className="text-sm text-gray-600">Safe and encrypted transactions</p>
            </div>
            <div className="bg-brand-light-cyan p-6 rounded-lg text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold mb-2 text-brand-blue-dark">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive rates guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TESTIMONIALS ============ */}
      <div className="bg-brand-light-cyan py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-brand-blue-dark">What Our Customers Say</h2>
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
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-brand-blue">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-brand-accent">
                      {j < Math.floor(testimonial.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="font-semibold text-brand-blue-dark">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CTA SECTION ============ */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-accent text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of Satisfied Customers</h2>
          <p className="text-lg mb-8 opacity-90">Start shopping for premium orthopedic solutions today</p>
          <a
            href="#/products"
            className="inline-block bg-white text-brand-blue px-8 py-3 rounded-lg font-bold hover:bg-brand-light-cyan transition"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
