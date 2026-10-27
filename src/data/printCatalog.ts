import { PrintProduct, PrintLabProvider } from '../types/cineflow';

export const DEFAULT_PRINT_PRODUCTS: PrintProduct[] = [
  // Albums
  {
    id: 'prod_album_12x12',
    category: 'albums',
    name: 'Heirloom Flush Mount Leather Album (12x12")',
    description: 'Ultra-thick seamless panoramic spreads printed on archival Fuji Crystal silk paper. Hand-bound in full-grain Italian leather with custom gold foil name debossing.',
    size: '12x12" (30x30 cm)',
    labCost: 145.00,
    retailPrice: 750.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      coverMaterials: ['Tuscan Caramel Leather', 'Midnight Obsidian Leather', 'Champagne Linen', 'Forest Emerald Velvet'],
    },
  },
  {
    id: 'prod_album_10x10',
    category: 'albums',
    name: 'Fine Art Linen Layflat Album (10x10")',
    description: 'Modern luxury layflat album wrapped in Belgian linen. Archival matte fine art pages that open completely flat with zero crease disruption.',
    size: '10x10" (25x25 cm)',
    labCost: 85.00,
    retailPrice: 420.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      coverMaterials: ['Natural Oatmeal Linen', 'Rose Quartz Linen', 'Slate Charcoal Linen', 'Sage Linen'],
    },
  },
  {
    id: 'prod_album_8x8_parent',
    category: 'albums',
    name: 'Parent Keepsake Album (8x8" Companion)',
    description: 'Compact heirloom edition designed specifically as gifts for parents and grandparents. Exact duplicate layout of your main feature album.',
    size: '8x8" (20x20 cm)',
    labCost: 55.00,
    retailPrice: 250.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      coverMaterials: ['Tuscan Caramel Leather', 'Champagne Linen', 'Slate Charcoal Linen'],
    },
  },

  // Museum Framed Wall Art
  {
    id: 'prod_frame_24x36',
    category: 'framed-prints',
    name: 'Exhibition Museum Framed Wall Art (24x36")',
    description: 'Statement focal wall piece. Handcrafted solid hardwood moulding, acid-free museum mat board, and 99% UV-protective non-glare museum acrylic glass.',
    size: '24x36" (60x90 cm)',
    labCost: 110.00,
    retailPrice: 580.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      frames: ['Solid Natural White Oak', 'Matte Gallery Black', 'Clean Gallery White', 'Brushed Champagne Brass'],
    },
  },
  {
    id: 'prod_frame_16x24',
    category: 'framed-prints',
    name: 'Handcrafted Gallery Framed Print (16x24")',
    description: 'Custom framed fine art print complete with hanging hardware attached and ready to hang in living rooms, bedrooms, or hallways.',
    size: '16x24" (40x60 cm)',
    labCost: 65.00,
    retailPrice: 290.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      frames: ['Solid Natural White Oak', 'Matte Gallery Black', 'Brushed Champagne Brass'],
    },
  },
  {
    id: 'prod_frame_11x14',
    category: 'framed-prints',
    name: 'Tabletop / Wall Floating Frame (11x14")',
    description: 'Versatile framed print with dual desktop easel back and wall hanging wire. Perfect for desks, mantels, and bedside tables.',
    size: '11x14" (28x35 cm)',
    labCost: 38.00,
    retailPrice: 165.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      frames: ['Solid Natural White Oak', 'Matte Gallery Black', 'Clean Gallery White'],
    },
  },

  // Archival Fine Art Prints
  {
    id: 'prod_print_8x10',
    category: 'paper-prints',
    name: 'Archival Deep Matte Fine Art Print (8x10")',
    description: 'Printed on 100% cotton rag paper with zero glare and velvet touch texture. Rated for 100+ years archival longevity.',
    size: '8x10" (20x25 cm)',
    labCost: 3.80,
    retailPrice: 35.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      finishes: ['Archival Deep Matte', 'Fuji Lustre Finish', 'Pearl Metallic'],
    },
  },
  {
    id: 'prod_print_5x7',
    category: 'paper-prints',
    name: 'Silk Finish Portrait Print (5x7")',
    description: 'Classic portrait size ideal for framing or sending to family in celebration cards.',
    size: '5x7" (13x18 cm)',
    labCost: 1.90,
    retailPrice: 22.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      finishes: ['Archival Deep Matte', 'Fuji Lustre Finish'],
    },
  },

  // Keepsake USB & Digital Heirloom
  {
    id: 'prod_usb_walnut',
    category: 'usb-keepsake',
    name: 'Custom Engraved Walnut & Crystal 4K USB Box',
    description: 'Solid walnut wooden keepsake box lined with natural moss, containing a weighted crystal and rose gold 128GB USB 3.2 drive loaded with your master 4K films.',
    size: '128GB USB 3.2 + Heirloom Box',
    labCost: 32.00,
    retailPrice: 195.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      finishes: ['Natural Walnut & Crystal', 'White Oak & Gold', 'Matte Black & Silver'],
    },
  },

  // Metal & Acrylic
  {
    id: 'prod_metal_20x30',
    category: 'metal-acrylic',
    name: 'ChromaLuxe Ultra-HD Metal Print (20x30")',
    description: 'Dyes directly infused into specially coated aluminum sheets. Jaw-dropping color vibrancy, waterproof, and scratch-resistant with floating wall mount.',
    size: '20x30" (50x75 cm)',
    labCost: 78.00,
    retailPrice: 390.00,
    labProvider: 'whcc',
    previewMockupUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    availableOptions: {
      finishes: ['High-Gloss Vibrant', 'Satin Non-Glare'],
    },
  },
];

export const PRINT_LAB_INFO: Record<PrintLabProvider, { name: string; region: string; turnAround: string; description: string }> = {
  whcc: {
    name: 'White House Custom Colour (WHCC)',
    region: 'United States & Worldwide',
    turnAround: '2 - 3 business days',
    description: 'The industry-standard professional lab for wedding photographers and filmmakers. Known for handcrafted flush-mount albums, fine art printing, and 100% white-label dropshipping.',
  },
  millers: {
    name: 'Miller\'s Professional Imaging',
    region: 'North America',
    turnAround: '1 - 2 business days (Fastest in USA)',
    description: 'Premier lab offering free overnight shipping to clients and exceptional signature albums with metallic foil stamping.',
  },
  loxley: {
    name: 'Loxley Colour',
    region: 'UK & Europe',
    turnAround: '3 - 5 business days',
    description: 'Award-winning European professional print lab based in Glasgow, trusted by destination wedding filmmakers and photographers across the UK and EU.',
  },
  atkins: {
    name: 'Atkins Pro Lab',
    region: 'Australia, NZ & Asia Pacific',
    turnAround: '3 - 5 business days',
    description: 'Australia’s oldest and most prestigious professional lab, renowned for artisanal hand-torn cotton rag fine art prints and bespoke linen books.',
  },
  prodpi: {
    name: 'ProDPI',
    region: 'United States',
    turnAround: '2 - 4 business days',
    description: 'Boutique custom lab specializing in modern press-printed books, eco-friendly fine art paper, and luxury packaging.',
  },
};
