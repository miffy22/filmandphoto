import React, { useState } from 'react';
import {
  X, ShoppingBag, CheckCircle2, ChevronRight, Frame, BookOpen,
  Image as ImageIcon, Usb, ArrowRight, Sparkles, Heart, CreditCard,
  Truck, ShieldCheck, Plus, Minus, Trash2, Eye, Sliders, Tag, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClientProject, GalleryPhoto, PrintProduct, StoreOrderItem, StoreOrder } from '../../types/cineflow';
import { DEFAULT_PRINT_PRODUCTS, PRINT_LAB_INFO } from '../../data/printCatalog';

interface ClientPrintStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ClientProject;
  initialSelectedPhoto?: GalleryPhoto | null;
  onOrderPlaced: (order: StoreOrder) => void;
}

const ROOM_BACKGROUNDS = [
  {
    id: 'living-room',
    name: 'Modern Living Room',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    wallPosition: 'top-[22%] left-1/2 -translate-x-1/2',
  },
  {
    id: 'bedroom',
    name: 'Scandinavian Bedroom',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80',
    wallPosition: 'top-[25%] left-1/2 -translate-x-1/2',
  },
  {
    id: 'studio-gallery',
    name: 'Exhibition Gallery',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    wallPosition: 'top-[28%] left-1/2 -translate-x-1/2',
  },
];

