import { UserRole } from "../backend";
import { useGetCallerUserProfile } from "./useGetCallerUserProfile";
import { useInternetIdentity } from "./useInternetIdentity";

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const userRole = userProfile?.role ?? null;
  const needsProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isAuthenticated,
    userProfile,
    userRole,
    profileLoading,
    isFetched,
    needsProfileSetup,
  };
}
