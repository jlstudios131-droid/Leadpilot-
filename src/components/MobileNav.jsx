import clsx from 'clsx';

export default function MobileNav({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  if (!isMobileMenuOpen) {
    return null;
  }
  
  return (
    <div
      className={clsx(
        "fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setIsMobileMenuOpen(false)}
      aria-hidden={!isMobileMenuOpen}
    />
  );
}
