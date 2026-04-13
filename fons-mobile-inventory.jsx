import { useState, useRef } from "react";

const CATEGORIES = [
  "Sab Products","Charger","Cable","Handsfree","Speaker",
  "Headphones","Watch","Ringlight","Powerbank","Adapter","Other",
];

const CAT_META = {
  Charger:    { emoji:"🔌", color:"#f7971e", bg:"linear-gradient(135deg,#f7971e33,#f7971e11)" },
  Cable:      { emoji:"🔗", color:"#4facfe", bg:"linear-gradient(135deg,#4facfe33,#4facfe11)" },
  Handsfree:  { emoji:"🎧", color:"#a78bfa", bg:"linear-gradient(135deg,#a78bfa33,#a78bfa11)" },
  Speaker:    { emoji:"🔊", color:"#34d399", bg:"linear-gradient(135deg,#34d39933,#34d39911)" },
  Headphones: { emoji:"🎵", color:"#f472b6", bg:"linear-gradient(135deg,#f472b633,#f472b611)" },
  Watch:      { emoji:"⌚", color:"#60a5fa", bg:"linear-gradient(135deg,#60a5fa33,#60a5fa11)" },
  Ringlight:  { emoji:"💡", color:"#fbbf24", bg:"linear-gradient(135deg,#fbbf2433,#fbbf2411)" },
  Powerbank:  { emoji:"🔋", color:"#10b981", bg:"linear-gradient(135deg,#10b98133,#10b98111)" },
  Adapter:    { emoji:"🔧", color:"#fb7185", bg:"linear-gradient(135deg,#fb718533,#fb718511)" },
  Other:      { emoji:"📦", color:"#94a3b8", bg:"linear-gradient(135deg,#94a3b833,#94a3b811)" },
};

// Sample products with real working image URLs
const initialProducts = [
  { id:1, name:"Fast Charger 65W",    category:"Charger",    price:850,  stock:25, brand:"Anker",   img:"https://m.media-amazon.com/images/I/61bXFBydvpL._AC_SL1500_.jpg" },
  { id:2, name:"Type-C Cable 1m",     category:"Cable",      price:350,  stock:60, brand:"Baseus",  img:"https://m.media-amazon.com/images/I/71pHRGjQDmL._AC_SL1500_.jpg" },
  { id:3, name:"Stereo Handsfree",    category:"Handsfree",  price:450,  stock:40, brand:"Generic", img:"https://m.media-amazon.com/images/I/71kA4UCxOqL._AC_SL1500_.jpg" },
  { id:4, name:"JBL Mini Speaker",    category:"Speaker",    price:2200, stock:12, brand:"JBL",     img:"https://m.media-amazon.com/images/I/71MnG5RKULL._AC_SL1500_.jpg" },
  { id:5, name:"Sony WH-1000XM4",     category:"Headphones", price:8500, stock:8,  brand:"Sony",    img:"https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg" },
  { id:6, name:"Smart Watch Pro",     category:"Watch",      price:3500, stock:15, brand:"T500",    img:"https://m.media-amazon.com/images/I/71VjXMVsRzL._AC_SL1500_.jpg" },
  { id:7, name:"Ring Light 10 inch",  category:"Ringlight",  price:1200, stock:20, brand:"Neewer",  img:"https://m.media-amazon.com/images/I/71YSMbf9eXL._AC_SL1500_.jpg" },
  { id:8, name:"Powerbank 20000mAh",  category:"Powerbank",  price:2800, stock:18, brand:"Anker",   img:"https://m.media-amazon.com/images/I/618BUJXRKIL._AC_SL1500_.jpg" },
  { id:9, name:"Multi Adapter EU/UK", category:"Adapter",    price:650,  stock:30, brand:"Generic", img:"https://m.media-amazon.com/images/I/71F8XKrfNFL._AC_SL1500_.jpg" },
];

let nextId = 10;

const BLANK_FORM = { name:"", category:"Charger", price:"", stock:"", brand:"", img:"", imgFile:null };

