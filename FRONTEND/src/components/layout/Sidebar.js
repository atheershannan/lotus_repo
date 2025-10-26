import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { 
  Dashboard, 
  Chat, 
  School, 
  Psychology, 
  TrendingUp, 
  Person,
  History,
  Analytics
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Chat', icon: <Chat />, path: '/chat' },
    { text: 'Content', icon: <School />, path: '/content' },
    { text: 'Skills', icon: <Psychology />, path: '/skills' },
    { text: 'Progress', icon: <TrendingUp />, path: '/progress' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider'
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Learning Assistant
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleItemClick(item.path)}
            sx={{
              cursor: 'pointer',
              bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
              color: location.pathname === item.path ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                bgcolor: location.pathname === item.path ? 'primary.light' : 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;


