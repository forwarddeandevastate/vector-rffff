import { buildRoutePageMetadata, createRoutePage } from "@/lib/route-page";

export const revalidate = 86400;
export const dynamicParams = true;

export const generateMetadata = buildRoutePageMetadata("taxi-mezhgorod");

export default createRoutePage("taxi-mezhgorod");
