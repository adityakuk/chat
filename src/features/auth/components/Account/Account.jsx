import { useTheme } from "@mui/material";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";

import MuiAvatar from "@mui/material/Avatar";
import MuiTypography from "@mui/material/Typography";
import {
  StyledListItemButton,
  StyledListItemIcon,
} from "../../../chat-sidebar/components/ChatSidebar/ChatSidebar";

export default function Account({ open }) {
  const { displayName, photoURL } = useCurrentUser();
  const theme = useTheme();

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
}
