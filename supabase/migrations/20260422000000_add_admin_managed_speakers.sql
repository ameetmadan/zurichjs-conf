alter table cfp_speakers
  add column if not exists is_admin_managed boolean not null default false;

update cfp_speakers
set is_admin_managed = true
where is_visible = true;
