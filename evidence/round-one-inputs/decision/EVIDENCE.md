# Planning packet, 12 November 2026

## Company context
RelayDesk has 38 paying customers and $57,000 monthly recurring revenue. The product routes support tickets into shared team queues. Two engineers are available for the coming six weeks. An existing enterprise audit-log commitment consumes one engineer for four of those weeks. The other engineer maintains the queue engine and is the only person currently comfortable changing routing.

## Commercial request
Northbank Services pays $4,000/month. Its annual renewal is in eight weeks. Its operations manager asked for a graphical rules builder: nested conditions, customer-defined fields, working hours, escalation timers, and reassignment. She wrote: “Without a better way to catch urgent items, I can't recommend renewal.” The account executive marked $48,000 ARR “at risk” and estimated another $24,000 ARR from expansion if the builder ships. There is no signed expansion order. Procurement says renewal depends on both operational fit and a vendor consolidation review; that review has not happened.

A second prospect, a 70-person support team, asked for conditional routing but has not trialed the product. Its estimated deal is $18,000 ARR. Three current customers have asked for better escalation visibility, not configuration. Twenty-nine current customers have never enabled the existing single-threshold escalation feature. No one has interviewed those 29 about why.

## Northbank observation
During two observed shifts, 19 of 410 tickets breached Northbank's target response time. Of the 19, 12 had already been flagged by RelayDesk's existing threshold feature but the flags were invisible in the team's default compact queue view. Four tickets arrived outside staffed hours. Three needed classification data not currently available in RelayDesk. The operations manager demonstrated a spreadsheet with 27 “rules”; 18 were identical escalation thresholds for different customer names. The remaining nine include exceptions, but their frequency is unknown. These observations cover only two shifts and are not a representative baseline.

## Product and engineering notes
The existing escalation threshold can be configured per queue and generates a timestamped escalation event. Compact view can show an escalation indicator without queue-engine changes. Showing escalated items in a saved view would reuse an existing filter mechanism; an engineer estimates 2–4 days including tests. These estimates have not been validated against Northbank's exact permissions model.

A flexible rules builder is estimated at 7–10 engineer-weeks before operational hardening. The estimate excludes conflict resolution, migration from existing thresholds, and customer support for misconfigured rules. Working-hours support is estimated separately at 2–3 engineer-weeks. There is no automated rollback for routing changes today.

Support currently spends about 5 hours/week explaining escalation status. That is an informal estimate from the support lead, not time-tracked data. The team can support one design partner with a weekly review but cannot manually monitor tickets on a customer's behalf.

## Leadership positions
The CEO wants to “save the renewal without becoming a consulting shop.” Sales wants a dated commitment this week. The engineering lead opposes promising the builder on the current estimate. The customer has not been shown a saved escalation view. Northbank's operations manager has offered a 30-minute session next Tuesday and can invite the shift supervisor; procurement will not attend.
