import { Suspense } from "react";
import CircularLoading from "../loading/circular";

interface SuspensorProps {
  children: any;
}

const Suspensor = ({ children }: SuspensorProps) => (
  <Suspense
    fallback={
      <div className='container'>
        <CircularLoading />
      </div>
    }>
    {children}
  </Suspense>
);

export default Suspensor;
