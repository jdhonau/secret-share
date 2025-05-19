export default function Header() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-6 max-w-2xl">
        <img
          src="/squareJD.ico"
          alt="Secret Share Logo"
          className="w-32 h-32"
          style={{ objectFit: 'contain' }}
        />
        <h1 className="text-4xl text-purple-900 font-bold">Secure Secret Sharing</h1>
      </div>
    </div>
  );
} 