import { listDestinationBlobs } from "@/lib/blob";
import { handle } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = () => handle(listDestinationBlobs);
