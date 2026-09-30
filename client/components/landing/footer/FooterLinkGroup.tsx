import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroupProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinkGroup({
  title,
  links,
}: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-950">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-sm text-neutral-500 transition-colors duration-200 hover:opacity-80"
            >
              <span>{link.label}</span>

              <span
                aria-hidden="true"
                className="ml-1.5 max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-w-3 group-hover:opacity-100"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}