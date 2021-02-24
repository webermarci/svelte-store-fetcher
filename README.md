# Svelte Store Fetcher

This package helps you with fetching and caching responses with rarely showing the loading state.

It's based on [Tim's original implementation](https://github.com/cstrnt/modern-fetch-with-svelte).

## Usage
```html
<script>
  import { get } from "svelte-store-fetcher";
  const response = get("https://rickandmortyapi.com/api/character/1", 5000);
</script>

<main>
  {#await $response}
    <h1>Loading</h1>
  {:then data}
    <code>{JSON.stringify(data)}</code>
  {:catch}
    <h1>Error</h1>
  {/await}
</main>
```