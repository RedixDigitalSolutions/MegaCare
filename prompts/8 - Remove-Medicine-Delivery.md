Completely remove all medicine/medical delivery functionality from the platform as it is not legally permitted.

Task Details:

Remove the delivery option from the pharmacy cart and checkout flow

Remove the home delivery choice from the cart page (/pharmacy/cart)

Remove all delivery-related steps from the checkout wizard (/pharmacy/checkout)

Remove the Delivery Tracking page and route (/dashboard/tracking)

Remove any delivery-related KPI cards, status badges (e.g. "in transit", "delivered"), and order tracking UI across all dashboards

Remove any delivery address fields from forms

Remove all delivery-related database calls, API endpoints, and backend logic

Clean up any leftover delivery references in the codebase (variables, comments, imports)

Keep the pharmacy pickup option intact — only home delivery and transport-related features should be removed.