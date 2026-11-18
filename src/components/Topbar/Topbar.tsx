import Button from "@/components/Button";

import styles from "./Topbar.module.scss";

interface TopbarProps {
  title: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  onPrimaryClick?: () => void;
  primaryButtonLabel?: string;
  actions?: React.ReactNode;
}

const HEADINGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

export default function Topbar({
  title,
  headingLevel = 1,
  onPrimaryClick,
  primaryButtonLabel,
  actions,
}: TopbarProps) {
  const Heading = HEADINGS[headingLevel];
  const defaultActions =
    onPrimaryClick && primaryButtonLabel ? (
      <Button variant="primary" size="md" onClick={onPrimaryClick}>
        {primaryButtonLabel}
      </Button>
    ) : null;

  return (
    <header className={styles.topbar}>
      <Heading className={styles.title}>{title}</Heading>
      {actions ?? defaultActions}
    </header>
  );
}
