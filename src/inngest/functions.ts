import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import JSONL from "jsonl-parse-stringify";
import { db } from "@/db";
import { user, agents, meetings } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import OpenAI from "openai";


// DIRECT OpenAI client (replaces agent-kit)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// MEETING PROCESSING FUNCTION
export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    // 1️⃣ FETCH TRANSCRIPT
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    // 2️⃣ PARSE JSONL
    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    // 3️⃣ ADD SPEAKERS
    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds));

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds));

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find((s) => s.id === item.speaker_id);

        return {
          ...item,
          user: {
            name: speaker?.name ?? "unknown",
          },
        };
      });
    });

    // 4️⃣ OPENAI SUMMARY (replaces agent-kit)
    const summary = await step.run("summarize", async () => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
       You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
            `.trim(),
          },
          {
            role: "user",
            content:
              "Summarize this meeting transcript:\n" +
              JSON.stringify(transcriptWithSpeakers),
          },
        ],
      });

      return completion.choices[0].message.content;
    });

    // 5️⃣ SAVE TO DB
    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: summary ?? "",
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });
  }
);
