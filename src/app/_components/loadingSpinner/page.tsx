import React from "react";
import { RotatingLines } from "react-loader-spinner";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <RotatingLines
        visible={true}
        height={96} // Ensuring it's a number for TypeScript safety
        width={96}
        color="#3956CD"
        strokeWidth={5}
        animationDuration={0.75}
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default LoadingSpinner;
