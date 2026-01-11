import { RouterProvider } from "react-router";

import { Flowbite, ThemeModeScript } from '@/shared/components/theme-ui';
import customTheme from '@/shared/utils/theme/custom-theme';
import router from "@/app/router/Router";

function App() {

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
      <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
