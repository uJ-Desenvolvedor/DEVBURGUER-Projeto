'use client';
/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Product = { id: number; name: string; description: string; price: number; category_id: number; category: string; category_slug: string; image: string; featured: number; active: number };
type CartItem = Product & { quantity: number };
type User = { id: number; name: string; email: string; role: string };
type Order = { id: string; customer_name: string; user_email: string; total: number; status: string; payment_method: string; created_at: string };
type View = 'home'|'menu'|'cart'|'checkout'|'login'|'register'|'thanks'|'admin';

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(value / 100);
const categories = ['Todos','Hambúrgueres','Acompanhamentos','Bebidas','Sobremesas'];

export default function StoreClient({ view }: { view: View }) {
  const [products,setProducts] = useState<Product[]>([]);
  const [cart,setCart] = useState<CartItem[]>([]);
  const [user,setUser] = useState<User|null>(null);
  const [toast,setToast] = useState('');

  useEffect(() => {
    fetch('/api/products').then(r=>r.json()).then(setProducts).catch(()=>setProducts([]));
    try { setCart(JSON.parse(localStorage.getItem('brasa-cart') || '[]')); setUser(JSON.parse(localStorage.getItem('brasa-user') || 'null')); } catch { /* estado limpo */ }
  },[]);
  useEffect(() => { if (cart.length || localStorage.getItem('brasa-cart')) localStorage.setItem('brasa-cart',JSON.stringify(cart)); },[cart]);
  useEffect(() => { if (!toast) return; const timer=setTimeout(()=>setToast(''),2200); return ()=>clearTimeout(timer); },[toast]);

  const add = (product: Product) => { setCart(items => { const found=items.find(i=>i.id===product.id); return found ? items.map(i=>i.id===product.id?{...i,quantity:i.quantity+1}:i) : [...items,{...product,quantity:1}]; }); setToast(`${product.name} adicionado à sacola`); };
  const change = (id:number, delta:number) => setCart(items=>items.map(i=>i.id===id?{...i,quantity:i.quantity+delta}:i).filter(i=>i.quantity>0));
  const count = cart.reduce((sum,item)=>sum+item.quantity,0);
  const total = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const logout = () => { localStorage.removeItem('brasa-user'); setUser(null); window.location.href='/'; };

  return <main className={view==='home'?'':'inner-site'}>
    {!['admin','login','register'].includes(view) && <Header count={count} user={user} logout={logout}/>}
    {view==='home' && <Home products={products} add={add}/>} 
    {view==='menu' && <Menu products={products} add={add}/>} 
    {view==='cart' && <Cart cart={cart} total={total} change={change}/>} 
    {view==='checkout' && <Checkout cart={cart} total={total} user={user} clear={()=>setCart([])}/>} 
    {view==='login' && <Auth mode="login" setUser={setUser}/>} 
    {view==='register' && <Auth mode="register" setUser={setUser}/>} 
    {view==='thanks' && <Thanks/>}
    {view==='admin' && <Admin user={user}/>}
    {view!=='admin' && <Footer/>}
    {toast && <div className="toast" role="status">✓ {toast}</div>}
  </main>;
}

function Header({count,user,logout}:{count:number;user:User|null;logout:()=>void}) {
  return <header className="site-header">
    <a className="brand" href="/" aria-label="DEVBURGUER — início"><img className="brand-logo" src="/logo-symbol.png" alt="DEVBURGUER"/></a>
    <nav aria-label="Navegação principal"><a href="/">Início</a><a href="/cardapio">Cardápio</a><a href="/#sobre">Sobre</a>{user?.role==='admin'&&<a href="/admin">Gerenciar</a>}</nav>
    <div className="header-actions">{user?<button className="user-link" onClick={logout}>Olá, {user.name.split(' ')[0]} · sair</button>:<a className="text-link" href="/login">Entrar</a>}<a className="cart-button" href="/carrinho">Sacola <span>{count}</span></a></div>
  </header>;
}

