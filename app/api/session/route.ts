import { ensureDatabase } from '@/lib/database';

export async function POST(request: Request) {
  const { email, password } = await request.json() as { email?: string; password?: string };
  const db = await ensureDatabase();
  const user = await db.prepare('SELECT id,name,email,role FROM users WHERE email = ? AND password = ?').bind(email || '', password || '').first();
  if (!user) return Response.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 });
  return Response.json(user);
}
