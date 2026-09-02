import { env } from 'cloudflare:workers';

const seedProducts = [
  ['Brasa Bacon', 'Pão brioche, carne 180g, cheddar e bacon crocante', 3490, 1, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85', 1],
  ['Smash da Casa', 'Dois smash burgers, queijo, picles e molho especial', 2990, 1, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85', 1],
  ['Duplo Fogo', 'Carne dupla, pepperoni, cheddar e maionese picante', 3890, 1, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=85', 0],
  ['Veggie da Horta', 'Burger vegetal, queijo, rúcula, tomate e molho verde', 3190, 1, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=85', 0],
  ['Fritas Brasa', 'Batata crocante com páprica defumada e molho da casa', 1690, 2, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85', 0],
  ['Onion Rings', 'Anéis de cebola empanados, sequinhos e crocantes', 1890, 2, 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85', 0],
  ['Cola Artesanal', 'Refrigerante artesanal gelado, garrafa 355ml', 890, 3, 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=85', 0],
  ['Limonada da Casa', 'Limão siciliano, hortelã e xarope artesanal', 1190, 3, 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=900&q=85', 0],
  ['Brownie na Brasa', 'Brownie de chocolate com sorvete e calda quente', 1990, 4, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85', 0],
];

export function database() {
  if (!env.DB) throw new Error('Banco de dados indisponível');
  return env.DB;
}

export async function ensureDatabase() {
  const db = database();
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT \'customer\', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)'),
    db.prepare('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE)'),
    db.prepare('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, description TEXT NOT NULL, price INTEGER NOT NULL, category_id INTEGER NOT NULL, image TEXT NOT NULL, featured INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, FOREIGN KEY(category_id) REFERENCES categories(id))'),
    db.prepare('CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_email TEXT NOT NULL, customer_name TEXT NOT NULL, address TEXT NOT NULL, total INTEGER NOT NULL, status TEXT NOT NULL DEFAULT \'Pedido recebido\', payment_method TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)'),
    db.prepare('CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL, product_id INTEGER NOT NULL, name TEXT NOT NULL, price INTEGER NOT NULL, quantity INTEGER NOT NULL, FOREIGN KEY(order_id) REFERENCES orders(id))'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)'),
  ]);
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO categories (id,name,slug) VALUES (1,'Hambúrgueres','hamburgueres')"),
    db.prepare("INSERT OR IGNORE INTO categories (id,name,slug) VALUES (2,'Acompanhamentos','acompanhamentos')"),
    db.prepare("INSERT OR IGNORE INTO categories (id,name,slug) VALUES (3,'Bebidas','bebidas')"),
    db.prepare("INSERT OR IGNORE INTO categories (id,name,slug) VALUES (4,'Sobremesas','sobremesas')"),
    db.prepare("INSERT OR IGNORE INTO users (name,email,password,role) VALUES ('Administrador','admin@devburguer.com','admin123','admin')"),
    db.prepare("INSERT OR IGNORE INTO users (name,email,password,role) VALUES ('Cliente Demonstração','cliente@devburguer.com','cliente123','customer')"),
  ]);
  for (const product of seedProducts) {
    await db.prepare('INSERT OR IGNORE INTO products (name,description,price,category_id,image,featured) VALUES (?,?,?,?,?,?)').bind(...product).run();
  }
  await db.prepare('PRAGMA optimize').run();
  return db;
}
