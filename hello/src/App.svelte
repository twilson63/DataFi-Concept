<script>
  import Arweave from "arweave";
  import { SmartWeaveWebFactory } from "redstone-smartweave/esm";
  import { ArweaveWebWallet } from "arweave-wallet-connector";

  let count = 0;
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
  const smartweave = SmartWeaveWebFactory.memCached(arweave);
  const contractId = window.location.pathname.replace("/", "");
  const contract = smartweave.contract(contractId);

  async function getVisits() {
    return contract.readState().then((res) => res.state);
  }

  function doVisit() {
    contract.writeInteraction({
      function: "visit",
    });
  }
</script>

<main class="hero min-h-screen bg-base-200">
  <section class="hero-content text-center">
    <div class="max-w-md space-y-8">
      <h1 class="text-6xl">Hello</h1>
      {#await getVisits}
        Loading number of visits...
      {:then state}
        <p>Visits: {count}</p>
      {:catch e}
        <div class="alert-error">{e.message}</div>
      {/await}
      <button class="btn btn-primary" on:click={doVisit}>Visit</button>
    </div>
  </section>
</main>
