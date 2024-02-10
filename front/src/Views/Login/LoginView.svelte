<script>
    let username = '';
    let password = '';
    let Message = '';
    let textColor = '';

    async function login() {
        const response = await fetch('http://localhost:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            Message = data.message;
            textColor = 'green'
            window.location.href = '/home';
        } else {
            const error = await response.json();
            Message = error.error;
            textColor = 'red'
        }
    }
</script>

<section class="flex h-screen justify-center items-center">
    <main class="bg-purple-200 p-10 rounded-lg shadow-lg max-w-md">
        <h1 class="text-xl font-bold text-center mb-4">Connectez Vous</h1>
        {#if Message}
            <p class={`text-center ${textColor}`}>{Message}</p>
        {/if}
        <form on:submit|preventDefault={login} class="space-y-4">
            <div>
                <label for="username" class="block mb-2">Nom d'utilisateur:</label>
                <input type="text" bind:value={username} class="w-full p-2 border rounded"/>
            </div>
            <div>
                <label for="password" class="block mb-2">Mot de passe:</label>
                <input type="password" bind:value={password} class="w-full p-2 border rounded"/>
            </div>
            <button type="submit" class="w-full py-2 px-4 text-white rounded bg-custom-gradient">
                Se connecter
            </button>
        </form>
        <p class="mt-4 text-center">Vous n'êtes pas encore inscrit ? cliquez <a href="/register" class="text-blue-500 hover:underline">ici</a>.</p>
    </main>
</section>