import { createClient } from "contentful";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "e8y2nngpr6yc";
const accessToken =
  process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ||
  "upNLkRBWF2F3B_I_LkpJsd09KxfJh7_N2G2Fp_awRxY";

export const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});
