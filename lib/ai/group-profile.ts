export type GroupProfile = {
  summary: string;
  sharedPriorities: string[];
  tensions: string[];
  strategy: string;
  source: "azure-ai" | "local";
};

export async function createGroupProfile(input: {
  tastes: string;
  vibe: string;
  groupSize: number;
}): Promise<GroupProfile> {
  if (hasAzureAiConfig()) {
    try {
      return await createWithAzureAi(input);
    } catch {
      // Group mode remains usable if the external model is unavailable.
    }
  }

  return createLocalProfile(input);
}

async function createWithAzureAi(input: {
  tastes: string;
  vibe: string;
  groupSize: number;
}) {
  const endpoint = process.env.AZURE_AI_ENDPOINT?.replace(/\/$/, "");
  const deployment = process.env.AZURE_AI_DEPLOYMENT;
  const apiKey = process.env.AZURE_AI_API_KEY;
  const response = await fetch(
    `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": String(apiKey),
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "Create a concise movie-night group preference profile. Return only JSON with summary, sharedPriorities, tensions, and strategy. Be spoiler-free.",
          },
          { role: "user", content: JSON.stringify(input) },
        ],
        temperature: 0.35,
        response_format: { type: "json_object" },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Azure group profile failed.");
  }

  const body = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error("Azure group profile was empty.");

  const parsed = JSON.parse(content) as Partial<GroupProfile>;
  return {
    summary:
      parsed.summary ??
      "A group looking for enough common ground and one memorable angle.",
    sharedPriorities: stringList(parsed.sharedPriorities).slice(0, 5),
    tensions: stringList(parsed.tensions).slice(0, 4),
    strategy:
      parsed.strategy ??
      "Start with accessible common ground, then leave room for a surprise.",
    source: "azure-ai" as const,
  };
}

function createLocalProfile(input: {
  tastes: string;
  vibe: string;
  groupSize: number;
}): GroupProfile {
  const words = input.tastes
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4);
  const priorities = [...new Set(words)].slice(0, 5);

  return {
    summary: `${input.groupSize} people looking for a ${input.vibe.toLowerCase()} movie night with enough common ground for everyone.`,
    sharedPriorities:
      priorities.length > 0
        ? priorities
        : ["accessible story", "strong pacing", "shared experience"],
    tensions: [
      "familiar comfort versus novelty",
      "broad appeal versus a distinctive point of view",
    ],
    strategy:
      "Lead with a confident crowd-pleaser, keep compromise picks balanced, and make the wildcard meaningfully different.",
    source: "local",
  };
}

function hasAzureAiConfig() {
  return Boolean(
    process.env.AZURE_AI_ENDPOINT &&
      process.env.AZURE_AI_API_KEY &&
      process.env.AZURE_AI_DEPLOYMENT
  );
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
