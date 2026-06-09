import type { getTasteDnaPageData } from "@/lib/taste-dna/page-data";

export type TasteDnaPageData = NonNullable<
  Awaited<ReturnType<typeof getTasteDnaPageData>>
>;

export type TasteInsight = {
  label: string;
  title: string;
  explanation: string;
  evidence: string[];
};

export function createTasteInsights(dna: TasteDnaPageData): TasteInsight[] {
  const strongestAffinity = dna.affinities[0];
  const strongestSignal = dna.ratingSignals.find(
    (signal) => signal.likedTraits.length > 0
  );
  const contrastSignal = dna.ratingSignals.find(
    (signal) => signal.dislikedTraits.length > 0
  );

  return [
    {
      label: "Core Pattern",
      title: dna.anchors[0]
        ? `You repeatedly return to ${dna.anchors[0]}.`
        : "Your core pattern is still taking shape.",
      explanation: dna.anchors.length
        ? `Your strongest anchors suggest that ${joinNatural(dna.anchors.slice(0, 3))} are reliable ingredients in a good match.`
        : "A few more favorites and ratings will reveal the ingredients that consistently work for you.",
      evidence: dna.anchors.slice(0, 4),
    },
    {
      label: "Category Pull",
      title: strongestAffinity
        ? `${strongestAffinity.label} currently has the strongest pull.`
        : "Your category preference is broad.",
      explanation: strongestAffinity
        ? `Its ${Math.round(strongestAffinity.value)}% affinity makes it a confident starting point, while lower-ranked categories leave room for useful surprises.`
        : "Moodmatch will keep category choices balanced until your interactions reveal a clearer direction.",
      evidence: dna.affinities.slice(0, 3).map((item) => item.label),
    },
    {
      label: "Rating Lesson",
      title: strongestSignal
        ? `${strongestSignal.title} clarified what works.`
        : "Your next rating can teach Moodmatch something specific.",
      explanation: strongestSignal
        ? `The positive feedback around ${joinNatural(strongestSignal.likedTraits.slice(0, 3))} is now part of how future picks are judged.`
        : "Adding liked and disliked traits after a rating gives the profile more useful evidence than stars alone.",
      evidence: strongestSignal?.likedTraits.slice(0, 4) ?? [],
    },
    {
      label: "Useful Tension",
      title: contrastSignal
        ? `You enjoy discovery, but not every kind of friction.`
        : "Your comfort boundaries remain flexible.",
      explanation: contrastSignal
        ? `Your feedback asks Moodmatch to reduce ${joinNatural(contrastSignal.dislikedTraits.slice(0, 3))}, even when the overall recommendation is promising.`
        : dna.avoidances.length
          ? `Your profile currently steers around ${joinNatural(dna.avoidances.slice(0, 3))}.`
          : "No strong negative pattern has emerged yet, so recommendations can stay exploratory.",
      evidence:
        contrastSignal?.dislikedTraits.slice(0, 4) ?? dna.avoidances.slice(0, 4),
    },
  ];
}

export async function answerTasteQuestion(
  question: string,
  dna: TasteDnaPageData
) {
  if (!isTasteQuestion(question)) {
    return {
      answer:
        "I can help with questions about your taste, ratings, recommendation patterns, moods, and what to try next. Ask me something connected to your Taste DNA.",
      source: "local" as const,
    };
  }

  if (hasAzureAiConfig()) {
    try {
      const answer = await answerWithAzureAi(question, dna);
      return { answer, source: "azure-ai" as const };
    } catch {
      // Keep the taste conversation useful if the external model is unavailable.
    }
  }

  return {
    answer: answerLocally(question, dna),
    source: "local" as const,
  };
}

