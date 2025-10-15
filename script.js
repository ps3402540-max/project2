// Simple ice cream data
const FLAVORS = [
  { id: 'vanilla', name: 'Classic Vanilla', price: 3.5, desc: 'Smooth, creamy, timeless.', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=60' },
  { id: 'choco', name: 'Chocolate Fudge', price: 4.0, desc: 'Rich dark chocolate.', img: 'https://images.unsplash.com/photo-1542444459-db88ef83b5a6?auto=format&fit=crop&w=300&q=60' },
  { id: 'straw', name: 'Strawberry Swirl', price: 4.25, desc: 'Fresh strawberry ribbons.', img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=60' },
  { id: 'mint', name: 'Mint Chip', price: 4.0, desc: 'Cool mint & chocolate chips.', img: 'https://images.unsplash.com/photo-1551022378-2875a690c59e?auto=format&fit=crop&w=300&q=60' },
  { id: 'mango', name: 'Mango Tango', price: 4.5, desc: 'Tropical mango bliss.', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=60' },
  { id: 'banana', name: 'Banana Cream', price: 3.75, desc: 'Sweet banana cream.', img: 'https://images.unsplash.com/photo-1617191518792-6b9b8e1d4f7b?auto=format&fit=crop&w=300&q=60' },
  { id: 'banana-split', name: 'Banana Split', price: 5.00, desc: 'Classic banana split with cherries & whipped cream.', img: 'https://images.unsplash.com/photo-1562440499-64cf73a7c6a9?auto=format&fit=crop&w=300&q=60' },
  { id: 'banana-bread', name: 'Banana Bread', price: 4.25, desc: 'Banana bread inspired ice cream.', img: 'https://images.unsplash.com/photo-1550374848-9f9e6b0c1b2c?auto=format&fit=crop&w=300&q=60' },
  { id: 'pineapple', name: 'Pineapple Punch', price: 4.25, desc: 'Zesty pineapple.', img: 'https://images.unsplash.com/photo-1505253716364-9f7b7a3a6c2b?auto=format&fit=crop&w=300&q=60' },
  { id: 'apple', name: 'Apple Crisp', price: 3.9, desc: 'Apple & cinnamon notes.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=60' }
]

// DOM refs
const flavorsEl = document.getElementById('flavors')
const cartToggle = document.getElementById('cart-toggle')
const cartEl = document.getElementById('cart')
const cartClose = document.getElementById('cart-close')
const cartItemsEl = document.getElementById('cart-items')
const cartCount = document.getElementById('cart-count')
const cartTotal = document.getElementById('cart-total')
const clearCartBtn = document.getElementById('clear-cart')
const checkoutBtn = document.getElementById('checkout')
const priceToggle = document.getElementById('price-toggle')
const priceEditor = document.getElementById('price-editor')
const priceClose = document.getElementById('price-close')
const priceList = document.getElementById('price-list')
const priceSave = document.getElementById('price-save')
const priceReset = document.getElementById('price-reset')

let cart = {}
let priceOverrides = {}

// Load cart from localStorage
function loadCart(){
  try{
    const raw = localStorage.getItem('icecream_cart')
    cart = raw ? JSON.parse(raw) : {}
  }catch(e){cart = {}}
}

function saveCart(){
  localStorage.setItem('icecream_cart', JSON.stringify(cart))
}

function loadPrices(){
  try{
    const raw = localStorage.getItem('icecream_prices')
    priceOverrides = raw ? JSON.parse(raw) : {}
    // apply overrides to FLAVORS array (do not mutate original price permanently; override in place is fine for this demo)
    FLAVORS.forEach(f => {
      if(priceOverrides[f.id] !== undefined) f.price = Number(priceOverrides[f.id])
    })
  }catch(e){priceOverrides={}}
}

function savePrices(){
  localStorage.setItem('icecream_prices', JSON.stringify(priceOverrides))
}

function resetPrices(){
  // reset to defaults (hardcoded defaults here)
  const defaults = { vanilla:3.5, choco:4.0, straw:4.25, mint:4.0, mango:4.5, banana:3.75, 'banana-split':5.00, 'banana-bread':4.25, pineapple:4.25, apple:3.9 }
  priceOverrides = {}
  FLAVORS.forEach(f => { f.price = defaults[f.id] || f.price })
  savePrices(); updateAllViews(); renderPriceList()
}

function renderFlavors(){
  flavorsEl.innerHTML = ''
  FLAVORS.forEach(f => {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <img src="${f.img}" alt="${f.name}">
      <h4>${f.name}</h4>
      <p>${f.desc}</p>
      <div class="price">$${f.price.toFixed(2)}</div>
      <div class="actions">
        <div class="quantity">
          <button data-action="dec" data-id="${f.id}">-</button>
          <span id="qty-${f.id}">0</span>
          <button data-action="inc" data-id="${f.id}">+</button>
        </div>
        <button class="btn" data-action="add" data-id="${f.id}" style="margin-left:.5rem">Add</button>
      </div>
    `
    flavorsEl.appendChild(card)
  })
}

function updateQtyViews(){
  FLAVORS.forEach(f => {
    const q = cart[f.id] ? cart[f.id].qty : 0
    const el = document.getElementById(`qty-${f.id}`)
    if(el) el.textContent = q
  })
}

function updateCartCount(){
  const count = Object.values(cart).reduce((s,i)=>s+i.qty,0)
  cartCount.textContent = count
}

function updateCartTotal(){
  const total = Object.values(cart).reduce((s,i)=>s+(i.qty*i.price),0)
  cartTotal.textContent = total.toFixed(2)
}

function renderCartItems(){
  cartItemsEl.innerHTML = ''
  if(Object.keys(cart).length===0){
    cartItemsEl.innerHTML = '<p class="footer-note">Your cart is empty.</p>'
    return
  }
  Object.values(cart).forEach(item => {
    const row = document.createElement('div')
    row.className = 'cart-item'
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="meta">
        <h5>${item.name}</h5>
        <div>$${item.price.toFixed(2)} × ${item.qty} = $${(item.price*item.qty).toFixed(2)}</div>
      </div>
      <div class="quantity">
        <button data-action="dec" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button data-action="inc" data-id="${item.id}">+</button>
      </div>
    `
    cartItemsEl.appendChild(row)
  })
}

function renderPriceList(){
  priceList.innerHTML = ''
  FLAVORS.forEach(f => {
    const row = document.createElement('div')
    row.className = 'price-row'
    row.innerHTML = `
      <label for="price-${f.id}">${f.name}</label>
      <input id="price-${f.id}" type="number" step="0.01" min="0" value="${f.price.toFixed(2)}" data-id="${f.id}">
    `
    priceList.appendChild(row)
  })
}

function addToCart(id, qty=1){
  const flavor = FLAVORS.find(f=>f.id===id)
  if(!flavor) return
  if(!cart[id]){
    cart[id] = { id: flavor.id, name: flavor.name, price: flavor.price, qty: 0, img: flavor.img }
  }
  cart[id].qty += qty
  if(cart[id].qty <= 0) delete cart[id]
  saveCart(); updateAllViews()
}

function setQty(id, qty){
  if(qty<=0){ delete cart[id] } else {
    const f = FLAVORS.find(x=>x.id===id)
    cart[id] = { id: f.id, name: f.name, price: f.price, qty, img: f.img }
  }
  saveCart(); updateAllViews()
}

function updateAllViews(){
  updateQtyViews(); updateCartCount(); updateCartTotal(); renderCartItems()
}

// Event delegation for flavor actions
flavorsEl.addEventListener('click', e=>{
  const btn = e.target.closest('button')
  if(!btn) return
  const action = btn.dataset.action
  const id = btn.dataset.id
  if(action==='add') addToCart(id, 1)
  if(action==='inc') addToCart(id, 1)
  if(action==='dec') addToCart(id, -1)
})

// Price editor toggles
priceToggle.addEventListener('click', ()=>{
  const isOpen = priceEditor.getAttribute('aria-hidden') === 'false'
  priceEditor.setAttribute('aria-hidden', isOpen ? 'true' : 'false')
  priceToggle.setAttribute('aria-expanded', !isOpen)
  if(!isOpen) renderPriceList()
})
priceClose.addEventListener('click', ()=>{priceEditor.setAttribute('aria-hidden','true');priceToggle.setAttribute('aria-expanded',false)})

// Save price changes
priceSave.addEventListener('click', ()=>{
  const inputs = priceList.querySelectorAll('input')
  inputs.forEach(inp => {
    const id = inp.dataset.id
    const val = Number(inp.value)
    if(!isNaN(val)){
      priceOverrides[id] = val
      const f = FLAVORS.find(x=>x.id===id)
      if(f) f.price = val
    }
  })
  savePrices(); updateAllViews()
  priceEditor.setAttribute('aria-hidden','true');priceToggle.setAttribute('aria-expanded',false)
})

priceReset.addEventListener('click', ()=>{
  if(confirm('Reset prices to defaults?')) resetPrices()
})

// Cart panel controls
cartToggle.addEventListener('click', ()=>{
  const isOpen = cartEl.getAttribute('aria-hidden') === 'false'
  cartEl.setAttribute('aria-hidden', isOpen ? 'true' : 'false')
  cartToggle.setAttribute('aria-expanded', !isOpen)
})
cartClose.addEventListener('click', ()=>{cartEl.setAttribute('aria-hidden','true');cartToggle.setAttribute('aria-expanded',false)})

// Cart quantity controls inside panel
cartItemsEl.addEventListener('click', e=>{
  const btn = e.target.closest('button')
  if(!btn) return
  const action = btn.dataset.action
  const id = btn.dataset.id
  if(action==='inc') addToCart(id,1)
  if(action==='dec') addToCart(id,-1)
})

clearCartBtn.addEventListener('click', ()=>{cart={};saveCart();updateAllViews()})
checkoutBtn.addEventListener('click', ()=>{alert('Thanks! This demo has no checkout.')})

// Initialize
loadCart(); loadPrices(); renderFlavors(); renderPriceList(); updateAllViews();
