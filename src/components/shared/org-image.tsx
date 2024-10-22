import React from "react";

interface Props {
  className?: string;
  src: string;
  width?: number | string;
  height?: number;
  alt?: string;
}

const OrgImage = ({
  className = "",
  src,
  alt,
  width = "fit-content",
  height = 200,
}: Props) => {
  return (
    <div className={`relative ${className}`}>
      <img
        style={{ width, height }}
        src={src}
        alt={alt ?? src[0]}
        className="object-cover"
      />
    </div>
  );
};

export default OrgImage;
