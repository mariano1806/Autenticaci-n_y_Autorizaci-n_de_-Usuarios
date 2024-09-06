(async () => {
    const response = await fetch('http://localhost:4000/auth/session', {
        method: 'GET',
        credentials: 'include' 
    })
    console.log(response);
    console.log({ response })


    if (response.ok) {
        const data = await response.json();
        document.getElementById('user-name').innerText = data.user.username;
    } else {
        window.location.href = 'index.html'
    }
})();


// Manejar el cierre de sesión
document.getElementById('logout').addEventListener('click', async () => {
    const response = await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })
    
    if (!response.ok) {
        throw new Error('Error al cerrar sesión');
    } else {
        window.location.href = 'index.html';
    }
});