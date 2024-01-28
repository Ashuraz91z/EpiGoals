<script>
import {Router, Route } from 'svelte-routing';
import Home from './Views/HomeView/HomeView.svelte';
import Register from './Views/RegisterView/RegisterView.svelte';
import Login from './Views/LoginView/LoginView.svelte';
import NotFound from './Views/404NotFoundView/404NotFoundView.svelte';
import AddMatch from './Views/AddMatchView/AddMatchView.svelte';



let url = window.location.pathname;
</script>

<Router {url}>
    <Route component={NotFound} />
    <Route path="/" component={Home} />
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
    <Route path="/addMatch" component={AddMatch} />
</Router>

