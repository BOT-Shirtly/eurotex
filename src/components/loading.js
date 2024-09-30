"use client";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-20">
      <div className="loader border-t-4 border-themeColor-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
};

export default Loading;
