# Svelte Store Fetcher

[![npm version](https://badge.fury.io/js/svelte-store-fetcher.svg)](https://badge.fury.io/js/svelte-store-fetcher)

This package helps you with fetching and caching responses with rarely showing the loading state.

It's based on [Tim's original implementation](https://github.com/cstrnt/modern-fetch-with-svelte).

## Usage
```bash
yarn add -D svelte-store-fetcher

npm install --save-dev svelte-store-fetcher
```

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
