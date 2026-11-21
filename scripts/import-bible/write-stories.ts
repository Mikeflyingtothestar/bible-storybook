import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { STORIES } from '../../src/stories/catalog'
import { sqlString } from './sql'

const root = path.resolve(import.meta.dirname, '../..')

function storiesSql(): string {
  const storyRows = STORIES.map(
    (story, index) =>
      `(${sqlString(story.slug)}, ${sqlString(story.title)}, ${sqlString(story.summary)}, ${sqlString(story.testament)}, ${sqlString(story.startRef)}, ${sqlString(story.endRef)}, ${sqlString(story.scenes.map((scene) => scene.narration).join('\n\n'))}, ${story.kids ? 'kids' : 'all'}, ${story.bedtime}, 'free', ${index + 1}, 'published')`,
  ).join(',\n')
  const sceneRows = STORIES.flatMap((story) =>
    story.scenes.map(
      (scene, index) =>
        `(${sqlString(story.slug)}, ${index + 1}, ${sqlString(scene.verseRef)}, ${sqlString(scene.caption)}, ${sqlString(scene.narration)}, 'published')`,
    ),
  ).join(',\n')
  const videoSlugs = ['creation', 'the-nativity', 'david-and-goliath', 'the-exodus', 'the-resurrection']
  const videoRows = videoSlugs
    .flatMap((slug) =>
      (['human', 'anime'] as const).map(
        (style) => `(${sqlString(slug)}, ${sqlString(style)}, ${sqlString(`placeholders/video-${slug}-${style}.mp4`)})`,
      ),
    )
    .join(',\n')

  return `-- Story text, scene rows, and placeholder media. Apply after the schema. Safe to re-run.
insert into public.stories (slug, title, summary, testament, start_ref, end_ref, body, age_band, is_bedtime, tier_required, order_index, review_status)
values
${storyRows}
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  age_band = excluded.age_band,
  is_bedtime = excluded.is_bedtime,
  review_status = excluded.review_status;

insert into public.scenes (story_id, order_index, verse_ref, caption, narration, review_status)
select s.id, x.ord, x.ref, x.caption, x.narration, 'published'::public.review_status
from public.stories s
join (values
${sceneRows}
) as x(slug, ord, ref, caption, narration) on s.slug = x.slug
on conflict (story_id, order_index) do update set
  verse_ref = excluded.verse_ref,
  caption = excluded.caption,
  narration = excluded.narration,
  review_status = excluded.review_status;

insert into public.media_assets (owner_type, owner_id, kind, style, storage_bucket, storage_path, is_placeholder, tier_required, feature_flag, review_status)
select 'scene', sc.id::text, 'image', 'none', 'media-public', 'placeholders/scene-' || s.slug || '-' || sc.order_index || '.svg', true, 'free', 'scene_images', 'published'
from public.scenes sc
join public.stories s on s.id = sc.story_id
where not exists (
  select 1 from public.media_assets m
  where m.storage_path = 'placeholders/scene-' || s.slug || '-' || sc.order_index || '.svg'
);

insert into public.media_assets (owner_type, owner_id, kind, style, storage_bucket, storage_path, is_placeholder, tier_required, feature_flag, review_status)
select 'story', s.id::text, 'video', x.style::public.media_style, 'media-private', x.path, true, 'premium', 'video_mode', 'published'
from (values
${videoRows}
) as x(slug, style, path)
join public.stories s on s.slug = x.slug
where not exists (select 1 from public.media_assets m where m.storage_path = x.path);
`
}

function svg(index: number): string {
  const hue = (index * 47) % 360
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="hsl(${hue} 28% 88%)"/>
  <circle cx="480" cy="90" r="36" fill="hsl(${hue} 40% 70%)"/>
  <path d="M0 250 C140 190 220 280 340 230 C460 180 520 250 640 210 L640 360 L0 360 Z" fill="hsl(${hue} 22% 62%)"/>
  <text x="32" y="48" font-family="Georgia, serif" font-size="22" fill="#3B2F23">Placeholder</text>
</svg>
`
}

async function main(): Promise<void> {
  const seedDir = path.join(root, 'supabase/seed')
  await mkdir(seedDir, { recursive: true })
  await writeFile(path.join(seedDir, 'stories.sql'), storiesSql())
  const art = path.join(root, 'public/placeholders')
  await mkdir(art, { recursive: true })
  let n = 1
  for (const story of STORIES) {
    for (let scene = 1; scene <= story.scenes.length; scene += 1) {
      await writeFile(path.join(art, `scene-${story.slug}-${scene}.svg`), svg(n))
      n += 1
    }
  }
  console.log(`stories.sql and ${n - 1} placeholder images`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
