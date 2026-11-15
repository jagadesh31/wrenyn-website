export const CONTACT_TOPICS = ["Product idea", "Kexoz support", "Working together", "Something else"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export function parseContact(body: Record<string, unknown>) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const topic = body.topic as ContactTopic;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." } as const;
  if (name.length > 100) return { error: "Keep your name under 100 characters." } as const;
  if (!CONTACT_TOPICS.includes(topic)) return { error: "Choose what you would like to talk about." } as const;
  if (message.length < 10 || message.length > 4000) return { error: "Add a message between 10 and 4,000 characters." } as const;
  return { value: { email, name, message, topic } } as const;
}
