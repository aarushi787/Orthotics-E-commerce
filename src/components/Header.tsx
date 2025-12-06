import React, { useState, useEffect } from 'react';
import {
    AIIcon,
    PhoneIcon,
    MailIcon,
    LocationMarkerIcon,
    SearchIcon,
    UserIcon,
    ShoppingCartIcon,
    HeartIcon
} from './icons';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import SearchSuggestions from './SearchSuggestions';
import logo from '../assets/logo.png'; // <-- Your logo
import { openBusinessWhatsApp } from '../utils/whatsapp';

interface HeaderProps {
    products: Product[];
    wishlistCount: number;
    cartCount: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const slugify = (text: string) =>
    text.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');

const Header: React.FC<HeaderProps> = ({
    products,
    wishlistCount,
    cartCount,
    searchQuery,
    setSearchQuery
}) => {

    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const q = searchQuery.toLowerCase();
            const filtered = products
                .filter(
                    (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.sku.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q)
                )
                .slice(0, 8);

            setSuggestions(filtered);
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [searchQuery, products]);

    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            {/* ---------- TOP BAR ---------- */}
            <div className="bg-gray-100 text-gray-600 text-xs py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-brand-blue">
                            <PhoneIcon className="w-4 h-4" />
                            <span>+91 98765 43210</span>
                        </a>

                        <a href="mailto:sales@foxorthotics.com" className="flex items-center gap-1 hover:text-brand-blue">
                            <MailIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">sales@foxorthotics.com</span>
                        </a>

                        <div className="hidden md:flex items-center gap-1">
                            <LocationMarkerIcon className="w-4 h-4" />
                            <span>New Delhi, India</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                            GST REGISTERED
                        </div>
                        <button 
                            onClick={() => openBusinessWhatsApp("Hi! I'd like to inquire about your products.")}
                            className="hidden sm:flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold"
                            title="Chat on WhatsApp"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.567.897-2.766 2.217-3.632 3.997-1.03 2.185-.96 4.607.214 6.552 1.05 1.786 3.065 3.265 5.456 3.904 1.504.425 3.056.427 4.527.126 1.075-.23 2.041-.616 2.87-1.141v-.001c.54-.343 1.027-.744 1.456-1.194.488-.528.871-1.087 1.165-1.691 1.122-2.329 1.15-5.142.158-7.509-.99-2.371-3.04-4.093-5.448-4.714-.88-.247-1.8-.353-2.695-.258zm.668 9.016c-.285-.424-.893-.58-1.438-.388-.545.192-1.056.782-1.242 1.587-.186.804.052 1.653.597 2.052.545.399 1.409.296 1.694-.128.285-.424.186-1.327 0-1.652-.186-.325-.546-.519-.611-.471z"/>
                            </svg>
                            <span>WhatsApp</span>
                        </button>
                        <a href="#/dealer" className="hover:text-brand-blue font-medium">
                            Become a Dealer
                        </a>
                    </div>
                </div>
            </div>

            {/* ---------- MAIN HEADER ---------- */}
            <div className="bg-brand-blue">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">

                    {/* ---------- LOGO + BRAND NAME ---------- */}
                    <a href="#/" className="flex items-center gap-3">
                        <div className="bg-brand-blue-dark p-2 rounded-full">
                            <img
                                src={logo}
                                alt="Fox Orthotics Logo"
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white">Fox Orthotics</h1>
                            <p className="text-xs md:text-sm text-gray-300">Premium Orthopedic Solutions</p>
                        </div>
                    </a>

                    {/* ---------- SEARCH BAR + AI BUTTON ---------- */}
                    <div className="flex-1 max-w-2xl mx-4 flex items-center gap-2 relative">

                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search products, categories, SKU..."
                                className="w-full py-2.5 pl-4 pr-12 rounded-md border-gray-300 focus:ring-yellow-400 focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length > 1 && setIsVisible(true)}
                                onBlur={() => setTimeout(() => setIsVisible(false), 200)}
                            />

                            <button 
                                className="absolute right-0 inset-y-0 bg-brand-blue-dark px-3 rounded-r-md text-white"
                                title="Search products"
                                aria-label="Search"
                            >
                                <SearchIcon className="w-5 h-5" />
                            </button>

                            {isVisible && suggestions.length > 0 && (
                                <SearchSuggestions
                                    suggestions={suggestions}
                                    onSuggestionClick={(p) => {
                                        setSearchQuery(p.name);
                                        setIsVisible(false);
                                        window.location.hash = `#/product/${p.id}`;
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* ---------- ACCOUNT / WISHLIST / CART ---------- */}
                    <div className="flex items-center gap-4 text-white">

                        <a href="#/login" className="hover:text-gray-300 flex items-center flex-col">
                            <UserIcon className="w-6 h-6" />
                            <span className="text-xs hidden sm:inline">Account</span>
                        </a>

                        <a href="#/wishlist" className="relative hover:text-gray-300 flex items-center flex-col">
                            <HeartIcon className="w-6 h-6" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                            <span className="text-xs hidden sm:inline">Wishlist</span>
                        </a>

                        <a href="#/cart" className="relative hover:text-gray-300 flex items-center flex-col">
                            <ShoppingCartIcon className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                            <span className="text-xs hidden sm:inline">Cart</span>
                        </a>

                    </div>
                </div>
            </div>

            {/* ---------- NAVIGATION BAR ---------- */}
            <nav className="border-b bg-white hidden md:block">
                <div className="container mx-auto px-4 flex items-center gap-1">
                    <a href="#/" className="px-4 py-3 font-semibold hover:bg-gray-100">Home</a>
                    <a href="#/products" className="px-4 py-3 font-semibold bg-purple-100 text-purple-700">All Products</a>

                    {CATEGORIES.slice(0, 5).map((cat) => (
                        <a
                            key={cat.name}
                            href={`#/category/${slugify(cat.name)}`}
                            className="px-4 py-3 hover:bg-gray-100 text-gray-700 font-medium"
                        >
                            {cat.name}
                        </a>
                    ))}

                    <a href="#/dealer" className="ml-auto text-red-600 font-bold px-4 py-3 hover:bg-red-50">
                        Bulk Orders
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Header;