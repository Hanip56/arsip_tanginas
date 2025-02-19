import NavMenu from "./nav-menu";

const Sidebar = () => {
  return (
    <>
      <div className="hidden md:flex fixed h-screen top-0 left-0 w-[var(--sidebar-width)] py-4 bg-white border-r">
        <NavMenu />
      </div>
    </>
  );
};

export default Sidebar;
