import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center text-center">
      <div>
        <div className="kicker">404</div>
        <h1 className="mt-2 text-2xl font-bold">Not on the map</h1>
        <p className="mt-2 text-fog">That asset or page doesn&apos;t exist.</p>
        <Link href="/map" className="btn btn-atlas mt-4">Open the atlas →</Link>
      </div>
    </div>
  );
}
