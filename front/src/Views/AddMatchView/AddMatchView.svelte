<script>
    import { onMount } from 'svelte';
  
    let allPlayers = [];
    let TeamA = [null, null];
    let TeamB = [null, null];
    let scoreA = 0;
    let scoreB = 0;
  
    onMount(async () => {
        const response = await fetch('http://localhost:3000/user');
        allPlayers = await response.json();
    });
  
    function handleSubmit() {
        console.log('Match ajouté:', TeamA, TeamB, scoreA, scoreB);
    }
  
    function isPlayerSelected(player) {
        return TeamA.includes(player) || TeamB.includes(player);
    }
  </script>
  
  <form on:submit|preventDefault={handleSubmit}>
    <label>
        Équipe A - Joueur 1:
        <select bind:value={TeamA[0]}>
            <option value={null}>-- Choisir un joueur --</option>
            {#each allPlayers as player}
                {#if !isPlayerSelected(player) || player === TeamA[0]}
                    <option value={player}>{player}</option>
                {/if}
            {/each}
        </select>
    </label>
  
    <label>
        Équipe A - Joueur 2:
        <select bind:value={TeamA[1]}>
            <option value={null}>-- Choisir un joueur --</option>
            {#each allPlayers as player}
                {#if !isPlayerSelected(player) || player === TeamA[1]}
                    <option value={player}>{player}</option>
                {/if}
            {/each}
        </select>
    </label>
  
    <label>
        Équipe B - Joueur 1:
        <select bind:value={TeamB[0]}>
            <option value={null}>-- Choisir un joueur --</option>
            {#each allPlayers as player}
                {#if !isPlayerSelected(player) || player === TeamB[0]}
                    <option value={player}>{player}</option>
                {/if}
            {/each}
        </select>
    </label>
  
    <label>
        Équipe B - Joueur 2:
        <select bind:value={TeamB[1]}>
            <option value={null}>-- Choisir un joueur --</option>
            {#each allPlayers as player}
                {#if !isPlayerSelected(player) || player === TeamB[1]}
                    <option value={player}>{player}</option>
                {/if}
            {/each}
        </select>
    </label>
  
    <label>
        Score A:
        <input type="number" bind:value={scoreA} />
    </label>
  
    <label>
        Score B:
        <input type="number" bind:value={scoreB} />
    </label>
  
    <button type="submit">Ajouter le match</button>
  </form>
  
  <style>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }
  
    label {
        margin-bottom: 10px;
    }
  
    select {
        padding: 5px;
        margin-left: 5px;
    }
  
    input[type="number"] {
        padding: 5px;
        margin-left: 5px;
    }
  
    button {
        margin-top: 10px;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
    }
  
    button:hover {
        background-color: #0056b3;
    }
  </style>
  