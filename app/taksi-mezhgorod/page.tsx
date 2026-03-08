import KeywordLandingPage, { buildKeywordLandingMetadata } from "@/app/ui/keyword-landing-page";
import { KEYWORD_LANDINGS_BY_SLUG } from "@/lib/keyword-landings";

const CONFIG = KEYWORD_LANDINGS_BY_SLUG["taksi-mezhgorod"];

export const metadata = buildKeywordLandingMetadata(CONFIG);

export default function Page() {
  return <KeywordLandingPage config={CONFIG} />;
}
