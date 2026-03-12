import { FC, useContext } from 'react';
import { Outlet } from "react-router";
import { Customizer } from './shared/customizer/Customizer';
import { CustomizerContext } from '@/app/providers/CustomizerProvider';
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';
import ScrollToTop from 'src/shared/components/theme-ui/ScrollToTop';
import { useAuth } from '@/app/auth';
import { PERMISSIONS } from '@/app/constants/permission';

const FullLayout: FC = () => {
  const { activeLayout, isLayout } = useContext(CustomizerContext);
  const { user } = useAuth();

  // Check if user is admin (has at least one admin permission)
  const isAdmin = user?.role?.permissions?.some((p: string) =>
    Object.values(PERMISSIONS).includes(p as any)
  ) ?? false;

  return (
    <div className="flex w-full min-h-screen dark:bg-darkgray">
      <div className="page-wrapper flex w-full">

        {/* Sidebar — only for admin */}
        {isAdmin && activeLayout === "vertical" && <Sidebar />}

        <div className="page-wrapper-sub flex flex-col w-full dark:bg-darkgray">

          {/* Header — only for admin */}
          {isAdmin && (
            activeLayout === "horizontal"
              ? <Header layoutType="horizontal" />
              : <Header layoutType="vertical" />
          )}

          <div className={`bg-lightgray dark:bg-dark h-full ${
            activeLayout !== "horizontal" ? "rounded-bb" : "rounded-none"
          }`}>
            <div className={`${
              isLayout === "full" ? "" : "container mx-auto py-30"
            } ${activeLayout === "horizontal" ? "xl:mt-3" : ""}`}>
              <ScrollToTop>
                <Outlet />
              </ScrollToTop>
            </div>

            {/* Customizer — only for admin */}
            {isAdmin && <Customizer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullLayout;