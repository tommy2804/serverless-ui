import { Fragment } from 'react';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface NoPermissionsTooltipProps {
  children: any;
  isDisabled: boolean;
  shouldWrapSpan?: boolean;
}

export default ({ children, isDisabled, shouldWrapSpan }: NoPermissionsTooltipProps) => {
  const { t } = useTranslation();
  const Wrapper = isDisabled
    ? shouldWrapSpan
      ? ({ children }: any) => (
          <Tooltip title={t('no-permissions')}>
            <span>{children}</span>
          </Tooltip>
        )
      : ({ children }: any) => <Tooltip title={t('no-permissions')}>{children}</Tooltip>
    : Fragment;

  return <Wrapper>{children}</Wrapper>;
};
