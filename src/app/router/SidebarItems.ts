export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  permission?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  permission?: string;
}

import { uniqueId } from "lodash";
import { ROUTES } from '@/app/constants/router';
import { PERMISSIONS } from '@/app/constants/permission';

const SidebarContent: MenuItem[] = [
  {
    id: 1,
    name: "Pages",
    items: [
      {
        heading: "Pages",
        children: [
          {
            name: "Sample Page 2",
            icon: "solar:settings-minimalistic-line-duotone",
            id: uniqueId(),
            url: ROUTES.SAMPLE_PAGE,
          }
         
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Master",
    items: [
      {
        heading: "Master",
        children: [
           
          {
            name: "User",
            icon: "solar:home-angle-outline",
            id: uniqueId(),
            url: ROUTES.USERS,
            permission: PERMISSIONS.USER_VIEW,
          },
          {
            name: "Roles",
            icon: "solar:shield-check-line-duotone",
            id: uniqueId(),
            url: ROUTES.ROLES,
            permission: PERMISSIONS.ROLE_VIEW,
          },
          {
            name: "RAG",
            icon: "solar:shield-check-line-duotone",
            id: uniqueId(),
            url: ROUTES.RAG,
            permission: PERMISSIONS.RAG_VIEW,
          },
          {
            name: "Chat",
            icon: "solar:chat-round-dots-line-duotone",
            id: uniqueId(),
            url: ROUTES.CHAT,
            permission: PERMISSIONS.CHAT_VIEW,
          }
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Menu",
    items: [
      {
        heading: "Multi level",
        children: [
          {
            name: "Menu Level",
            icon: "solar:widget-add-line-duotone",
            id: uniqueId(),
            children: [
              {
                id: uniqueId(),
                name: "Level 1",
                url: "",
              },
              {
                id: uniqueId(),
                name: "Level 1.1",
                icon: "fad:armrecording",
                url: "",
                children: [
                  {
                    id: uniqueId(),
                    name: "Level 2",
                    url: "",
                  },
                  {
                    id: uniqueId(),
                    name: "Level 2.1",
                    icon: "fad:armrecording",
                    url: "",
                    children: [
                      {
                        id: uniqueId(),
                        name: "Level 3",
                        url: "",
                      },
                      {
                        id: uniqueId(),
                        name: "Level 3.1",
                        url: "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        heading: "More Options",
        children: [
          {
            id: uniqueId(),
            url: ROUTES.SAMPLE_PAGE,
            name: "Applications",
            icon: "solar:check-circle-bold",
            color: "text-primary",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Form Options",
            icon: "solar:check-circle-bold",
            color: "text-secondary",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Table Variations",
            icon: "solar:check-circle-bold",
            color: "text-info",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Charts Selection",
            icon: "solar:check-circle-bold",
            color: "text-warning",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Widgets",
            icon: "solar:check-circle-bold",
            color: "text-success",
          },
        ],
      },
    ],
  },
];

export default SidebarContent;
