import { Check } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
const services = [
  {
    id: 1,
    name: "Website Hosting Server",
    description: "Server to host built-in Websites, Apps, Streaming & Storage",
    price: 299,
  },
  {
    id: 2,
    name: "Streaming Server",
    description: "Streaming Server to stream to 2 platforms",
    price: 499,
  },
  {
    id: 3,
    name: "Multi-Platform Broadcasting Server",
    description: "with your own logo and name insertion or slide insertion on video player with 1000 GB bandwidth every month. Get your own control panel for managing your server.",
    price: 499,
  },
  {
    id: 4,
    name: "Re-Streaming Server",
    description: "This server takes your feed and re-streams it to multiple servers.- you can also increase the bit rate - for example your internet is very low - this can take and stream even in 4k or full hd from the server.",
    price: 999,
  },
  {
    id: 5,
    name: "AI Automated Live Streaming for streaming",
    description: "without any system and High Speed internet - used for automated Live TV Channel, Automated Scheduled live Streaming all without local system device and internet",
    price: 1999,
  },
  {
    id: 6,
    name: "No Delay RTMP Server",
    description: "This Server is used for conducting Panel discussions",
    price: 899,
  },
  {
    id: 7,
    name: "SRT Server",
    description: "To Stream to Jio OTT Platform etc.",
    price: 899,
  },
  {
    id: 8,
    name: "RTSP Server",
    description: "To pull videos from IP Cameras",
    price: 899,
  },
  {
    id: 9,
    name: "Streaming Server to push Local TV and Broadcast Receiver box",
    description: "Streaming Server to push to Local MSO through Broadcast receiver Box.",
    price: 499,
  },
  {
    id: 10,
    name: "Playout Server Software",
    description: "with control for Local TV broadcast and TVs In Malls and other public places with control system",
    price: 499,
  },
  {
    id: 11,
    name: "Local TV Broadcasting Control Panel and Monitoring Server",
    description: "Monitoring Multiple Broadcast Receiver Boxes at various MSOs",
    price: 499,
  },
  {
    id: 12,
    name: "Live TV Websites for your Channel",
    description: "Live TV Website with your own Name and Logo",
    price: 299,
  },
  {
    id: 13,
    name: "Live TV Andorid App",
    description: "Android App - APK with your own Name and Logo",
    price: 499,
  },
  {
    id: 14,
    name: "Direct broadcast to Mobile App",
    description: "Direct to Mobile App with your own Name and logo - Broadcast direct to all Mobiles without any 3rd party controls",
    price: 899,
  },
  {
    id: 15,
    name: "Storage",
    description: "50 GB (Rs.50 per GB)",
    price: 500,
  },
  {
    id: 16,
    name: "Bandwidth",
    description: "3000 GB per month (Rs.1 per GB BW)",
    price: 500,
  },
  {
    id: 17,
    name: "Server Analytics",
    description: "Shows each viewer location, time, duration and the bandwidth used for viewing with IP address",
    price: null,
  },
  {
    id: 18,
    name: "Dual Control Panel",
    description: "3 levels of Controls",
    price: null,
  },
  {
    id: 19,
    name: "White labeled Video Player",
    description: "Have your own logo for each program or also have it as a slide in between programs",
    price: 499,
  },
  {
    id: 20,
    name: "IPTV & OTT Server",
    description: "",
    price: 7999,
  },
  {
    id: 21,
    name: "Transcoding Server",
    description: "",
    price: 5999,
  },
  {
    id: 22,
    name: "Radio Channel Single",
    description: "",
    price: 999,
  },
  {
    id: 23,
    name: "Radio Station Multiple",
    description: "",
    price: 4999,
  },
];

export function PricingTable() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showQR, setShowQR] = useState(false);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    // Hide QR if selection changes to prevent stale amount QR
    setShowQR(false);
  };

  const selectedServices = services.filter((s) => selectedIds.has(s.id));
  const totalAmount = selectedServices.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const upiId = "cdtechinnovationspvt.62289923@hdfcbank";
  const merchantName = "CDTECH INNOVATIONS PVT LTD";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR`;

  return (
    <section id="pricing" className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Services & Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            All our Servers are available on a yearly basis. Our Servers are highly cost effective — costing only Rs.299 to Rs.399 per month when taken as a package on a yearly basis.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-foreground">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Sl.no.
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Medium Package-1
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Own your Own Server TV Channel (Dedicated)
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">
                    Price (Rs.)
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {services.map((service) => {
                  const isSelected = selectedIds.has(service.id);
                  return (
                    <tr 
                      key={service.id} 
                      className={`transition-colors hover:bg-muted/30 ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                        {service.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {service.name}
                      </td>
                      <td className="px-6 py-4">
                        {service.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-foreground">
                        {service.price ? `₹${service.price}` : "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {service.price && (
                          <button 
                            onClick={() => toggleSelection(service.id)}
                            className={`rounded-md px-4 py-2 text-xs font-semibold transition ${
                              isSelected 
                                ? 'bg-primary text-primary-foreground shadow-sm hover:brightness-110' 
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Summary & Checkout Section */}
        {selectedIds.size > 0 && (
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">Selected Services</h3>
                <ul className="mt-4 space-y-2">
                  {selectedServices.map(s => (
                    <li key={s.id} className="flex justify-between text-sm text-muted-foreground border-b border-primary/10 pb-2">
                      <span>{s.name}</span>
                      <span className="font-medium text-foreground">₹{s.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-primary/20 pt-4 text-lg font-bold text-foreground">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
                
                {!showQR && (
                  <button 
                    onClick={() => setShowQR(true)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-110 md:w-auto"
                  >
                    Proceed to Pay ₹{totalAmount}
                  </button>
                )}
              </div>
              
              {showQR && (
                <div className="flex flex-col items-center justify-center animate-in zoom-in-95 mt-6 w-full max-w-sm">
                  <div className="bg-[#0a2e7a] text-white w-full rounded-2xl overflow-hidden shadow-xl border border-[#0a2e7a]/20">
                    <div className="p-6 pb-4 text-center">
                      <h4 className="text-2xl font-bold mb-5 tracking-tight">Scan QR to pay</h4>
                      
                      <div className="border border-white/40 rounded-lg p-3 text-center mb-6">
                        <h5 className="font-bold text-lg leading-tight tracking-wide">CDTECH INNOVATIONS PVT LTD</h5>
                        <p className="text-sm text-white/80 mt-1 uppercase tracking-widest font-medium">CHENNA | TID: 62289923</p>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-4 mx-auto shadow-inner overflow-hidden w-fit relative flex items-center justify-center">
                        <QRCode value={upiUrl} size={220} />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-b from-[#0a2e7a] to-[#254b99] px-6 pb-6 pt-2 text-center">
                      <p className="text-[13px] font-medium leading-tight">
                        Customers can scan the QR with any BharatQR/UPI enabled app
                      </p>
                      <div className="mt-4 inline-block bg-white/10 px-4 py-2 rounded-full border border-white/20">
                        <p className="text-sm text-white font-semibold">
                          Pay exactly <span className="text-xl ml-1">₹{totalAmount}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
