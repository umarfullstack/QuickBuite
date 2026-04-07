document.addEventListener('alpine:init', () => {
  Alpine.store('app', {

    page: 'menu',
    theme: 'dark',
    showCart: false,
    showAdmin: false,
    showSettings: false,

    /* â”€â”€ Auth â”€â”€ */
    role: 'guest',        // guest | user | admin
    authPage: 'login',    // login | register | profile
    showAuth: false,
    currentUser: null,    // { name, phone, email }
    loginForm: { email:'', password:'' },
    loginError: '',
    regForm: { name:'', phone:'', email:'', password:'' },
    regError: '',
    ADMIN_PASS: '12345678',
    activeCategory: 'Ð’ÑÐµ',
    toast: { visible:false, msg:'' },
    _toastTimer: null,

    config: { supabaseUrl:'', supabaseKey:'' },
    form: { name:'', phone:'', address:'' },
    formErrors: {},
    trackingOrder: null,
    _mapInstance: null,
    _trackInterval: null,

    /* â”€â”€ ÐšÐ°Ñ‚Ð°Ð»Ð¾Ð³ â€” ÐžÐ Ð˜Ð“Ð˜ÐÐÐ›Ð¬ÐÐ«Ð• ÐºÐ°Ñ€Ñ‚Ð¸Ð½ÐºÐ¸ Ð¸ Ñ‚Ð¾Ð²Ð°Ñ€Ñ‹ â”€â”€ */
    products: [
          { id: 1, name: 'Jumbo Burger', price: 6.59, category: 'Ð‘ÑƒÑ€Ð³ÐµÑ€Ñ‹', emoji: 'ðŸ”', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', desc: 'Ð¡Ð¾Ñ‡Ð½Ð°Ñ Ð³Ð¾Ð²ÑÐ¶ÑŒÑ ÐºÐ¾Ñ‚Ð»ÐµÑ‚Ð°, Ñ…Ñ€ÑƒÑÑ‚ÑÑ‰Ð¸Ð¹ ÑÐ°Ð»Ð°Ñ‚, Ñ‚Ð¾Ð¼Ð°Ñ‚Ñ‹, ÑÐ²ÐµÐ¶Ð¸Ð¹ Ð»ÑƒÐº, Ñ…Ñ€ÑƒÑÑ‚ÑÑ‰Ð°Ñ Ð±ÑƒÐ»Ð¾Ñ‡ÐºÐ°' },
          { id: 2, name: 'Cheeseburger', price: 6.99, category: 'Ð‘ÑƒÑ€Ð³ÐµÑ€Ñ‹', emoji: 'ðŸ”', img: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZXNlYnVyZ2VyfGVufDB8fDB8fHww', desc: 'Ð¡Ð¾Ñ‡Ð½Ð°Ñ Ð³Ð¾Ð²ÑÐ¶ÑŒÑ ÐºÐ¾Ñ‚Ð»ÐµÑ‚Ð°, Ñ…Ñ€ÑƒÑÑ‚ÑÑ‰Ð¸Ð¹ ÑÐ°Ð»Ð°Ñ‚, Ñ‚Ð¾Ð¼Ð°Ñ‚Ñ‹, ÑÐ²ÐµÐ¶Ð¸Ð¹ Ð»ÑƒÐº, Ñ…Ñ€ÑƒÑÑ‚ÑÑ‰Ð°Ñ Ð±ÑƒÐ»Ð¾Ñ‡ÐºÐ°, ÑÑ‹Ñ€' },
          { id: 3, name: 'Breaded Chicken', price: 5.99, category: 'ÐšÑƒÑ€Ð¸Ñ†Ð°', emoji: 'ðŸ—', img: 'https://images.unsplash.com/photo-1586793783658-261cddf883ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RnJpZWQlMjBDaGlja2VufGVufDB8fDB8fHww', desc: 'ÐšÑƒÑ€Ð¸Ð½Ð¾Ðµ Ñ„Ð¸Ð»Ðµ Ð½Ð° Ð³Ñ€Ð¸Ð»Ðµ Ð² Ð¿Ð°Ð½Ð¸Ñ€Ð¾Ð²ÐºÐµ' },
          { id: 4, name: 'Fried Chicken', price: 6.29, category: 'ÐšÑƒÑ€Ð¸Ñ†Ð°', emoji: 'ðŸ—', img: 'https://images.unsplash.com/photo-1638439430466-b2bb7fdc1d67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RnJpZWQlMjBDaGlja2VufGVufDB8fDB8fHww', desc: 'ÐšÑƒÑ€Ð¸Ð½Ð¾Ðµ Ñ„Ð¸Ð»Ðµ Ð½Ð° Ð³Ñ€Ð¸Ð»Ðµ' },
          { id: 5, name: 'Veggie Wrap', price: 4.49, category: 'Ð Ð¾Ð»Ð»Ñ‹', emoji: 'ðŸŒ¯', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', desc: 'Ð¡Ð²ÐµÐ¶Ð¸Ðµ Ð¾Ð²Ð¾Ñ‰Ð¸, Ñ…ÑƒÐ¼ÑƒÑ, Ð°Ð²Ð¾ÐºÐ°Ð´Ð¾' },
          { id: 6, name: 'Spicy Tuna Roll', price: 5.20, category: 'Ð Ð¾Ð»Ð»Ñ‹', emoji: 'ðŸ£', img: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=300&fit=crop', desc: 'Ð¢ÑƒÐ½ÐµÑ†, ÐºÑƒÐ½Ð¶ÑƒÑ‚, Ð¾ÑÑ‚Ñ€Ñ‹Ð¹ ÑÐ¾ÑƒÑ' },
          { id: 7, name: 'Margherita', price: 8.90, category: 'ÐŸÐ¸Ñ†Ñ†Ð°', emoji: 'ðŸ•', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', desc: 'Ð¢Ð¾Ð¼Ð°Ñ‚Ð½Ñ‹Ð¹ ÑÐ¾ÑƒÑ, Ð¼Ð¾Ñ†Ð°Ñ€ÐµÐ»Ð»Ð°, Ð±Ð°Ð·Ð¸Ð»Ð¸Ðº' },
          { id: 8, name: 'Pepperoni XXL', price: 10.50, category: 'ÐŸÐ¸Ñ†Ñ†Ð°', emoji: 'ðŸ•', img: 'https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFBlcHBlcm9uaXxlbnwwfHwwfHx8MA%3D%3D', desc: 'Ð©ÐµÐ´Ñ€Ð°Ñ Ð¿ÐµÐ¿Ð¿ÐµÑ€Ð¾Ð½Ð¸, Ñ‚Ñ€Ð¾Ð¹Ð½Ð¾Ð¹ ÑÑ‹Ñ€' },
          { id: 9, name: 'Caesar Salad', price: 5.30, category: 'Ð¡Ð°Ð»Ð°Ñ‚Ñ‹', emoji: 'ðŸ¥—', img: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop', desc: 'Ð Ð¾Ð¼Ð°Ð½Ð¾, ÐºÑ€ÑƒÑ‚Ð¾Ð½Ñ‹, Ð¿Ð°Ñ€Ð¼ÐµÐ·Ð°Ð½' },
          { id: 10, name: 'Greek Salad', price: 4.80, category: 'Ð¡Ð°Ð»Ð°Ñ‚Ñ‹', emoji: 'ðŸ¥™', img: 'https://images.unsplash.com/photo-1659270156961-323ea2afcd0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEdyZWVrJTIwc2FsYXR8ZW58MHx8MHx8fDA%3D', desc: 'ÐžÐ³ÑƒÑ€Ñ†Ñ‹, Ð¼Ð°ÑÐ»Ð¸Ð½Ñ‹, Ñ„ÐµÑ‚Ð°' },
          { id: 11, name: 'Lemonade', price: 2.50, category: 'ÐÐ°Ð¿Ð¸Ñ‚ÐºÐ¸', emoji: 'ðŸ‹', img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop', desc: 'Ð”Ð¾Ð¼Ð°ÑˆÐ½Ð¸Ð¹ Ð»Ð¸Ð¼Ð¾Ð½Ð°Ð´ Ñ Ð¼ÑÑ‚Ð¾Ð¹' },
          { id: 12, name: 'Milkshake', price: 3.90, category: 'ÐÐ°Ð¿Ð¸Ñ‚ÐºÐ¸', emoji: 'ðŸ¥¤', img: 'https://media.istockphoto.com/id/926990564/photo/chocolate-milk-and-whipped-cream.webp?a=1&b=1&s=612x612&w=0&k=20&c=ilJBEWejGCIwCGi3AV7eiVJ3jE9AI18HEj4bllQM-QI=', desc: 'Ð’Ð°Ð½Ð¸Ð»ÑŒ, ÐºÐ»ÑƒÐ±Ð½Ð¸ÐºÐ° Ð¸Ð»Ð¸ ÑˆÐ¾ÐºÐ¾Ð»Ð°Ð´' },
          { id: 13, name: 'Choco Lava', price: 4.20, category: 'Ð”ÐµÑÐµÑ€Ñ‚Ñ‹', emoji: 'ðŸ«', img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop', desc: 'Ð¢Ñ‘Ð¿Ð»Ñ‹Ð¹ Ð±Ñ€Ð°ÑƒÐ½Ð¸ Ñ ÑˆÐ¾ÐºÐ¾Ð»Ð°Ð´Ð½Ñ‹Ð¼ Ñ†ÐµÐ½Ñ‚Ñ€Ð¾Ð¼' },
          { id: 14, name: 'Tiramisu', price: 4.60, category: 'Ð”ÐµÑÐµÑ€Ñ‚Ñ‹', emoji: 'ðŸ®', img: 'https://plus.unsplash.com/premium_photo-1695028378225-97fbe39df62a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VGlyYW1pc3V8ZW58MHx8MHx8fDA%3D', desc: 'ÐšÐ»Ð°ÑÑÐ¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð¸Ñ‚Ð°Ð»ÑŒÑÐ½ÑÐºÐ¸Ð¹ Ð´ÐµÑÐµÑ€Ñ‚' },
        ],

    cart: [],
    orders: [],

    init() {
      try {
        const c=localStorage.getItem('qb_cart');   if(c) this.cart=JSON.parse(c);
        const o=localStorage.getItem('qb_orders'); if(o) this.orders=JSON.parse(o);
        const g=localStorage.getItem('qb_config'); if(g) this.config={...this.config,...JSON.parse(g)};
        const t=localStorage.getItem('qb_theme');  if(t) this.theme=t;
      } catch(e){}
      this._applyTheme(this.theme);
      // Ð’Ð¾ÑÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ ÑÐµÑÑÐ¸ÑŽ
      const savedRole=localStorage.getItem('qb_role');
      const savedUser=localStorage.getItem('qb_user');
      if(savedRole&&savedUser){
        this.role=savedRole;
        this.currentUser=JSON.parse(savedUser);
      }
      this.$nextTick(()=>lucide.createIcons());
    },

    _applyTheme(t){
      const r=document.documentElement.style;
      if(t==='light'){
        r.setProperty('--z950','#F4F4F5');
        r.setProperty('--z900','#FFFFFF');
        r.setProperty('--z800','#E4E4E7');
        r.setProperty('--z700','#D4D4D8');
        r.setProperty('--z400','#71717A');
        document.body.classList.add('light');
        document.body.style.color='#18181b';
      } else {
        r.setProperty('--z950','#09090B');
        r.setProperty('--z900','#18181B');
        r.setProperty('--z800','#27272A');
        r.setProperty('--z700','#3F3F46');
        r.setProperty('--z400','#A1A1AA');
        document.body.classList.remove('light');
        document.body.style.color='#ffffff';
      }
    },

    toggleTheme(){
      this.theme=this.theme==='dark'?'light':'dark';
      localStorage.setItem('qb_theme',this.theme);
      this._applyTheme(this.theme);
      this.$nextTick(()=>lucide.createIcons());
    },

    /* â•â• AUTH â•â• */
    login(){
      this.loginError='';
      const email=this.loginForm.email.trim().toLowerCase();
      const pass=this.loginForm.password;
      if(!email||!pass){this.loginError='Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð²ÑÐµ Ð¿Ð¾Ð»Ñ';return;}

      // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð¿Ð°Ñ€Ð¾Ð»ÑŒ Ð°Ð´Ð¼Ð¸Ð½Ð°
      if(pass===this.ADMIN_PASS){
        this.role='admin';
        this.currentUser={name:'ÐÐ´Ð¼Ð¸Ð½Ð¸ÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€',email,phone:''};
        localStorage.setItem('qb_role','admin');
        localStorage.setItem('qb_user',JSON.stringify(this.currentUser));
        this.showAuth=false;
        this.loginForm={email:'',password:''};
        this.showToast('ðŸ‘‘ Ð”Ð¾Ð±Ñ€Ð¾ Ð¿Ð¾Ð¶Ð°Ð»Ð¾Ð²Ð°Ñ‚ÑŒ, ÐÐ´Ð¼Ð¸Ð½Ð¸ÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€!');
        this.$nextTick(()=>lucide.createIcons());
        return;
      }

      // ÐžÐ±Ñ‹Ñ‡Ð½Ñ‹Ð¹ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ â€” Ð¸Ñ‰ÐµÐ¼ Ð² localStorage
      const users=JSON.parse(localStorage.getItem('qb_users')||'[]');
      const user=users.find(u=>u.email===email&&u.password===pass);
      if(!user){this.loginError='ÐÐµÐ²ÐµÑ€Ð½Ñ‹Ð¹ email Ð¸Ð»Ð¸ Ð¿Ð°Ñ€Ð¾Ð»ÑŒ';return;}
      this.role='user';
      this.currentUser={name:user.name,email:user.email,phone:user.phone};
      localStorage.setItem('qb_role','user');
      localStorage.setItem('qb_user',JSON.stringify(this.currentUser));
      this.showAuth=false;
      this.loginForm={email:'',password:''};
      this.showToast(`ðŸ‘‹ ÐŸÑ€Ð¸Ð²ÐµÑ‚, ${user.name}!`);
      this.$nextTick(()=>lucide.createIcons());
    },

    register(){
      this.regError='';
      const {name,phone,email,password}=this.regForm;
      if(!name.trim()||!phone.trim()||!email.trim()||!password.trim()){this.regError='Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð²ÑÐµ Ð¿Ð¾Ð»Ñ';return;}
      if(password.length<6){this.regError='ÐŸÐ°Ñ€Ð¾Ð»ÑŒ Ð¼Ð¸Ð½Ð¸Ð¼ÑƒÐ¼ 6 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²';return;}
      if(password===this.ADMIN_PASS){this.regError='Ð­Ñ‚Ð¾Ñ‚ Ð¿Ð°Ñ€Ð¾Ð»ÑŒ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½';return;}
      const users=JSON.parse(localStorage.getItem('qb_users')||'[]');
      if(users.find(u=>u.email===email.toLowerCase())){this.regError='Email ÑƒÐ¶Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ';return;}
      const newUser={name:name.trim(),phone:phone.trim(),email:email.trim().toLowerCase(),password};
      users.push(newUser);
      localStorage.setItem('qb_users',JSON.stringify(users));
      // ÐÐ²Ñ‚Ð¾-Ð»Ð¾Ð³Ð¸Ð½
      this.role='user';
      this.currentUser={name:newUser.name,email:newUser.email,phone:newUser.phone};
      localStorage.setItem('qb_role','user');
      localStorage.setItem('qb_user',JSON.stringify(this.currentUser));
      this.showAuth=false;
      this.regForm={name:'',phone:'',email:'',password:''};
      this.showToast(`ðŸŽ‰ ÐÐºÐºÐ°ÑƒÐ½Ñ‚ ÑÐ¾Ð·Ð´Ð°Ð½! ÐŸÑ€Ð¸Ð²ÐµÑ‚, ${newUser.name}!`);
      this.$nextTick(()=>lucide.createIcons());
    },

    logout(){
      this.role='guest';
      this.currentUser=null;
      localStorage.removeItem('qb_role');
      localStorage.removeItem('qb_user');
      this.showAdmin=false;
      this.showAuth=false;
      this.page='menu';
      this.showToast('ðŸ‘‹ Ð’Ñ‹ Ð²Ñ‹ÑˆÐ»Ð¸ Ð¸Ð· Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°');
      this.$nextTick(()=>lucide.createIcons());
    },

    openAuth(page='login'){
      this.authPage=page;
      this.showAuth=true;
      this.loginError='';
      this.regError='';
      this.$nextTick(()=>lucide.createIcons());
    },

    _saveCart()  { localStorage.setItem('qb_cart',  JSON.stringify(this.cart)); },
    _saveConfig(){ localStorage.setItem('qb_config',JSON.stringify(this.config)); },

    showToast(msg,ms=2400){
      if(this._toastTimer) clearTimeout(this._toastTimer);
      this.toast={visible:true,msg};
      this._toastTimer=setTimeout(()=>{this.toast.visible=false;},ms);
    },

    get categories(){ return ['Ð’ÑÐµ',...new Set(this.products.map(p=>p.category))]; },
    get filteredProducts(){ return this.activeCategory==='Ð’ÑÐµ'?this.products:this.products.filter(p=>p.category===this.activeCategory); },
    cartQty(id){ const i=this.cart.find(i=>i.id===id); return i?i.qty:0; },
    get cartCount(){ return this.cart.reduce((s,i)=>s+i.qty,0); },
    get cartTotal(){ return this.cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2); },
    get totalRevenue(){ return this.orders.reduce((s,o)=>s+o.total,0).toFixed(2); },
    get topSellers(){
      const m={};
      this.orders.forEach(o=>o.items.forEach(i=>{m[i.name]=(m[i.name]||0)+i.qty;}));
      return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5);
    },

    addToCart(product){
      const item=this.cart.find(i=>i.id===product.id);
      if(item) item.qty++;
      else this.cart.push({...product,qty:1});
      this._saveCart();
      this.showToast(`${product.emoji} ${product.name} Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½!`);
      this.$nextTick(()=>lucide.createIcons());
    },

    changeQty(id,delta){
      const item=this.cart.find(i=>i.id===id);
      if(!item) return;
      item.qty+=delta;
      if(item.qty<=0) this.cart=this.cart.filter(i=>i.id!==id);
      this._saveCart();
      this.$nextTick(()=>lucide.createIcons());
    },

    getLocation(){
      if(!navigator.geolocation){this.showToast('Ð“ÐµÐ¾Ð»Ð¾ÐºÐ°Ñ†Ð¸Ñ Ð½Ðµ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÑ‚ÑÑ');return;}
      this.showToast('ðŸ“ ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÑÑŽ Ð¼ÐµÑÑ‚Ð¾Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµâ€¦');
      navigator.geolocation.getCurrentPosition(
        pos=>{
          this.form.address=`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
          this.showToast('âœ… ÐšÐ¾Ð¾Ñ€Ð´Ð¸Ð½Ð°Ñ‚Ñ‹ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ñ‹!');
        },
        ()=>this.showToast('âŒ ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð³ÐµÐ¾Ð»Ð¾ÐºÐ°Ñ†Ð¸ÑŽ')
      );
    },

    async _sendToSupabase(order){
      if(!this.config.supabaseUrl||!this.config.supabaseKey) return null;
      try{
        const res=await fetch(`${this.config.supabaseUrl}/rest/v1/orders`,{
          method:'POST',
          headers:{'Content-Type':'application/json','apikey':this.config.supabaseKey,'Authorization':`Bearer ${this.config.supabaseKey}`,'Prefer':'return=representation'},
          body:JSON.stringify({customer_name:order.customer.name,customer_phone:order.customer.phone,customer_address:order.customer.address,items:order.items,total:order.total,status:'new',created_at:order.createdAt})
        });
        if(!res.ok) throw new Error(await res.text());
        const data=await res.json();
        console.log('âœ… Supabase OK',data);
        return data[0];
      }catch(e){ console.error('âŒ Supabase:',e); this.showToast('âš ï¸ Supabase: Ð¾ÑˆÐ¸Ð±ÐºÐ° ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ'); return null; }
    },

    async _sendToTelegram(order){
      try{
        const res=await fetch('/api/order-notify',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({type:'order',order})
        });
        const d=await res.json().catch(()=>({ok:false,error:'invalid_json'}));
        if(!res.ok||!d.ok){
          console.error('âŒ TG notify failed:',d);
          this.showToast('âŒ Telegram: Ð½Ðµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ');
          return d;
        }
        console.log('âœ… Telegram notify OK');
        return d;
      }catch(e){
        console.error('âŒ TG notify fetch:',e.message);
        this.showToast('âŒ Telegram: ÑÐµÑ‚ÐµÐ²Ð°Ñ Ð¾ÑˆÐ¸Ð±ÐºÐ°');
        return {ok:false};
      }
    },

    async testTelegram(){
      this.showToast('ðŸ“¤ ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÑÑŽ Ñ‚ÐµÑÑ‚â€¦');
      try{
        const res=await fetch('/api/order-notify',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({type:'test'})
        });
        const d=await res.json().catch(()=>({ok:false,error:'invalid_json'}));
        if(d&&d.ok) this.showToast('âœ… Ð¢ÐµÑÑ‚ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½! ÐŸÑ€Ð¾Ð²ÐµÑ€ÑŒ Ñ‡Ð°Ñ‚.');
        else this.showToast('âŒ Ð¢ÐµÑÑ‚ Ð½Ðµ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ð»ÑÑ');
      }catch(e){
        this.showToast('âŒ Ð¢ÐµÑÑ‚ Ð½Ðµ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð¸Ð»ÑÑ');
      }
    },

    prefillForm(){
      if(this.currentUser){
        if(this.currentUser.name&&!this.form.name) this.form.name=this.currentUser.name;
        if(this.currentUser.phone&&!this.form.phone) this.form.phone=this.currentUser.phone;
      }
    },

    async submitOrder(){
      this.formErrors={};
      if(!this.form.name.trim())    this.formErrors.name='Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð¸Ð¼Ñ';
      if(!this.form.phone.trim())   this.formErrors.phone='Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½';
      if(!this.form.address.trim()) this.formErrors.address='Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð°Ð´Ñ€ÐµÑ';
      if(!this.cart.length)         this.formErrors.cart='ÐšÐ¾Ñ€Ð·Ð¸Ð½Ð° Ð¿ÑƒÑÑ‚Ð°';
      if(Object.keys(this.formErrors).length) return;
      const order={id:Date.now(),createdAt:new Date().toISOString(),customer:{...this.form,email:this.currentUser?.email||''},items:[...this.cart],total:parseFloat(this.cartTotal),status:'cooking',deliveryLat:41.2995+(Math.random()-.5)*.018,deliveryLng:69.2401+(Math.random()-.5)*.018};
      console.log('ðŸ“¦ ORDER JSON:',JSON.stringify(order,null,2));
      await Promise.all([this._sendToSupabase(order),this._sendToTelegram(order)]);
      this.orders.unshift(order);
      localStorage.setItem('qb_orders',JSON.stringify(this.orders));
      this.cart=[]; this._saveCart();
      this.form={name:'',phone:'',address:''};
      this.trackingOrder=order;
      this.page='success';
      this.$nextTick(()=>lucide.createIcons());
    },

    initMap(){
      if(this._trackInterval) clearInterval(this._trackInterval);
      if(this._mapInstance){this._mapInstance.remove();this._mapInstance=null;}
      const order=this.trackingOrder;
      if(!order) return;
      const dLat=order.deliveryLat, dLng=order.deliveryLng;
      let cLat=dLat-.014, cLng=dLng-.010;
      setTimeout(()=>{
        const el=document.getElementById('tracking-map');
        if(!el) return;
        const map=L.map(el,{zoomControl:false,attributionControl:false}).setView([dLat,dLng],14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
        const mkDest=L.divIcon({html:`<div style="background:#F59E0B;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 16px rgba(245,158,11,.6);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:15px">ðŸ </span></div>`,className:'',iconAnchor:[18,36]});
        const mkCourier=L.divIcon({html:`<div style="background:#10b981;width:40px;height:40px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 16px rgba(16,185,129,.6);display:flex;align-items:center;justify-content:center;font-size:18px">ðŸ›µ</div>`,className:'',iconAnchor:[20,20]});
        L.marker([dLat,dLng],{icon:mkDest}).addTo(map).bindPopup('<b>ÐÐ´Ñ€ÐµÑ Ð´Ð¾ÑÑ‚Ð°Ð²ÐºÐ¸</b>').openPopup();
        const cm=L.marker([cLat,cLng],{icon:mkCourier}).addTo(map);
        this._mapInstance=map;
        setTimeout(()=>map.invalidateSize(),100);
        this._trackInterval=setInterval(()=>{
          cLat+=(dLat-cLat)*.08; cLng+=(dLng-cLng)*.08;
          cm.setLatLng([cLat,cLng]);
          map.panTo([cLat,cLng],{animate:true,duration:.8});
          if(Math.abs(dLat-cLat)<.0002&&Math.abs(dLng-cLng)<.0002){
            clearInterval(this._trackInterval);
            this.showToast('ðŸŽ‰ ÐšÑƒÑ€ÑŒÐµÑ€ Ð¿Ñ€Ð¸Ð±Ñ‹Ð»!');
            if(this.trackingOrder) this.trackingOrder.status='done';
          }
        },1800);
      },200);
    },
  });
});

document.addEventListener('DOMContentLoaded',()=>lucide.createIcons());

