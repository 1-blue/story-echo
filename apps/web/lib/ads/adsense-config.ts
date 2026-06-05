export type AdSenseConfig = {
  client: string;
  slot: string;
  adTest: boolean;
};

export function getAdSenseConfig(): AdSenseConfig | null {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim();

  if (!client || !slot) return null;

  return {
    client,
    slot,
    adTest: process.env.NEXT_PUBLIC_ADSENSE_ADTEST === "on",
  };
}
