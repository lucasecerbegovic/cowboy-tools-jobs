import Link from 'next/link';
import { Check } from '@/components/icons';
import { mono, monoUi, muted } from '@/lib/brand-type';
import { href, toggleParam, type Query } from '@/lib/url';

type Option = { value: string; label: string; count: number };

function FacetGroup({
  title,
  paramKey,
  options,
  selected,
  query,
}: {
  title: string;
  paramKey: string;
  options: Option[];
  selected: string[];
  query: Query;
}) {
  return (
    <div>
      <h3 className={`${monoUi} border-b border-ink pb-3`}>{title}</h3>
      <ul className="mt-1">
        {options.map((o) => {
          const isOn = selected.includes(o.value);
          return (
            <li key={o.value}>
              <Link
                href={href('/jobs', toggleParam(query, paramKey, o.value))}
                className="flex h-[var(--tap-min)] items-center gap-3 transition-opacity duration-150 hover:opacity-70"
              >
                <span
                  aria-hidden
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border border-ink ${
                    isOn ? 'bg-ink text-surface' : 'bg-surface'
                  }`}
                >
                  {isOn && <Check size={12} />}
                </span>
                <span className="flex-1 text-body-sm">{o.label}</span>
                <span className={`${mono.meta} ${muted}`}>{o.count}</span>
                <span className="sr-only">
                  {isOn ? '(selected — activate to remove)' : '(activate to filter)'}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FilterRail({
  query,
  trades,
  types,
  unionCount,
  selectedTrades,
  selectedTypes,
  unionOnly,
}: {
  query: Query;
  trades: Option[];
  types: Option[];
  unionCount: number;
  selectedTrades: string[];
  selectedTypes: string[];
  unionOnly: boolean;
}) {
  return (
    <div className="flex flex-col gap-7">
      <FacetGroup
        title="Trade"
        paramKey="trade"
        options={trades}
        selected={selectedTrades}
        query={query}
      />
      <FacetGroup
        title="Employment type"
        paramKey="type"
        options={types}
        selected={selectedTypes}
        query={query}
      />
      <FacetGroup
        title="Agreement"
        paramKey="union"
        options={[{ value: '1', label: 'Union only', count: unionCount }]}
        selected={unionOnly ? ['1'] : []}
        query={query}
      />
    </div>
  );
}
