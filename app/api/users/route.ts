import { ensureDatabase } from '@/lib/database';

export async function POST(request: Request) {
  const body = await request.json() as { name?: string; email?: string; password?: string };
  if (!body.name || !body.email || !body.password || body.password.length < 6) return Response.json({ error: 'Informe nome, e-mail e senha com pelo menos 6 caracteres.' }, { status: 400 });
  try {
    const db = await ensureDatabase();
    const result = await db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,\'customer\')').bind(body.name, body.email.toLowerCase(), body.password).run();
    return Response.json({ id: result.meta.last_row_id, name: body.name, email: body.email, role: 'customer' }, { status: 201 });
  } catch { return Response.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 }); }
}
