import { Box } from "@mui/system";

interface TabPanelProps {
  children?: React.ReactNode;
  tag: string;
  value: string;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, tag } = props;

  return (
    <div role='tabpanel' id={`simple-tabpanel-${tag}`} aria-labelledby={`simple-tab-${tag}`}>
      {value === tag && (
        <Box sx={{ p: 3, padding: 0 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

export default CustomTabPanel;
