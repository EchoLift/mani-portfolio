import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return <main id="main-content" className="not-found container"><span className="label accent">404 / OUT OF FRAME</span><h1>A story yet<br />to be <em>found.</em></h1><p>This page isn’t part of the collection.</p><Link href="/#work" className="text-link">Return to selected work<Arrow diagonal /></Link></main>;
}
