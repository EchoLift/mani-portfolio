"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Film01Icon,
  UserIcon,
  Layers01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { siteConfig } from "@/data/site-config";
import { emailHref, phoneHref, socialHref } from "@/lib/config";

interface DockMenuItem {
  label?: string;
  separator?: boolean;
  checked?: boolean;
  onClick?: () => void;
  items?: Array<{ label?: string; checked?: boolean; onClick?: () => void }>;
}

interface DockItem {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  badge?: boolean | number | string;
  onClick?: () => void;
  menu?: DockMenuItem[];
}

interface DockProps {
  items?: DockItem[];
  position?: "bottom" | "top" | "left" | "right";
  theme?: "dark" | "light";
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  gap?: number;
  roundness?: number;
  spring?: { mass?: number; stiffness?: number; damping?: number };
  bounce?: boolean;
  autoHide?: boolean;
  tiles?: boolean;
  showLabels?: boolean;
  showIndicators?: boolean;
  showBadges?: boolean;
  badgeColor?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Dynamically import Dock to ensure safe client-side execution
const Dock = dynamic<DockProps>(
  () =>
    import("../ui/Dock/Dock") as unknown as Promise<
      React.ComponentType<DockProps>
    >,
  {
    ssr: false,
    loading: () => null,
  }
);

const glyph = (icon: Parameters<typeof HugeiconsIcon>[0]["icon"]) => (
  <HugeiconsIcon icon={icon} size={20} strokeWidth={1.8} />
);

export function PortfolioDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [activeSection, setActiveSection] = useState<string>("home");

  // Track active section on the homepage
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["top", "work", "about", "services", "contact"];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // If at top
      if (scrollY < 200) {
        setActiveSection("home");
        return;
      }

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.15) {
          setActiveSection(id === "top" ? "home" : id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navigateTo = (targetId: string) => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (pathname === "/") {
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: isReduced ? "auto" : "smooth" });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: isReduced ? "auto" : "smooth" });
        }
      }
    } else {
      startTransition(() => {
        router.push(targetId === "top" ? "/" : `/#${targetId}`);
      });
    }
  };

  const dockItems = [
    {
      icon: glyph(Home01Icon),
      label: "Home",
      active: activeSection === "home",
      onClick: () => navigateTo("top"),
      menu: [
        {
          label: "Return to Top",
          onClick: () => navigateTo("top"),
        },
        { separator: true },
        {
          label: "Selected Work",
          onClick: () => navigateTo("work"),
        },
      ],
    },
    {
      icon: glyph(Film01Icon),
      label: "Work",
      active: activeSection === "work",
      onClick: () => navigateTo("work"),
      menu: [
        {
          label: "All 9 Selected Films",
          onClick: () => navigateTo("work"),
        },
        {
          label: "Featured Film (01)",
          onClick: () => {
            if (pathname === "/") {
              document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
            } else {
              router.push("/work/selected-work-01");
            }
          },
        },
      ],
    },
    {
      icon: glyph(Layers01Icon),
      label: "Services",
      active: activeSection === "services",
      onClick: () => navigateTo("services"),
      menu: [
        {
          label: "Video Editing",
          onClick: () => navigateTo("services"),
        },
        {
          label: "Color Grading",
          onClick: () => navigateTo("services"),
        },
        {
          label: "Brand Films",
          onClick: () => navigateTo("services"),
        },
        {
          label: "Social Content",
          onClick: () => navigateTo("services"),
        },
      ],
    },
    {
      icon: glyph(UserIcon),
      label: "About",
      active: activeSection === "about",
      onClick: () => navigateTo("about"),
      menu: [
        {
          label: "Creative Perspective",
          onClick: () => navigateTo("about"),
        },
        {
          label: "Behind the Edit",
          onClick: () => navigateTo("about"),
        },
      ],
    },
    {
      icon: glyph(Mail01Icon),
      label: "Contact",
      active: activeSection === "contact",
      onClick: () => navigateTo("contact"),
      menu: [
        ...(siteConfig.email
          ? [
              {
                label: `Email: ${siteConfig.email}`,
                onClick: () => {
                  const href = emailHref(siteConfig.email);
                  if (href) window.location.href = href;
                },
              },
            ]
          : []),
        ...(siteConfig.phone
          ? [
              {
                label: `Call: ${siteConfig.phone}`,
                onClick: () => {
                  const href = phoneHref(siteConfig.phone);
                  if (href) window.location.href = href;
                },
              },
            ]
          : []),
        { separator: true },
        ...(siteConfig.socials.instagram
          ? [
              {
                label: `Instagram: ${siteConfig.socials.instagram ? "@" + new URL(siteConfig.socials.instagram).pathname.split("/").filter(Boolean)[0] : ""}`,
                onClick: () => {
                  const href = socialHref(siteConfig.socials.instagram, "instagram");
                  if (href) window.open(href, "_blank", "noopener,noreferrer");
                },
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div
      className="portfolio-dock fixed left-0 right-0 z-40 flex justify-center pointer-events-none px-4"
      role="navigation"
      aria-label="Portfolio navigation"
    >
      <div className="pointer-events-auto">
        <Dock
          items={dockItems}
          position="bottom"
          theme="dark"
          baseItemSize={48}
          magnification={66}
          distance={180}
          panelHeight={64}
          gap={10}
          roundness={0.65}
          bounce={true}
          autoHide={false}
          tiles={true}
          showLabels={true}
          showIndicators={true}
          showBadges={false}
          accentColor="#c6ae83"
          className="shadow-2xl shadow-black/80 border border-white/10 !bg-[#121212]/80 backdrop-blur-xl"
          style={{
            "--dock-panel": "rgba(14, 14, 14, 0.78)",
            "--dock-panel-edge": "rgba(243, 240, 233, 0.12)",
            "--dock-panel-highlight": "rgba(243, 240, 233, 0.08)",
            "--dock-tile": "linear-gradient(180deg, rgba(35, 34, 32, 0.7) 0%, rgba(20, 20, 20, 0.8) 100%)",
            "--dock-tile-edge": "rgba(243, 240, 233, 0.08)",
            "--dock-tile-highlight": "rgba(243, 240, 233, 0.12)",
            "--dock-ink": "#f3f0e9",
            "--dock-dot": "#c6ae83",
            "--dock-label": "#1a1917",
            "--dock-label-ink": "#f3f0e9",
            "--dock-menu": "rgba(20, 19, 18, 0.92)",
            "--dock-menu-edge": "rgba(243, 240, 233, 0.14)",
            "--dock-menu-ink": "#f3f0e9",
            "--dock-menu-muted": "rgba(243, 240, 233, 0.5)",
            "--dock-accent": "#c6ae83",
            "--dock-separator": "rgba(243, 240, 233, 0.12)",
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
