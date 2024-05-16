import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppBar, Box, Button, Drawer, IconButton, List, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLandingPageContext } from "../../context/landing-page-context";
import LanguageSelector from "../../../../components/language-select-menu/language-selector";
import { scrollToSection } from "../../utils/helpers";
import Logo from "../logo";
import "./navbar.scss";
import "../../../../shared/styles/buttons/Buttons-basic.scss";

interface Section {
  ref: React.MutableRefObject<null>;
  id: string;
  text?: string;
  url?: string;
}

interface NavbarProps {
  navItems: Section[];
}

const Navbar = ({ navItems }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWindowScrolled, setIsWindowScrolled] = useState(false);
  const { isNonMobile, activeSection } = useLandingPageContext();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const drawerWidth = 240;

  useEffect(() => {
    const isScroll = window.scrollY > 40;
    if (window.scrollY > 40 !== isWindowScrolled) {
      setIsWindowScrolled(isScroll);
    }
    const handleScroll = () => {
      const isScroll = window.scrollY > 40;
      if (isScroll !== isWindowScrolled) {
        setIsWindowScrolled(isScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isWindowScrolled]);

  const handleDrawerToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: Section
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    scrollToSection(item.ref);
  };

  const navbarLinksRenderer = () => (
    <List component='nav' className='navbar_links_container'>
      {!isNonMobile ? (
        <Button href='/' className='nav-link'>
          {t("home")}
        </Button>
      ) : null}
      {navItems.slice(1).map((item) => (
        <Button
          key={item.url?.replace("#", "")}
          href={item.url}
          className={`nav-link ${activeSection === item.id ? "active" : ""}`}
          onClick={(e) => {
            handleNavItemClick(e, item);
          }}>
          {item.text}
        </Button>
      ))}
    </List>
  );
  const desktopNavbarRenderer = () => (
    <Box className='navbar'>
      {navbarLinksRenderer()}
      <List className='navbar_buttons_container'>
        <Button
          variant='text'
          // href={`https://manage.izme.ai/sign-up?lang=${i18n.language}`}
          className='nav-button black-button'>
          {t("photographers-login")}
        </Button>
        <Button
          variant='text'
          // href={`https://manage.izme.ai?lang=${i18n.language}`}
          className='nav-button'>
          {t("log-in")}
        </Button>
        <Button
          // href={`https://manage.izme.ai/sign-up?lang=${i18n.language}`}
          className='main-button'>
          {t("start-now")}
        </Button>
        <LanguageSelector />
      </List>
    </Box>
  );

  const mobileNavbarRenderer = () => (
    <Drawer
      className='mobile-menu'
      dir={direction}
      variant='temporary'
      anchor={direction === "rtl" ? "right" : "left"}
      open={isMobileMenuOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
          padding: "2rem 1rem",
          right: direction === "rtl" ? "0" : "auto",
          left: direction === "rtl" ? "auto" : "0",
        },
      }}>
      <Logo />
      {navbarLinksRenderer()}
      <List className='navbar_buttons_container'>
        <Button
          variant='text'
          // href={`https://manage.izme.ai/sign-up?lang=${i18n.language}`}
          className='nav-button'>
          {t("photographers-login")}
        </Button>
        <Button
          variant='text'
          // href={`https://manage.izme.ai?lang=${i18n.language}`}
          className='nav-button'>
          {t("log-in")}
        </Button>
        <Button
          // href={`https://manage.izme.ai/sign-up?lang=${i18n.language}`}
          className='nav-button main-button'>
          {t("start-now")}
        </Button>
      </List>
      <LanguageSelector />
    </Drawer>
  );

  return (
    <Box
      sx={{ display: "flex", justifyContent: "flex-end", width: "calc(100vw - (100vw - 100%))" }}>
      <AppBar
        className='header'
        sx={{
          backgroundColor: isWindowScrolled ? "var(--white-color, #FFF)" : "transparent",
          boxShadow: isWindowScrolled ? "0px 4px 34.2px 0px rgba(0, 0, 0, 0.04)" : "none",
          color: "#475467",
          width: "100%",
        }}>
        <Toolbar className='navbar-container' sx={{ padding: "0" }} dir={direction}>
          <Logo />
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, marginRight: "-8px" }}>
            <MenuIcon />
          </IconButton>
          {isNonMobile ? desktopNavbarRenderer() : mobileNavbarRenderer()}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
