type TasteDnaInput = {
  categories: string[];
  favorites: string[];
  alreadyExperienced: string[];
  confirmedTags: string[];
  rejectedTags: string[];
  comfortSettings: Record<string, unknown> | null;
  sliders: Record<string, unknown>[];
};

export type GeneratedTasteDna = {
  summary: string;
  traits: {
    anchors: string[];
    categoryAffinities: Record<string, number>;
    moodKeywords: string[];
    avoidances: string[];
    recommendationStyle: string;
    confidence: number;
    source: "azure-ai" | "local-fallback";
  };
};

export async function generateTasteDna(
  input: TasteDnaInput
): Promise<GeneratedTasteDna> {
  if (hasAzureAiConfig()) {
    try {
      return await generateWithAzureAi(input);
    } catch {
      return generateLocalTasteDna(input);
    }
  }

  return generateLocalTasteDna(input);
}

function hasAzureAiConfig() {
  return Boolean(
    process.env.AZURE_AI_ENDPOINT &&
      process.env.AZURE_AI_API_KEY &&
      process.env.AZURE_AI_DEPLOYMENT
  );
}

async function generateWithAzureAi(
  input: TasteDnaInput
): Promise<GeneratedTasteDna> {
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
              "You generate concise Taste DNA profiles. Return only valid JSON with summary and traits.",
          },
          {
            role: "user",
            content: JSON.stringify({
              instructions:
                "Create a Taste DNA profile with anchors, categoryAffinities, moodKeywords, avoidances, recommendationStyle, confidence.",
              input,
            }),
          },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Azure AI Taste DNA generation failed.");
  }

  const body = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = body.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Azure AI returned an empty Taste DNA response.");
  }

  const parsed = JSON.parse(content) as Omit<GeneratedTasteDna, "traits"> & {
    traits: Omit<GeneratedTasteDna["traits"], "source">;
  };

  return {
    summary: parsed.summary,
    traits: {
      anchors: parsed.traits.anchors ?? [],
      categoryAffinities: parsed.traits.categoryAffinities ?? {},
      moodKeywords: parsed.traits.moodKeywords ?? [],
      avoidances: parsed.traits.avoidances ?? [],
      recommendationStyle:
        parsed.traits.recommendationStyle ?? "Balanced and exploratory",
      confidence: parsed.traits.confidence ?? 0.65,
      source: "azure-ai",
    },
  };
}

function generateLocalTasteDna(input: TasteDnaInput): GeneratedTasteDna {
  const anchors = [...input.confirmedTags, ...input.favorites].slice(0, 8);
  const moodKeywords = input.confirmedTags.length
    ? input.confirmedTags.slice(0, 6)
    : ["curious", "balanced", "taste-building"];
  const avoidances = [
    ...input.rejectedTags,
    ...extractComfortAvoidances(input.comfortSettings),
  ].slice(0, 8);
  const categoryAffinities = Object.fromEntries(
    input.categories.map((category, index) => [
      category,
      Math.max(55, 90 - index * 6),
    ])
  );

  return {
    summary:
      anchors.length > 0
        ? `You seem drawn to ${anchors.slice(0, 3).join(", ")}. Moodmatch will start with confident picks and adjust as you rate.`
        : "Moodmatch has enough starter signals to begin learning, and every rating will sharpen this profile.",
    traits: {
      anchors,
      categoryAffinities,
      moodKeywords,
      avoidances,
      recommendationStyle: inferRecommendationStyle(input.sliders),
      confidence: input.favorites.length + input.confirmedTags.length > 4 ? 0.72 : 0.58,
      source: "local-fallback",
    },
  };
}

function extractComfortAvoidances(settings: Record<string, unknown> | null) {
  if (!settings) {
    return [];
  }

  const avoidances: string[] = [];

  if (settings.avoidSpoilers) avoidances.push("spoilers");
  if (settings.avoidExplicitContent) avoidances.push("explicit content");
  if (settings.avoidViolence) avoidances.push("heavy violence");
  if (settings.avoidHorror) avoidances.push("horror");
  if (settings.avoidSadEndings) avoidances.push("sad endings");
  if (Array.isArray(settings.customAvoidList)) {
    avoidances.push(
      ...settings.customAvoidList.filter(
        (item): item is string => typeof item === "string"
      )
    );
  }

  return avoidances;
}

function inferRecommendationStyle(sliders: Record<string, unknown>[]) {
  const averageNovelty = averageSlider(sliders, "novelty");
  const averageComfort = averageSlider(sliders, "comfort");

  if (averageNovelty > 65) {
    return "Exploratory, with room for surprising picks";
  }

  if (averageComfort > 65) {
    return "Comfort-forward, familiar, and low-friction";
  }

  return "Balanced between reliable favorites and fresh discoveries";
}

function averageSlider(rows: Record<string, unknown>[], key: string) {
  if (rows.length === 0) {
    return 50;
  }

  const total = rows.reduce((sum, row) => sum + Number(row[key] ?? 50), 0);
  return total / rows.length;
}
