import { type FC, useContext, useMemo } from "react";
import { AppBar, IconButton, Toolbar, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { getColorModeIcon } from "../../theme/colorMode.enum";
import Styles from "./appHeader.style";
import { ColorModeContext } from "../../contexts/ColorMode.context";
import logoSrc from "../../assets/logo.svg";

type AppHeaderProps = {
  handleMobileDrawerOpen: () => void;
};

const AppHeader: FC<AppHeaderProps> = ({
  handleMobileDrawerOpen,
}: AppHeaderProps) => {
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);
  const ColorModeIcon = useMemo(
    () => () => getColorModeIcon(colorMode),
    [colorMode]
  );

  return (
    <AppBar sx={Styles.appHeader}>
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleMobileDrawerOpen}
          sx={Styles.menuIconButton}
        >
          <MenuIcon />
        </IconButton>
        <Box component="img" src={logoSrc} alt="App Logo" sx={Styles.logo} />
        <Typography sx={Styles.typography} variant="h6" noWrap component="div">
          Recipes
        </Typography>
        <Box sx={Styles.spacer} />
        <IconButton sx={Styles.toggleColorIconButton} onClick={toggleColorMode}>
          <ColorModeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
