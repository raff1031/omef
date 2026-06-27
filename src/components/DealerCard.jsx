import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

function kmStatus(km) {
  if (km < 50) return "green";
  if (km <= 150) return "amber";
  return "red";
}

function digitsOnly(tel) {
  return tel.replace(/\D/g, "");
}

export default function DealerCard({ dealer }) {
  const { name, city, province, tel, email, km } = dealer;
  const waNumber = tel ? `39${digitsOnly(tel)}` : null;

  return (
    <div className="bg-[#EEF2E8] rounded-xl border border-[#7A9E50]/20 p-4 my-2">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <MapPin size={18} className="text-[#7A9E50] mt-0.5 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#152E20] text-sm leading-tight truncate">
            {name}
          </div>
          <div className="text-[#5A6A5C] text-xs mt-0.5">
            {city}{province ? `, ${province}` : ""}
          </div>
        </div>

        {km != null && (
          <StatusBadge
            status={kmStatus(km)}
            label={`${km} km`}
            size="sm"
          />
        )}
      </div>

      {/* Bottom row — contact links */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pl-7">
        {tel && (
          <a
            href={`tel:${tel}`}
            className="inline-flex items-center gap-1 text-xs text-[#5A6A5C] hover:text-[#152E20] transition-colors"
          >
            <Phone size={13} />
            <span>{tel}</span>
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1 text-xs text-[#5A6A5C] hover:text-[#152E20] transition-colors"
          >
            <Mail size={13} />
            <span className="truncate max-w-[160px]">{email}</span>
          </a>
        )}

        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#3D6B2A] hover:text-[#152E20] transition-colors"
          >
            <MessageCircle size={13} />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}
