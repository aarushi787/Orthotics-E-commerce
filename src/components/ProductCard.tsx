import React from "react";
import { Product } from "../types";
import { StarIcon, HeartIcon, ShoppingCartIcon } from "./icons";
import { shareProductViaWhatsApp } from "../utils/whatsapp";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  const {
    id,
    name,
    price,
    originalPrice,
    rating,
    moq,
    imageUrls,
    images,
    inStock,
    category,
    sku,
  } = product;

  // ---------- PRICE SAFETY ----------
  const p = Number(price) || 0;
  const mrp = Number(originalPrice) || p;
  const discount = mrp > 0 ? Math.round(((mrp - p) / mrp) * 100) : 0;

  // ---------- UNIVERSAL IMAGE PICKER ----------
  // priority: imageUrls[] → images.default[] → images[color][] → fallback
  const extractedImages: string[] =
    (images && typeof images === "object" ? Object.values(images).flat() : []) || [];

  const rawMainImage =
    (Array.isArray(imageUrls) && imageUrls.length ? imageUrls[0] : null) ||
    extractedImages[0] ||
    "/images/no-image.png";

  // Ensure path is absolute so it resolves correctly from root
  const mainImage = rawMainImage && rawMainImage.startsWith("/") ? rawMainImage : `/${rawMainImage}`;

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    // prevent infinite loop — try one SKU-based fallback then final placeholder
    if (img.dataset.attempt === "1") {
      img.src = "/images/no-image.png";
      return;
    }

    // try SKU-based folder convention e.g. /images/MDL-101/MDL-101-1.jpg
    const s = (sku || product.sku || "").toString().toUpperCase();
    if (s) {
      img.dataset.attempt = "1";
      img.src = `/images/${s}/${s}-1.jpg`;
      return;
    }

    img.src = "/images/no-image.png";
  };

  // ----------------------------------------------
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group border overflow-hidden">
      {/* PRODUCT IMAGE */}
      <div className="relative">
        <a href={`#/product/${id}`}>
          <img
            src={mainImage}
            alt={name}
            className="w-full h-52 object-contain p-3 bg-white transition-transform duration-300 group-hover:scale-105"
            onError={handleImgError}
            loading="lazy"
          />
        </a>

        {/* Wishlist */}
        <button
          onClick={() => onToggleWishlist(id)}
          aria-label={`Toggle wishlist for ${name}`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-500"
        >
          <HeartIcon filled={isWishlisted} className="w-5 h-5" />
        </button>

        {/* Discount Badge */}
        {discount > 5 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs rounded-md font-semibold">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4 flex flex-col flex-grow">
        <a
          href={`#/category/${category
            ?.toLowerCase()
            .replace(/ & /g, "-and-")
            .replace(/\s+/g, "-")}`}
          className="text-xs text-gray-500"
        >
          {category}
        </a>

        <a
          href={`#/product/${id}`}
          className="font-bold text-gray-800 mt-1 hover:text-brand-teal-500"
        >
          {name}
        </a>

        {/* Rating + MOQ */}
        <div className="flex justify-between mt-3">
          <div className="flex items-center gap-1 bg-amber-300 text-white px-2 py-0.5 rounded">
            <StarIcon className="w-4 h-4" />
            {rating}
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            MOQ: {moq}
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-4">
          <p className="text-lg font-bold text-brand-teal-500">₹{p}</p>
          {discount > 5 && (
            <p className="text-xs text-gray-400 line-through">₹{mrp}</p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-auto flex gap-2 pt-4 border-t">
          <a
            href={`#/product/${id}`}
            className="flex-1 text-center border rounded-lg py-2 hover:bg-gray-100"
          >
            Details
          </a>

          <button
            title="Share on WhatsApp"
            onClick={() => shareProductViaWhatsApp(name, `${window.location.origin}#/product/${id}`, p)}
            className="px-2 py-2 rounded-lg hover:opacity-80 hidden sm:block transition-opacity"
          >
            <img 
              src="/logos/whatsapp-official.png" 
              alt="Share on WhatsApp" 
              className="w-5 h-5"
            />
          </button>

          <button
            disabled={!inStock}
            onClick={() => onAddToCart(product, 50)}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-brand-teal-500 text-white py-2 hover:bg-brand-teal-600 disabled:bg-gray-300 transition"
            title={inStock ? "Add to cart" : "Out of stock"}
          >
            <ShoppingCartIcon className="w-5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;