/* ================= Books ================= */
const books = [
    { title: "Learn JavaScript", category: "Programming", price: 399, image: "images/javascript.jpg", description: "Learn JavaScript from scratch. Covers basics, DOM, ES6, and modern JS practices." },
    { title: "HTML & CSS Mastery", category: "Programming", price: 299, image: "images/htmlcss.jpg", description: "Master HTML and CSS. Build responsive and modern web pages easily." },
    { title: "Python for Beginners", category: "Programming", price: 499, image: "images/python.jpg", description: "A complete guide for Python beginners. Covers syntax, loops, functions, and projects." },
    { title: "React Basics", category: "Programming", price: 449, image: "images/react.jpg", description: "Learn the basics of React JS, including components, state, and props." },
    { title: "Data Analytics", category: "Data Science", price: 599, image: "images/data-analytics.jpg", description: "Learn to analyze data with real-world examples and practical techniques." },
    { title: "Machine Learning", category: "Data Science", price: 699, image: "images/ml.jpg", description: "Introduction to machine learning algorithms with Python examples." },
    { title: "Deep Learning", category: "Data Science", price: 799, image: "images/dl.jpg", description: "Dive into neural networks, deep learning frameworks, and real-world projects." },
    { title: "Cyber Security", category: "Technology", price: 499, image: "images/cybersecurity.jpg", description: "Learn about network security, ethical hacking, and cyber threats." },
    { title: "Cloud Computing", category: "Technology", price: 459, image: "images/cloud.jpg", description: "Understand cloud services, deployment models, and cloud computing basics." }
];

/* ================= Sections ================= */
const loginSection = document.getElementById("login");
const signupSection = document.getElementById("signup");
const home = document.getElementById("home");
const categories = document.getElementById("categories");
const cartSection = document.getElementById("cart");
const wishlistSection = document.getElementById("wishlist");

const homeBooks = document.getElementById("homeBooks");
const categoryBooks = document.getElementById("categoryBooks");
const navLinks = document.getElementById("navLinks");

/* Modal Elements */
const modal = document.getElementById("bookModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

/* Forms */
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

/* ================= Cart & Wishlist ================= */
let cart = [];
let wishlist = [];

/* ================= Utility ================= */
function hideAll(){
    loginSection?.classList.add("hidden");
    signupSection?.classList.add("hidden");
    home.classList.add("hidden");
    categories.classList.add("hidden");
    cartSection.classList.add("hidden");
    wishlistSection.classList.add("hidden");
}

/* ================= Login / Signup ================= */
function showLogin(){ hideAll(); loginSection.classList.remove("hidden"); }
function showSignup(){ hideAll(); signupSection.classList.remove("hidden"); }

/* Signup */
signupForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=document.getElementById("signupName").value;
    const password=document.getElementById("signupPassword").value;
    let users=JSON.parse(localStorage.getItem("users"))||[];
    if(users.find(u=>u.name===name)){ signupError.textContent="Name already exists!"; return;}
    users.push({name,password});
    localStorage.setItem("users",JSON.stringify(users));
    signupError.textContent="";
    alert("Account created! Login now.");
    showLogin();
});

/* Login */
loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=document.getElementById("loginName").value;
    const password=document.getElementById("loginPassword").value;
    let users=JSON.parse(localStorage.getItem("users"))||[];
    const user=users.find(u=>u.name===name && u.password===password);
    if(user){
        loginError.textContent="";
        localStorage.setItem("currentUser",name);
        wishlist = JSON.parse(localStorage.getItem(`wishlist_${name}`)) || [];
        renderNavLinks();
        showHome();
    } else { loginError.textContent="Invalid credentials!"; }
});

/* Navbar */
function renderNavLinks(){
    const currentUser = localStorage.getItem("currentUser");
    if(currentUser){
        navLinks.innerHTML = `
            <li>Welcome, ${currentUser}</li>
            <li><a href="#" onclick="showHome()">Home</a></li>
            <li><a href="#" onclick="showCategories()">Categories</a></li>
            <li><a href="#" onclick="showCart()">Cart</a></li>
            <li><a href="#" onclick="showWishlist()">Wishlist</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="#" onclick="showLogin()">Login</a></li>
            <li><a href="#" onclick="showSignup()">Sign Up</a></li>
        `;
    }
}

function logout(){
    localStorage.removeItem("currentUser");
    cart = [];
    wishlist = [];
    renderNavLinks();
    showLogin();
}

/* ================= Books ================= */
function renderBooks(container, bookList){
    container.innerHTML="";
    bookList.forEach((book,index)=>{
        const div=document.createElement("div");
        div.className="book-card";
        div.innerHTML=`
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.category}</p>
            <span>₹${book.price}</span><br><br>
            <button class="addCart">Add to Cart</button>
            <button class="addWishlist">❤️ Wishlist</button>
        `;
        div.querySelector("img").addEventListener("click",()=>showBookDetails(index));
        div.querySelector("h3").addEventListener("click",()=>showBookDetails(index));
        div.querySelector(".addCart").addEventListener("click",()=>addToCart(book));
        div.querySelector(".addWishlist").addEventListener("click",()=>addToWishlist(book));
        container.appendChild(div);
    });
}

