---
name: add-ielts-topic
description: "Use when: adding a new IELTS speaking topic, creating vocabulary table with Dutch translations, collecting adapted speaking questions from source websites like ieltsliz.com"
---

# Add IELTS Topic

Use this skill when the user wants to add or refresh a topic in the speaking catalog. This involves creating or updating a markdown file in `src/content/topics/` that includes an introduction, a vocabulary table with Dutch translations, and sets of short and essay questions adapted from approved source websites. The content should be fluent, natural, and useful for spoken practice, while adhering to the quality standards defined by IELTS and the internal quality bar.

## Goal

Create a new topic content file in `src/content/topics/` that matches the existing schema and quality bar.

## Source rules

1. Fetch only the URLs the user provides or clearly approves.
2. Use source pages for inspiration, structure, and fact gathering.
3. You may copy verbatim, as this content will be never published publicly and is for internal use only.
4. Record attribution in the `sources` array with URL and short notes.

## Output format

Each topic file must be Markdown and must include:

- short introduction to the topic
- vocabulary table with English terms and Dutch translations
- 3 to 6 short questions with concise model answers
- 2 to 4 essay or discussion questions (with some suggested points to cover, but no full model answers)
- Study tips or additional notes if relevant

## Quality bar

1. Add 4 to 10 vocabulary items.
2. Add 3 to 6 short questions.
3. Add 2 to 4 essay or discussion questions.
4. Keep answers concise, natural, and useful for spoken practice.
5. Make Dutch translations idiomatic rather than word-for-word when needed.
6. Keep tone simple and clean.

## Workflow

1. Fetch the approved source pages.
2. Extract the topic angle and useful vocabulary ideas.
3. Draft adapted content in the repo schema.
4. Add the new markdown file under `src/content/topics/`.
5. If needed, update any documentation that lists authoring conventions.
6. Follow the same structure and style as existing topic files for consistency. Arts.md is a good reference for formatting and tone.