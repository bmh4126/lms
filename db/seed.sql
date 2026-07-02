-- Seed data: a small real slice of Grade 1 math (Toán lớp 1).
-- Run AFTER schema.sql has been applied.
-- Safe to re-run: it clears the curriculum tables first.
--
-- Insert order matters because of the foreign keys:
--   chapters (parent) -> topics -> lessons (child).
-- We reference parents by looking them up on their title, so we never have to
-- know the auto-generated UUIDs (Technique A from our discussion).

-- Clear existing curriculum so re-running is deterministic.
-- CASCADE also empties topics and lessons via their foreign keys.
TRUNCATE chapters, topics, lessons CASCADE;

-- 1) Chapters -----------------------------------------------------------------
INSERT INTO chapters (title, grade, position) VALUES
  ('Các số đến 10', 1, 10);

-- 2) Topics -- reference the chapter by looking it up on (title, grade) --------
INSERT INTO topics (title, chapter_id, position) VALUES
  ('Đếm và so sánh trong phạm vi 10',
     (SELECT id FROM chapters WHERE title = 'Các số đến 10' AND grade = 1), 10),
  ('Phép cộng trong phạm vi 10',
     (SELECT id FROM chapters WHERE title = 'Các số đến 10' AND grade = 1), 20);

-- 3) Lessons -- reference the topic by its (unique) title ----------------------
INSERT INTO lessons (title, topic_id, position, video_url) VALUES
  ('Đếm đến 10',
     (SELECT id FROM topics WHERE title = 'Đếm và so sánh trong phạm vi 10'), 10, NULL),
  ('So sánh các số trong phạm vi 10',
     (SELECT id FROM topics WHERE title = 'Đếm và so sánh trong phạm vi 10'), 20, NULL),
  ('Phép cộng bằng cách đếm thêm',
     (SELECT id FROM topics WHERE title = 'Phép cộng trong phạm vi 10'), 10, NULL),
  ('Bảng cộng trong phạm vi 10',
     (SELECT id FROM topics WHERE title = 'Phép cộng trong phạm vi 10'), 20, NULL);
