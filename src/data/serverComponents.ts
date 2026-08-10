export type ComponentCategory = 'Category' | 'Server' | 'Server Add-on' | 'Automation' | 'Platform' | 'Requirement';

export interface ComponentItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: ComponentCategory;
  requiredComponents?: string[];
  minimumCapacity?: { type: 'Storage' | 'Bandwidth', value: number }[];
  optionalComponents?: string[];
  autoAdd?: boolean;
}

export const serverComponents: ComponentItem[] = [
  {
    id: 'S01',
    name: 'RTMP Live Streaming Server',
    description: 'Stream live video to websites, apps, OTT platforms and other destinations.',
    price: 499,
    category: 'Server',
    requiredComponents: ['Bandwidth'],
    optionalComponents: ['Player', 'Storage'],
    autoAdd: false,
  },
  {
    id: 'S02',
    name: 'SRT Professional Streaming Server',
    description: 'Reliable professional contribution feed over internet.',
    price: 499,
    category: 'Server',
    requiredComponents: ['Bandwidth'],
    optionalComponents: ['Player'],
    autoAdd: false,
  },
  {
    id: 'S03',
    name: 'RTSP Camera / Video Feed Server',
    description: 'Receive RTSP feeds from cameras, encoders and other video sources.',
    price: 499,
    category: 'Server',
    requiredComponents: ['Bandwidth'],
    optionalComponents: ['Player'],
    autoAdd: false,
  },
  {
    id: 'S04',
    name: 'Multi-Platform Streaming',
    description: 'Stream simultaneously to YouTube, Facebook, Instagram, OTT, websites and apps.',
    price: 499,
    category: 'Server Add-on',
    requiredComponents: ['S01', 'Bandwidth'],
    autoAdd: true,
  },
  {
    id: 'S05',
    name: 'ABR Transcoding',
    price: 999,
    category: 'Server',
    requiredComponents: ['S01', 'Storage', 'Bandwidth'],
    minimumCapacity: [{ type: 'Storage', value: 50 }],
    autoAdd: true,
  },
  {
    id: 'S06',
    name: 'Unlimited RTMP Broadcasting',
    price: 999,
    category: 'Server',
    requiredComponents: ['Bandwidth', 'Storage', 'Player'],
    minimumCapacity: [{ type: 'Bandwidth', value: 5000 }, { type: 'Storage', value: 50 }],
    optionalComponents: ['Analytics'],
    autoAdd: true,
  },
  {
    id: 'S07',
    name: '24x7 AI Auto Streaming',
    description: 'Schedule your uploaded videos and automatically broadcast them',
    price: 999,
    category: 'Automation',
    requiredComponents: ['S01', 'Storage', 'Bandwidth'],
    minimumCapacity: [{ type: 'Storage', value: 20 }, { type: 'Bandwidth', value: 1000 }],
    optionalComponents: ['Player'],
    autoAdd: true,
  },
  {
    id: 'S08',
    name: 'OTT Platform',
    price: 999,
    category: 'Platform',
    requiredComponents: ['S01', 'Storage', 'Bandwidth', 'Hosting'],
    minimumCapacity: [{ type: 'Storage', value: 50 }, { type: 'Bandwidth', value: 1000 }],
    optionalComponents: ['App', 'Analytics'],
    autoAdd: true,
  },
  { id: 'A01', name: 'Re-Streaming Server', description: 'Receive one feed and redistribute it to multiple servers', price: 499, category: 'Server Add-on' },
  { id: 'A02', name: 'Server Analytics', description: 'Know viewer IP, location, date, time and viewing duration', price: 999, category: 'Server Add-on' },
  { id: 'A03', name: 'Live TV Website', description: 'Your own branded Live TV website', price: 999, category: 'Server Add-on' },
  { id: 'A04', name: 'Android App', description: 'App with your name and branding', price: 499, category: 'Server Add-on' },
  { id: 'A05', name: 'Dual / 3-Level Admin', description: 'Multiple levels of server control', price: 499, category: 'Server Add-on' },
  { id: 'A06', name: 'IPTV Platform', price: 999, category: 'Platform' },
  { id: 'A07', name: 'Radio Server', price: 999, category: 'Platform' }
];

export const requirementOptions = {
    bandwidth: [
        { id: 'BW500', name: '500 GB', value: 500, price: 500 },
        { id: 'BW1000', name: '1000 GB', value: 1000, price: 1000 },
        { id: 'BW2000', name: '2000 GB', value: 2000, price: 2000 },
        { id: 'BW3000', name: '3000 GB', value: 3000, price: 3000 },
        { id: 'BW5000', name: '5000 GB', value: 5000, price: 5000 },
    ],
    player: [
        { id: 'P01', name: 'I only need the streaming URL', price: 0 },
        { id: 'P02', name: 'White Label Video Player', price: 499 },
        { id: 'P03', name: 'DVR Rewind / Forward Player', price: 499 },
        { id: 'P04', name: 'ABR Transcoding Player', price: 499 }
    ],
    storage: [
        { id: 'ST0', name: 'No Storage', value: 0, price: 0 },
        { id: 'ST10', name: '10 GB', value: 10, price: 100 },
        { id: 'ST20', name: '20 GB', value: 20, price: 200 },
        { id: 'ST50', name: '50 GB', value: 50, price: 500 },
        { id: 'ST100', name: '100 GB', value: 100, price: 1000 },
    ]
};
