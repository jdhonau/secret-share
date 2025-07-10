export default function Header() {
  return (
    <div className="mb-8">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/EphemeralBanner.png"
          alt="Ephemeral Header"
          style={{ width: '851px', height: '315px', objectFit: 'contain' }}
        />
        {/* <h1 className="text-4xl text-purple-900 font-bold">Secure Secret Sharing</h1> */}
      </div>
    </div>
  );
} 