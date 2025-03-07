import NavMenu from "./nav-menu";

const Sidebar = () => {
  return (
    <>
      <div className="hidden md:flex fixed h-screen top-0 left-0 w-[var(--sidebar-width)] py-4 border-r bg-main-2 text-white">
        <NavMenu />
      </div>
    </>
  );
};

export default Sidebar;
