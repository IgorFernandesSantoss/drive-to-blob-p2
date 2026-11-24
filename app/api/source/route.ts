import { listSourceFiles } from "@/lib/drive";
import { handle } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = () => handle(listSourceFiles);
