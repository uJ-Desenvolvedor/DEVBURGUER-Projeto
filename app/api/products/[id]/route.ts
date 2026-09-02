import { ensureDatabase } from '@/lib/database';

async function isAdmin(request: Request) {
  const email = request.headers.get('x-admin-email');
  if (!email) return false;
  const db = await ensureDatabase();
  const user = await db.prepare("SELECT role FROM users WHERE email = ? AND role = 'admin'").bind(email).first<{ role: string }>();
  return user?.role === 'admin';
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin(request)) return Response.json({ error: 'Acesso administrativo necessário.' }, { status: 403 });
  const { id } = await params;
  const body = await request.json() as { name?: string; description?: string; price?: number; categoryId?: number; image?: string; featured?: boolean; active?: boolean };
  const db = await ensureDatabase();
  const current = await db.prepare('SELECT * FROM products WHERE id = ?').bind(Number(id)).first<Record<string, unknown>>();
  if (!current) return Response.json({ error: 'Produto não encontrado.' }, { status: 404 });
  const values = {
    name: body.name ?? String(current.name),
    description: body.description ?? String(current.description),
    price: body.price ?? Number(current.price),
    categoryId: body.categoryId ?? Number(current.category_id),
    image: body.image ?? String(current.image),
    featured: body.featured === undefined ? Number(current.featured) : body.featured ? 1 : 0,
    active: body.active === undefined ? Number(current.active) : body.active ? 1 : 0,
  };
  if (!values.name || !values.description || values.price <= 0 || !values.categoryId) return Response.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
  await db.prepare('UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image = ?, featured = ?, active = ? WHERE id = ?').bind(values.name, values.description, values.price, values.categoryId, values.image, values.featured, values.active, Number(id)).run();
  return Response.json({ message: 'Produto atualizado com sucesso.' });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin(request)) return Response.json({ error: 'Acesso administrativo necessário.' }, { status: 403 });
  const { id } = await params;
  const db = await ensureDatabase();
  await db.prepare('DELETE FROM products WHERE id = ?').bind(Number(id)).run();
  return Response.json({ message: 'Produto excluído com sucesso.' });
}
