import React from "react";

const OWL_LOGO_URL = "https://media.base44.com/images/public/6a5a1bda47b40feb17d47ebf/6dd8d2fcd_238SemTtulo_20260717090042.png";

export default function OwlMascot({ size = 80, className = "" }) {
  return (
    <img
      src={OWL_LOGO_URL}
      alt="MentorOwl"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: "auto", objectFit: "contain" }}
    />
  );
}