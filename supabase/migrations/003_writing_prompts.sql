-- 003_writing_prompts.sql
-- Banco de consignas originales de Writing (Pharos), generado 12 julio 2026.
-- Ver nota de verificacion de formato/convenciones en el proyecto Claude 'COPILOT WITH GPT'.

create table if not exists writing_prompts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text unique not null,
  exam_level text not null check (exam_level in ('B2', 'C1')),
  exam_set text not null,
  part text not null check (part in ('Part 1', 'Part 2')),
  task_type text not null,
  word_count text not null,
  prompt_text text not null,
  topic_tag text,
  status text not null default 'available' check (status in ('available', 'retired'))
);

alter table orders add column if not exists writing_prompt_id uuid references writing_prompts(id);

create index if not exists idx_writing_prompts_level_status on writing_prompts(exam_level, status);

-- RLS: deny all public access, same convention as orders/submissions (API routes use service role)
alter table writing_prompts enable row level security;

-- Seed data: 40 original Pharos writing prompts (20 B2 First, 20 C1 Advanced)
insert into writing_prompts (code, exam_level, exam_set, part, task_type, word_count, prompt_text, topic_tag) values
  ('B2-WRI-001-P1', 'B2', '001', 'Part 1', 'Essay', '140-190', 'Your English class recently discussed the topic of where people choose to live. Your teacher has set the following essay as homework.

Question: Is it better to live in a big city or in a small town?

Base your essay on both of the notes below, add a third idea of your own, and support your opinion with clear reasons throughout.

Notes
1. Job opportunities
2. Quality of life
3. ......................... (your own idea)

Write your essay in 140-190 words.', 'Ciudad vs. pueblo'),
  ('B2-WRI-001-P2A', 'B2', '001', 'Part 2', 'Email/Carta', '140-190', 'You recently spent a weekend staying at a friend''s house in another city. Your friend has emailed you asking how the weekend was for you.

Write an email to your friend. In your email, you should:
• thank them for their hospitality
• say what you enjoyed most about the visit
• invite them to stay at your place next time

Write your email in 140-190 words.', 'Agradecimiento / invitación'),
  ('B2-WRI-001-P2B', 'B2', '001', 'Part 2', 'Reseña', '140-190', 'You see this notice on an English-language website for students:

Reviews wanted! Write a review of a restaurant you have been to recently. Tell us about the food, the atmosphere and the service, and say whether you would recommend it to other students.

Write your review in 140-190 words.', 'Reseña de restaurante'),
  ('B2-WRI-001-P2C', 'B2', '001', 'Part 2', 'Informe', '140-190', 'Your school is thinking about starting a new after-school sports programme and the director has asked students for their views.

Write a report for the school director. In your report, you should:
• say which sports students would be most interested in
• make recommendations for the new programme

Write your report in 140-190 words.', 'Deportes escolares'),
  ('B2-WRI-002-P1', 'B2', '002', 'Part 1', 'Essay', '140-190', 'Your English class recently discussed the topic of schoolwork. Your teacher has set the following essay as homework.

Question: Does homework help students learn more effectively?

Base your essay on both of the notes below, add a third idea of your own, and support your opinion with clear reasons throughout.

Notes
1. Academic results
2. Free time
3. ......................... (your own idea)

Write your essay in 140-190 words.', 'Tareas escolares'),
  ('B2-WRI-002-P2A', 'B2', '002', 'Part 2', 'Artículo', '140-190', 'You see this announcement on a travel website:

Articles wanted! Tell us about a memorable trip you have taken. Where did you go, what did you do, and why would you recommend it to other travellers?

Write your article in 140-190 words.', 'Viaje memorable'),
  ('B2-WRI-002-P2B', 'B2', '002', 'Part 2', 'Carta formal', '140-190', 'You recently bought a product online, but it arrived damaged. You have decided to write to the company.

Write a letter to the company. In your letter, you should:
• describe the problem with the product
• explain what happened when it arrived
• say what you would like the company to do

Write your letter in 140-190 words.', 'Reclamo formal'),
  ('B2-WRI-002-P2C', 'B2', '002', 'Part 2', 'Informe', '140-190', 'Your college principal has asked students to suggest improvements to the student common room.

Write a report for your college principal. In your report, you should:
• describe the current problems with the common room
• make recommendations for improvements

Write your report in 140-190 words.', 'Mejoras en el colegio'),
  ('B2-WRI-003-P1', 'B2', '003', 'Part 1', 'Essay', '140-190', 'Your English class recently discussed the topic of technology. Your teacher has set the following essay as homework.

Question: Has technology improved the way people communicate?

Base your essay on both of the notes below, add a third idea of your own, and support your opinion with clear reasons throughout.

Notes
1. Convenience
2. Face-to-face relationships
3. ......................... (your own idea)

Write your essay in 140-190 words.', 'Tecnología y comunicación'),
  ('B2-WRI-003-P2A', 'B2', '003', 'Part 2', 'Email', '140-190', 'You have started writing to a new pen pal from another country. You want to tell them about your life.

Write an email to your pen pal. In your email, you should:
• describe your town
• describe your daily routine
• say what you enjoy doing in your free time

Write your email in 140-190 words.', 'Pen pal'),
  ('B2-WRI-003-P2B', 'B2', '003', 'Part 2', 'Reseña', '140-190', 'You see this notice on your school magazine''s website:

Reviews wanted! Write a review of a film you have watched recently. Briefly describe the plot and give your opinion on the acting and the ending.

Write your review in 140-190 words.', 'Reseña de película'),
  ('B2-WRI-003-P2C', 'B2', '003', 'Part 2', 'Artículo', '140-190', 'You see this announcement on a magazine for young people:

Articles wanted! Tell us about a hobby you enjoy. How did you start it, and why would you recommend it to other people your age?

Write your article in 140-190 words.', 'Hobbies'),
  ('B2-WRI-004-P1', 'B2', '004', 'Part 1', 'Essay', '140-190', 'Your English class recently discussed the topic of young people''s free time. Your teacher has set the following essay as homework.

Question: Is volunteering a valuable use of young people''s free time?

Base your essay on both of the notes below, add a third idea of your own, and support your opinion with clear reasons throughout.

Notes
1. New skills
2. Financial needs
3. ......................... (your own idea)

Write your essay in 140-190 words.', 'Voluntariado'),
  ('B2-WRI-004-P2A', 'B2', '004', 'Part 2', 'Carta', '140-190', 'A friend of yours is planning to move to your city and has written to you asking for advice.

Write a letter to your friend. In your letter, you should:
• give advice about accommodation
• give advice about transport
• suggest things to do in the city

Write your letter in 140-190 words.', 'Consejos para mudanza'),
  ('B2-WRI-004-P2B', 'B2', '004', 'Part 2', 'Informe', '140-190', 'Your manager has asked staff to suggest ways of improving the office environment.

Write a report for your manager. In your report, you should:
• describe the current problems in the office
• make recommendations for improvements, based on feedback from colleagues

Write your report in 140-190 words.', 'Ambiente laboral'),
  ('B2-WRI-004-P2C', 'B2', '004', 'Part 2', 'Reseña', '140-190', 'You see this notice on a local newspaper''s website:

Reviews wanted! Write a review of a concert or live event you attended recently. Describe the atmosphere and the performance.

Write your review in 140-190 words.', 'Reseña de concierto'),
  ('B2-WRI-005-P1', 'B2', '005', 'Part 1', 'Essay', '140-190', 'Your English class recently discussed the topic of school subjects. Your teacher has set the following essay as homework.

Question: Should schools teach financial literacy as a compulsory subject?

Base your essay on both of the notes below, add a third idea of your own, and support your opinion with clear reasons throughout.

Notes
1. Life skills
2. Curriculum time
3. ......................... (your own idea)

Write your essay in 140-190 words.', 'Educación financiera'),
  ('B2-WRI-005-P2A', 'B2', '005', 'Part 2', 'Artículo', '140-190', 'You see this announcement on a magazine website:

Articles wanted! Tell us about the best way to learn a new language, based on your own experience.

Write your article in 140-190 words.', 'Aprender idiomas'),
  ('B2-WRI-005-P2B', 'B2', '005', 'Part 2', 'Email', '140-190', 'Your college is hosting an exchange student next month, and you have been asked to write to them before they arrive.

Write an email to the exchange student. In your email, you should:
• welcome them
• give tips about the college
• give tips about the local area

Write your email in 140-190 words.', 'Bienvenida a intercambio'),
  ('B2-WRI-005-P2C', 'B2', '005', 'Part 2', 'Informe', '140-190', 'The student council has asked students for feedback on the food available in the college canteen.

Write a report for the student council. In your report, you should:
• summarise students'' opinions about the canteen food
• make recommendations for improvements

Write your report in 140-190 words.', 'Comedor escolar'),
  ('C1-WRI-001-P1', 'C1', '001', 'Part 1', 'Essay', '220-260', 'Your class has listened to a talk about how the arts should be funded.

• government funding
• private sponsorship
• ticket and sales revenue

Some opinions expressed in the talk:
"Only the government can guarantee that art stays diverse."
"Businesses will only fund what makes them look good."
"People should pay for what they actually want to see."

In your essay, choose and discuss two of the three funding methods above, and make clear which of the two you consider more effective, supporting your view with well-developed reasons.

Write your essay in 220-260 words.', 'Financiación del arte'),
  ('C1-WRI-001-P2A', 'C1', '001', 'Part 2', 'Propuesta', '220-260', 'Your local council has asked students to submit proposals about how to increase young people''s participation in community events.

Write a proposal for the local council. In your proposal, you should:
• describe the current problems
• suggest specific improvements
• explain the likely costs and benefits

Write your proposal in 220-260 words.', 'Participación juvenil'),
  ('C1-WRI-001-P2B', 'C1', '001', 'Part 2', 'Reseña', '220-260', 'An arts magazine has asked readers to review exhibitions or works of public art they have seen recently.

Write a review for the magazine. In your review, you should:
• describe the exhibition or work of art
• evaluate its impact on visitors

Write your review in 220-260 words.', 'Reseña de exposición'),
  ('C1-WRI-001-P2C', 'C1', '001', 'Part 2', 'Informe', '220-260', 'The management of the company you work for is considering introducing flexible working hours and has asked staff for a report.

Write a report for your company''s management. In your report, you should:
• evaluate the potential benefits of flexible working hours
• evaluate the potential drawbacks

Write your report in 220-260 words.', 'Horarios flexibles'),
  ('C1-WRI-002-P1', 'C1', '002', 'Part 1', 'Essay', '220-260', 'Your class has read an article about how resources should be spent to benefit humanity.

• space exploration
• medical research
• poverty reduction

Some opinions expressed in the article:
"We won''t survive as a species if we don''t look beyond Earth."
"Curing diseases would save more lives right now."
"Ending poverty should always come first."

In your essay, choose and discuss two of the three priorities above, and make clear which of the two you consider more important, supporting your view with well-developed reasons.

Write your essay in 220-260 words.', 'Exploración espacial'),
  ('C1-WRI-002-P2A', 'C1', '002', 'Part 2', 'Carta formal', '220-260', 'You recently read an article in a magazine that you strongly disagreed with.

Write a letter to the editor. In your letter, you should:
• explain which points in the article you disagreed with
• present an alternative view, giving reasons

Write your letter in 220-260 words.', 'Carta al editor'),
  ('C1-WRI-002-P2B', 'C1', '002', 'Part 2', 'Propuesta', '220-260', 'Your city council is reviewing the public transport system and has invited residents to submit proposals.

Write a proposal for the city council. In your proposal, you should:
• suggest specific improvements to the public transport system
• explain the likely costs and benefits

Write your proposal in 220-260 words.', 'Transporte público'),
  ('C1-WRI-002-P2C', 'C1', '002', 'Part 2', 'Reseña', '220-260', 'A magazine has asked readers to review a book that changed the way they thought about a particular topic.

Write a review for the magazine. In your review, you should:
• describe the content of the book
• explain the impact it had on you

Write your review in 220-260 words.', 'Reseña de libro'),
  ('C1-WRI-003-P1', 'C1', '003', 'Part 1', 'Essay', '220-260', 'Your class has listened to a discussion about the effects of social media.

• staying connected
• mental wellbeing
• spreading misinformation

Some opinions expressed in the discussion:
"I feel closer to my friends because of social media."
"Comparing your life to others online makes you unhappy."
"It''s too easy for false information to spread."

In your essay, choose and discuss two of the three effects above, and make clear which of the two you consider more significant, supporting your view with well-developed reasons.

Write your essay in 220-260 words.', 'Redes sociales'),
  ('C1-WRI-003-P2A', 'C1', '003', 'Part 2', 'Informe', '220-260', 'Your university is reviewing the support services available to international students and has asked for a report based on student feedback.

Write a report for your university. In your report, you should:
• summarise the feedback collected from international students
• make recommendations for improving support services

Write your report in 220-260 words.', 'Estudiantes internacionales'),
  ('C1-WRI-003-P2B', 'C1', '003', 'Part 2', 'Reseña', '220-260', 'A magazine has asked readers to review documentaries that addressed an important social issue.

Write a review for the magazine. In your review, you should:
• describe the documentary and the issue it addressed
• evaluate how effectively it presented the topic

Write your review in 220-260 words.', 'Reseña de documental'),
  ('C1-WRI-003-P2C', 'C1', '003', 'Part 2', 'Propuesta', '220-260', 'Your college is considering introducing a mentorship scheme for first-year students and has invited proposals.

Write a proposal for your college. In your proposal, you should:
• outline how the mentorship scheme would work
• explain its expected benefits

Write your proposal in 220-260 words.', 'Mentoría estudiantil'),
  ('C1-WRI-004-P1', 'C1', '004', 'Part 1', 'Essay', '220-260', 'Your class has read an article about the impact of automation and artificial intelligence on employment.

• new job creation
• job security
• retraining opportunities

Some opinions expressed in the article:
"New industries will always create new kinds of jobs."
"Many people will lose the only skills they have."
"Governments should invest in retraining workers."

In your essay, choose and discuss two of the three aspects above, and make clear which of the two you consider more important, supporting your view with well-developed reasons.

Write your essay in 220-260 words.', 'Automatización e IA'),
  ('C1-WRI-004-P2A', 'C1', '004', 'Part 2', 'Carta formal', '220-260', 'You have seen an advertisement for a competitive internship and have decided to apply.

Write a letter of application. In your letter, you should:
• describe your relevant skills and experience
• explain why you would be a strong candidate

Write your letter in 220-260 words.', 'Carta de postulación'),
  ('C1-WRI-004-P2B', 'C1', '004', 'Part 2', 'Informe', '220-260', 'The management of the company you work for has asked staff to submit reports proposing sustainability initiatives.

Write a report for your company''s management. In your report, you should:
• suggest specific sustainability initiatives
• explain their likely benefits

Write your report in 220-260 words.', 'Sustentabilidad laboral'),
  ('C1-WRI-004-P2C', 'C1', '004', 'Part 2', 'Reseña', '220-260', 'A technology magazine has asked readers to review a piece of technology or an app they use regularly.

Write a review for the magazine. In your review, you should:
• describe the technology or app
• evaluate its usefulness and design

Write your review in 220-260 words.', 'Reseña de tecnología'),
  ('C1-WRI-005-P1', 'C1', '005', 'Part 1', 'Essay', '220-260', 'Your class has listened to a discussion about who should pay for higher education.

• government funding
• student loans
• personal savings

Some opinions expressed in the discussion:
"Education is a right, not a privilege for those who can pay."
"Loans let students invest in their own future."
"People value what they have worked to save for."

In your essay, choose and discuss two of the three funding methods above, and make clear which of the two you consider fairer, supporting your view with well-developed reasons.

Write your essay in 220-260 words.', 'Educación superior'),
  ('C1-WRI-005-P2A', 'C1', '005', 'Part 2', 'Propuesta', '220-260', 'Your university is reviewing its careers guidance services and has invited proposals from students.

Write a proposal for your university. In your proposal, you should:
• describe the current gaps in the careers guidance service
• suggest specific improvements

Write your proposal in 220-260 words.', 'Orientación laboral'),
  ('C1-WRI-005-P2B', 'C1', '005', 'Part 2', 'Reseña', '220-260', 'A magazine has asked readers to review courses or educational programmes they have completed.

Write a review for the magazine. In your review, you should:
• describe the content of the course
• evaluate its usefulness for your goals

Write your review in 220-260 words.', 'Reseña de curso'),
  ('C1-WRI-005-P2C', 'C1', '005', 'Part 2', 'Informe', '220-260', 'Your institution is reviewing how classes are delivered and has asked for a report comparing remote and in-person classes, based on student feedback.

Write a report for your institution. In your report, you should:
• summarise student feedback comparing the two formats
• make recommendations

Write your report in 220-260 words.', 'Clases remotas vs. presenciales');
