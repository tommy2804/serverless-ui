import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
  linearProgressClasses,
  styled,
} from '@mui/material';

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#EAECF0',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#E31B54',
  },
}));

export const CustomLinearProgress = (
  props: LinearProgressProps & { value: number; customwidth: string },
) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{ width: props.customwidth, mr: 1 }}>
      <BorderLinearProgress
        variant="determinate"
        sx={{
          height: '0.7rem',
          borderRadius: '12px',
          color: 'success.main',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...props}
      />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">
        {`${Math.round(props.value)}%`}
      </Typography>
    </Box>
  </Box>
);

interface CustomCircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  backgroundColor?: string;
}
export const CustomCircularProgress: React.FC<CustomCircularProgressProps> = ({
  value,
  size = 100,
  strokeWidth = 10,
  progressColor = '#e31b54',
  backgroundColor = '#eaecf0',
}) => {
  // Calculate the progress value as a percentage of the total circumference
  const progress = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="custom-circular-progress-wrapper" style={{ width: size, height: size }}>
      <img src="/izme.svg" alt="logo" />
      <svg className="custom-circular-progress" width={size} height={size}>
        {/* Gray background circle */}
        <circle
          className="circle-background"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={backgroundColor}
        />

        {/* Progress circle */}
        <circle
          className="circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={progressColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
};
