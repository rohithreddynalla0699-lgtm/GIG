create view public.public_marketplace_bags as
select
  ps.id as store_id,
  ps.name as store_name,
  ps.area as store_area,
  ps.city as store_city,
  ps.store_image_url,
  rbt.id as rescue_bag_type_id,
  dba.id as daily_bag_availability_id,
  rbt.title,
  rbt.listing_type,
  rbt.category,
  rbt.veg_type,
  rbt.dietary_tags,
  rbt.allergen_note,
  rbt.collection_instructions,
  rbt.short_description,
  rbt.original_price_amount,
  rbt.rescue_price_amount,
  dba.service_date,
  dba.pickup_start_time,
  dba.pickup_end_time,
  dba.quantity_left
from public.partner_stores ps
join public.rescue_bag_types rbt on rbt.store_id = ps.id
join public.daily_bag_availability dba on dba.rescue_bag_type_id = rbt.id
where ps.is_active = true
  and rbt.status = 'live'
  and dba.is_archived_for_day = false
  and dba.quantity_left > 0;

revoke all on public.public_marketplace_bags from public;
revoke all on public.public_marketplace_bags from anon;
revoke all on public.public_marketplace_bags from authenticated;

grant select on public.public_marketplace_bags to anon;
grant select on public.public_marketplace_bags to authenticated;
