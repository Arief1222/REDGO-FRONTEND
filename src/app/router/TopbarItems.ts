import { uniqueId } from "lodash";
import { ROUTES } from "@/app/constants/router";
import { PERMISSIONS } from "@/app/constants/permission";

interface TopbarChildItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  permission?: string;
  children?: TopbarChildItem[];
}

interface TopbarMenuItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  column: number;
  children: TopbarChildItem[];
}

const Menuitems: TopbarMenuItem[] = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: "solar:layers-line-duotone",
    href: "",
    column:1,
    children: [
      {
        id: uniqueId(),
        title: "Sample Page 1",
        icon: "solar:home-angle-outline",
        href: ROUTES.ROOT,
      },
      {
        id: uniqueId(),
        title: "Sample Page 2",
        icon: "solar:settings-minimalistic-line-duotone",
        href: ROUTES.SAMPLE_PAGE,
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Master",
    icon: "solar:database-line-duotone",
    href: "",
    column: 1,
    children: [
      {
        id: uniqueId(),
        title: "User",
        icon: "solar:user-rounded-outline",
        href: ROUTES.USERS,
        permission: PERMISSIONS.USER_VIEW,
      },

    ],
  },

];
export default Menuitems;
