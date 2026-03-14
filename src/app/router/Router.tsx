import { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import Loadable from '@/shared/components/layouts/full/shared/loadable/Loadable';
import { AuthGuard } from '@/app/guards/AuthGuard';
import { GuestGuard } from '@/app/guards/GuestGuard';
import { AdminGuard } from '@/app/guards/AdminGuard';
import { PermissionGuard } from '@/app/guards/PermissionGuard';
import { PERMISSIONS } from '@/app/constants/permission';
import { ROUTES } from '../constants';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('@/shared/components/layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('@/shared/components/layouts/blank/BlankLayout')));

// authentication
const Login = Loadable(lazy(() => import('@/features/auth/LoginPage')));
const Login2 = Loadable(lazy(() => import('@/features/auth/Login2Page')));
const Register = Loadable(lazy(() => import('@/features/auth/RegisterPage')));
const Register2 = Loadable(lazy(() => import('@/features/auth/Register2Page')));
const ForgotPassword = Loadable(lazy(() => import('@/features/auth/ForgotPasswordPage')));
const ForgotPassword2 = Loadable(lazy(() => import('@/features/auth/ForgotPassword2Page')));
const ResetPassword = Loadable(lazy(() => import('@/features/auth/ResetPasswordPage')));
const VerifyEmail = Loadable(lazy(() => import('@/features/auth/VerifyEmailPage')));
const TwoSteps = Loadable(lazy(() => import('@/features/auth/TwoStepsPage')));
const TwoSteps2 = Loadable(lazy(() => import('@/features/auth/TwoSteps2Page')));
const Maintainance = Loadable(lazy(() => import('@/features/auth/MaintainancePage')));
const PrivacyPage = Loadable(lazy(() => import('@/features/auth/PrivacyPage')));
const TosPage = Loadable(lazy(() => import('@/features/auth/TosPage')));
const OAuthCallback = Loadable(lazy(() => import('@/features/auth/OAuthCallBackPage')));

const SamplePage = Loadable(lazy(() => import('@/features/sample-page/pages/SamplePage')));
const UserPage = Loadable(lazy(() => import('@/features/user/UserPage')));
const RolePage = Loadable(lazy(() => import('@/features/role/RolePage')));
const RagPage = Loadable(lazy(() => import('@/features/rag/RagPage')));
const ChatPage = Loadable(lazy(() => import('@/features/chat/ChatPage')));
const PromptPage = Loadable(lazy(() => import('@/features/prompts/PromptPage')));

// Error pages
const ForbiddenPage = Loadable(lazy(() => import('@/features/errors/403Page')));
const NotFoundPage = Loadable(lazy(() => import('@/features/errors/404Page')));

const Router = [
  // Error pages
  {
    path: ROUTES.ERROR.FORBIDDEN,
    element: <BlankLayout />,
    children: [{ path: '', element: <ForbiddenPage /> }],
  },
  {
    path: ROUTES.ERROR.NOT_FOUND,
    element: <BlankLayout />,
    children: [{ path: '', element: <NotFoundPage /> }],
  },

  // Public pages
  {
    path: ROUTES.AUTH.PRIVACY,
    element: <BlankLayout />,
    children: [{ path: '', element: <PrivacyPage /> }],
  },
  {
    path: ROUTES.AUTH.TOS,
    element: <BlankLayout />,
    children: [{ path: '', element: <TosPage /> }],
  },

  // Guest routes
  {
    path: ROUTES.ROOT,
    element: <GuestGuard><BlankLayout /></GuestGuard>,
    children: [
      { path: ROUTES.AUTH.LOGIN_1, element: <Login /> },
      { path: ROUTES.AUTH.LOGIN_2, element: <Login2 /> },
      { path: ROUTES.AUTH.REGISTER_1, element: <Register /> },
      { path: ROUTES.AUTH.REGISTER_2, element: <Register2 /> },
      { path: ROUTES.AUTH.FORGOT_PASSWORD_1, element: <ForgotPassword /> },
      { path: ROUTES.AUTH.FORGOT_PASSWORD_2, element: <ForgotPassword2 /> },
      { path: ROUTES.AUTH.RESET_PASSWORD_1, element: <ResetPassword /> },
      { path: ROUTES.AUTH.VERIFY_EMAIL, element: <VerifyEmail /> },
      { path: ROUTES.AUTH.TWO_STEPS_1, element: <TwoSteps /> },
      { path: ROUTES.AUTH.TWO_STEPS_2, element: <TwoSteps2 /> },
      { path: ROUTES.AUTH.MAINTENANCE, element: <Maintainance /> },
      { path: ROUTES.AUTH.OAUTH_CALLBACK, element: <OAuthCallback /> },
    ],
  },


// ← Chat route untuk USER: standalone tanpa FullLayout


// Admin/dashboard routes: dengan FullLayout
{
  path: ROUTES.ROOT,
  element: (
    <AuthGuard>
      <AdminGuard>
        <FullLayout />
      </AdminGuard>
    </AuthGuard>
  ),
  children: [
    { index: true, element: <SamplePage /> },
    { path: 'sample-page', element: <SamplePage /> },
    {
      path: 'chat', // ← chat untuk admin ada di sini (dengan FullLayout)
      element: <PermissionGuard permission={PERMISSIONS.CHAT_VIEW}><ChatPage /></PermissionGuard>
    },
    {
      path: 'users',
      element: <PermissionGuard permission={PERMISSIONS.USER_VIEW}><UserPage /></PermissionGuard>
    },
    {
      path: 'roles',
      element: <PermissionGuard permission={PERMISSIONS.ROLE_VIEW}><RolePage /></PermissionGuard>
    },
    {
      path: 'rag',
      element: <PermissionGuard permission={PERMISSIONS.RAG_VIEW}><RagPage /></PermissionGuard>
    },
    {
      path: 'prompts',
      element: <PermissionGuard permission={PERMISSIONS.PROMPT_VIEW}><PromptPage /></PermissionGuard>
    },
  ],
},

  // Fallback
  {
    path: '*',
    element: <Navigate to={ROUTES.ERROR.NOT_FOUND} replace />,
  },
];

const router = createBrowserRouter(Router);
export default router;