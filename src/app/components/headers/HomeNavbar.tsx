import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface HomeNavbarProps {
    cartItems: CartItem[];
    onAdd: (item: CartItem) => void;
    onRemove: (item: CartItem) => void;
    onDelete: (item: CartItem) => void;
    onDeleteAll: () => void;
    setSignupOpen:(isopen: boolean) => void;
    setLoginOpen:(isopen: boolean) => void;
    handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
    anchorEl: HTMLElement | null;
    handleCloseLogout: () => void;
    handleLogoutRequest: () => void;
}


export default function HomeNavbar(props: HomeNavbarProps) {
    const {cartItems,
        onAdd, 
        onDelete, 
        onRemove, 
        onDeleteAll,
        setSignupOpen, 
        setLoginOpen, 
        handleLogoutClick, 
        anchorEl, 
        handleCloseLogout,
        handleLogoutRequest} = props
    const {authMember} = useGlobals(); 
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            // Start fading at 50px and complete by 300px
            const scrollRange = 250;
            const startFade = 50;
            const currentScroll = window.scrollY;
            
            if (currentScroll <= startFade) {
                setOpacity(1);
            } else if (currentScroll >= startFade + scrollRange) {
                setOpacity(0);
            } else {
                const fadeProgress = (currentScroll - startFade) / scrollRange;
                setOpacity(1 - fadeProgress);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /** Handlers */
   

    return (
    <div className="home-navbar">
        <Container className="navbar-container">
            <Stack className="menu">
                <Box>
                    <NavLink to={'/'}>
                        <div className="brand-logo" style={{ 
                            fontFamily: 'Pacifico, cursive', 
                            fontWeight: 'bold', 
                            fontSize: '30px', 
                            color: '#f8f8ff',
                            background: 'linear-gradient(45deg, #d7b668, #f8f8ff)',
                            WebkitBackgroundClip: 'text',
                        }}>
                            Pizzeria
                        </div>
                    </NavLink>
                </Box>

                <Stack className="links">

                <Box className={"hover-line"}>
                    <NavLink to={'/'} activeClassName="underline">Home</NavLink>
                </Box>
                <Box className={"hover-line"}>
                    <NavLink to={'/products'} activeClassName="underline">Products</NavLink>
                </Box>
                {authMember ? (
                <Box className={"hover-line"}>
                    <NavLink to={'/orders'} activeClassName="underline">Orders</NavLink>
                </Box>
                ) : null}
                {authMember ? (
                <Box className={"hover-line"}>
                    <NavLink to={'/member-page'} activeClassName="underline">My Page</NavLink>
                </Box>
                ) : null}
                <Box className={"hover-line"}>
                    <NavLink to={'/cal-ai'} activeClassName="underline">Cal AI</NavLink>
                </Box>
                {/* BASKET */}
                <Basket  cartItems={cartItems} onAdd={onAdd}  onRemove={onRemove} onDeleteAll={onDeleteAll} onDelete={onDelete}  />
                {!authMember ? (
                    <Box>
                        <Button className="login-button" variant="contained" onClick={()=> setLoginOpen(true)}>Login</Button>
                    </Box>
                    ) : (
                    <img 
                    className="user-avatar"
                    src={ authMember?.memberImage? `${serverApi}/${authMember.memberImage}`
                        :"/icons/default-user.svg"}
                    aria-haspopup={"true"}
                    onClick={handleLogoutClick}
                    
                    />
                    )}

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleCloseLogout}
                onClick={handleCloseLogout}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleLogoutRequest}>
                    <ListItemIcon>
                        <Logout fontSize="small" style={{ color: '#d7722c' }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

                </Stack>
            </Stack>
            <Stack className={"header-frame"}>
                <Stack className={"detail"} style={{ opacity }}>
                    <Box className={"head-main-text"}>
                        World's Greatest Pizza Experience
                    </Box>
                    <Box className={"wel-txt"}>
                        Authentic Italian Flavors
                    </Box>
                    <Box className={"service-text-container"}>
                        <div className={"service-text"}>
                            Order Online 24/7
                        </div>
                    </Box>
                    <Box className={"signup"}>
                        {!authMember ? (
                            <Button 
                            variant={"contained"} 
                            className={"signup-button"} onClick={()=> setSignupOpen(true)}>
                                SIGN UP
                            </Button>
                            ) : null}
                    </Box>
                </Stack>
            </Stack>
        </Container>
    </div>
    );
}