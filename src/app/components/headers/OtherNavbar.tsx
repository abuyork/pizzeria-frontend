import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface OtherNavbarProps {
    cartItems: CartItem[];
    onAdd: (item: CartItem) => void;
    onRemove: (item: CartItem) => void;
    onDelete: (item: CartItem) => void;
    onDeleteAll: () => void;
    setLoginOpen:(isopen: boolean) => void;
    handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
    anchorEl: HTMLElement | null;
    handleCloseLogout: () => void;
    handleLogoutRequest: () => void;
}

export default function OtherNavbar(props: OtherNavbarProps) {
    const {cartItems, 
        onAdd, 
        onDelete, 
        onRemove, 
        onDeleteAll, 
        setLoginOpen, 
        handleLogoutClick, 
        anchorEl, 
        handleCloseLogout,
        handleLogoutRequest
    } = props
    const {authMember} = useGlobals(); 


    return (
        <div className="other-navbar">
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
                    <NavLink to={'/'}>Home</NavLink>
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
                <Basket cartItems={cartItems} onAdd={onAdd}  onRemove={onRemove} onDeleteAll={onDeleteAll} onDelete={onDelete}  />
                {!authMember ? (
                    <Box>
                        <Button className="login-button" variant="contained" onClick={() => setLoginOpen(true)}>Login</Button>
                    </Box>
                    ) : (
                      <IconButton
                        onClick={handleLogoutClick}
                        aria-haspopup="true"
                        sx={{ p: 0 }}
                      >
                        <img 
                        className="user-avatar"
                        src={ authMember?.memberImage? `${serverApi}/${authMember.memberImage}`
                        :"/icons/default-user.svg"}
                        alt="User avatar"
                        />
                      </IconButton>
                    )}
                </Stack>
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
                        <Logout fontSize="small" style={{ color: 'blue' }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            </Stack>
        </Container>
    </div>
    )
}