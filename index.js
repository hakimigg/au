// Sample data for products
const products = [
    { id: 1, name: 'Nokia Smartphone', price: '$299', company: 'Nokia', image: 'assets/nokia-phone.jpg' },
    { id: 2, name: 'Samsung Galaxy', price: '$499', company: 'Samsung', image: 'assets/samsung-phone.jpg' },
    { id: 3, name: 'Apple iPhone', price: '$999', company: 'Apple', image: 'assets/apple-phone.jpg' },
    { id: 4, name: 'Nokia Tablet', price: '$199', company: 'Nokia', image: 'assets/nokia-tablet.jpg' },
    { id: 5, name: 'Samsung TV', price: '$799', company: 'Samsung', image: 'assets/samsung-tv.jpg' },
    { id: 6, name: 'Apple MacBook', price: '$1299', company: 'Apple', image: 'assets/apple-laptop.jpg' }
];

// Function to show products
function showProducts() {
    document.getElementById('products').style.display = 'block';
    document.getElementById('home').scrollIntoView();
    loadProducts();
}

// Function to load products
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/placeholder.jpg';">
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Company: ${product.company}</p>
        `;
        productGrid.appendChild(productCard);
    });
}

// Function to show company products
function showCompany(company) {
    const filteredProducts = products.filter(p => p.company === company);
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/placeholder.jpg';">
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Company: ${product.company}</p>
        `;
        productGrid.appendChild(productCard);
    });
    document.getElementById('products').style.display = 'block';
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
