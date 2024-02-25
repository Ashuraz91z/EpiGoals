<script lang="ts">
    import { writable } from 'svelte/store';

    let username: string = '';
    let email: string = '';
    let password: string = '';
    let message = writable(''); // Utiliser un store réactif pour le message
    let colorText = writable(''); // Utiliser un store réactif pour la couleur du texte

    function register() {
    fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then((response) => {
        if (!response.ok) { // Vérifie si la réponse du serveur n'est pas OK (ex : code 400 ou 500)
            return response.json().then((data) => {
                throw data; // Lance une exception avec l'objet d'erreur qui sera capturé par .catch
            });
        }
        return response.json();
    })
    .then((data) => {
        message.set('Vous êtes inscrit !');
        colorText.set('text-green-500');
        window.location.href = '/login';
    })
    .catch((error) => {
        console.error(error);
        if (error && error.errors) {
            message.set(error.errors.join("\n"));
        } else {
            message.set("Une erreur inattendue s'est produite.");
        }
        colorText.set('text-red-500');
    });
}

</script>


<section class="flex h-screen justify-center items-center">
    <main class="bg-purple-200 p-10 rounded-lg shadow-lg max-w-md">
        <h1 class="text-xl font-bold text-center mb-4">S'inscrire</h1>
        {#if $message}
        <p class="text-center {$colorText}">{$message}</p>
    {/if}
        <form on:submit|preventDefault={register} class="space-y-4">
            <div>
                <label for="username" class="block mb-2">Nom d'utilisateur :</label>
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
            <button type="submit" class="w-full py-2 px-4 text-white rounded bg-custom-gradient">
                Envoyez
            </button>
        </form>
        <p class="mt-4 text-center w-full ">Vous avez déja un compte ? Alors cliquez  <a href="/login" class="text-blue-500 hover:underline">ici</a>.</p>
    </main>
</section>
