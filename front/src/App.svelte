<script>
import {Router, Route } from 'svelte-routing';
import Home from '../src/Views/HomeView/HomeView.svelte';

let url = window.location.pathname;
</script>

<Router {url}>
    <Route path="/" component={Home} />
</Router>