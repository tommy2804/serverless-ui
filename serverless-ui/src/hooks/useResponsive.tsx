import { useTheme, Breakpoint } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type QueryType = "up" | "down" | "between" | "only";

export default function useResponsive(
  query: QueryType,
  key: Breakpoint,
  start?: Breakpoint,
  end?: Breakpoint
): boolean | null {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key));
  const mediaDown = useMediaQuery(theme.breakpoints.down(key));
  const mediaBetween = useMediaQuery(theme.breakpoints.between(start || "xs", end || "xl"));
  const mediaOnly = useMediaQuery(theme.breakpoints.only(key));

  if (query === "up") {
    return mediaUp;
  }

  if (query === "down") {
    return mediaDown;
  }

  if (query === "between") {
    return mediaBetween;
  }

  if (query === "only") {
    return mediaOnly;
  }

  return null;
}
