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


<section>
    <main class="centered-main">
        <h1>Connectez Vous</h1>

        {#if Message}
            <p class="message" style="color: {textColor}">{Message}</p>
        {/if}

        <form on:submit|preventDefault={login}>
            <label>
                Nom d'utilisateur:
                <input type="text" bind:value={username} />
            </label>

            <label>
                Mot de passe:
                <input type="password" bind:value={password} />
            </label>

            <button type="submit">Se connecter</button>
        </form>
        <p id="register">Vous n'êtes pas encore inscrit ? cliquez <a href="/register">ici</a></p>
    </main>
</section>


<style>
    @media (max-width: 600px) {
        main {
            max-width: 90%;
        }
    }

    h1 {
        text-align: center;
        margin-bottom: 15px;
    }

    section {
        width: 100%;
        height: 90vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    main {
        border-radius: 15px;
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        backdrop-filter: blur(10px);
    }

    .centered-main {
    background-color: rgba(255, 255, 255, 0.727);          
    width: 400px;
    padding: 20px;
    backdrop-filter: blur(1px);
    /* Supprimez les styles de flex de cette classe car body les gère maintenant */
}


    label {
        display: block;
        margin-bottom: 10px;
    }

    input {
        width: 90%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    button {
        display: block;
        width: 100%;
        padding: 10px;
        background: linear-gradient(to right, violet, rgb(66, 66, 237));
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .message {
        text-align: center;
        margin-top: 0px;
    }

    #register {
        margin-top: 2px;
    }
</style>