function Home({products,add}:{products:Product[];add:(p:Product)=>void}) {
  const featured=products.slice(0,4);
  const categoryCards=[
    {name:'Hambúrgueres',slug:'hamburgueres',image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85'},
    {name:'Acompanhamentos',slug:'acompanhamentos',image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85'},
    {name:'Bebidas',slug:'bebidas',image:'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=700&q=85'},
    {name:'Sobremesas',slug:'sobremesas',image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85'},
  ];
  return <>
    <section className="dev-hero" id="inicio" aria-label="Hambúrguer artesanal da DEVBURGUER"><div className="dev-hero-copy"><h1>Bem-vindo!</h1><a className="purple-button" href="/cardapio">VER CARDÁPIO</a></div></section>
    <section className="category-showcase"><span className="green-title">CATEGORIAS</span><h2>ESCOLHA O QUE DESEJA</h2><div className="category-cards">{categoryCards.map(category=><a key={category.slug} href={`/cardapio#${category.slug}`} style={{backgroundImage:`linear-gradient(0deg,rgba(24,24,24,.88),rgba(24,24,24,.05)),url(${category.image})`}}><strong>{category.name}</strong><span>VER PRODUTOS →</span></a>)}</div></section>
    <section className="featured" id="ofertas"><div className="section-heading"><div><span className="green-title">OFERTAS DO DIA</span><h2>OS QUERIDINHOS DA CASA</h2></div><a href="/cardapio">Ver cardápio completo →</a></div><ProductGrid products={featured} add={add}/></section>
    <section className="about-strip" id="sobre"><div><span className="eyebrow">NOSSA BRASA</span><h2>Feito sem pressa.<br/>Entregue bem quente.</h2></div><p>Selecionamos ingredientes frescos, preparamos nossos molhos na casa e grelhamos cada burger somente depois do seu pedido.</p><div className="about-number"><strong>7</strong><span>anos<br/>na brasa</span></div></section>
  </>;
}

function ProductGrid({products,add}:{products:Product[];add:(p:Product)=>void}) {
  return <div className="product-grid">{products.map((p,index)=><article className="product-card" key={p.id}><div className="product-image" style={{backgroundImage:`url(${p.image})`}}><span>{String(index+1).padStart(2,'0')}</span>{p.featured===1&&<b>DESTAQUE</b>}</div><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><footer><strong>{money(p.price)}</strong><button onClick={()=>add(p)} aria-label={`Adicionar ${p.name} à sacola`}>+</button></footer></div></article>)}</div>;
}

function Menu({products,add}:{products:Product[];add:(p:Product)=>void}) {
  const [active,setActive]=useState('Todos');
  useEffect(()=>{const slug=location.hash.replace('#','');const product=products.find(p=>p.category_slug===slug);if(product)setActive(product.category)},[products]);
  const filtered=active==='Todos'?products:products.filter(p=>p.category===active);
  return <><section className="menu-hero"><div><h1>O MELHOR<br/>HAMBÚRGUER<br/>ESTÁ AQUI!</h1><p>Esse cardápio está irresistível</p></div></section><section className="page-section menu-page"><div className="page-title"><span className="eyebrow dark">CARDÁPIO</span><h1>{active==='Todos'?'Todos os produtos':active}</h1></div><div className="category-tabs">{categories.map(cat=><button className={cat===active?'active':''} key={cat} onClick={()=>setActive(cat)}>{cat}</button>)}</div><ProductGrid products={filtered} add={add}/></section></>;
}

function Cart({cart,total,change}:{cart:CartItem[];total:number;change:(id:number,delta:number)=>void}) {
  return <section className="page-section cart-page"><div className="page-title compact"><span className="eyebrow dark">SEU PEDIDO</span><h1>Sacola</h1></div>{cart.length===0?<EmptyCart/>:<div className="cart-layout"><div className="cart-list">{cart.map(item=><article className="cart-item" key={item.id}><img src={item.image} alt=""/><div><small>{item.category}</small><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><div className="quantity"><button onClick={()=>change(item.id,-1)}>−</button><span>{item.quantity}</span><button onClick={()=>change(item.id,1)}>+</button></div><b>{money(item.price*item.quantity)}</b></article>)}</div><OrderSummary subtotal={total}/></div>}</section>;
}
function EmptyCart(){return <div className="empty-state"><span>☰</span><h2>Sua sacola está vazia</h2><p>Tem muito sabor esperando por você.</p><a className="primary" href="/cardapio">Escolher meu burger</a></div>}
function OrderSummary({subtotal}:{subtotal:number}){const delivery=subtotal>=8000?0:790;return <aside className="order-summary"><span className="eyebrow dark">RESUMO</span><h2>Seu pedido</h2><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Entrega</span><strong>{delivery?money(delivery):'Grátis'}</strong></p>{delivery>0&&<small>Entrega grátis em pedidos acima de R$ 80.</small>}<div className="summary-total"><span>Total</span><strong>{money(subtotal+delivery)}</strong></div><a className="primary full" href="/checkout">Continuar pedido</a></aside>}

function Checkout({cart,total,user,clear}:{cart:CartItem[];total:number;user:User|null;clear:()=>void}) {
  const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const finalTotal=total+(total>=8000?0:790);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError('');const data=new FormData(e.currentTarget);const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userEmail:user?.email||data.get('email'),customerName:data.get('name'),address:`${data.get('address')}, ${data.get('number')} - ${data.get('district')}`,paymentMethod:data.get('payment'),items:cart,total:finalTotal})});const result=await res.json();if(!res.ok){setError(result.error);setLoading(false);return}clear();localStorage.removeItem('brasa-cart');window.location.href=`/obrigado?pedido=${result.id}`}
  if(!cart.length)return <section className="page-section"><EmptyCart/></section>;
  return <><section className="checkout-brand"><img src="/logo-symbol.png" alt="DEVBURGUER"/></section><section className="page-section checkout-page"><div className="page-title"><span className="eyebrow dark">CHECKOUT</span><h1>Finalizar pedido</h1></div><form className="checkout-layout" onSubmit={submit}><div className="checkout-form"><fieldset><legend>Endereço de entrega</legend><div className="field-row"><label>Nome completo<input name="name" defaultValue={user?.name||''} required/></label><label>E-mail<input name="email" type="email" defaultValue={user?.email||''} required/></label></div><label>Rua / avenida<input name="address" required/></label><div className="field-row"><label>Número<input name="number" required/></label><label>Bairro<input name="district" required/></label></div></fieldset><fieldset><legend>Forma de pagamento</legend><div className="payment-options"><label><input type="radio" name="payment" value="Dinheiro"/> Dinheiro</label><label><input type="radio" name="payment" value="Cartão na entrega"/> Cartão Crédito/Débito</label><label><input type="radio" name="payment" value="PIX" defaultChecked/> PIX</label></div></fieldset>{error&&<p className="form-error">{error}</p>}</div><aside className="order-summary"><h2>Resumo do pedido</h2>{cart.map(i=><p key={i.id}><span>{i.quantity}× {i.name}</span><strong>{money(i.price*i.quantity)}</strong></p>)}<p><span>Taxa de entrega</span><strong>{money(finalTotal-total)}</strong></p><div className="summary-total"><span>Total</span><strong>{money(finalTotal)}</strong></div><button className="primary full" disabled={loading}>{loading?'Enviando...':'Finalizar pedido'}</button></aside></form></section></>;
}

