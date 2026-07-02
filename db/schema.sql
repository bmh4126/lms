CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher','admin','parent')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chapters(
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    title TEXT NOT NULL,
    grade SMALLINT NOT NULL,
    position INT NOT NULL
);

CREATE TABLE IF NOT EXISTS topics(
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    title TEXT NOT NULL,
    chapter_id UUID NOT NULL REFERENCES chapters(id),
    position INT NOT NULL,
    UNIQUE(title, chapter_id)
);

CREATE TABLE IF NOT EXISTS lessons(
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    title TEXT NOT NULL,
    topic_id UUID NOT NULL REFERENCES topics(id),
    position INT NOT NULL,
    video_url TEXT,
    UNIQUE(title, topic_id)
);