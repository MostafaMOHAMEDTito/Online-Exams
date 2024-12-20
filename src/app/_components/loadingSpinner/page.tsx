import React from "react";
import { ColorRing, RotatingLines } from "react-loader-spinner";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <ColorRing
        visible={true}
        height="95"
        width="95"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["#3956CD", "#3956CD", "#3956CD", "#3956CD", "#3956CD"]}
      />
    </div>
  );
};

export default LoadingSpinner;
