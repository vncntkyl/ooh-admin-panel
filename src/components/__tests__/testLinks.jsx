import { HiUsers, HiViewGrid } from "react-icons/hi";
import { FaUserGear } from "react-icons/fa6";
import { DiGoogleAnalytics } from "react-icons/di";
import { CgWebsite } from "react-icons/cg";
export const testLinks = {
  "": [
    {
      title: "dashboard",
      link: "",
      icon: HiViewGrid,
    },
  ],
  sites_management: [
    {
      title: "sites",
      link: "/sites",
      icon: CgWebsite,
    },
    {
      title: "analytics",
      link: "/analytics",
      icon: DiGoogleAnalytics,
    },
  ],
  system: [
    {
      title: "users",
      link: "/users",
      icon: HiUsers,
    },
    {
      title: "roles",
      link: "/roles",
      icon: FaUserGear,
    },
  ],
};
