import { SvgIconComponent } from "@mui/icons-material";
import { Icon, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

interface NavItemProps {
  link: string;
  style: React.CSSProperties;
  text: string;
  icon: SvgIconComponent;
}

export default function GenericNavItem(props: NavItemProps) {
  const { link, style, text, icon } = props;

  return (
    <ListItem style={style} button component={Link} to={link}>
      <ListItemIcon>
        <Icon component={icon} />
      </ListItemIcon>

      <ListItemText primary={text} />
    </ListItem>
  );
}