export default function FonsMobileInventory() {
  const [products, setProducts]             = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("Sab Products");
  const [search, setSearch]                 = useState("");
  const [showForm, setShowForm]             = useState(false);
  const [editProduct, setEditProduct]       = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null);
  const [notification, setNotification]     = useState(null);
  const [form, setForm]                     = useState(BLANK_FORM);
  const [imgError, setImgError]             = useState({});
  const fileRef = useRef();

  const showNotif = (msg, type="success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = products.filter(p => {
    const matchCat    = activeCategory === "Sab Products" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalValue = products.reduce((s,p) => s + p.price * p.stock, 0);
  const totalItems = products.reduce((s,p) => s + p.stock, 0);
  const lowStock   = products.filter(p => p.stock < 10).length;

  const meta = (cat) => CAT_META[cat] || CAT_META.Other;

  const openAdd = () => {
    setEditProduct(null);
    setForm(BLANK_FORM);
    setShowForm(true);
  };

  const handleEdit = (p) => {
    setEditProduct(p);
    setForm({ name:p.name, category:p.category, price:p.price, stock:p.stock, brand:p.brand, img:p.img||"", imgFile:null });
    setShowForm(true);
  };

  // Handle file upload → convert to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, img: ev.target.result, imgFile: file }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) { showNotif("Naam, Qeemat aur Stock zaroor bharen!", "error"); return; }
    const finalImg = form.img || "";
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id
        ? { ...p, ...form, price:+form.price, stock:+form.stock, img:finalImg } : p));
      showNotif("Product update ho gaya ✓");
    } else {
      setProducts(prev => [...prev, { id:nextId++, ...form, price:+form.price, stock:+form.stock, img:finalImg }]);
      showNotif("Product add ho gaya ✓");
    }
    setShowForm(false); setEditProduct(null);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showNotif("Product delete ho gaya", "error");
  };

  const ProductImg = ({ p, height=140 }) => {
    const m = meta(p.category);
    const hasImg = p.img && !imgError[p.id];
    return (
      <div style={{ height, background: hasImg ? "#111" : m.bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
        {hasImg ? (
          <img
            src={p.img}
            alt={p.name}
            onError={() => setImgError(prev => ({ ...prev, [p.id]: true }))}
            style={{ width:"100%", height:"100%", objectFit:"contain", padding:8, boxSizing:"border-box" }}
          />
        ) : (
          <div style={{ fontSize:64, lineHeight:1, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))", userSelect:"none" }}>{m.emoji}</div>
        )}
        <div style={{ position:"absolute", top:8, left:8, background:m.color, borderRadius:6, padding:"3px 8px", fontSize:10, fontWeight:700, color:"#fff" }}>{p.category}</div>
        {p.stock < 10 && (
          <div style={{ position:"absolute", top:8, right:8, background:"#fc5c7d", borderRadius:6, padding:"3px 7px", fontSize:9, fontWeight:700, color:"#fff" }}>LOW</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)", minHeight:"100vh", color:"#fff" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(90deg,#ff6b35,transparent)", borderBottom:"2px solid #ff6b35", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:"#fff", borderRadius:"50%", width:42, height:42, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📱</div>
          <div>
            <div style={{ fontWeight:900, fontSize:20, letterSpacing:1 }}>FONS MOBILE</div>
            <div style={{ fontSize:11, opacity:.7 }}>Accessories Inventory</div>
          </div>
        </div>
        <button onClick={openAdd} style={{ background:"#ff6b35", border:"none", color:"#fff", borderRadius:10, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer", boxShadow:"0 3px 12px #ff6b3566" }}>
          ＋ Add Product
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{ position:"fixed", top:16, right:16, zIndex:9999, background:notification.type==="error"?"#e53e3e":"#38a169", color:"#fff", borderRadius:10, padding:"11px 20px", fontWeight:600, fontSize:13, boxShadow:"0 4px 20px #0008" }}>
          {notification.msg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display:"flex", gap:12, padding:"18px 20px 0", flexWrap:"wrap" }}>
        {[
          { label:"Products",    value:products.length,             icon:"📦", color:"#4facfe" },
          { label:"Total Stock", value:totalItems.toLocaleString(),  icon:"🔢", color:"#43e97b" },
          { label:"Value (Rs.)", value:totalValue.toLocaleString(),  icon:"💰", color:"#f7971e" },
          { label:"Low Stock",   value:lowStock,                    icon:"⚠️", color:"#fc5c7d" },
        ].map(s => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${s.color}44`, borderRadius:14, padding:"12px 16px", flex:"1 1 110px" }}>
            <div style={{ fontSize:18 }}>{s.icon}</div>
            <div style={{ fontSize:19, fontWeight:800, color:s.color, marginTop:3 }}>{s.value}</div>
            <div style={{ fontSize:11, opacity:.6, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding:"14px 20px 0" }}>
        <input placeholder="🔍  Product ya brand dhundhen..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ width:"100%", background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
      </div>

      {/* Category Tabs */}
      <div style={{ display:"flex", gap:8, padding:"12px 20px 4px", overflowX:"auto" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={()=>setActiveCategory(cat)}
            style={{ background:activeCategory===cat?"#ff6b35":"rgba(255,255,255,0.07)", border:activeCategory===cat?"1px solid #ff6b35":"1px solid rgba(255,255,255,0.14)", color:"#fff", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:activeCategory===cat?700:400, cursor:"pointer", whiteSpace:"nowrap" }}>
            {cat !== "Sab Products" && CAT_META[cat]?.emoji+" "}{cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))", gap:16, padding:"18px 20px 40px" }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", opacity:.45, padding:40, fontSize:15 }}>Koi product nahi mila 😕</div>
        )}
        {filtered.map(p => {
          const m = meta(p.category);
          return (
            <div key={p.id}
              style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${m.color}44`, borderRadius:16, overflow:"hidden", transition:"transform .18s, box-shadow .18s", cursor:"default" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 10px 30px ${m.color}33`}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>

              <ProductImg p={p} />

              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                <div style={{ fontSize:11, opacity:.5, marginBottom:10 }}>{p.brand}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <span style={{ color:"#43e97b", fontWeight:800, fontSize:16 }}>Rs. {p.price.toLocaleString()}</span>
                  <span style={{ background:p.stock<10?"#fc5c7d22":"#43e97b22", border:`1px solid ${p.stock<10?"#fc5c7d":"#43e97b"}`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600, color:p.stock<10?"#fc5c7d":"#43e97b" }}>
                    {p.stock} pcs
                  </span>
                </div>
                <div style={{ display:"flex", gap:7 }}>
                  <button onClick={()=>handleEdit(p)} style={{ flex:1, background:"rgba(79,172,254,0.12)", border:"1px solid #4facfe44", color:"#4facfe", borderRadius:8, padding:"7px 0", fontSize:12, fontWeight:600, cursor:"pointer" }}>✏️ Edit</button>
                  <button onClick={()=>setDeleteConfirm(p.id)} style={{ flex:1, background:"rgba(252,92,125,0.12)", border:"1px solid #fc5c7d44", color:"#fc5c7d", borderRadius:8, padding:"7px 0", fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Del</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"#000c", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, overflowY:"auto" }}>
          <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)", border:"1px solid rgba(255,107,53,0.4)", borderRadius:18, padding:"24px 22px", width:"100%", maxWidth:420, boxShadow:"0 20px 60px #0009", margin:"auto" }}>
            <h2 style={{ margin:"0 0 18px", fontWeight:800, color:"#ff6b35", fontSize:18 }}>
              {editProduct?"✏️ Product Edit Karen":"➕ Naya Product Add Karen"}
            </h2>

            {/* ── Photo Section ── */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, opacity:.65, display:"block", marginBottom:6 }}>📷 Product Ki Photo</label>

              {/* Preview */}
              <div style={{ width:"100%", height:140, borderRadius:12, overflow:"hidden", background: form.img ? "#111" : meta(form.category).bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10, border:"1px solid rgba(255,255,255,0.1)" }}>
                {form.img ? (
                  <img src={form.img} alt="preview" style={{ width:"100%", height:"100%", objectFit:"contain", padding:8, boxSizing:"border-box" }}
                    onError={()=>setForm(prev=>({...prev,img:""}))} />
                ) : (
                  <div style={{ fontSize:52, opacity:.6 }}>{meta(form.category).emoji}</div>
                )}
              </div>

              {/* Upload Button */}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }}/>
              <button onClick={()=>fileRef.current.click()}
                style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px dashed rgba(255,255,255,0.3)", color:"#fff", borderRadius:9, padding:"10px", fontSize:13, cursor:"pointer", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                📁 Gallery se Photo Chunen
              </button>

              {/* URL Input */}
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.12)" }}/>
                <span style={{ fontSize:11, opacity:.4 }}>ya</span>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.12)" }}/>
              </div>
              <input
                placeholder="🔗 Image URL paste karen"
                value={form.imgFile ? "(Uploaded File)" : form.img}
                onChange={e => setForm(prev => ({ ...prev, img: e.target.value, imgFile: null }))}
                style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.16)", borderRadius:9, padding:"9px 12px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box" }}
              />
              {form.img && (
                <button onClick={()=>setForm(prev=>({...prev,img:"",imgFile:null}))}
                  style={{ marginTop:6, background:"none", border:"none", color:"#fc5c7d", fontSize:11, cursor:"pointer", padding:0 }}>
                  ✕ Photo hatao
                </button>
              )}
            </div>

            {/* Fields */}
            {[
              { label:"Product Ka Naam *", key:"name",  placeholder:"e.g. Fast Charger 65W" },
              { label:"Brand",             key:"brand", placeholder:"e.g. Anker, Baseus" },
              { label:"Qeemat (Rs.) *",    key:"price", placeholder:"e.g. 850",  type:"number" },
              { label:"Stock *",           key:"stock", placeholder:"e.g. 25",   type:"number" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, opacity:.65, display:"block", marginBottom:4 }}>{f.label}</label>
                <input type={f.type||"text"} value={form[f.key]} onChange={e=>setForm(prev=>({...prev,[f.key]:e.target.value}))} placeholder={f.placeholder}
                  style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:9, padding:"10px 13px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
              </div>
            ))}

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, opacity:.65, display:"block", marginBottom:4 }}>Category *</label>
              <select value={form.category} onChange={e=>setForm(prev=>({...prev,category:e.target.value,img:prev.imgFile?prev.img:"",imgFile:prev.imgFile}))}
                style={{ width:"100%", background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.18)", borderRadius:9, padding:"10px 13px", color:"#fff", fontSize:13, outline:"none" }}>
                {CATEGORIES.filter(c=>c!=="Sab Products").map(c=>(
                  <option key={c} value={c}>{CAT_META[c]?.emoji} {c}</option>
                ))}
              </select>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleSave} style={{ flex:1, background:"#ff6b35", border:"none", color:"#fff", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                {editProduct?"Update Karen":"Add Karen"}
              </button>
              <button onClick={()=>{setShowForm(false);setEditProduct(null);}} style={{ flex:1, background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.18)", color:"#fff", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"#000c", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1a1a2e", border:"1px solid #fc5c7d55", borderRadius:16, padding:28, maxWidth:320, width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>⚠️</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:7 }}>Delete karna chahte hain?</div>
            <div style={{ opacity:.55, marginBottom:22, fontSize:13 }}>Ye product hamesha ke liye hataye ga</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>handleDelete(deleteConfirm)} style={{ flex:1, background:"#fc5c7d", border:"none", color:"#fff", borderRadius:9, padding:"11px", fontWeight:700, cursor:"pointer" }}>Delete</button>
              <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.18)", color:"#fff", borderRadius:9, padding:"11px", fontWeight:700, cursor:"pointer" }}>Rokein</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
