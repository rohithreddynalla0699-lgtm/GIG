import type { OrderTimelineEvent } from '../../types/order';

interface OrderTimelineProps {
  events: OrderTimelineEvent[];
}

export default function OrderTimeline({ events }: OrderTimelineProps) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="mt-[6px] h-3 w-3 rounded-full bg-[color:var(--gig-green)]" />
            {index < events.length - 1 && <div className="mt-2 w-[2px] flex-1 bg-[rgba(11,122,77,0.18)]" />}
          </div>
          <div className="pb-4">
            <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">{event.timeLabel}</div>
            <div className="mb-1 text-[16px] font-semibold text-[color:var(--gig-text)]">{event.title}</div>
            <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{event.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
