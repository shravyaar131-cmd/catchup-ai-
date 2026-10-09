// CatchUp AI - Sample Conversations for Hackathon Demo
// These realistic datasets demonstrate all core detection capabilities:
// - Summary & Main Topics
// - Decisions, Blockers, Announcements with supporting evidence quotes
// - Action Items with explicit owners (or Unassigned) and deadlines
// - Priority classifications with clear reasoning (High/Med/Low)
// - Confirmed deadlines vs Ambiguous dates
// - Direct mentions

const SAMPLE_CONVERSATIONS = {
  launchCrunch: {
    id: "launchCrunch",
    title: "Scenario 1: Product Launch Crunch (Blockers, Deadlines & Decisions)",
    badge: "High Urgency",
    description: "Engineering team resolving a payment blocker before launch freeze.",
    rawText: `[10:15 AM] Sarah (Lead): Team, we have our launch scheduled for 7:00 PM today! Everyone please check in with status.
[10:16 AM] David (Backend): Heads up - we hit a critical blocker on staging. The Stripe payment gateway is returning 500 errors on foreign currency transactions.
[10:18 AM] Elena (QA): Can confirm! I tested 6 transactions with EUR and GBP, all 6 failed. USD works fine though.
[10:19 AM] Sarah (Lead): @David this is a HIGH priority blocker. Can we get this patched immediately?
[10:20 AM] David (Backend): Yes, I found the bug. It's a currency conversion rounding mismatch in the webhook handler. I will push a fix to staging by 12:30 PM.
[10:22 AM] Sarah (Lead): Decision made: If the Stripe fix is not verified by 2:00 PM, we will temporarily disable non-USD checkout and proceed with USD-only for launch.
[10:24 AM] Priya (Frontend): What about the mobile checkout page? The buttons are misaligned on iOS Safari.
[10:25 AM] Marcus (Design): @Priya please update the CSS grid container for iOS Safari before 3:00 PM.
[10:26 AM] Priya (Frontend): On it! I will have the iOS button fix ready by 1:30 PM.
[10:28 AM] Alex (DevOps): Reminder: Production code freeze is strictly at 6:00 PM today. No commits after that.
[10:30 AM] Sarah (Lead): Great reminder @Alex. Also, we will need someone to write the post-launch monitoring script.
[10:31 AM] Elena (QA): I can review the test cases, but someone else needs to write the monitoring script.
[10:33 AM] Chloe (Marketing): Announcement: The marketing email blast is scheduled for tomorrow at 8:00 AM. Also, social media influencer posts will go out sometime next week.
[10:35 AM] Sarah (Lead): Thanks Chloe. Team sync is scheduled for 5:30 PM today to give final go/no-go approval. Let's make this happen!`
  },

  incidentOutage: {
    id: "incidentOutage",
    title: "Scenario 2: Critical Production Incident (Outage & Resolution)",
    badge: "Incident Response",
    description: "DevOps and SRE responding to an active database latency spike.",
    rawText: `[02:04 AM] PagerDuty Bot: CRITICAL ALERT: Database cluster CPU at 98%, API p99 latency spiked to 4,200ms.
[02:06 AM] Jordan (On-Call SRE): Acknowledged alert. Investigating production DB cluster.
[02:07 AM] Marcus (CTO): @Jordan What is our status? We are seeing customer complaints on Twitter.
[02:09 AM] Jordan (On-Call SRE): Root cause identified: The analytics batch job deployed at 01:45 AM ran an unindexed query locking the users table.
[02:11 AM] Marcus (CTO): Official decision: Roll back deployment v2.14 immediately and kill the analytics worker process.
[02:12 AM] Jordan (On-Call SRE): Terminating worker lock now. Rollback to v2.13 in progress, ETA 10 minutes.
[02:15 AM] Jordan (On-Call SRE): Worker killed. CPU dropped back to 14%. Latency normalizing to 120ms.
[02:17 AM] Sam (Customer Support): Announcement: Public status page updated to 'Investigating'. Should we publish the resolution note?
[02:18 AM] Marcus (CTO): @Sam wait until 02:45 AM to confirm stability before marking resolved.
[02:20 AM] Jordan (On-Call SRE): Action item: @Jordan will write the incident post-mortem document by Friday 5:00 PM.
[02:22 AM] Marcus (CTO): Need someone to audit all pending migration scripts before next release.
[02:24 AM] Jordan (On-Call SRE): We should also schedule a chaos engineering review session sometime next month.
[02:25 AM] Marcus (CTO): Agreed. Great quick response everyone.`
  },

  productSync: {
    id: "productSync",
    title: "Scenario 3: Weekly Product & Design Sync (Features & Planning)",
    badge: "Planning Sync",
    description: "Cross-functional team reviewing user research and planning the next sprint.",
    rawText: `[11:00 AM] Rachel (Product Manager): Welcome to the weekly sync. Today's agenda: Onboarding redesign feedback and Q3 roadmap.
[11:03 AM] Liam (UX Researcher): The usability test findings are in! 8 out of 10 users found the step 3 signup form too confusing.
[11:05 AM] Rachel (Product Manager): That explains the 25% dropoff. What did they struggle with?
[11:07 AM] Liam (UX Researcher): Users didn't understand why we require phone verification before trying the product.
[11:09 AM] Maya (Lead Designer): Decision: We are removing phone verification from the initial onboarding and moving it to the security settings tab.
[11:11 AM] Rachel (Product Manager): Approved! @Maya please upload the revised Figma flow by Thursday 3:00 PM.
[11:13 AM] Maya (Lead Designer): Will do! I will also share the prototype with Liam for a quick validation.
[11:15 AM] Kevin (Lead Engineer): Action item: Engineering needs to estimate backend changes for the deferred phone auth. @Kevin will deliver estimates by Monday morning.
[11:17 AM] Rachel (Product Manager): Perfect. Announcement: Company all-hands meeting is moved to Wednesday at 2:00 PM.
[11:19 AM] Kevin (Lead Engineer): Heads up - we should also upgrade our React dependencies sometime later this quarter.
[11:21 AM] Rachel (Product Manager): Noted, we can backlog the dependency upgrade. Next sync is next Tuesday at 11:00 AM.`
  }
};

// Export for module systems (Node.js) or browser global window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_CONVERSATIONS };
} else if (typeof window !== 'undefined') {
  window.SAMPLE_CONVERSATIONS = SAMPLE_CONVERSATIONS;
}
