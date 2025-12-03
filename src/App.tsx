// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";

// ⬇️ Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import ProductDetailPage from "./components/ProductDetailPage";
import ProductListingPage from "./components/ProductListingPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import DealerPage from "./components/DealerPage";
import WishlistPage from "./components/WishlistPage";
import CartPage from "./components/CartPage";
import Toast from "./components/Toast";
import PageTransition from "./components/PageTransition";
import SkeletonCard from "./components/SkeletonCard";

// ⬇️ Admin Panel
import AdminApp from "./admin/AdminApp";

// ⬇️ Services & Types
import api from "./services/api";
import type { Product, FiltersState, CartItem } from "./types";
import { INITIAL_FILTERS } from "./constants";

const App: React.FC = () => {
  // 🟦 STATE VARIABLES
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [sortOption, setSortOption] = useState("featured");
  const [currentPath, setCurrentPath] = useState(window.location.hash || "#/");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error" | "warning";
  } | null>(null);

  // 🟥 SAFETY CHECK — products must always be an array
  if (!Array.isArray(products)) {
    console.error("products corrupted, resetting...", products);
    return <div style={{ padding: 40 }}>Loading…</div>;
  }

  // 🟧 FETCH PRODUCTS
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.getProducts();
        const list = Array.isArray(response?.products)
          ? response.products
          : [];
        setProducts(list);
      } catch (err) {
        console.error("Error fetching products:", err);
        try {
          const fallback = await fetch("/products.json");
          const json = await fallback.json();
          setProducts(Array.isArray(json) ? json : []);
        } catch {
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // 🟩 SAVE WISHLIST + CART
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🟦 HASH ROUTER LISTENER
  useEffect(() => {
    const handler = () => setCurrentPath(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // 🟨 TOAST
  const showToast = (
    msg: string,
    type: "success" | "info" | "error" | "warning" = "success"
  ) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ❤️ WISHLIST
  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // 🛒 CART
  const handleAddToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);

      if (exists) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [...prev, { product, quantity: qty }];
    });
    showToast("Added to cart!", "success");
  };

  const handleUpdateCartQuantity = (id: number, qty: number) => {
    if (qty <= 0) return handleRemoveFromCart(id);
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === id ? { ...i, quantity: qty } : i
      )
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  // ⭐ FILTERING LOGIC
  const applyFiltersAndSort = useCallback(() => {
    let temp = [...products];

    const q = searchQuery.toLowerCase();
    if (q.length > 1) {
      temp = temp.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (currentPath.startsWith("#/category/")) {
      const slug = currentPath.split("/")[2];
      // restore category names — handle `-and-` used to replace ` & ` in links
      const restored = slug.replace(/-and-/g, " & ").replace(/-/g, " ");
      const cat = restored.replace(/\b\w/g, (l) => l.toUpperCase());
      temp = temp.filter((p) => p.category === cat);
    }

    if (filters.categories.length) {
      temp = temp.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    temp = temp.filter(
      (p) =>
        p.price >= filters.priceRange[0] &&
        p.price <= filters.priceRange[1]
    );

    switch (sortOption) {
      case "price-asc":
        temp.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        temp.sort((a, b) => b.price - a.price);
        break;
      default:
        temp.sort((a, b) => a.id - b.id);
    }

    setFilteredProducts(temp);
  }, [products, filters, searchQuery, sortOption, currentPath]);

  useEffect(() => applyFiltersAndSort(), [applyFiltersAndSort]);

  // 🧭 HASH ROUTER PAGES
  const renderPage = () => {
    if (currentPath.startsWith("#/admin"))
      return <AdminApp />;

    if (currentPath.startsWith("#/product/")) {
      const id = currentPath.split("/")[2];
      const product = products.find((p) => String(p.id) === String(id));

      return product ? (
        <ProductDetailPage
          product={product}
          allProducts={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <p>Product not found</p>
      );
    }

    if (currentPath === "#/login") return <LoginPage />;
    if (currentPath === "#/about") return <AboutPage />;
    if (currentPath === "#/contact") return <ContactPage />;
    if (currentPath === "#/dealer") return <DealerPage />;

    if (currentPath === "#/wishlist")
      return (
        <WishlistPage
          wishlist={wishlist}
          allProducts={products}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      );

    if (currentPath === "#/cart")
      return (
        <CartPage
          cartItems={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
        />
      );

    return (
      <ProductListingPage
        products={filteredProducts}
        filters={filters}
        searchQuery={searchQuery}
        onFilterChange={setFilters}
        onClearFilters={() => setFilters(INITIAL_FILTERS)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        sortOption={sortOption}
        onSortChange={setSortOption}
        pageTitle="All Products"
      />
    );
  };

  // ⭐ JSX RENDER
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <Header
        products={products}
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((n, i) => n + i.quantity, 0)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <PageTransition>{renderPage()}</PageTransition>
        )}
      </main>

      <Footer />

      <Toast
        message={toast?.message}
        type={toast?.type}
        isVisible={!!toast}
      />
    </div>
  );
};

export default App;