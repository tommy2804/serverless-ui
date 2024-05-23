import { createTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const useGenericEventTheme = () => {
  const { i18n } = useTranslation();

  const theme = createTheme({
    direction: i18n.dir(),
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            background: 'transparent',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            textTransform: 'capitalize',
          },
        },
      },
    },
  });

  return theme;
};

export default useGenericEventTheme;
