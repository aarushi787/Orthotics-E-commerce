import React, { useState, useRef, useEffect } from "react";
import { Product } from "../types";
import ProductCard from "./ProductCard";
import ImageGallery from "./ImageGallery";            // Our upgraded component
import CompareBar from "./CompareBar";                // New
import ReviewSystem from "./ReviewSystem";            // New
import VideoGallery from "./VideoGallery";            // New
import {
  StarIcon, HeartIcon, ShoppingCartIcon,
  ShieldCheckIcon, CheckIcon, TruckIcon
} from "./icons";


interface Props {
  product: Product;
  allProducts: Product[];
  wishlist: number[];
  onToggleWishlist: (id:number)=>void;
  onAddToCart: (product: Product, qty:number)=>void;
}


const ProductDetailPage = ({ product, allProducts, wishlist, onToggleWishlist, onAddToCart }: Props) => {

  /** 🔥 Get all product images: Firebase → Local → Placeholder */
  const baseImages =
    product.images?.length > 0 ? product.images :
    product.imageUrls?.length > 0 ? product.imageUrls :
    [];

  /** Convert to Firestore style if array */
  const galleryImages = Array.isArray(baseImages) ? { default: baseImages } : baseImages;

  const video = (product as any).videoUrl || null;


  // ========================= STATE =========================
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [quantity,setQuantity] = useState(1);
  const isWishlisted = wishlist.includes(product.id);


  // ========================= SWIPE SUPPORT =========================
  const [touchStart,setTouchStart] = useState<number|null>(null);

  const swipeStart=(e:any)=>setTouchStart(e.touches[0].clientX);
  const swipeEnd=(e:any)=>{
    if(touchStart===null||baseImages.length<=1)return;
    const end=e.changedTouches[0].clientX;
    const diff=end-touchStart;
    const i=baseImages.indexOf(selectedImage);
    if(diff>50) setSelectedImage(baseImages[(i-1+baseImages.length)%baseImages.length]);
    if(diff<-50)setSelectedImage(baseImages[(i+1)%baseImages.length]);
    setTouchStart(null);
  };


  // ========================= AUTO-SLIDER =========================
  const [selectedImage,setSelectedImage]=useState(baseImages[0]);
  useEffect(()=>{
    const timer=setInterval(()=>{
      const i=baseImages.indexOf(selectedImage);
      setSelectedImage(baseImages[(i+1)%baseImages.length]);
    },3500);
    return()=>clearInterval(timer);
  },[selectedImage,baseImages]);


  // ========================= ZOOM MAGNIFIER =========================
  const containerRef=useRef<HTMLDivElement|null>(null);
  const[zoom,setZoom]=useState({x:0,y:0,show:false});

  const zoomMove=(e:any)=>{
    if(!containerRef.current)return;
    const r=containerRef.current.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    setZoom({x,y,show:true});
  };
  const zoomOff=()=>setZoom(p=>({...p,show:false}));


  // ========================= COMPARE SYSTEM =========================
  const addCompare=()=>{
    const list=JSON.parse(localStorage.getItem("compare")||"[]");
    if(!list.includes(product.id)) list.push(product.id);
    localStorage.setItem("compare",JSON.stringify(list));
    alert("Added to Compare 🧾");
  };


  // ========================= RELATED PRODUCTS =========================
  const related = allProducts.filter(p=>p.category===product.category && p.id!==product.id).slice(0,3);


  const savePct=Math.round(((product.originalPrice-product.price)/product.originalPrice)*100);



  return(
  <div className="bg-slate-50 pb-20">

    {/* Breadcrumb */}
    <div className="mb-4 text-sm text-gray-600">
      <a href="#/">Home</a> / <a href={`#/category/${product.category}`}>{product.category}</a> /
      <b className="text-gray-900"> {product.name}</b>
    </div>

    <div className="bg-white p-8 rounded shadow border">

      <div className="grid lg:grid-cols-2 gap-10">


        {/* ================= LEFT PANEL - IMAGES ================ */}
        <div ref={containerRef}
             onMouseMove={zoomMove}
             onMouseLeave={zoomOff}
             onTouchStart={swipeStart}
             onTouchEnd={swipeEnd}
             className="relative">

          {/* Main Component */}
          <ImageGallery images={galleryImages} autoPlay delay={3500} />

          {/* Zoom Circle */}
          {zoom.show && (
            <div className="absolute w-40 h-40 border-2 rounded-full pointer-events-none"
              style={{
                left:`${zoom.x}%`, top:`${zoom.y}%`,transform:"translate(-50%,-50%)",
                background:`url(${selectedImage})`,
                backgroundSize:"200%",backgroundPosition:`${zoom.x}% ${zoom.y}%`
              }}
            />
          )}

          {video && <VideoGallery videoUrl={video} />}
        </div>



        {/* ================= RIGHT PANEL ================= */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex gap-4 my-3">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 flex gap-2 items-center">
              <StarIcon className="w-5"/> {product.rating}
            </span>

            <span className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${product.inStock?'bg-green-100 text-green-700':'bg-red-200 text-red-700'}`}>
              {product.inStock?"In Stock":"Out of Stock"}
            </span>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="bg-slate-50 p-4 rounded-lg border mb-6">
            <p className="text-lg text-gray-600">
              M.R.P: <span className="line-through">₹{product.originalPrice}</span>
              <span className="ml-3 px-2 py-1 text-sm font-bold bg-red-200 text-red-700 rounded">
                SAVE {savePct}%
              </span>
            </p>
            <p className="text-4xl font-extrabold">₹{product.price}</p>
            <p className="text-gray-500 text-sm">(Inclusive of all taxes)</p>
          </div>


          {/* Sizes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Size</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(s=>(
                <button key={s} onClick={()=>setSelectedSize(s)}
                  className={`px-4 py-2 rounded-full border
                  ${selectedSize===s?"bg-blue-600 text-white border-blue-600":"hover:bg-gray-100"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>


          <div className="flex gap-3 mb-6 items-center">

            <input type="number" min={1} value={quantity}
              onChange={e=>setQuantity(Math.max(1,Number(e.target.value)))}
              className="w-20 p-2 border rounded text-center"/>

            <button onClick={()=>onAddToCart(product,quantity)}
              className="flex-1 flex justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
              <ShoppingCartIcon className="w-5"/> Add to Cart
            </button>

            <button onClick={()=>onToggleWishlist(product.id)}
              className="p-3 rounded-lg border hover:bg-red-100">
              <HeartIcon className="w-6 h-6" filled={isWishlisted}/>
            </button>

            <button onClick={addCompare}
              className="px-3 py-3 border rounded-lg hover:bg-blue-50 flex items-center gap-1">
              🔍 Compare
            </button>
          </div>
        </div>

      </div>
    </div>



    {/* Sticky Compare Bar */}
    <CompareBar products={allProducts}/>



    {/* ================= PRODUCT DETAILS SECTION ================= */}
    <div className="grid md:grid-cols-3 gap-10 mt-14">

      <div className="md:col-span-2 bg-white p-8 border rounded shadow">

        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <dl className="grid grid-cols-2 text-sm gap-y-2">
          <dt>SKU</dt> <dd>{product.sku}</dd>
          <dt>Material</dt><dd>{product.material}</dd>
          <dt>Sizes</dt><dd>{product.sizes.join(", ")}</dd>
          <dt>MOQ</dt><dd>{product.moq} pcs</dd>
          <dt>Certifications</dt>
          <dd>{product.certifications.join(", ")}</dd>
        </dl>

        <div className="mt-6">
          <h3 className="font-semibold text-lg">Key Features</h3>
          <ul className="list-disc ml-5 mt-2">
            {product.features.map((f,i)=>(
              <li key={i} className="py-1">{f}</li>
            ))}
          </ul>
        </div>

        {/* ⭐⭐ Reviews System */}
        <ReviewSystem productId={product.id}/>
      </div>


      <div className="bg-white p-6 border rounded shadow space-y-4">
        <div className="flex gap-3 items-center">
          <TruckIcon className="w-7 text-blue-600"/>
          <p>🚚 Fast Pan-India Delivery</p>
        </div>
        <div className="flex gap-3 items-center">
          <ShieldCheckIcon className="w-7 text-blue-600"/>
          <p>🛡 100% Genuine Products</p>
        </div>
      </div>
    </div>



    {/* Related */}
    {related.length>0 &&(
      <div className="mt-14">
        <h2 className="text-2xl font-bold text-center mb-6">You May Also Like</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map(p=>(
            <ProductCard key={p.id} product={p}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}/>
          ))}
        </div>
      </div>
    )}

  </div>
  );
};

export default ProductDetailPage;