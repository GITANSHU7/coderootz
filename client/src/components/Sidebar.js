import { LockOpen } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Drawer } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useThemeMode } from 'flowbite-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const { toggleMode, mode } = useThemeMode();
    const [open, setOpen] = React.useState(false);
    const store = JSON.parse(localStorage.getItem("userData") || "{}");
    const userRole = store?.data?.user?.role;

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    console.log('userRole', userRole);

    const onLogout = async () => {
        const store = JSON.parse(localStorage.getItem("userData") || "{}");
    
        try {
          const apiToken = store?.data?.token;
    
          if (!apiToken) {
            throw new Error("Missing authorization token"); // Throw error if no token
          }
    
          const response = await axios.post("http://localhost:8000/auth/signout", null, {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          });
          // on sucessful logout, remove the user data from local storage
          localStorage.removeItem("userData");
          window.location.href = "/signin";
        } catch (error) {
          
          console.error(error.message || "Error fetching user details"); // Handle errors
        }
      };

      
 
    
    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {userRole?.menus?.map((menu, index) => (
                    <ListItem key={index}>
                        <ListItemButton component={Link} to={`/${menu.toLowerCase().replace(/\s+/g, '-')}`}>
                            <ListItemIcon>
                                <ArrowForwardIosIcon />
                            </ListItemIcon>
                            <ListItemText primary={menu} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
      <List>
       
          <ListItem disablePadding>
            <ListItemButton  onClick={onLogout} >
              <ListItemIcon>
                <LockOpen />
              </ListItemIcon>
              <ListItemText> Logout </ListItemText>
            </ListItemButton>
          </ListItem>
       
      </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                    </Drawer>
                    <Link to='/dashboard' style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                            Coderootz
                        </Typography>
                    </Link>
                    <span className='cursor-pointer' onClick={toggleMode}>
                        {mode === 'light' ? <DarkModeIcon /> : <WbSunnyIcon />}
                    </span>
                    <span className='ml-2'>{store?.data?.user?.email}</span>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
