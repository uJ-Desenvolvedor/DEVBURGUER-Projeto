import { ensureDatabase } from '@/lib/database';

async function isAdmin(request: Request) {
  const email = request.headers.get('x-admin-email');
  if (!email) return false;
  const db = await ensureDatabase();
  const user = await db.prepare("SELECT role FROM users WHERE email = ? AND role = 'admin'").bind(email).first<{ role: string }>();
  return user?.role === 'admin';
}

export async function GET(request: Request) {
  const db = await ensureDatabase();
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === '1' && await isAdmin(request);
  const query = `SELECT p.*, c.name AS category, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id ${showAll ? '' : 'WHERE p.active = 1'} ORDER BY p.featured DESC, p.id`;
  const result = await db.prepare(query).all();
  return Response.json(result.results);
}

export async function POST(request: Request) {
  if (!await isAdmin(request)) return Response.json({ error: 'Acesso administrativo necessário.' }, { status: 403 });
  const body = await request.json() as { name?: string; description?: string; price?: number; categoryId?: number; image?: string; featured?: boolean };
  if (!body.name || !body.description || !body.price || !body.categoryId) return Response.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
  const db = await ensureDatabase();
  const fallbackImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85';
  const result = await db.prepare('INSERT INTO products (name,description,price,category_id,image,featured) VALUES (?,?,?,?,?,?)').bind(body.name, body.description, body.price, body.categoryId, body.image || fallbackImage, body.featured ? 1 : 0).run();
  return Response.json({ id: result.meta.last_row_id, message: 'Produto cadastrado com sucesso.' }, { status: 201 });
}