/* Navbar actions */
function showHome(){ hideAll(); home.classList.remove("hidden"); renderBooks(homeBooks,books);}
function showCategories(){ hideAll(); categories.classList.remove("hidden"); renderBooks(categoryBooks,books);}
function showCart(){ hideAll(); cartSection.classList.remove("hidden"); renderCart();}
function showWishlist(){ hideAll(); wishlistSection.classList.remove("hidden"); renderWishlist();}

/* Category filter */
function filterCategory(category){
    if(category==="All") renderBooks(categoryBooks, books);
    else renderBooks(categoryBooks, books.filter(b=>b.category===category));
}

/* Modal */
function showBookDetails(index){
    const book = books[index];
    modalImage.src = book.image;
    modalTitle.textContent = book.title;
    modalCategory.textContent = book.category;
    modalPrice.textContent = `₹${book.price}`;
    modalDescription.textContent = book.description;
    modal.style.display="flex";
}

function closeModal(){ modal.style.display="none";}
window.addEventListener("click",(e)=>{if(e.target===modal) closeModal();});

/* Cart Functions */
function addToCart(book){
    const existing = cart.find(item=>item.title===book.title);
    if(existing) existing.quantity+=1;
    else cart.push({...book,quantity:1});
    alert(`${book.title} added to cart!`);
}

function renderCart(){
    cartSection.innerHTML="<h2>Your Cart</h2>";
    if(cart.length===0){ cartSection.innerHTML+="<p>Your cart is empty.</p>"; return;}
    const table=document.createElement("table"); table.style.width="100%"; table.style.borderCollapse="collapse";
    const header=table.insertRow();
    ["Book","Price","Quantity","Total","Action"].forEach(text=>{
        const th= document.createElement("th"); th.textContent=text; th.style.borderBottom="2px solid #ddd"; th.style.padding="10px"; header.appendChild(th);
    });
    let grandTotal=0;
    cart.forEach((item,index)=>{
        const row=table.insertRow(); row.style.borderBottom="1px solid #ddd";
        const cellTitle=row.insertCell(); cellTitle.textContent=item.title; cellTitle.style.padding="10px";
        const cellPrice=row.insertCell(); cellPrice.textContent=`₹${item.price}`; cellPrice.style.padding="10px";
        const cellQty=row.insertCell(); 
        const qtyInput=document.createElement("input"); qtyInput.type="number"; qtyInput.value=item.quantity; qtyInput.min=1; 
        qtyInput.style.width="50px";
        qtyInput.addEventListener("change",(e)=>{item.quantity=parseInt(e.target.value); renderCart();});
        cellQty.appendChild(qtyInput); cellQty.style.padding="10px";
        const cellTotal=row.insertCell(); const total=item.price*item.quantity; grandTotal+=total; cellTotal.textContent=`₹${total}`; cellTotal.style.padding="10px";
        const cellAction=row.insertCell();
        const removeBtn=document.createElement("button"); removeBtn.textContent="Remove"; removeBtn.style.backgroundColor="#dc2626"; removeBtn.style.color="white"; removeBtn.style.border="none"; removeBtn.style.padding="5px 10px"; removeBtn.style.cursor="pointer"; removeBtn.style.borderRadius="4px";
        removeBtn.addEventListener("click",()=>{cart.splice(index,1); renderCart();});
        cellAction.appendChild(removeBtn); cellAction.style.padding="10px";
    });
    cartSection.appendChild(table);
    const totalDiv=document.createElement("div"); totalDiv.style.marginTop="20px"; totalDiv.style.fontWeight="bold"; totalDiv.style.fontSize="18px"; totalDiv.textContent=`Grand Total: ₹${grandTotal}`;
    cartSection.appendChild(totalDiv);
}

/* Wishlist Functions */
function addToWishlist(book){
    if(!wishlist.find(item=>item.title===book.title)){
        wishlist.push(book);
        saveWishlist();
        alert(`${book.title} added to wishlist!`);
    } else alert(`${book.title} is already in your wishlist!`);
}

function saveWishlist(){
    const currentUser = localStorage.getItem("currentUser");
    localStorage.setItem(`wishlist_${currentUser}`, JSON.stringify(wishlist));
}

function renderWishlist(){
    const container=document.getElementById("wishlistBooks");
    container.innerHTML="";
    if(wishlist.length===0){ container.innerHTML="<p>Your wishlist is empty.</p>"; return;}
    wishlist.forEach((book,index)=>{
        const div=document.createElement("div");
        div.className="book-card";
        div.innerHTML=`
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.category}</p>
            <span>₹${book.price}</span><br><br>
            <button class="removeWishlist">Remove</button>
        `;
        div.querySelector("img").addEventListener("click",()=>showBookDetails(index));
        div.querySelector("h3").addEventListener("click",()=>showBookDetails(index));
        div.querySelector(".removeWishlist").addEventListener("click",()=>{
            wishlist.splice(index,1); saveWishlist(); renderWishlist();
        });
        container.appendChild(div);
    });
}

/* ================= Load Default ================= */
if(localStorage.getItem("currentUser")){ 
    wishlist = JSON.parse(localStorage.getItem(`wishlist_${localStorage.getItem("currentUser")}`)) || [];
    renderNavLinks(); 
    showHome();
}else showLogin();