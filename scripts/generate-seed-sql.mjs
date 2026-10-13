import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.resolve('./src/data/officialQuestionBank.ts'), 'utf8');
const match = content.match(/export const OFFICIAL_QUESTION_BANK: Scenario\[\] = (\[[\s\S]*?\]);\s*$/);
if (!match) {
  console.error('Could not match OFFICIAL_QUESTION_BANK');
  process.exit(1);
}

const scenarios = JSON.parse(match[1]);
console.log('Total scenarios found:', scenarios.length);

function escapeSql(val) {
  if (typeof val !== 'string') return val;
  return val.replace(/'/g, "''");
}

let sql = `-- ================================================================
-- CYBERSAFE QUEST - SEED 39 CÂU HỎI KHOA HỌC VÀO SUPABASE
-- Bám sát 11 nhóm thủ đoạn & 39 tình huống thực tiễn
-- Hướng dẫn: Copy toàn bộ nội dung file này dán vào SQL Editor trên Supabase Dashboard và bấm RUN.
-- ================================================================

-- 1. Đảm bảo cấu trúc bảng scenarios đầy đủ và các policy
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  category_name_vi TEXT NOT NULL,
  skill TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  question_type VARCHAR(30) NOT NULL CHECK (question_type IN ('multiple_choice', 'branching_scenario', 'hotspot')),
  context TEXT NOT NULL,
  stimulus JSONB NOT NULL,
  options JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
  feedback JSONB NOT NULL,
  consequence JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS & Policies
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read scenarios' AND tablename = 'scenarios') THEN
    CREATE POLICY "Public read scenarios" ON public.scenarios FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert scenarios' AND tablename = 'scenarios') THEN
    CREATE POLICY "Allow insert scenarios" ON public.scenarios FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update scenarios' AND tablename = 'scenarios') THEN
    CREATE POLICY "Allow update scenarios" ON public.scenarios FOR UPDATE USING (true);
  END IF;
END $$;

-- 2. Dữ liệu 39 tình huống mô phỏng chuẩn
`;

for (const s of scenarios) {
  const scenario_id = escapeSql(s.scenario_id);
  const category = escapeSql(s.category);
  const category_name_vi = escapeSql(s.category_name_vi);
  const skill = escapeSql(s.skill);
  const difficulty = escapeSql(s.difficulty);
  const question_type = escapeSql(s.question_type);
  const context = escapeSql(s.context);
  const stimulus = escapeSql(JSON.stringify(s.stimulus));
  const options = escapeSql(JSON.stringify(s.options));
  const correct_answer = escapeSql(JSON.stringify(s.correct_answer));
  const feedback = escapeSql(JSON.stringify(s.feedback));
  const consequence = escapeSql(JSON.stringify(s.consequence));

  sql += `
INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  '${scenario_id}', '${category}', '${category_name_vi}', '${skill}', '${difficulty}', '${question_type}', '${context}', '${stimulus}'::jsonb, '${options}'::jsonb, '${correct_answer}'::jsonb, '${feedback}'::jsonb, '${consequence}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;
`;
}

fs.writeFileSync('./supabase/seed_39_scenarios.sql', sql, 'utf8');
console.log('Successfully wrote ./supabase/seed_39_scenarios.sql with', scenarios.length, 'scenarios.');
