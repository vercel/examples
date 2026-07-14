import { usePathname } from "next/navigation";

/**
 * Function checks if the current route is active
 * @param {string} pathToCheck - path to check
 * @returns {boolean} - true if the current route is active not flase
 */
function useIsRouteActive(pathToCheck: string) {
  const pathname = usePathname();
  const currentPath = pathname.split("?")[0]; // drop query params

  // currentPath and pathToCheck are the same (e.g. /blog)
  if (currentPath === pathToCheck) return true;

  // currentPath is included pathToCheck (e.g. /blog/1 is included in /blog)
  if (currentPath.includes(pathToCheck)) return true;

  return false;
}

export default useIsRouteActive;
