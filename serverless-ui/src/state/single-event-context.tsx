import { createContext, useContext } from "react";
import { GetSingleEventDTO } from "../types/event-dto";

export const SingleEventContext = createContext<GetSingleEventDTO | undefined>(undefined);

export const useSingleEventContext = () => {
  const context = useContext<GetSingleEventDTO | undefined>(SingleEventContext);
  if (!context?.id) throw new Error("Please make sure that the provider is wrapped");
  return context;
};
