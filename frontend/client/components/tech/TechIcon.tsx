import React from "react";

export type TechIconName =
  | "javascript"
  | "typescript"
  | "python"
  | "php"
  | "html5"
  | "css3"
  | "react"
  | "nextjs"
  | "tailwindcss"
  | "nodejs"
  | "express"
  | "nestjs"
  | "reactnative"
  | "expo"
  | "postgresql"
  | "mongodb"
  | "mysql"
  | "redis"
  | "docker"
  | "git"
  | "github"
  | "linux"
  | "vscode"
  | "postman"
  | "figma"
  | "vite"
  | "framermotion"
  | "graphql"
  | "django"
  | "nginx"
  | string;

interface TechIconProps {
  name: TechIconName;
  className?: string;
  size?: number;
  colorMode?: "brand" | "monochrome" | "warm";
  title?: string;
}

export function TechIcon({
  name,
  className = "w-7 h-7",
  size = 28,
  colorMode = "brand",
  title,
}: TechIconProps) {
  const normalized = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  const getMonochromeFill = () => {
    if (colorMode === "warm") return "#FFDD9B";
    if (colorMode === "monochrome") return "#FFFFFF";
    return null;
  };

  const mono = getMonochromeFill();

  // Helper for brand color vs monochrome
  const c = (brandColor: string) => (mono ? mono : brandColor);

  switch (normalized) {
    case "javascript":
    case "js":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <rect width="24" height="24" rx="4" fill={c("#F7DF1E")} />
          <path
            d="M6.5 18.5V13.8h2.3v4.7c0 1.2-.6 1.8-1.7 1.8-.7 0-1.4-.3-1.8-.8l1-1.3c.3.3.5.5.8.5.4 0 .6-.2.6-.6zM13.5 15.6c-.6-.4-1.2-.6-1.7-.6-.6 0-.9.3-.9.6 0 .4.3.5 1.1.9 1.4.6 2.1 1.2 2.1 2.3 0 1.4-1.1 2.2-2.7 2.2-1 0-1.8-.3-2.4-.8l.9-1.5c.5.4 1.1.7 1.6.7.7 0 1-.3 1-.7 0-.4-.4-.6-1.2-1-1.3-.5-2-1.1-2-2.2 0-1.3 1-2.1 2.5-2.1.8 0 1.6.2 2.2.6l-.8 1.6z"
            fill={mono ? "#302E2D" : "#000000"}
          />
        </svg>
      );

    case "typescript":
    case "ts":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <rect width="24" height="24" rx="4" fill={c("#3178C6")} />
          <path
            d="M5.5 8h6v2h-2v8h-2v-8h-2V8zm8.8 3.5c-.7-.4-1.3-.6-1.9-.6-.7 0-1.1.3-1.1.8 0 .5.4.7 1.3 1.1 1.6.7 2.4 1.5 2.4 2.8 0 1.7-1.3 2.7-3.2 2.7-1.2 0-2.2-.4-2.9-1l1.1-1.8c.6.5 1.3.8 1.9.8.8 0 1.2-.4 1.2-.8 0-.5-.5-.8-1.4-1.2-1.6-.7-2.3-1.4-2.3-2.7 0-1.6 1.2-2.6 3-2.6 1 0 1.9.3 2.6.7l-.7 1.9z"
            fill={mono ? "#302E2D" : "#FFFFFF"}
          />
        </svg>
      );

    case "python":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M11.87 2c-3.1 0-5.1.7-5.1 3v2.24h5.2v.75H4.6C2.33 8 2 9.94 2 12.33c0 2.5.4 4.33 2.67 4.33h1.66v-2.37c0-2.3 2-4.3 4.33-4.3h5.27V7.75c0-2.46-2.1-4.75-4.06-5.75H11.87zm-1.8 1.66a.93.93 0 1 1 0 1.86.93.93 0 0 1 0-1.86z"
            fill={c("#3776AB")}
          />
          <path
            d="M12.13 22c3.1 0 5.1-.7 5.1-3v-2.24h-5.2v-.75h7.37c2.27 0 2.6-1.94 2.6-4.33 0-2.5-.4-4.33-2.67-4.33h-1.66v2.37c0 2.3-2 4.3-4.33 4.3H8.07v2.24c0 2.46 2.1 4.75 4.06 5.75h-.002zm1.8-1.66a.93.93 0 1 1 0-1.86.93.93 0 0 1 0 1.86z"
            fill={c("#FFD43B")}
          />
        </svg>
      );

    case "php":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <ellipse cx="12" cy="12" rx="11" ry="6.5" fill={c("#777BB4")} />
          <path
            d="M6 14.5l.8-4.5h2.2c1 0 1.7.5 1.5 1.5-.2 1.2-1 1.8-2.1 1.8H7.3l-.3 1.2H6zm1.7-2.3h.8c.5 0 .9-.2 1-.7.1-.5-.1-.7-.6-.7h-.8l-.4 1.4zm3.8 2.3l1-5.5h1.2l-.3 1.6h.1c.4-.7 1-1.1 1.8-1.1 1 0 1.5.7 1.3 1.7l-.6 3.3h-1.2l.6-3.1c.1-.6-.2-1-.7-1-.6 0-1 .5-1.2 1.3l-.5 2.8h-1.4zm6 0l.8-4.5h2.2c1 0 1.7.5 1.5 1.5-.2 1.2-1 1.8-2.1 1.8h-1.1l-.3 1.2h-1zm1.7-2.3h.8c.5 0 .9-.2 1-.7.1-.5-.1-.7-.6-.7h-.8l-.4 1.4z"
            fill={mono ? "#302E2D" : "#FFFFFF"}
          />
        </svg>
      );

    case "html5":
    case "html":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path d="M3 2l1.6 18.5L12 23l7.4-2.5L21 2H3z" fill={c("#E34F26")} />
          <path d="M12 21.1l6.1-2 1.3-15.1H12v17.1z" fill={c("#EF652A")} />
          <path
            d="M12 8.3H8.3l-.2-2.3h7.8l.2-2.3H5.8l.7 8.9H12v-2zm0 6.6l-3.3-.9-.2-2.4H6.2l.4 4.5 5.4 1.5V14.9zm0-3.3v-2.3h5.6l-.5 5.6-5.1 1.4v-2.4l2.8-.8.3-3.2H12z"
            fill={mono ? "#302E2D" : "#FFFFFF"}
          />
        </svg>
      );

    case "css3":
    case "css":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path d="M3 2l1.6 18.5L12 23l7.4-2.5L21 2H3z" fill={c("#1572B6")} />
          <path d="M12 21.1l6.1-2 1.3-15.1H12v17.1z" fill={c("#33A9DC")} />
          <path
            d="M12 8.3H8.3l-.2-2.3h7.8l.2-2.3H5.8l.7 8.9H12v-2zm0 6.6l-3.3-.9-.2-2.4H6.2l.4 4.5 5.4 1.5V14.9zm5.7-4.4l-.5 5.6-5.2 1.4v-2.4l2.8-.8.3-3.2h-3.1v-2.3h6.1l-.4 1.7z"
            fill={mono ? "#302E2D" : "#FFFFFF"}
          />
        </svg>
      );

    case "react":
    case "reactjs":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(30 12 12)"
            stroke={c("#61DAFB")}
            strokeWidth="1.5"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(90 12 12)"
            stroke={c("#61DAFB")}
            strokeWidth="1.5"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            transform="rotate(150 12 12)"
            stroke={c("#61DAFB")}
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="1.8" fill={c("#61DAFB")} />
        </svg>
      );

    case "nextjs":
    case "next":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <circle cx="12" cy="12" r="11" fill={c("#000000")} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <path
            d="M15.5 8h1.8v8h-1.8V8zm-5.6 0l5.8 7.7c-.5.4-1.1.7-1.8.9L8.1 8h1.8zm-1.8 0v8H6.3V8h1.8z"
            fill={mono ? "#302E2D" : "#FFFFFF"}
          />
        </svg>
      );

    case "tailwindcss":
    case "tailwind":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
            fill={c("#06B6D4")}
          />
        </svg>
      );

    case "nodejs":
    case "node":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M12 2l9 5.2v10.4L12 23l-9-5.2V7.2L12 2z"
            fill={c("#5FA04E")}
          />
          <path
            d="M12 4.5l6.5 3.8v7.4L12 19.5 5.5 15.7V8.3L12 4.5z"
            fill="#333333"
          />
          <path
            d="M12 7.5c-2.4 0-4.3 1.2-4.3 3.6 0 2.2 1.5 3 3.4 3.4l1.2.3c1.1.2 1.7.5 1.7 1.1 0 .7-.7 1.2-1.8 1.2-1.4 0-2.3-.5-2.8-1.2l-1.3 1.2c.8 1.1 2.2 1.8 4.1 1.8 2.5 0 4.2-1.3 4.2-3.6 0-2.1-1.5-3-3.4-3.4l-1.2-.3c-1.1-.2-1.7-.5-1.7-1.1 0-.6.6-1.1 1.7-1.1 1.2 0 2 .4 2.5 1l1.2-1.2c-.8-1-2.1-1.7-3.8-1.7z"
            fill={mono ? "#FFDD9B" : "#5FA04E"}
          />
        </svg>
      );

    case "express":
    case "expressjs":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <circle cx="12" cy="12" r="11" fill="#1E1E1E" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <text
            x="12"
            y="15.5"
            textAnchor="middle"
            fill={c("#FFFFFF")}
            fontFamily="monospace"
            fontSize="10"
            fontWeight="bold"
          >
            ex
          </text>
        </svg>
      );

    case "nestjs":
    case "nest":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M20.9 4.6c-.6-.7-1.6-1.1-2.6-1.1-1.5 0-2.9.8-3.7 2.1l-.8 1.3-1.4-1.2c-.8-.7-1.9-1.1-3-1.1-1.8 0-3.4 1-4.2 2.6l-3.3 6.6c-.6 1.2-.6 2.6 0 3.8.6 1.2 1.7 2 3.1 2.3 2.1.4 4.3-.2 5.9-1.6l4-3.5 1.5 1.3c.7.6 1.6.9 2.5.9 1.4 0 2.7-.8 3.4-2l1.2-2.3c.6-1.1.7-2.4.3-3.6-.4-1.3-1.3-2.4-2.5-3l-.4-.4zm-4.7 4.1l-4 3.5c-1.1 1-2.6 1.5-4.1 1.2-.8-.2-1.5-.7-1.9-1.4-.4-.7-.4-1.6 0-2.3l3.3-6.6c.5-1 1.5-1.6 2.6-1.6.7 0 1.4.3 1.9.7l2.2 1.9v4.6zm3.3 5.3l-1.2 2.3c-.4.7-1.2 1.2-2 1.2-.6 0-1.1-.2-1.5-.6l-1.8-1.5 2.1-1.8 1.8.8c.8.3 1.7.2 2.3-.3.2-.2.3-.4.3-.6 0-.2-.1-.4-.2-.5l-.8-.8.7-1.2c.7.4 1.3 1 1.5 1.8.3.7.2 1.5-.1 2.2z"
            fill={c("#E0234E")}
          />
        </svg>
      );

    case "reactnative":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <rect x="5" y="2" width="14" height="20" rx="3" stroke={c("#61DAFB")} strokeWidth="1.5" />
          <ellipse
            cx="12"
            cy="11"
            rx="5"
            ry="2.2"
            transform="rotate(30 12 11)"
            stroke={c("#61DAFB")}
            strokeWidth="1"
          />
          <ellipse
            cx="12"
            cy="11"
            rx="5"
            ry="2.2"
            transform="rotate(90 12 11)"
            stroke={c("#61DAFB")}
            strokeWidth="1"
          />
          <ellipse
            cx="12"
            cy="11"
            rx="5"
            ry="2.2"
            transform="rotate(150 12 11)"
            stroke={c("#61DAFB")}
            strokeWidth="1"
          />
          <circle cx="12" cy="11" r="1" fill={c("#61DAFB")} />
          <line x1="10" y1="19" x2="14" y2="19" stroke={c("#61DAFB")} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "expo":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M3 18.5l8.5-14.8c.3-.5.9-.7 1.4-.4.2.1.3.2.4.4L21.8 18.5c.3.5.1 1.2-.4 1.5-.2.1-.4.1-.6.1H3.2c-.6 0-1.1-.4-1.1-1 0-.2 0-.4.1-.6l.8-.5zM12 7.8L5.7 18h12.6L12 7.8z"
            fill={c("#FFFFFF")}
          />
        </svg>
      );

    case "postgresql":
    case "postgres":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M12 2C6.5 2 2 6.5 2 12c0 2.2.7 4.2 2 5.9l1.4-1.4c-.9-1.3-1.4-2.8-1.4-4.5 0-4.4 3.6-8 8-8s8 3.6 8 8c0 3.2-1.9 6-4.6 7.3l.8 1.8C19.7 19.5 22 16 22 12c0-5.5-4.5-10-10-10z"
            fill={c("#4169E1")}
          />
          <path
            d="M12 5.5c-3 0-5.5 2.5-5.5 5.5 0 2 .9 3.8 2.5 4.6v3.4l2.5-1.5 2.5 1.5v-3.4c1.6-.8 2.5-2.6 2.5-4.6 0-3-2.5-5.5-5.5-5.5zm0 8.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"
            fill={c("#4169E1")}
          />
        </svg>
      );

    case "mongodb":
    case "mongo":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M12 1.5s-6 5.5-6 11c0 4 2.8 7.3 6 8.5 3.2-1.2 6-4.5 6-8.5 0-5.5-6-11-6-11zm.6 17.8c-.2 0-.4 0-.6.1V3.9c.2.2.4.4.6.6 2.5 2.8 4.2 6.2 4.2 8.5 0 3.3-1.9 6-4.2 6.3z"
            fill={c("#47A248")}
          />
          <path d="M12 21v2c-.2 0-.4-.1-.5-.2l-.5-1.8h1z" fill={c("#47A248")} />
        </svg>
      );

    case "mysql":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M18.8 6.5C17.2 4.3 14.5 3 11.5 3 6.8 3 3 6.8 3 11.5c0 2.2.8 4.2 2.2 5.7L4 20.5l4-1.3c1.1.5 2.3.8 3.5.8 4.7 0 8.5-3.8 8.5-8.5 0-1.8-.6-3.6-1.2-5zM12 17c-3 0-5.5-2.5-5.5-5.5S9 6 12 6s5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5z"
            fill={c("#4479A1")}
          />
          <path d="M11 9h2v5h-2z" fill={c("#DE8A10")} />
        </svg>
      );

    case "redis":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M21.2 7.8L12.5 2.6c-.3-.2-.7-.2-1 0L2.8 7.8c-.4.2-.6.6-.6 1v7.4c0 .4.2.8.6 1l8.7 5.2c.3.2.7.2 1 0l8.7-5.2c.4-.2.6-.6.6-1V8.8c0-.4-.2-.8-.6-1zM12 4.4l7.1 4.2-3 1.8-7.1-4.2 3-1.8zm-8 5.7l7 4.2v5.8L4 16V10.1zm9 10v-5.8l7-4.2V16l-7 4.1z"
            fill={c("#DC382D")}
          />
        </svg>
      );

    case "docker":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M13.8 7.5h2.2v2.2h-2.2V7.5zm-2.8 0h2.2v2.2H11V7.5zm-2.8 0h2.2v2.2H8.2V7.5zm5.6-2.8h2.2v2.2h-2.2V4.7zm-2.8 0h2.2v2.2H11V4.7zm-2.8 0h2.2v2.2H8.2V4.7zm-2.8 2.8h2.2v2.2H5.4V7.5zm16.5 4.5c-.5-.4-1.5-.5-2.2-.2-.2-.7-.7-1.3-1.4-1.7l-.8-.5-.5.8c-.4.7-.5 1.5-.3 2.3-.6.4-1.7.5-2.3.2H2.3c-.3 1.2-.1 2.9.8 4.3 1.2 1.9 3.3 3.1 6.3 3.1 5.3 0 9.8-3.3 11.2-8.5.8.1 1.6-.1 2-.6l.4-.5-.7-.7z"
            fill={c("#2496ED")}
          />
        </svg>
      );

    case "git":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M21.6 10.9L13.1 2.4c-.5-.5-1.3-.5-1.8 0l-2 2 2.5 2.5c.6-.2 1.3 0 1.7.5.5.5.6 1.2.3 1.8l2.4 2.4c.6-.3 1.3-.2 1.8.3.7.7.7 1.8 0 2.5s-1.8.7-2.5 0c-.5-.5-.6-1.3-.3-1.8l-2.3-2.3v5.1c.3.2.6.6.6 1.1 0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-.5.3-.9.6-1.1v-5.2c-.3-.2-.6-.6-.6-1.1 0-.6.3-1 .8-1.3L8.8 6.8 2.4 13.2c-.5.5-.5 1.3 0 1.8l8.5 8.5c.5.5 1.3.5 1.8 0l8.9-8.9c.5-.4.5-1.2 0-1.7z"
            fill={c("#F05032")}
          />
        </svg>
      );

    case "github":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            fill={c("#FFFFFF")}
          />
        </svg>
      );

    case "linux":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M12.3 2c-2.4 0-3.8 2.3-3.8 5.4 0 1.5.2 3.6.1 5.1-.3 2.6-2.1 4.2-2.1 5.3 0 1.7 2.1 3.2 5.5 3.2s5.5-1.5 5.5-3.2c0-1.1-1.8-2.7-2.1-5.3-.1-1.5.1-3.6.1-5.1 0-3.1-1.4-5.4-3.2-5.4h-.002z"
            fill={c("#FCC624")}
          />
          <path
            d="M12.3 3.5c-1.5 0-2.3 1.6-2.3 4 0 1.3.2 3.3.1 4.5-.2 2.3-1.6 3.6-1.6 4.5 0 1.2 1.6 2.3 3.8 2.3s3.8-1.1 3.8-2.3c0-.9-1.4-2.2-1.6-4.5-.1-1.2.1-3.2.1-4.5 0-2.4-.8-4-2.3-4z"
            fill="#231F20"
          />
          <ellipse cx="11.2" cy="7" rx=".8" ry="1.2" fill="#FFFFFF" />
          <ellipse cx="13.4" cy="7" rx=".8" ry="1.2" fill="#FFFFFF" />
          <circle cx="11.2" cy="7.2" r=".4" fill="#000000" />
          <circle cx="13.4" cy="7.2" r=".4" fill="#000000" />
          <path d="M12.3 8.8l-1.5 1.5h3l-1.5-1.5z" fill="#FFA500" />
        </svg>
      );

    case "vscode":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M17.5 2.1L7.8 11.2 3.7 8.1 2 9.4l4.5 4.3L2 18l1.7 1.3 4.1-3.1 9.7 9.1L22 23V4.3L17.5 2.1zm.5 5.6v11.9l-6.5-5.9 6.5-6z"
            fill={c("#007ACC")}
          />
        </svg>
      );

    case "postman":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <circle cx="12" cy="12" r="10" fill={c("#FF6C37")} />
          <path
            d="M8.5 7.5c1.7 0 3 1.3 3 3 0 .7-.2 1.3-.6 1.8l3.6 3.6-1.4 1.4-3.6-3.6c-.5.4-1.1.6-1.8.6-1.7 0-3-1.3-3-3s1.3-3 3-3zm0 2c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm6.5-1.5l1.5-1.5 3 3-1.5 1.5-3-3z"
            fill={mono ? "#302E2D" : "#FFFFFF"}
          />
        </svg>
      );

    case "figma":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path d="M8 2h4v5H8c-1.4 0-2.5-1.1-2.5-2.5S6.6 2 8 2z" fill={c("#F24E1E")} />
          <path d="M12 2h4c1.4 0 2.5 1.1 2.5 2.5S17.4 7 16 7h-4V2z" fill={c("#FF7262")} />
          <path d="M12 7h4c1.4 0 2.5 1.1 2.5 2.5S17.4 12 16 12h-4V7z" fill={c("#1ABCFE")} />
          <path d="M8 7h4v5H8c-1.4 0-2.5-1.1-2.5-2.5S6.6 7 8 7z" fill={c("#A259FF")} />
          <path d="M8 12h4v2.5C12 15.9 10.9 17 9.5 17S7 15.9 7 14.5 8.1 12 9.5 12H8z" fill={c("#0ACF83")} />
        </svg>
      );

    case "vite":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M21.5 3.5l-9.1 18-9.1-18h18.2z"
            fill={c("#646CFF")}
          />
          <path
            d="M13.2 4.5l-4.7 8.2h3.3l-2.1 6.8 6.7-9.5h-3.6l2.4-5.5h-2z"
            fill={c("#BD34FE")}
          />
          <path
            d="M12.8 5.5l-3.8 6.5h2.8l-1.6 5.2 5.3-7.5h-2.9l1.9-4.2h-1.7z"
            fill={c("#FFD62E")}
          />
        </svg>
      );

    case "framermotion":
    case "framer":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path d="M4 2h16v7h-8z" fill={c("#0055FF")} />
          <path d="M4 9h8l8 7H4z" fill={c("#FF0055")} />
          <path d="M4 16h8v6z" fill={c("#0099FF")} />
        </svg>
      );

    case "graphql":
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <path
            d="M12 2l8.7 5v10L12 22l-8.7-5V7L12 2zm0 2.3L5.3 8.1v7.8L12 19.7l6.7-3.8V8.1L12 4.3z"
            stroke={c("#E10098")}
            strokeWidth="1.5"
          />
          <circle cx="12" cy="4" r="2" fill={c("#E10098")} />
          <circle cx="20" cy="8.5" r="2" fill={c("#E10098")} />
          <circle cx="20" cy="17.5" r="2" fill={c("#E10098")} />
          <circle cx="12" cy="22" r="2" fill={c("#E10098")} />
          <circle cx="4" cy="17.5" r="2" fill={c("#E10098")} />
          <circle cx="4" cy="8.5" r="2" fill={c("#E10098")} />
        </svg>
      );

    default:
      // Graceful clean code terminal fallback
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {title && <title>{title}</title>}
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="3"
            stroke={c("#FFDD9B")}
            strokeWidth="1.5"
          />
          <path
            d="M7 9l3 3-3 3M13 15h4"
            stroke={c("#FFDD9B")}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export default TechIcon;
