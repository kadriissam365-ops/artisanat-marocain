import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Fil d'Ariane" className={className}>
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-muted-foreground/50">
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? "page" : undefined} className="text-foreground font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-terracotta-500 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
