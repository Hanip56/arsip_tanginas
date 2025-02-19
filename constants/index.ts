import { IconType } from "react-icons/lib";
import { RiDashboardLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";

type NavType = {
  label: string;
  href: string;
  icon: IconType;
};

type NavListType = {
  type: "subtitle" | "single" | "multiple";
  label?: string;
  subtitle?: string;
  href?: string;
  icon?: IconType;
  sub?: NavType[];
};

export const navigations: NavListType[] = [
  {
    type: "subtitle",
    subtitle: "Workspace",
  },
  {
    type: "single",
    label: "Dashboard",
    href: "/",
    icon: RiDashboardLine,
  },
  {
    type: "single",
    label: "Kategori",
    href: "/kategori",
    icon: MdOutlineCategory,
  },
  {
    type: "single",
    label: "Proyek",
    href: "/proyek",
    icon: PiBuildingOffice,
  },
];
