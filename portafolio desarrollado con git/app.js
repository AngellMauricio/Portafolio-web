urlApi = 'https://api.github.com/users/AngellMauricio'

CargarUsuario = () => {

    fetch(urlApi)
        .then(Response => Response.json())
        .then(data => {

            const usuario = data

            console.log("Datos recibidos: ", usuario)
            mostrarUsuario(usuario)
        })


}
mostrarUsuario = (usuario)=>{
    const contenedor =document.getElementById("perfil-container")
    contenedor.innerHTML=""

    const tarjeta=document.createElement("div")

    tarjeta.innerHTML=`
      <img src="https://avatars.githubusercontent.com/u/219763925?v=4" alt="Avatar" class="profile-img mb-3" id="avatar-perfil">
                <h1 class="display-4" id="user-name">${usuario.name}</h1>
                <p class="lead" id="user-bio">${usuario.bio}</p>
                <div class="d-flex justify-content-center gap-3">
                    <span class="badge bg-primary" id="user-location">${usuario.location}</span>
    `

    contenedor.appendChild(tarjeta)
}

mostrarRepos=()=>{

    

}
CargarUsuario()