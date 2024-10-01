import React from "react";
import { useNavigate } from "react-router-dom"; 
import { styled, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from "../../images/Logo.png";
import BasicSelect from "./BasicSelect";
import Tooltip from "@mui/material/Tooltip";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
}));

export default function TopBanner({ userData, onLogout, view, setView }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const navigate = useNavigate(); 

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleHomeClick = () => {
    navigate("/landingPage"); 
  };

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .MuiTooltip-tooltip`]: {
      color: "black",
    },
  }));

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      style={{ marginTop: "18px", marginLeft: "4px" }}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          onLogout();
        }}
      >
        Log out
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleHomeClick}>
        {" "}
        {/* Use handleHomeClick */}
        <IconButton size="large" color="inherit">
          <Badge>
            <HomeIcon />
          </Badge>
        </IconButton>
        <p>Home </p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ width: 1 }}
        style={{ backgroundColor: "#fff" }}
      >
        <Grid container spacing={3} sx={{ padding: "6px" }}>
          <Grid item xs={2} style={{ color: "black", cursor: "pointer" }} onClick={handleHomeClick}>
            <Toolbar>
              <Box
                component="img"
                sx={{
                  height: 60,
                  paddingBottom: 1,
                }}
                alt="Your logo."
                src={Logo}
              />
              <Typography
                variant="h6"
                sx={{ paddingBottom: "8px", textAlign: "center" }}
              >
                Engage
              </Typography>
            </Toolbar>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0, margin: 0, padding: 0 }}>
              <BasicSelect userData={userData} view={view} setView={setView} />
              <Search
                style={{
                  border: "0.25px solid black",
                  width: "80%",
                  color: "black",
                  marginLeft: 0,
                }}
              >
                <SearchIconWrapper style={{ color: "black" }}>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  style={{ color: "black" }}
                />
              </Search>
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "centre",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    sx={{ padding: "4px" }}
                    onClick={handleHomeClick} 
                  >
                    <Badge>
                      <HomeIcon sx={{ fontSize: "30px", color: "#000" }} />
                    </Badge>
                  </IconButton>
                  <Typography variant="caption" sx={{ color: "#000" }}>
                    Home
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    sx={{ padding: "4px" }}
                  >
                    <Badge>
                      <NotificationsIcon
                        sx={{ fontSize: "30px", color: "#000" }}
                      />
                    </Badge>
                  </IconButton>
                  <Typography variant="caption" sx={{ color: "#000" }}>
                    Notifications
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="white"
                    sx={{ padding: "4px" }}
                  >
                    <AccountCircle sx={{ fontSize: "30px", color: "#000" }} />
                  </IconButton>
                  <Typography variant="caption" sx={{ color: "#000" }}>
                    Account
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}