function Auth({mode,setUser}:{mode:'login'|'register';setUser:(u:User)=>void}) {
  const [error,setError]=useState('');const [loading,setLoading]=useState(false);const login=mode==='login';
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError('');const data=new FormData(e.currentTarget);const res=await fetch(login?'/api/session':'/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),password:data.get('password')})});const result=await res.json();if(!res.ok){setError(result.error);setLoading(false);return}localStorage.setItem('brasa-user',JSON.stringify(result));setUser(result);window.location.href=result.role==='admin'?'/admin':'/cardapio'}
  return <section className="auth-page"><div className="auth-art"><a className="auth-brand" href="/" aria-label="DEVBURGUER — início"><img className="auth-logo" src="/logo-symbol.png" alt="DEVBURGUER"/></a></div><div className="auth-panel"><form onSubmit={submit}><div className="auth-welcome"><h1>{login?'Olá, seja bem-vindo à DEVBURGUER!':'Faça parte da DEVBURGUER!'}</h1><p>{login?'Acesse com seu login e senha.':'Cadastre seus dados para começar.'}</p></div>{!login&&<label>Nome completo<input name="name" required/></label>}<label>Email<input name="email" type="email" required/></label><label>Senha<input name="password" type="password" minLength={6} required/></label>{error&&<p className="form-error">{error}</p>}<button className="primary full" disabled={loading}>{loading?'Aguarde...':login?'Entrar':'Cadastrar'}</button>{login&&<div className="demo-box"><strong>Acessos de demonstração</strong><span>Cliente: cliente@devburguer.com / cliente123</span><span>Admin: admin@devburguer.com / admin123</span></div>}<p>{login?'Não possui conta?':'Já possui cadastro?'} <a href={login?'/cadastro':'/login'}>{login?'Clique aqui.':'Entrar'}</a></p></form></div></section>;
}

function Thanks(){const [id,setId]=useState('');useEffect(()=>setId(new URLSearchParams(location.search).get('pedido')||'DB-DEMO'),[]);return <><section className="checkout-brand"><img src="/logo-symbol.png" alt="DEVBURGUER"/></section><section className="thanks-page"><span className="eyebrow dark">CHECKOUT — PEDIDO CONCLUÍDO</span><div className="checkmark">✓</div><h1>Obrigado!</h1><p>Seu pedido <strong>{id}</strong> já está em produção e logo sairá para entrega. Agradecemos a preferência!</p><a className="thanks-link" href="/">Voltar para o início</a></section></>}

function Admin({user}:{user:User|null}) {
  const [tab,setTab]=useState<'orders'|'products'|'form'>('orders');
  const [orders,setOrders]=useState<Order[]>([]);
  const [adminProducts,setAdminProducts]=useState<Product[]>([]);
  const [editing,setEditing]=useState<Product|null>(null);
  const [message,setMessage]=useState('');
  const [search,setSearch]=useState('');
  const [category,setCategory]=useState('Todas');
  const [saving,setSaving]=useState(false);
  const adminHeaders = user ? {'x-admin-email':user.email} : {};
  const loadOrders=()=>fetch('/api/orders').then(r=>r.json()).then(setOrders);
  const loadProducts=()=>fetch('/api/products?all=1',{headers:adminHeaders}).then(r=>r.json()).then(setAdminProducts);
  useEffect(()=>{if(user?.role==='admin'){loadOrders();loadProducts()}},[user?.email]);
  const filteredProducts=useMemo(()=>adminProducts.filter(p=>(category==='Todas'||p.category===category)&&`${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())),[adminProducts,search,category]);
  async function updateOrder(id:string,status:string){await fetch(`/api/orders/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});loadOrders()}
  function openCreate(){setEditing(null);setMessage('');setTab('form')}
  function openEdit(product:Product){setEditing(product);setMessage('');setTab('form')}
  async function saveProduct(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setSaving(true);setMessage('');const form=e.currentTarget;const data=new FormData(form);let image=String(data.get('imageUrl')||editing?.image||'');const file=data.get('imageFile');
    if(file instanceof File&&file.size){const uploadData=new FormData();uploadData.set('file',file);const upload=await fetch('/api/uploads',{method:'POST',headers:adminHeaders,body:uploadData});const uploaded=await upload.json();if(!upload.ok){setMessage(uploaded.error);setSaving(false);return}image=uploaded.url}
    const payload={name:data.get('name'),description:data.get('description'),price:Math.round(Number(data.get('price'))*100),categoryId:Number(data.get('categoryId')),image,featured:data.get('featured')==='on',active:data.get('active')==='on'};
    const res=await fetch(editing?`/api/products/${editing.id}`:'/api/products',{method:editing?'PATCH':'POST',headers:{'Content-Type':'application/json',...adminHeaders},body:JSON.stringify(payload)});const result=await res.json();setMessage(result.message||result.error);setSaving(false);if(res.ok){await loadProducts();setEditing(null);setTab('products')}
  }
  async function toggleProduct(product:Product){await fetch(`/api/products/${product.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',...adminHeaders},body:JSON.stringify({active:!product.active})});loadProducts()}
  async function deleteProduct(product:Product){if(!window.confirm(`Excluir ${product.name}?`))return;const res=await fetch(`/api/products/${product.id}`,{method:'DELETE',headers:adminHeaders});const result=await res.json();setMessage(result.message||result.error);if(res.ok)loadProducts()}
  if(user?.role!=='admin')return <section className="page-section"><div className="empty-state"><h2>Área restrita</h2><p>Entre com a conta administrativa para continuar.</p><a className="primary" href="/login">Fazer login</a></div></section>;
  return <div className="admin-layout"><aside className="admin-sidebar"><a className="admin-logo" href="/"><img src="/logo-symbol.png" alt="DEVBURGUER"/></a><span className="admin-label">GERENCIAR</span><button className={tab==='orders'?'active':''} onClick={()=>setTab('orders')}>▣ Pedidos</button><button className={tab==='products'?'active':''} onClick={()=>setTab('products')}>▦ Listar produtos</button><button className={tab==='form'?'active':''} onClick={openCreate}>＋ Cadastrar produto</button><a href="/">← Voltar à loja</a></aside><section className="admin-content"><div className="admin-heading"><div><span className="eyebrow dark">GERENCIAMENTO</span><h1>{tab==='orders'?'Pedidos':tab==='products'?'Produtos':editing?'Editar produto':'Cadastrar produto'}</h1></div><span>{user.name}</span></div>
  {tab==='orders'&&<div className="admin-table"><div className="table-row table-head"><span>Pedido</span><span>Cliente</span><span>Total</span><span>Pagamento</span><span>Status</span></div>{orders.length?orders.map(o=><div className="table-row" key={o.id}><strong>{o.id}</strong><span>{o.customer_name}<small>{o.user_email}</small></span><span>{money(o.total)}</span><span>{o.payment_method}</span><select value={o.status} onChange={e=>updateOrder(o.id,e.target.value)}><option>Pedido recebido</option><option>Em preparo</option><option>Saiu para entrega</option><option>Finalizado</option></select></div>):<p className="table-empty">Nenhum pedido recebido ainda.</p>}</div>}
  {tab==='products'&&<><div className="admin-toolbar"><input aria-label="Pesquisar produto" placeholder="Pesquisar produto" value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Filtrar por categoria" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c} value={c==='Todos'?'Todas':c}>{c==='Todos'?'Todas as categorias':c}</option>)}</select><button className="primary" onClick={openCreate}>Novo produto</button></div>{message&&<p className="form-message">{message}</p>}<div className="admin-products admin-product-table"><div className="admin-product-head"><span>Produto</span><span>Preço</span><span>Status</span><span>Ações</span></div>{filteredProducts.length?filteredProducts.map(p=><article key={p.id}><img src={p.image} alt=""/><div><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p></div><strong>{money(p.price)}</strong><button className={`status-toggle ${p.active?'on':''}`} onClick={()=>toggleProduct(p)} aria-label={`${p.active?'Desativar':'Ativar'} ${p.name}`}>{p.active?'Ativo':'Inativo'}</button><div className="product-actions"><button onClick={()=>openEdit(p)}>Editar</button><button className="danger" onClick={()=>deleteProduct(p)}>Excluir</button></div></article>):<p className="table-empty">Nenhum produto encontrado.</p>}</div></>}
  {tab==='form'&&<form key={editing?.id||'new'} className="admin-form" onSubmit={saveProduct}><label>Nome do produto<input name="name" defaultValue={editing?.name||''} required/></label><label>Descrição<textarea name="description" rows={3} defaultValue={editing?.description||''} required/></label><div className="field-row"><label>Preço (R$)<input name="price" type="number" min="0.01" step="0.01" defaultValue={editing?(editing.price/100).toFixed(2):''} required/></label><label>Categoria<select name="categoryId" defaultValue={editing?.category_id||1}><option value="1">Hambúrgueres</option><option value="2">Acompanhamentos</option><option value="3">Bebidas</option><option value="4">Sobremesas</option></select></label></div><div className="image-fields"><label>Carregar imagem<input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp"/></label><span>ou</span><label>URL da imagem<input name="imageUrl" type="url" defaultValue={editing?.image.startsWith('http')?editing.image:''} placeholder="https://..."/></label></div>{editing&&<img className="product-preview" src={editing.image} alt={`Imagem atual de ${editing.name}`}/>}<div className="admin-checks"><label className="check-field"><input type="checkbox" name="featured" defaultChecked={Boolean(editing?.featured)}/> Mostrar como destaque</label><label className="check-field"><input type="checkbox" name="active" defaultChecked={editing?Boolean(editing.active):true}/> Produto ativo</label></div>{message&&<p className={message.includes('sucesso')?'form-message':'form-error'}>{message}</p>}<div className="form-actions"><button className="primary" disabled={saving}>{saving?'Salvando...':editing?'Salvar alterações':'Cadastrar produto'}</button><button type="button" className="secondary-button" onClick={()=>setTab('products')}>Cancelar</button></div></form>}</section></div>;
}

function Footer(){return <footer className="site-footer"><small>Desenvolvido para o projeto DEVBURGUER — 2026 — Todos os direitos reservados</small></footer>}
