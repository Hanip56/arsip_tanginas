import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="flex md:hidden fixed top-0 w-[100%] shadow-sm z-50 bg-white px-4 h-[var(--navbar-height)]">
      <MobileSidebar />
    </div>
  );
};

export default Navbar;
