import { preventFirefoxDisabledRestore } from "@/utils/preventFirefoxDisabledRestore";

import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "link";
  ref?: React.Ref<HTMLButtonElement>;
}

export default function Button({
  children,
  onClick,
  disabled,
  size = "md",
  variant = "primary",
  type = "button",
  className,
  ref,
  ...rest
}: ButtonProps) {
  const buttonClassName = [styles.button, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={buttonClassName}
      {...preventFirefoxDisabledRestore}
    >
      {children}
    </button>
  );
}
