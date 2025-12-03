import React, { useState, useEffect } from "react";

interface Props {
  images: Record<string, string[]> | string[];  // Accepts BOTH formats
  autoPlay?: boolean;
  delay?: number;
}

export default function ImageGallery({
  images,
  autoPlay = true,
  delay = 4000,
}: Props) {

  /** 🔥 Convert array → firestore format automatically */
  const formattedImages: Record<string,string[]> = Array.isArray(images)
      ? { default: images }
      : images;

  const colorKeys = Object.keys(formattedImages || {});
  const [activeColor, setActiveColor] = useState(colorKeys[0]);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [play, setPlay] = useState(autoPlay);

  const imgs = formattedImages[activeColor] || [];

  /* Auto Slide */
  useEffect(() => {
    if (!play || imgs.length <= 1) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % imgs.length), delay);
    return () => clearInterval(timer);
  }, [play, imgs.length, delay]);

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* Main Image */}
      <div className="relative w-full h-96 bg-white shadow rounded-xl flex items-center justify-center border">
        {imgs.length ? (
          <>
            <img
              src={imgs[index]}
              onClick={() => setZoom(true)}
              className="max-h-96 w-full object-contain cursor-zoom-in"
            />

            {/* Nav Arrows */}
            {imgs.length > 1 && <>
              <button onClick={() => setIndex(i => (i - 1 + imgs.length) % imgs.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow">◀</button>
              <button onClick={() => setIndex(i => (i + 1) % imgs.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow">▶</button>
            </>}

            {/* Play/Pause */}
            <button className="absolute bottom-3 right-3 bg-white/80 px-3 py-1 rounded-full shadow"
              onClick={() => setPlay(!play)}>
              {play ? "⏸" : "▶"}
            </button>
          </>
        ) : <p className="text-gray-400">No Images Available</p>}
      </div>

      {/* Variants (only if more than 1 set exists) */}
      {colorKeys.length > 1 && (
        <div className="flex gap-2 my-3">
          {colorKeys.map(c => (
            <button key={c} onClick={() => { setActiveColor(c); setIndex(0); }}
              className={`px-3 py-1 border rounded ${activeColor === c ? "bg-black text-white" : "bg-white"}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {imgs.map((url, i) => (
            <img key={i} src={url} onClick={() => setIndex(i)}
              className={`w-20 h-20 rounded border cursor-pointer ${i===index?"ring-2 ring-blue-500 scale-110":"opacity-90"}`}
            />
          ))}
        </div>
      )}

      {/* Zoom Popup */}
      {zoom && (
        <div onClick={() => setZoom(false)}
             className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
          <img src={imgs[index]} className="max-h-[90vh] rounded-xl shadow-xl" />
        </div>
      )}
    </div>
  );
}