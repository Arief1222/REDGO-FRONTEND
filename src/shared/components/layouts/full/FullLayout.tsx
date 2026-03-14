import { FC, useContext } from 'react';
import { Outlet } from "react-router";
import { Customizer } from './shared/customizer/Customizer';
import { CustomizerContext } from '@/app/providers/CustomizerProvider';
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';
import ScrollToTop from 'src/shared/components/theme-ui/ScrollToTop';
import { useAuth } from '@/app/auth';

const FullLayout: FC = () => {
  const { activeLayout, isLayout } = useContext(CustomizerContext);
  const { user } = useAuth();

  const isAdmin = user?.role?.name?.toLowerCase() !== 'user';

  // ← Role user: render outlet langsung, fullscreen
  if (!isAdmin) {
    return (
      <div className="w-full h-screen">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen dark:bg-darkgray">
      <div className="page-wrapper flex w-full">
        {activeLayout === "vertical" && <Sidebar />}
        <div className="page-wrapper-sub flex flex-col w-full dark:bg-darkgray">
          {activeLayout === "horizontal"
            ? <Header layoutType="horizontal" />
            : <Header layoutType="vertical" />
          }
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
            <Customizer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullLayout;