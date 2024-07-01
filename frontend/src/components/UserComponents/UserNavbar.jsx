import React, { useState } from "react";
import {
  Flex,
  Box,
  Input,
  IconButton,
  useBreakpointValue,
  Text,
  Link,
  useDisclosure,
  useToast,
  color,
} from "@chakra-ui/react";
import { FaSearch, FaBars } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../NavBarDrawer";
import { showToast } from "../SignUp";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'))
  

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showSearchBar, setShowSearchBar] = useState(false);
  const toast = useToast();
  const location = useLocation();
  function home() {
    navigate("/home");
  }

  function handleShowSearchBar() {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar && location.pathname === "/home") {
      showToast({
        toast,
        message: `Below is you search Result`,
        color: "green",
      });
    }
  }

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        p={4}
        bg="#f5f5f5"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        position="fixed"
        width="100vw"
        zIndex={12}
        top={0}
      >
        <Flex align="center">
          <Box>
            {/* Logo */}
            {/* <img src={image} alt="Logo" width="30%" /> */}
            <Text
              fontSize={30}
              fontWeight="extrabold"
              color="#f57003"
              _hover={{ cursor: "pointer" }}
              onClick={home}
            >
              ACUMEN VELOCITY
            </Text>
          </Box>
        </Flex>

        {!isMobile ? (
          <Flex align="center">
            <Box>
              {/* Search Bar */}
              <Input
                type="text"
                variant="filled"
                border="1px solid black"
                fontSize="0.7rem"
                m="0 2rem"
                color="black"
                placeholder="What do you want to learn?"
                borderRadius="10px 0 0px 10px"
                _placeholder={{ color: "#555454", letterSpacing: "1px" }}
              />
            </Box>
            <IconButton
              aria-label="Search"
              icon={<FaSearch />}
              bg="#f57003"
              color="white"
              borderRightRadius="7px"
              borderRadius="0px 10px 10px 0px"
              _hover={{ background: "#f74803" }}
            />
          </Flex>
        ) : (
          <Flex align="center">
            <IconButton
              aria-label="Menu"
              icon={<FaBars />}
              bg="transparent"
              color="#f57003"
              fontSize="2xl"
              mr={2}
              onClick={onOpen}
            />
          </Flex>
        )}
        {/* small screen search bar and icon  */}
        {isMobile &&
          location.pathname ===
            "/home" &&(
              <Box>
                {showSearchBar ? (
                  <Flex align="center">
                    <Box>
                      {/* Search Bar */}
                      <Input
                        type="text"
                        variant="filled"
                        border="1px solid black"
                        fontSize="0.8rem"
                        m="0 2rem"
                        color="black"
                        placeholder="Find your new Skiil!"
                        borderRadius="10px 0 0px 10px"
                        _placeholder={{
                          color: "#555454",
                          letterSpacing: "0.5px",
                        }}
                      />
                    </Box>
                    <IconButton
                      aria-label="Search"
                      icon={<FaSearch />}
                      bg="#f57003"
                      onClick={handleShowSearchBar}
                      color="white"
                      borderRightRadius="7px"
                      borderRadius="0px 10px 10px 0px"
                    />
                  </Flex>
                ) : (
                  <IconButton
                    aria-label="Search"
                    icon={<FaSearch />}
                    color="white"
                    borderRadius="7px"
                    bg="#f57003"
                    onClick={handleShowSearchBar}
                    _hover={{ backgroundColor: "#f74803", color: "orange" }}
                  />
                )}
              </Box>
            )}

        {!isMobile && (
          <Flex align="center">
            <Box mr={4}>
              {/* <Link
                _hover={{ color: "#003e9c", textDecoration: "underline" }}
                href="/Teachme"
              >
                {user.role!=='teacher' && user.role!=='admin' && 'Teach On SRM'}            
              </Link> */}
            </Box>
            <Box>
              <Dropdown />
            </Box>
          </Flex>
        )}
      </Flex>
      <NavBarDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;
