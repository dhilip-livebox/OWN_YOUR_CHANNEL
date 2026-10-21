import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function WhatsAppWidget() {
  const [pageTitle, setPageTitle] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    // Update the title dynamically based on the document title
    const title = document.title.split('-')[0].trim() || "Media Infrastructure";
    setPageTitle(title);
  }, []);

  const phoneNumber = "919876543210"; // Placeholder phone number
  const message = `Hello CDTECH, I am interested in your ${pageTitle} solution. I would like to discuss my requirement.`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 hover:shadow-[#25D366]/40 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="font-bold tracking-tight pr-1">{t('whatsapp.talkToConsultant')}</span>
    </a>
  );
}
