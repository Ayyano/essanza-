import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="text-center px-6 max-w-md">
        <h1 className="text-6xl font-heading font-bold text-muted-gold mb-4">404</h1>
        <h2 className="text-xl font-heading font-semibold text-matte-black mb-3">
          Yeh page nahi mila
        </h2>
        <p className="text-gray-400 mb-8">
          Aap jo dhundh rahe hain, woh yahan nahi hai. Shayed delete ho chuka hai ya URL galat hai.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-matte-black text-warm-white rounded-lg font-medium text-sm hover:bg-deep-charcoal transition-colors"
        >
          Wapas home par jayein
        </Link>
      </div>
    </div>
  );
}