async function answerWithAzureAi(question: string, dna: TasteDnaPageData) {
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
              "You are Moodmatch Taste AI. Answer only questions about the user's media taste and recommendations. Ground every answer in the provided Taste DNA. Be concise, specific, spoiler-free, and admit when evidence is limited.",
          },
          {
            role: "user",
            content: JSON.stringify({ question, tasteDna: compactDna(dna) }),
          },
        ],
        temperature: 0.35,
        max_tokens: 350,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Azure AI explanation failed.");
  }

  const body = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = body.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Azure AI returned an empty explanation.");
  }

  return content;
}

function answerLocally(question: string, dna: TasteDnaPageData) {
  const normalized = question.toLowerCase();
  const strongest = dna.affinities[0];
  const likedTraits = unique(
    dna.ratingSignals.flatMap((signal) => signal.likedTraits)
  );
  const dislikedTraits = unique(
    dna.ratingSignals.flatMap((signal) => signal.dislikedTraits)
  );

  if (includesAny(normalized, ["surprise", "new", "different", "explore"])) {
    const secondary = dna.affinities[1]?.label;
    return `A useful surprise would keep ${joinNatural((likedTraits.length ? likedTraits : dna.anchors).slice(0, 2))} as familiar ground, then move into ${secondary ?? "a less familiar category"}. That fits your ${dna.recommendationStyle.toLowerCase()} profile without becoming random.`;
  }

  if (includesAny(normalized, ["avoid", "dislike", "not like", "boundary"])) {
    const boundaries = unique([...dislikedTraits, ...dna.avoidances]);
    return boundaries.length
      ? `The clearest things to steer around are ${joinNatural(boundaries.slice(0, 4))}. I would treat those as filters, while keeping the rest of the recommendation adventurous.`
      : "You have not given enough negative feedback for a strong avoidance pattern yet. Adding disliked traits after ratings will make this answer much sharper.";
  }

  if (includesAny(normalized, ["why", "pattern", "taste", "describe"])) {
    return `Your current pattern is ${dna.recommendationStyle.toLowerCase()}. The strongest evidence is ${joinNatural(dna.anchors.slice(0, 3)) || "still emerging"}, supported by ${strongest ? `${strongest.label} as your highest-affinity category` : "a broad category mix"}.`;
  }

  if (includesAny(normalized, ["recommend", "next", "watch", "read", "play"])) {
    return `Your next pick should probably come from ${strongest?.label ?? "one of your selected categories"} and emphasize ${joinNatural((likedTraits.length ? likedTraits : dna.moodKeywords).slice(0, 3))}. I would keep ${joinNatural(unique([...dislikedTraits, ...dna.avoidances]).slice(0, 2)) || "your current comfort settings"} out of the way.`;
  }

  return `Your Taste DNA currently points toward ${joinNatural(dna.anchors.slice(0, 3)) || dna.recommendationStyle.toLowerCase()}. The profile is ${Math.round(dna.confidence * 100)}% confident, so this is a useful direction rather than a fixed label.`;
}

function compactDna(dna: TasteDnaPageData) {
  return {
    summary: dna.summary,
    confidence: dna.confidence,
    recommendationStyle: dna.recommendationStyle,
    affinities: dna.affinities.slice(0, 6),
    anchors: dna.anchors.slice(0, 8),
    moodKeywords: dna.moodKeywords.slice(0, 8),
    avoidances: dna.avoidances.slice(0, 8),
    ratingSignals: dna.ratingSignals.slice(0, 6),
  };
}

function hasAzureAiConfig() {
  return Boolean(
    process.env.AZURE_AI_ENDPOINT &&
      process.env.AZURE_AI_API_KEY &&
      process.env.AZURE_AI_DEPLOYMENT
  );
}

function isTasteQuestion(question: string) {
  return includesAny(question.toLowerCase(), [
    "taste",
    "recommend",
    "movie",
    "show",
    "book",
    "game",
    "watch",
    "read",
    "play",
    "rating",
    "like",
    "dislike",
    "avoid",
    "mood",
    "genre",
    "story",
    "character",
    "surprise",
    "pattern",
    "next",
    "favorite",
  ]);
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function unique(items: string[]) {
  return [...new Set(items)];
}

function joinNatural(items: string[]) {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}
