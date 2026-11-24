// Envolve o handler: erro vira JSON 500 com a mensagem (a UI mostra) e log no console.
export const handle = async (fn: () => Promise<unknown>) => {
  try {
    return Response.json(await fn());
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[ERRO] ${message}`);
    return Response.json({ error: message }, { status: 500 });
  }
};
