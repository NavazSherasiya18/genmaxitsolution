# Website development pricing

Both `/solutions-and-plans` and `/pricing` render the configurator below the existing plans. Website development pricing lives in `src/data/websitePricing.ts` and is shared by the calculator and the Express quote endpoint.

## Set prices and package policies

- Enter each approved INR, AED, or USD rate as a nonnegative integer in minor units. One hundred minor units are one rupee, dirham, or dollar. A missing currency rate displays **Price on Request**. A zero rate represents a free item.
- Configure package base prices in `PACKAGES`, page and product overages in `WEBSITE_PRICING`, feature rates in `ADD_ONS`, and gateway integration rates in `GATEWAYS`. Maintenance rates are monthly. Per-unit allowances come from each selected package.
- Set `delivery`, `revisions`, and `support` on a package when approved. Informational pages for eCommerce are scoped separately unless a package has a page allowance. Set `includedGateways` to a number for a defined allowance or `null` when scope must be confirmed before pricing.
- Rebuild the frontend and restart the backend together so visitors and the quote service use the same catalog.

## Run the quote service

- The Express app registers `POST /api/website-quotes` in development and production. It validates the selected configuration, recalculates the estimate, and returns a reference after storing the quote. For local use, run `npm run dev` instead of the static Vite preview.
- Set `WEBSITE_QUOTE_DATA_DIR` on the Express host to a private, persistent directory outside the project. The local default is `.genmax-it/website-quotes` under the server user's home directory. Authorized operators can read the JSON records directly from that directory. Records include the configuration, customer details, estimate, `new` status, and submission time.
- On Vercel, set `WEBSITE_QUOTE_BACKEND_URL` to the full HTTPS URL of the Express host's `/api/website-quotes` endpoint. The Vercel function forwards validated requests to that persistent service. See [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js).
- The existing leads panel has no authenticated administration for pricing and quotation records. An admin UI for catalog updates, quote status, and final approved amounts requires an authenticated and authorized back office. Manage the catalog in the typed configuration until that exists.

## Run the pricing tests

`node --import tsx --test tests/websitePricing.test.ts`
