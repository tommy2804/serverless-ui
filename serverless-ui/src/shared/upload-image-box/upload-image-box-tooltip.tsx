import React, { ReactNode } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Tooltip } from '@mui/material';

interface UploadImageBoxTooltipProps {
  tooltipContent: ReactNode | string;
}

const UploadImageBoxTooltip = ({ tooltipContent }: UploadImageBoxTooltipProps) => (
  <Tooltip
    classes={{ popper: 'upload-image-tooltip' }}
    title={tooltipContent}
    arrow={true}
    placement="bottom"
    enterTouchDelay={0}
  >
    <HelpOutlineIcon fontSize="small" />
  </Tooltip>
);

export default UploadImageBoxTooltip;
