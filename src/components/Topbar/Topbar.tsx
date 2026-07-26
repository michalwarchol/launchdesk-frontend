import Button from "@/components/Button";

import styles from "./Topbar.module.scss";

interface TopbarProps {
  title: string;
  onPrimaryClick: () => void;
  primaryButtonLabel: string;
}

export default function Topbar({ title, onPrimaryClick, primaryButtonLabel }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <Button variant="primary" size="md" onClick={onPrimaryClick}>
        {primaryButtonLabel}
      </Button>
    </header>
  );
}
