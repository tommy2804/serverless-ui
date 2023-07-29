import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  ListItemButton,
} from '@mui/material';
import {
  InsertChartOutlined,
  AccountCircle,
  LayersOutlined,
  PieChartOutlineOutlined,
  PeopleAltOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import GenericNavItem from './genericNavItem';
import { signOut } from '../../api/auth';
import './styles.scss';
import { User } from '../../types/user';

interface SideBarProps {
  user: User | null;
}

const Sidebar: React.FC<SideBarProps> = ({ user }) => {
  const onSignOut = () => {
    signOut();
    localStorage.removeItem('userToken');
    window.location.href = '/auth';
  };
  const navArrayTop = [
    {
      link: '/',
      style: { padding: 0, width: '100%', color: 'white' },
      text: 'Home',
      icon: HomeOutlined,
    },
    {
      link: '/',
      style: { padding: 0, width: '100%', color: 'white' },
      text: 'Dashboard',
      icon: InsertChartOutlined,
    },
    {
      link: '/',
      style: { padding: 0, width: '100%', color: 'white' },
      text: 'Events',
      icon: LayersOutlined,
    },
    {
      link: '/',
      style: { padding: 0, width: '100%', color: 'white' },
      text: 'Reporting',
      icon: PieChartOutlineOutlined,
    },
    {
      link: '/',
      style: { padding: 0, width: '100%', color: 'white' },
      text: 'Users',
      icon: PeopleAltOutlined,
    },
  ];

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          width: 250,
          height: '100vh',
          backgroundColor: '#2762f2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px',
        }}>
        <Box>
          <List className="list" component="nav" aria-label="sidebar options">
            {navArrayTop.map((item, index) => (
              <GenericNavItem
                key={index}
                link={item.link}
                style={item.style}
                text={item.text}
                icon={item.icon}
              />
            ))}
          </List>
        </Box>
        <Box>
          <Divider />

          {/* Account option */}

          <List className="account-footer" component="nav" aria-label="account option">
            <ListItem style={{ padding: 0, width: 210 }}>
              <ListItemButton className="account">
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText className="profile" secondary={user?.email} />
              </ListItemButton>
            </ListItem>
            <ListItem
              // className="sign-out-item"
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                width: 20,
                height: 20,
                paddingLeft: 0,

                top: 20,
              }}>
              <ListItemButton onClick={onSignOut}>
                <ListItemIcon className="logOut">
                  <LogoutOutlined />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
