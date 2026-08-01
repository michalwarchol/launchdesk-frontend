import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "link";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function Button({
  children,
  onClick,
  disabled,
  size = "md",
  variant = "primary",
  type = "button",
  className,
}: ButtonProps) {
  const buttonClassName = [styles.button, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} disabled={disabled} type={type} className={buttonClassName}>
      {children}
    </button>
  );
}
