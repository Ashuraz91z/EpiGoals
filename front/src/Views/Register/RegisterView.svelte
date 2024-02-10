<script lang="ts">
    let username: string = '';
    let email: string = '';
    let password: string = '';
    let message = '';
    let colorText = '';

    function register() {
        fetch('http://localhost:3000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })  
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                message = data.error;
                colorText = 'text-red-500'; // Utilisation de Tailwind pour la couleur du texte
            } else {
                message = 'Vous êtes inscrit !';
                colorText = 'text-green-500'; // Utilisation de Tailwind pour la couleur du texte
                window.location.href = '/login';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function checkPassword() {
        if (password.length < 8) {
            message = 'Le mot de passe doit contenir au moins 8 caractères';
            colorText = 'text-red-500';
        } else return true;
    }

    function checkUsername() {
        if (username.length < 3) {
            message = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
            colorText = 'text-red-500';
        } else return true;
    }

    function checkEmail() {
        if (email.length < 3) {
            message = 'L\'email doit contenir au moins 3 caractères';
            colorText = 'text-red-500';
        } else return true;
    }

    function Verification() {
        if (checkUsername() && checkEmail() && checkPassword()) {
            register();
        }
    }
</script>

<section class="flex h-screen justify-center items-center">
    <main class="bg-purple-200 p-10 rounded-lg shadow-lg max-w-md">
        <h1 class="text-xl font-bold text-center mb-4">Inscrivez Vous</h1>
        {#if message}
            <p class={`text-center ${colorText}`}>{message}</p>
        {/if}
        <form on:submit|preventDefault={Verification} class="space-y-4">
            <div>
                <label for="username" class="block mb-2">Nom d'utilisateur:</label>
                <input type="text" bind:value={username} class="w-full p-2 border rounded"/>
            </div>
            <div>
                <label for="email" class="block mb-2">Email :</label>
                <input type="email" bind:value={email} class="w-full p-2 border rounded"/>
            </div>
            <div>
                <label for="password" class="block mb-2">Mot de passe:</label>
                <input type="password" bind:value={password} class="w-full p-2 border rounded"/>
            </div>
            <button type="submit" class="w-full py-2 px-4 text-white rounded bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75">
                Envoyer
            </button>
        </form>
        <p class="mt-4 text-center">Vous êtes déjà inscrit ? cliquez <a href="/login" class="text-blue-500 hover:underline">ici</a>.</p>
    </main>
</section>
