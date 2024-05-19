import { createContext, useEffect, ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import getColorPresets, { ColorPreset, colorPresets } from "../utils/getColorPresets";
import { defaultSettings } from "../config";

// Define the type for the settings state
interface SettingsState {
  themeMode: string;
  themeLayout: string;
  themeStretch: boolean;
  themeContrast: string;
  themeDirection: string;
  themeColorPresets: string;
}

// Define the type for the context
interface SettingsContextType extends SettingsState {
  onToggleMode: () => void;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleDirection: () => void;
  onChangeDirection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDirectionByLang: (lang: string) => void;
  onToggleLayout: () => void;
  onChangeLayout: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleContrast: () => void;
  onChangeContrast: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleStretch: () => void;
  onResetSetting: () => void;
  setColor: ColorPreset;
  colorOption: { name: string; value: string }[];
}

// Create the context
const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

interface SettingsProviderProps {
  children: ReactNode;
}

// Define the component
const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // Retrieve settings from local storage
  const [settings, setSettings] = useLocalStorage<SettingsState>("settings", defaultSettings);

  // Detect language change
  const isArabic = localStorage.getItem("i18nextLng") === "ar";

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang("ar");
    }
  }, [isArabic]);

  // Mode
  const onToggleMode = () => {
    setSettings({ ...settings, themeMode: settings.themeMode === "light" ? "dark" : "light" });
  };

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, themeMode: event.target.value });
  };

  // Direction
  const onToggleDirection = () => {
    setSettings({ ...settings, themeDirection: settings.themeDirection === "rtl" ? "ltr" : "rtl" });
  };

  const onChangeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, themeDirection: event.target.value });
  };

  const onChangeDirectionByLang = (lang: string) => {
    setSettings({ ...settings, themeDirection: lang === "ar" ? "rtl" : "ltr" });
  };

  // Layout
  const onToggleLayout = () => {
    setSettings({
      ...settings,
      themeLayout: settings.themeLayout === "vertical" ? "horizontal" : "vertical",
    });
  };

  const onChangeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, themeLayout: event.target.value });
  };

  // Contrast
  const onToggleContrast = () => {
    setSettings({
      ...settings,
      themeContrast: settings.themeContrast === "default" ? "bold" : "default",
    });
  };

  const onChangeContrast = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, themeContrast: event.target.value });
  };

  // Color
  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, themeColorPresets: event.target.value });
  };

  // Stretch
  const onToggleStretch = () => {
    setSettings({ ...settings, themeStretch: !settings.themeStretch });
  };

  // Reset
  const onResetSetting = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onToggleMode,
        onChangeMode,
        onToggleDirection,
        onChangeDirection,
        onChangeDirectionByLang,
        onToggleLayout,
        onChangeLayout,
        onToggleContrast,
        onChangeContrast,
        onChangeColor,
        onToggleStretch,
        onResetSetting,
        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
