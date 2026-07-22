import StudioClient from "./StudioClient";

export function generateStaticParams() {
  return [{ tool: [] }];
}

export const dynamicParams = false;

export default function StudioPage() {
  return <StudioClient />;
}
