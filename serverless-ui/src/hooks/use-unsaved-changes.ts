import { useState, useEffect } from "react";

const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        // eslint-disable-next-line no-param-reassign
        event.returnValue = "";
      }
    };

    const handleUnload = () => {
      if (hasUnsavedChanges) {
        // Perform any cleanup or notification logic here before closing the tab.
        // For example, you can display a warning message to the user.
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [hasUnsavedChanges]);

  const setUnsavedChanges = (value: boolean): void => {
    setHasUnsavedChanges(value);
  };

  return { hasUnsavedChanges, setUnsavedChanges };
};

export default useUnsavedChanges;
