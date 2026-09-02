import { ensureDatabase } from '@/lib/database';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await request.json() as { status?: string };
  if (!status) return Response.json({ error: 'Informe o status.' }, { status: 400 });
  const db = await ensureDatabase();
  await db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, id).run();
  return Response.json({ id, status });
}
