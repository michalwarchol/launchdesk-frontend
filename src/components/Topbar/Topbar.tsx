import Button from "@/components/Button";

import styles from "./Topbar.module.scss";

interface TopbarProps {
  title: string;
  onPrimaryClick?: () => void;
  primaryButtonLabel?: string;
  actions?: React.ReactNode;
}

export default function Topbar({
  title,
  onPrimaryClick,
  primaryButtonLabel,
  actions,
}: TopbarProps) {
  const defaultActions =
    onPrimaryClick && primaryButtonLabel ? (
      <Button variant="primary" size="md" onClick={onPrimaryClick}>
        {primaryButtonLabel}
      </Button>
    ) : null;

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      {actions ?? defaultActions}
    </header>
  );
}
