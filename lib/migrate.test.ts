import { expect, test } from "bun:test";

import { migrate } from "@/lib/migrate";
import type { SourceFile } from "@/lib/types";

const file = (name: string): SourceFile => ({ id: name, name, mimeType: "text/plain", size: 3 });

test("falha em um arquivo é reportada e não interrompe os demais", async () => {
  const uploaded: string[] = [];
  const lines: string[] = [];
  const results = await migrate([file("a.txt"), file("quebra.txt"), file("c.txt")], {
    download: async (f) => {
      if (f.name === "quebra.txt") throw new Error("sem permissão");
      return Buffer.from("abc");
    },
    upload: async (f) => void uploaded.push(f.name),
    log: (l) => void lines.push(l),
  });

  expect(results.map((r) => r.status)).toEqual(["ok", "error", "ok"]);
  expect(results[1].message).toBe("sem permissão");
  expect(uploaded).toEqual(["a.txt", "c.txt"]);
  expect(lines[1]).toBe("[ERRO] quebra.txt: sem permissão");
});
