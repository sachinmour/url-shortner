import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        404
      </h1>
      <p className="text-2xl">Page Not Found</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      >
        Go Home
      </Link>
    </div>
  );
}
