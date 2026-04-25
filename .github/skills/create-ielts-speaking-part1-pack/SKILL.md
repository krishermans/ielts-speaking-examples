---
name: create-ielts-speaking-part1-pack
description: "Use when: creating IELTS Speaking Part 1 study documents per topic with idea banks, English-Dutch word lists, and paraphrasing synonyms based on IELTS Liz topic pages"
---

# Create IELTS Speaking Part 1 Pack

Use this skill when the user wants a complete IELTS Speaking Part 1 prep set organized by topic.

## Goal

Create one markdown document per Part 1 topic in `src/content/topics/`.

## Source and adaptation rules

1. Use only user-approved URLs.
2. Use source content for topic coverage and question style.
3. Adapt phrasing into concise study notes for speaking practice.
4. Add source attribution in frontmatter.

## Required structure per topic file

Each file should contain:

- YAML frontmatter with `title` and `sources`
- A short intro for the topic
- `# <Topic Title>` heading
- `### Ideas Bank` with practical talking points
- `### Vocabulary List (English - Dutch)` table
- `### Paraphrasing Synonyms` table
- `### Part 1 Prompt Starters` list
- `### Sample Short Questions & Model Answers` with 3 to 5 concise answers
- `### Study Tips` list

## Quality bar

1. Include 4 to 8 vocabulary items with clear Dutch translations.
2. Include 4 to 8 synonym/paraphrase pairs.
3. Keep language natural and spoken, useful for IELTS Part 1.
4. Keep ideas concrete and personal so learners can answer quickly.
5. Keep each file short and scannable.
6. Ensure prompt starters are topic-specific and aligned with common IELTS Part 1 wording.
7. Keep model answers question-matched and varied; avoid repeating generic templates across topics.

## Workflow

1. Fetch and extract Part 1 topics from the approved source page.
2. Normalize topic names into lowercase hyphenated file names.
3. Create one file per topic in `src/content/topics/`.
4. Ensure every file includes EN-NL vocabulary and paraphrasing synonyms.
5. Verify file count and basic section consistency after generation.
