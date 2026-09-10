import {
  Bolt,
  Excavator,
  Flame,
  Gear,
  Hammer,
  HardHat,
  Snowflake,
  Wrench,
} from '@/components/icons';
import type { Trade } from '@/lib/jobs';

const TRADE_ICON = {
  electrical: Bolt,
  plumbing: Wrench,
  carpentry: Hammer,
  welding: Flame,
  millwright: Gear,
  hvac: Snowflake,
  'heavy-equipment': Excavator,
  other: HardHat,
} as const satisfies Record<Trade, typeof Bolt>;

export function TradeIcon({
  trade,
  size = 20,
  className,
}: {
  trade: Trade;
  size?: number;
  className?: string;
}) {
  const Icon = TRADE_ICON[trade] ?? HardHat;
  return <Icon size={size} className={className} />;
}
