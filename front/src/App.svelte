<script>
import {Router, Route } from 'svelte-routing';
import Home from './Views/Home/HomeView.svelte';
import Register from './Views/Register/RegisterView.svelte';
import Login from './Views/Login/LoginView.svelte';
import NotFound from './Views/404NotFound/404NotFoundView.svelte';
import AddMatch from './Views/AddMatch/AddMatchView.svelte';




let url = window.location.pathname;
</script>

<Router {url}>
    <Route component={NotFound} />
    <Route path="/" component={Home} />
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
    <Route path="/addMatch" component={AddMatch} />
</Router>

