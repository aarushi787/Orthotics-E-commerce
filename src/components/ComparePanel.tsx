import React, { useState, useEffect } from "react";
import ComparePage from "./ComparePage";

export default function ComparePanel({ allProducts }: any) {
  const [open, setOpen] = useState(false);
  const [list, setList]=useState<number[]>([]);

  useEffect(()=>setList(JSON.parse(localStorage.getItem("compare")||"[]")),[]);

  const products = allProducts.filter((p:any)=>list.includes(p.id));

return list.length>0 &&(
<>
<button className="fixed bottom-6 right-6 bg-brand-blue text-white px-5 py-3 rounded-full shadow-lg hover:bg-brand-blue-dark transition"
  onClick={()=>setOpen(true)}>
  🔍 Compare ({list.length})
</button>

{open && <ComparePage products={products} onClose={()=>setOpen(false)}/>}
</>
);}
