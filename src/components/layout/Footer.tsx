export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        background: 'linear-gradient(to right, #220132, #001413, #230e01, #191700)',
      }}
    >
      <div className="w-full border-t border-white/10 px-5 py-6 text-white lg:px-28 lg:py-9">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center text-xl md:text-left lg:text-2xl">SuiFest Card Generator App</div>
          <div className="flex items-center justify-center text-lg lg:text-2xl">
            <img src="/logo-sui.png" alt="logo Suifest" className="h-7" />
            <div className="mx-1 h-6 w-px bg-white sm:mx-2" aria-hidden="true" />
            <img src="/logo-walrus.png" alt="logo Sui" className="h-7" />
          </div>
        </div>
      </div>
    </footer>
  );
}