export const ClientPrintStoreModal: React.FC<ClientPrintStoreModalProps> = ({
  isOpen,
  onClose,
  project,
  initialSelectedPhoto,
  onOrderPlaced,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<PrintProduct>(DEFAULT_PRINT_PRODUCTS[0]);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto>(
    initialSelectedPhoto || project.photos[0] || {
      id: 'demo_photo',
      url: project.heroCoverImageUrl,
      caption: 'The Highlight Still',
    }
  );

  const [selectedFrameOrCover, setSelectedFrameOrCover] = useState<string>('Solid Natural White Oak');
  const [viewMode, setViewMode] = useState<'room' | 'product'>('room');
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  const [cart, setCart] = useState<StoreOrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<StoreOrder | null>(null);

  // Discount & coupon code
  const [couponInput, setCouponInput] = useState('CELEBRATE20');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>({
    code: 'CELEBRATE20',
    percent: 20,
  });
  const [couponMessage, setCouponMessage] = useState('Early Bird 20% discount applied!');

  // Checkout form
  const [fullName, setFullName] = useState(project.title);
  const [email, setEmail] = useState('client@example.com');
  const [street, setStreet] = useState('124 Luxury Vista Drive');
  const [city, setCity] = useState('Beverly Hills');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('90210');

  if (!isOpen) return null;

  const filteredProducts = selectedCategory === 'all'
    ? DEFAULT_PRINT_PRODUCTS
    : DEFAULT_PRINT_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'CELEBRATE20' || code === 'EARLYBIRD' || code === 'LOVE20') {
      setAppliedCoupon({ code, percent: 20 });
      setCouponMessage('20% discount applied successfully!');
    } else if (code === 'VIP30') {
      setAppliedCoupon({ code, percent: 30 });
      setCouponMessage('VIP 30% discount applied!');
    } else {
      setAppliedCoupon(null);
      setCouponMessage('Invalid coupon code. Try CELEBRATE20');
    }
  };

  const handleAddToCart = () => {
    const existingIdx = cart.findIndex(
      (item) =>
        item.productId === selectedProduct.id &&
        item.photoUrl === activePhoto.url &&
        item.selectedOption === selectedFrameOrCover
    );

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      const newItem: StoreOrderItem = {
        id: `cart_${Date.now()}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        size: selectedProduct.size,
        photoUrl: activePhoto.url,
        selectedOption: selectedFrameOrCover,
        quantity: 1,
        unitPrice: selectedProduct.retailPrice,
        unitLabCost: selectedProduct.labCost,
      };
      setCart([...cart, newItem]);
    }

    try {
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
    } catch (e) {}

    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const cartLabCost = cart.reduce((acc, item) => acc + item.unitLabCost * item.quantity, 0);
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.percent) / 100 : 0;
  const cartShipping = cart.length > 0 ? 15 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + cartShipping);
  const photographerProfit = Math.max(0, cartSubtotal - discountAmount - cartLabCost);

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    setTimeout(() => {
      const newOrder: StoreOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: `CF-${Math.floor(1000 + Math.random() * 9000)}`,
        projectId: project.id,
        clientName: fullName,
        clientEmail: email,
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          zip,
          country: 'United States',
        },
        items: cart,
        subtotal: cartSubtotal,
        discountAmount,
        couponCode: appliedCoupon?.code,
        shipping: cartShipping,
        total: cartTotal,
        photographerProfit,
        labCostTotal: cartLabCost,
        status: 'in_production',
        labProvider: project.printLab || 'whcc',
        trackingNumber: `WHCC-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
      };

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}

      setIsCheckingOut(false);
      setOrderComplete(newOrder);
      onOrderPlaced(newOrder);
      setCart([]);
    }, 1200);
  };

  const activeLab = PRINT_LAB_INFO[project.printLab || 'whcc'];
  const currentRoom = ROOM_BACKGROUNDS[activeRoomIndex];

  // Helper for frame styling in mockup
  const getFrameStyleClass = () => {
    if (selectedFrameOrCover.includes('Black')) {
      return 'border-neutral-900 shadow-2xl';
    }
    if (selectedFrameOrCover.includes('White')) {
      return 'border-neutral-100 shadow-2xl';
    }
    if (selectedFrameOrCover.includes('Brass') || selectedFrameOrCover.includes('Gold')) {
      return 'border-amber-600/90 shadow-2xl';
    }
    // Default White Oak
    return 'border-amber-950/70 shadow-2xl';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col font-sans">
      {/* Top Automated Marketing / Early Bird Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-neutral-950 px-4 py-1.5 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 fill-current" />
        <span>
          <strong>Early Bird Gallery Special:</strong> 20% off all archival prints & handcrafted albums for the next 12 days with code <span className="font-mono underline font-bold">CELEBRATE20</span>
        </span>
      </div>

      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              The Print Lab & Heirloom Store
            </h2>
            <p className="text-xs text-neutral-400">
              Fulfilled by <strong>{activeLab.name}</strong> · 100% Archival Giclée & Handcrafted Binding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative py-2 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Bag</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Store Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left / Center Area: Visual Product Simulator & Catalog */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
          {/* Real-Time Mockup Visualizer: Shows the selected photo mounted inside frame / album */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* View Mode Switcher Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                  Interactive Live Mockup
                </span>
                <span className="text-xs bg-neutral-800 text-neutral-300 font-mono px-2 py-0.5 rounded">
                  {selectedProduct.size}
                </span>
              </div>

              {selectedProduct.category === 'framed-prints' && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('room')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                        viewMode === 'room' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Room View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('product')}
                      className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                        viewMode === 'product' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Frame className="w-3.5 h-3.5" />
                      <span>Studio Mat View</span>
                    </button>
                  </div>

                  {viewMode === 'room' && (
                    <select
                      value={activeRoomIndex}
                      onChange={(e) => setActiveRoomIndex(Number(e.target.value))}
                      className="text-xs bg-neutral-950 border border-neutral-800 text-neutral-300 px-2.5 py-1.5 rounded-xl focus:outline-none"
                    >
                      {ROOM_BACKGROUNDS.map((room, idx) => (
                        <option key={room.id} value={idx}>{room.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* The Live Render Mockup */}
              <div className="relative w-full max-w-md aspect-square rounded-2xl bg-neutral-950 flex items-center justify-center shadow-2xl border border-neutral-800 overflow-hidden group">
                {selectedProduct.category === 'framed-prints' ? (
                  viewMode === 'room' ? (
                    // Realistic Room Mockup Background with Art On Wall
                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                      <img
                        src={currentRoom.url}
                        alt="Room Interior"
                        className="w-full h-full object-cover filter brightness-[0.75]"
                      />
                      <div className="absolute inset-0 bg-black/20" />

                      {/* Framed Wall Art Mounted on the Room Wall */}
                      <div
                        className={`absolute ${currentRoom.wallPosition} w-44 sm:w-52 aspect-[3/4] p-2 bg-neutral-900 border-[8px] ${getFrameStyleClass()} shadow-[0_25px_50px_rgba(0,0,0,0.8)] transition-all`}
                      >
                        <div className="relative w-full h-full bg-white p-2 shadow-inner">
                          <img
                            src={activePhoto.url}
                            alt="Mounted Frame Still"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur border border-neutral-700/60 px-2.5 py-1 rounded-lg text-[10px] text-neutral-300 font-mono">
                        {currentRoom.name} · {selectedProduct.size} Wall Art
                      </div>
                    </div>
                  ) : (
                    // Framed Print Detail Mockup
                    <div
                      className={`relative p-5 bg-neutral-900 rounded-sm shadow-2xl border-[14px] ${getFrameStyleClass()} w-4/5 aspect-[4/5] flex items-center justify-center transition-all`}
                    >
                      <div className="relative w-full h-full bg-white p-2 shadow-inner">
                        <img
                          src={activePhoto.url}
                          alt="Framed preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )
                ) : selectedProduct.category === 'albums' ? (
                  // Heirloom Flush-Mount Album Mockup with Gold Foil Debossing
                  <div className="relative w-4/5 aspect-square rounded-lg bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 p-6 shadow-2xl flex flex-col items-center justify-center text-center border-l-8 border-amber-950">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400/60 mb-3 shadow">
                      <img src={activePhoto.url} alt="Cover Still" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-cinzel text-xs font-bold text-amber-200 tracking-widest uppercase">
                      {project.title}
                    </span>
                    <span className="text-[10px] text-amber-300/80 font-mono mt-1">
                      {project.eventDate}
                    </span>
                    <span className="text-[9px] text-neutral-400 uppercase tracking-widest mt-3 px-2 py-0.5 rounded bg-black/40 border border-amber-500/20">
                      {selectedFrameOrCover} · Gold Foil Deboss
                    </span>
                  </div>
                ) : selectedProduct.category === 'usb-keepsake' ? (
                  // USB Keepsake Box Mockup
                  <div className="relative w-4/5 aspect-[4/3] rounded-xl bg-amber-950/70 p-6 border-4 border-amber-900 shadow-2xl flex flex-col items-center justify-center">
                    <div className="w-36 h-12 rounded-lg bg-neutral-900/90 border border-amber-400/40 flex items-center justify-center text-amber-300 font-mono text-[10px] shadow gap-2">
                      <Usb className="w-3.5 h-3.5 text-amber-400" />
                      <span>CRYSTAL 4K · 128GB</span>
                    </div>
                    <span className="font-cinzel text-xs text-amber-200 mt-3 font-bold">
                      {project.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      Master Archival Film Box
                    </span>
                  </div>
                ) : (
                  // Fine Art Giclée Lustre Print
                  <div className="relative w-4/5 aspect-[4/5] bg-white p-3 shadow-2xl rounded-sm">
                    <img src={activePhoto.url} alt="Print Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-2 text-[8px] text-neutral-400 font-mono uppercase">
                      Archival 100% Cotton Rag
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/80 text-amber-300 backdrop-blur border border-amber-500/20">
                    {activeLab.name} · {selectedProduct.size}
                  </span>
                </div>
              </div>

              {/* Product Selector & Purchase Controls */}
              <div className="flex-1 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-cinzel">
                    {selectedProduct.category.replace('-', ' ')}
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-extrabold text-white font-cinzel">
                      ${selectedProduct.retailPrice.toFixed(2)}
                    </span>
                    {appliedCoupon && (
                      <span className="text-sm font-semibold text-emerald-400">
                        ${(selectedProduct.retailPrice * (1 - appliedCoupon.percent / 100)).toFixed(2)} with Early Bird
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Material / Frame Selection */}
                {selectedProduct.availableOptions?.frames && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Handcrafted Moulding Frame Finish
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.availableOptions.frames.map((frame) => (
                        <button
                          key={frame}
                          type="button"
                          onClick={() => setSelectedFrameOrCover(frame)}
                          className={`p-2 rounded-xl text-left text-xs transition-colors border ${
                            selectedFrameOrCover === frame
                              ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {frame}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.availableOptions?.coverMaterials && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Album Cover Material & Texture
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.availableOptions.coverMaterials.map((mat) => (
                        <button
                          key={mat}
                          type="button"
                          onClick={() => setSelectedFrameOrCover(mat)}
                          className={`p-2 rounded-xl text-left text-xs transition-colors border ${
                            selectedFrameOrCover === mat
                              ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Picker Strip */}
                {project.photos && project.photos.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Pick Photo from Gallery ({project.photos.length} Available)
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {project.photos.map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => setActivePhoto(photo)}
                          className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                            activePhoto.id === photo.id
                              ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105'
                              : 'border-neutral-800 hover:border-neutral-600'
                          }`}
                        >
                          <img src={photo.url} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add To Cart Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order Bag (${selectedProduct.retailPrice.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-cinzel text-lg font-bold text-white">
                Curated Heirloom Catalog
              </h4>
              <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
                {['all', 'albums', 'framed-prints', 'paper-prints', 'usb-keepsake'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      selectedCategory === cat ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedProduct.id === prod.id
                      ? 'bg-neutral-900 border-amber-500 ring-1 ring-amber-500/40'
                      : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 mb-3 relative">
                    <img src={prod.previewMockupUrl} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-black/80 font-mono text-[10px] text-white px-2 py-0.5 rounded">
                      {prod.size}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-white line-clamp-1">{prod.name}</h5>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{prod.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                    <span className="font-cinzel text-base font-bold text-white">
                      ${prod.retailPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-amber-400">
                      Customize →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Slide-Out: Shopping Bag & Checkout Drawer */}
        {isCartOpen && (
          <div className="w-full md:w-96 bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto">
            {orderComplete ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-cinzel text-xl font-bold text-white">
                  Order Confirmed!
                </h4>
                <p className="text-xs text-neutral-400">
                  Order <strong className="text-amber-400 font-mono">{orderComplete.orderNumber}</strong> has been transmitted to <strong>{activeLab.name}</strong> for custom printing and binding.
                </p>
                <div className="p-4 bg-neutral-900 rounded-xl text-left text-xs space-y-1.5 text-neutral-300">
                  <p><strong>Tracking:</strong> {orderComplete.trackingNumber}</p>
                  <p><strong>Deliver to:</strong> {orderComplete.shippingAddress.fullName}</p>
                  <p><strong>Total Charged:</strong> ${orderComplete.total.toFixed(2)}</p>
                  {orderComplete.couponCode && (
                    <p className="text-emerald-400"><strong>Coupon:</strong> {orderComplete.couponCode} applied</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrderComplete(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                    <h4 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      Your Order Bag ({cart.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs text-neutral-500 hover:text-white"
                    >
                      Hide
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 text-xs">
                      Your bag is empty. Select a product to customize!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3"
                        >
                          <img
                            src={item.photoUrl}
                            alt="Order item thumbnail"
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{item.productName}</h5>
                            <p className="text-[10px] text-neutral-400 truncate">{item.selectedOption} · {item.size}</p>
                            <span className="text-xs font-mono text-amber-400 font-semibold">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono text-white px-1">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="p-1 text-neutral-500 hover:text-red-400 ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <form onSubmit={handleCompleteOrder} className="pt-4 border-t border-neutral-800 space-y-3">
                    {/* Coupon Input */}
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Coupon Code"
                          className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-mono text-white uppercase placeholder:normal-case"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponMessage && (
                        <p className={`text-[10px] font-mono ${appliedCoupon ? 'text-emerald-400' : 'text-neutral-400'}`}>
                          {couponMessage}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-neutral-400">
                        <span>Items Subtotal</span>
                        <span>${cartSubtotal.toFixed(2)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-semibold">
                          <span>Discount ({appliedCoupon?.code})</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-400">
                        <span>Insured Lab Shipping</span>
                        <span>${cartShipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-neutral-800">
                        <span>Total Due</span>
                        <span className="text-amber-400 font-mono">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Shipping Inputs */}
                    <div className="space-y-2 pt-2">
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email for Tracking & Proofs"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Street Shipping Address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Zip"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      {isCheckingOut ? (
                        <span>Transmitting to {activeLab.name}...</span>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Place Print Order (${cartTotal.toFixed(2)})</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
