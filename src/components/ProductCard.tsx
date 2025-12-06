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
          className="font-bold text-gray-800 mt-1 hover:text-brand-blue"
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
          <p className="text-lg font-bold text-brand-blue">₹{p}</p>
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
            className="px-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hidden sm:block"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.567.897-2.766 2.217-3.632 3.997-1.03 2.185-.96 4.607.214 6.552 1.05 1.786 3.065 3.265 5.456 3.904 1.504.425 3.056.427 4.527.126 1.075-.23 2.041-.616 2.87-1.141v-.001c.54-.343 1.027-.744 1.456-1.194.488-.528.871-1.087 1.165-1.691 1.122-2.329 1.15-5.142.158-7.509-.99-2.371-3.04-4.093-5.448-4.714-.88-.247-1.8-.353-2.695-.258zm.668 9.016c-.285-.424-.893-.58-1.438-.388-.545.192-1.056.782-1.242 1.587-.186.804.052 1.653.597 2.052.545.399 1.409.296 1.694-.128.285-.424.186-1.327 0-1.652-.186-.325-.546-.519-.611-.471z"/>
            </svg>
          </button>

          <button
            disabled={!inStock}
            onClick={() => onAddToCart(product, 50)}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-purple-600 text-white py-2 hover:bg-purple-700 disabled:bg-gray-300"
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