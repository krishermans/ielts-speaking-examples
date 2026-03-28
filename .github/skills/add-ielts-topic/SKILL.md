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
2. Use source pages for inspiration, structure, and fact gathering. Prefer IELTS related content from reputable sites like ieltsliz.com.
3. You may copy verbatim, as this content will be never published publicly and is for internal use only.
4. Record attribution in the `sources` array with URL and short notes.

## Output format

Each topic file must be Markdown and must include:

- short introduction to the topic
- vocabulary table with English terms and Dutch translations, try to include at least 10 items, but max 20.
- 3 to 6 short questions with concise model answers written in a Band 7.5 to 8 speaking style
- 2 to 4 essay or discussion questions (with some suggested points to cover, but no full model answers)
- Study tips or additional notes if relevant

## Quality bar

1. Add 10 to 20 vocabulary items.
2. Add 3 to 6 short questions.
3. Add 2 to 4 essay or discussion questions.
4. Keep answers concise, natural, and useful for spoken practice.
5. **Dutch translations must be current and widely used**:
	- Favor common, modern equivalents over diminutives or archaic forms (e.g., "groene vingers hebben" instead of "een groen duimpje hebben")
	- Verify idioms are in active use by native speakers, not outdated variants
	- When offering alternatives, list the most common first
	- Use Flemish Dutch forms where they are genuinely more natural (e.g., diminutives in cultural contexts), but default to standard Dutch
	- Single clear translations over multiple options unless genuinely interchangeable
6. Keep tone simple and clean.
7. Model answers must consistently target Band 7.5 to 8 quality: flexible vocabulary, clear opinion, natural linking, and varied sentence structures without sounding scripted.
8. **Validate Dutch translations**: Prioritize common usage over diminutives or regional variants. Avoid translating phrasal verbs with uncommon older forms that modern speakers rarely use.

## Workflow

1. Fetch the approved source pages.
2. Extract the topic angle and useful vocabulary ideas.
3. Draft adapted content in the repo schema.
4. Add the new markdown file under `src/content/topics/`.
5. If needed, update any documentation that lists authoring conventions.
6. Follow the same structure and style as existing topic files for consistency. Art-and-the-arts.md and plants.md are good references for formatting and tone.
7. When drafting or refreshing short model answers, upgrade language level to Band 7.5 to 8 while keeping answers concise and natural for spoken delivery.