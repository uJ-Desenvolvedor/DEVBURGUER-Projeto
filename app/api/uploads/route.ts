import { env } from 'cloudflare:workers';
import { ensureDatabase } from '@/lib/database';

export async function POST(request: Request) {
  const email = request.headers.get('x-admin-email');
  const db = await ensureDatabase();
  const user = email ? await db.prepare("SELECT role FROM users WHERE email = ? AND role = 'admin'").bind(email).first<{ role: string }>() : null;
  if (user?.role !== 'admin') return Response.json({ error: 'Acesso administrativo necessário.' }, { status: 403 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || !file.size) return Response.json({ error: 'Selecione uma imagem.' }, { status: 400 });
  if (!file.type.startsWith('image/')) return Response.json({ error: 'O arquivo precisa ser uma imagem.' }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: 'A imagem deve ter no máximo 5 MB.' }, { status: 400 });
  const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
  const key = `produtos/${crypto.randomUUID()}.${extension}`;
  await env.ASSETS.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  return Response.json({ url: `/api/uploads/${key}` }, { status: 201 });
}
