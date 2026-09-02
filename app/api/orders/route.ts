import { ensureDatabase } from '@/lib/database';

type OrderItem = { id: number; name: string; price: number; quantity: number };

export async function GET() {
  const db = await ensureDatabase();
  const orders = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  return Response.json(orders.results);
}

export async function POST(request: Request) {
  const body = await request.json() as { userEmail?: string; customerName?: string; address?: string; paymentMethod?: string; items?: OrderItem[]; total?: number };
  if (!body.customerName || !body.address || !body.items?.length || !body.total) return Response.json({ error: 'Dados do pedido incompletos.' }, { status: 400 });
  const db = await ensureDatabase();
  const id = `BB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const statements = [db.prepare('INSERT INTO orders (id,user_email,customer_name,address,total,status,payment_method) VALUES (?,?,?,?,?,\'Pedido recebido\',?)').bind(id, body.userEmail || 'visitante@devburguer.com', body.customerName, body.address, body.total, body.paymentMethod || 'Cartão')];
  for (const item of body.items) statements.push(db.prepare('INSERT INTO order_items (order_id,product_id,name,price,quantity) VALUES (?,?,?,?,?)').bind(id, item.id, item.name, item.price, item.quantity));
  await db.batch(statements);
  return Response.json({ id, status: 'Pedido recebido' }, { status: 201 });
}
