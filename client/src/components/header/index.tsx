import { useState, ChangeEvent, KeyboardEvent } from "react";
import { QuestionsPageQueryFuntionType } from "../../types/functionTypes";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  Box,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// Update the type definition
interface HeaderProps {
  search: string;
  setQuestionPage: QuestionsPageQueryFuntionType;
  onSignUpClick?: () => void;
  onLoginClick?: () => void;
  onMyProfileClick?: () => void;
}

// Styled search component
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  border: `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
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
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

/**
 * The header component for the Fake Stack Overflow application.
 * It is composed of a title and a search bar.
 * When the user types in the search bar and presses Enter, the page is set to display the search results.
 * @param param0 with the search string and the function to set the page to display the search results
 * @returns the header component
 */
const Header = ({
  search,
  setQuestionPage,
  onSignUpClick,
  onLoginClick,
  onMyProfileClick,
}: HeaderProps) => {
  const [val, setVal] = useState<string>(search);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuestionPage(e.currentTarget.value, "Search Results");
    }
  };

  const handleSignUp = () => {
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      console.log("Sign Up clicked, but no handler provided");
    }
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      console.log("Log In clicked, but no handler provided");
    }
  };

  const handleMyProfile = () => {
    if (onMyProfileClick) {
      onMyProfileClick();
    } else {
      console.log("My Profile clicked, but no handler provided");
    }
  };

  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: isMobile ? 0 : 1,
            }}
          >
            Fake Stack Overflow
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              id="searchBar"
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              value={val}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </Search>

          <Box sx={{ flexGrow: 0, ml: 2 }}>
            {isMobile ? (
              // Mobile view - show icons only
              <Stack direction="row" spacing={1}>
                <IconButton
                  id="signUpButton"
                  color="inherit"
                  onClick={handleSignUp}
                >
                  <PersonAddIcon />
                </IconButton>
                <IconButton
                  id="loginButton"
                  color="inherit"
                  onClick={handleLogin}
                >
                  <LoginIcon />
                </IconButton>
                <IconButton
                  id="myProfileButton"
                  color="inherit"
                  onClick={handleMyProfile}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Stack>
            ) : (
              // Desktop view - show buttons with text
              <Stack direction="row" spacing={1}>
                <Button
                  id="signUpButton"
                  color="inherit"
                  startIcon={<PersonAddIcon />}
                  onClick={handleSignUp}
                  variant="outlined"
                  sx={{ borderColor: "rgba(255,255,255,0.5)" }}
                >
                  Sign Up
                </Button>
                <Button
                  id="loginButton"
                  color="inherit"
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  variant="outlined"
                  sx={{ borderColor: "rgba(255,255,255,0.5)" }}
                >
                  Log In
                </Button>
                <Button
                  id="myProfileButton"
                  color="inherit"
                  startIcon={<AccountCircleIcon />}
                  onClick={handleMyProfile}
                  variant="outlined"
                  sx={{ borderColor: "rgba(255,255,255,0.5)" }}
                >
                  My Profile
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
