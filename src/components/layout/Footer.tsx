import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export function Footer() {
  return (
    <footer className="container footer">
      <Link href="/" className="footer-name">
        {siteConfig.editorName}
        <span>VIDEO EDITOR & COLORIST</span>
      </Link>
      <p>© {new Date().getFullYear()} · A considered perspective.</p>
      <a href="#top" className="text-link">
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
