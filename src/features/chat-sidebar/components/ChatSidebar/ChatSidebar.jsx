import React, { useEffect, useState } from "react";
import { styled, useMediaQuery, useTheme } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiList from "@mui/material/List";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiTypography from "@mui/material/Typography";
import MuiAvatar from "@mui/material/Avatar";
import Account from "../../../auth/components/Account";

const Drawer = styled(MuiDrawer)(({ open, theme }) => {
  const openDrawerWidth = theme.spacing(28);
  const closedDrawerWidth = theme.spacing(6);

  return {
    width: open ? openDrawerWidth : closedDrawerWidth,
    [theme.breakpoints.down("sm")]: {
      width: closedDrawerWidth,
    },
    "& .MuiPaper-root": {
      border: "none",
      backgroundColor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    "& .MuiDrawer-paper": {
      transition: theme.transitions.create(["width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      ...(open && {
        width: openDrawerWidth,
        [theme.breakpoints.down("sm")]: {
          boxShadow: theme.shadows[5],
        },
      }),
      ...(!open && {
        width: closedDrawerWidth,
      }),
      overflowX: "hidden",
    },
  };
});

export const StyledListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  "&.MuiListItemButton-root": {
    padding: theme.spacing(1),
  },
  "&.MuiListItemButton-root:hover": {
    backgroundColor: theme.palette.action.hover,
    transition: theme.transitions.create(["color"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

export const StyledListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({}));

export default function ChatSidebar({ users = [] }) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isLargeScreen);
  }, [isLargeScreen]);

  return (
    <Drawer
      open={open}
      variant="permanent"
      onMouseEnter={() => {
        if (!isLargeScreen) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!isLargeScreen) setOpen(false);
      }}
    >
      <MuiList disablePadding>
        <Account open={open} />
        {users.map(({ displayName, photoURL }) => {
          return (
            <StyledListItemButton disableRipple disableGutters dense>
              <StyledListItemIcon>
                <MuiAvatar
                  sx={{ height: theme.spacing(4), width: theme.spacing(4) }}
                  src={photoURL}
                />
              </StyledListItemIcon>
              <MuiTypography
                sx={{
                  flexGrow: 1,
                  opacity: open ? 1 : 0,
                  transition: theme.transitions.create(["opacity"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                  fontWeight: theme.typography.fontWeightMedium,
                  backgroundColor: "transparent",
                }}
                variant="body2"
              >
                {displayName}
              </MuiTypography>
              {/* <StyledListItemIcon>{indicatorIcon}</StyledListItemIcon> */}
            </StyledListItemButton>
          );
        })}
      </MuiList>
    </Drawer>
  );
}
