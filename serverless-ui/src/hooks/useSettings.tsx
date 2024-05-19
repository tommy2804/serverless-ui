import { useContext } from "react";
import { SettingsContext } from "../state/SettingsContext";

// ----------------------------------------------------------------------

const useSettings = () => useContext(SettingsContext);

export default useSettings;
