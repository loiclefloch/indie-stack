import { getTheme, ThemeNames } from "~/themes";
import { DEFAULT_THEME } from "~/constants";
import { useContext, useMemo } from "react";
import ClientStyleContext from "~/context/ClientStyleContext";

export default function useTheme() {
	const { themeName: propThemeName } = useContext(ClientStyleContext)

  let themeName: ThemeNames = useMemo(() => {
    return propThemeName || DEFAULT_THEME;
  }, [propThemeName]);

  const theme = getTheme(themeName);

	return theme
}