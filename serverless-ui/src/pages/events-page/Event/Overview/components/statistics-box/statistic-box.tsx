import { Tooltip } from '@mui/material';
import { Box } from '@mui/system';

interface StatisticBoxProps {
  icon: React.ReactNode;
  statisticData: string;
  text: string;
  tooltip: string;
}

const StatisticBox = ({ statisticData, icon, text, tooltip }: StatisticBoxProps) => (
  <Tooltip title={tooltip}>
    <Box className="box-wrapper">
      {icon}
      <div className="box-details">
        <span>{text}</span>
        <span className="bold">{statisticData}</span>
      </div>
    </Box>
  </Tooltip>
);

export default StatisticBox;
