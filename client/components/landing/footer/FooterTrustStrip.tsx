import {
  BadgeCheck,
  BookOpenCheck,
  MessageCircle,
  MapPin,
} from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Verified catalogue",
    description: "Clearly marked products",
  },
  {
    icon: BookOpenCheck,
    title: "Clear product information",
    description: "Ingredients, usage and suitability",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp updates",
    description: "Stay informed about your order",
  },
  {
    icon: MapPin,
    title: "Nigeria delivery",
    description: "Available across selected states",
  },
];

export default function FooterTrustStrip() {
  return (
    <div className="border-y border-neutral-800/80">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-neutral-800/80 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 px-5 py-6 sm:px-7"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
                <Icon
                  className="h-[17px] w-[17px] text-neutral-300"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}