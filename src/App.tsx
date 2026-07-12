import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Amount,
  Avatar,
  Badge,
  Button,
  Card,
  CategoryIcon,
  Checkbox,
  Dialog,
  Icon,
  IconButton,
  Input,
  ListRow,
  ProgressBar,
  Radio,
  SegmentedControl,
  Select,
  StatCard,
  Switch,
  Tabs,
  Tag,
  Textarea,
  Toast,
  Tooltip,
  iconNames,
} from './design-system';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h2 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)' }}>{title}</h2>
      <Card>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            alignItems: 'center',
          }}
        >
          {children}
        </div>
      </Card>
    </section>
  );
}

/**
 * Temporary DS gallery — renders every ported component so the port is
 * visually inspectable. Replaced by real screens in Phase 3.
 */
export function App() {
  const [dark, setDark] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [seg, setSeg] = useState('3m');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-5) var(--space-10)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
      }}
    >
      <header
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <div
            style={{ font: 'var(--font-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-muted)', textTransform: 'uppercase' }}
          >
            Sprout · design system
          </div>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)' }}>Component gallery</h1>
        </div>
        <IconButton
          icon={dark ? 'sun' : 'moon'}
          label="Toggle theme"
          variant="secondary"
          onClick={() => setDark((d) => !d)}
        />
      </header>

      <Section title="Amount">
        <Amount value={4182.5} size="hero" />
        <Amount value={818} kind="in" showSign size="lg" />
        <Amount value={1200} kind="over" size="md" />
        <Amount value={45.9} kind="out" size="sm" />
      </Section>

      <Section title="Buttons">
        <Button variant="primary" iconStart="plus">Add entry</Button>
        <Button variant="soft" iconStart="plus">New space</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Delete</Button>
        <Button loading>Loading</Button>
        <Button size="sm">Small</Button>
        <Button size="lg" iconEnd="arrow-right">Large</Button>
      </Section>

      <Section title="Icon buttons">
        <IconButton icon="menu" label="Menu" />
        <IconButton icon="settings" label="Settings" variant="secondary" />
        <IconButton icon="plus" label="Add" variant="primary" round />
        <IconButton icon="chevron-left" label="Back" variant="soft" />
      </Section>

      <Section title="Avatars & badges">
        <Avatar name="JC" />
        <Avatar name="CH" />
        <Avatar name="Leo" size={48} />
        <Avatar name="Joint" square />
        <Badge tone="income" dot>Paid</Badge>
        <Badge tone="warning" dot>Due</Badge>
        <Badge tone="danger">Over budget</Badge>
        <Badge tone="accent">Recurring</Badge>
        <Badge tone="neutral" solid>Solid</Badge>
      </Section>

      <Section title="Category icons">
        <CategoryIcon category="grocery" />
        <CategoryIcon category="installment" />
        <CategoryIcon category="car" />
        <CategoryIcon category="baby" />
        <CategoryIcon category="electric" />
        <CategoryIcon category="water" />
        <CategoryIcon category="bills" />
        <CategoryIcon category="shopping" />
      </Section>

      <Section title="Tags">
        <Tag selected>Grocery</Tag>
        <Tag>Meals</Tag>
        <Tag iconStart="tag">Baby</Tag>
        <Tag onRemove={() => {}}>Removable</Tag>
      </Section>

      <Section title="Progress">
        <div style={{ width: 260 }}>
          <ProgressBar value={62} max={100} showLabel label="Everyday" />
        </div>
        <div style={{ width: 260 }}>
          <ProgressBar value={130} max={100} showLabel label="Over budget" />
        </div>
        <div style={{ width: 260 }}>
          <ProgressBar
            value={100}
            max={100}
            segments={[
              { value: 45, color: 'var(--sage-500)' },
              { value: 30, color: 'var(--sage-300)' },
              { value: 25, color: 'var(--sage-700)' },
            ]}
          />
        </div>
      </Section>

      <Section title="Stat cards">
        <div style={{ minWidth: 220 }}>
          <StatCard label="Joint Fund" value={12480} icon="wallet" footer="Balance" />
        </div>
        <div style={{ minWidth: 220 }}>
          <StatCard label="Total spent" value={4182.5} accent icon="trending-up" trend="+8%" trendDirection="up" />
        </div>
      </Section>

      <Section title="List rows">
        <div style={{ width: '100%', maxWidth: 460 }}>
          <Card padding="sm">
            <ListRow
              leading={<CategoryIcon category="grocery" />}
              title="Jaya Grocer"
              subtitle="Groceries · Joint"
              trailing={<Amount value={132.4} />}
              meta="Jun 12"
              chevron
              onClick={() => {}}
            />
            <ListRow
              leading={<Avatar name="JC" />}
              title="JC"
              subtitle="Income RM 6,200"
              trailing={<Amount value={1840} />}
              onClick={() => {}}
            />
          </Card>
        </div>
      </Section>

      <Section title="Forms">
        <div style={{ width: 240 }}>
          <Input label="Amount" prefix="RM" placeholder="0.00" inputMode="decimal" />
        </div>
        <div style={{ width: 240 }}>
          <Input label="Vendor" iconStart="search" placeholder="Search" hint="Where you spent" />
        </div>
        <div style={{ width: 240 }}>
          <Input label="With error" error="Required" defaultValue="" />
        </div>
        <div style={{ width: 240 }}>
          <Select
            label="Space"
            options={[
              { value: 'everyday', label: 'Everyday Expenses' },
              { value: 'housing', label: 'Housing' },
            ]}
          />
        </div>
        <div style={{ width: 240 }}>
          <Textarea label="Note" placeholder="Optional note" />
        </div>
      </Section>

      <Section title="Toggles">
        <Checkbox label="Recurring" description="Repeats monthly" defaultChecked />
        <Radio name="dir" label="Expense" defaultChecked />
        <Radio name="dir" label="Income" />
        <Switch label="Dark mode" description="Deep green-black theme" />
        <Switch defaultChecked />
        <SegmentedControl
          options={[
            { value: '3m', label: '3M' },
            { value: '6m', label: '6M' },
          ]}
          value={seg}
          onChange={setSeg}
        />
      </Section>

      <Section title="Tabs">
        <div style={{ width: '100%' }}>
          <Tabs
            items={[
              { value: 'activity', label: 'Activity', count: 12, content: <span style={{ color: 'var(--text-muted)' }}>Activity panel</span> },
              { value: 'recurring', label: 'Recurring', count: 3, content: <span style={{ color: 'var(--text-muted)' }}>Recurring panel</span> },
            ]}
          />
        </div>
      </Section>

      <Section title="Feedback">
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Tooltip label="Short label">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
        <Toast title="Entry added" description="RM 132.40 · Jaya Grocer" action="Undo" onAction={() => {}} onClose={() => {}} />
      </Section>

      <Section title={`Icons (${iconNames.length})`}>
        {iconNames.map((n) => (
          <Tooltip key={n} label={n}>
            <span style={{ display: 'inline-flex', padding: 6, color: 'var(--text-body)' }}>
              <Icon name={n} />
            </span>
          </Tooltip>
        ))}
      </Section>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add entry"
        description="A quick demonstration of the Dialog primitive."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>Save</Button>
          </>
        }
      >
        <Input label="Amount" prefix="RM" placeholder="0.00" />
      </Dialog>
    </div>
  );
}
