/* eslint-disable react/prop-types */
import { useState } from "react";
import placeholderimg from "../../assets/placeholder.png";

export default function AvatarImage({
  src,
  alt = "profile picture",
  className = "",
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src || placeholderimg);

  return (
    <img
      {...props}
      src={imageSrc || placeholderimg}
      alt={alt}
      className={className}
      onError={() => setImageSrc(placeholderimg)}
    />
  );
}
