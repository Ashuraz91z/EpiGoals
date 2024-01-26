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
            } else {
                message = 'Vous êtes inscrit !';
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
            colorText = 'red';
        } 
        else return true;
    }
    function checkUsername() {
        if (username.length < 3) {
            message = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
            colorText = 'red';
        } 
        else return true;
    }

    function checkEmail() {
        if (email.length < 3) {
            message = 'L\'email doit contenir au moins 3 caractères';
            colorText = 'red';
        } 
        else return true;

    }

    function Verification() {
        if (checkUsername() && checkEmail() && checkPassword()) {
            register();
        }

    }

</script>

<section>
    <main class="centered-main">
        <h1>Inscrivez Vous</h1>

        {#if message}
            <p class="message" style="color: red">{message}</p>
        {/if}

        <form on:submit|preventDefault={Verification}>
            <label>
                Nom d'utilisateur:
                <input type="text" bind:value={username}  />
            </label>
            <label>
                Email :
                <input type="email" bind:value={email} />
            </label>
            <label>
                Mot de passe:
                <input type="password" bind:value={password} />
            </label>

            <button type="submit">Envoyer</button>
        </form>
        <p id="register">Vous êtes déjà inscrit ? cliquez <a href="/login">ici</a></p>
    </main>
</section>


<style>

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
