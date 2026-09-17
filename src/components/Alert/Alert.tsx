import styles from "./Alert.module.scss";

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "info";
  className?: string;
}

export default function Alert({ children, variant = "error", className }: AlertProps) {
  const alertClassName = [styles.alert, styles[variant], className].filter(Boolean).join(" ");

  return (
    <div role="alert" className={alertClassName}>
      {children}
    </div>
  );
}
