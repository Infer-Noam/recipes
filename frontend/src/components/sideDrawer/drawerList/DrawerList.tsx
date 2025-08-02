import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { type FC } from "react";
import { drawerListItems } from "./drawerListItem/drawerListItems.const";
import Styles from "./drawerList.style";
import { useNavigate, useLocation } from "react-router-dom";

type DrawerListProps = {
  handleMobileDrawerClose?: () => void;
};

export const DrawerList: FC<DrawerListProps> = ({
  handleMobileDrawerClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box role="presentation">
      <List>
        {drawerListItems.map(({ name, path, icon: ItemIcon }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              sx={Styles.listItem}
              onClick={() => {
                handleMobileDrawerClose?.();
                navigate(path);
              }}
              selected={location.pathname === path}
            >
              <ListItemIcon>
                <ItemIcon />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
