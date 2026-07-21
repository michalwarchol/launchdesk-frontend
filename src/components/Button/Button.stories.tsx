import Button from "./Button";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

const variants = ["primary", "outline", "link"] as const;

const headerCellStyle: React.CSSProperties = {
  color: "var(--color-text-muted)",
  fontSize: 13,
  fontWeight: 600,
  padding: "8px 16px",
  textAlign: "left",
};

const cellStyle: React.CSSProperties = {
  padding: "12px 16px",
  verticalAlign: "middle",
};

export const Overview: Story = {
  render: () => (
    <table style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={headerCellStyle} />
          <th style={headerCellStyle}>size: sm</th>
          <th style={headerCellStyle}>size: md</th>
          <th style={headerCellStyle}>size: lg</th>
          <th style={headerCellStyle}>disabled</th>
        </tr>
      </thead>
      <tbody>
        {variants.map((variant) => (
          <tr key={variant}>
            <td style={{ ...headerCellStyle, ...cellStyle }}>{variant}</td>
            <td style={cellStyle}>
              <Button variant={variant} size="sm" onClick={() => {}}>
                Button
              </Button>
            </td>
            <td style={cellStyle}>
              <Button variant={variant} size="md" onClick={() => {}}>
                Button
              </Button>
            </td>
            <td style={cellStyle}>
              <Button variant={variant} size="lg" onClick={() => {}}>
                Button
              </Button>
            </td>
            <td style={cellStyle}>
              <Button variant={variant} size="md" disabled onClick={() => {}}>
                Button
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
