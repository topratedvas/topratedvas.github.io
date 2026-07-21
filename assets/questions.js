/* ============================================================
   TopRatedVAs.com — Certification question banks (Phase 6 · v1 DRAFT)
   Scenario-based, EcomSniper Amazon→eBay dropshipping model.
   The engine draws min(20, bank length), shuffles question order
   AND answer order, and speed-scores each answer.

   `answer` is the 0-based index of the correct option BEFORE shuffle.
   v1 DRAFT CONTENT — Dan refines + grows each bank to 30+ in Phase 9.
   Customer Service is a complete 30-question bank; the other four are
   ~10-question starters (engine draws what's available).
   ============================================================ */
(function () {
  "use strict";

  // The five certifications (order + metadata). `locked` = VA Manager,
  // which unlocks free after the other four pass (enforced in the engine/dash).
  window.TRV_CERTS = [
    { key: "customer-service", role: "Customer Service", fee: 15, blurb: "eBay messages, returns, cases, feedback — handled the dropship-safe way." },
    { key: "listing",          role: "Listing",          fee: 15, blurb: "Create & optimize eBay listings with EcomSniper — titles, specifics, VERO safety." },
    { key: "sourcing",         role: "Sourcing / Sniping", fee: 10, blurb: "Find winning Amazon items with EcomSniper sniping tools; velocity, margin, competition." },
    { key: "fulfillment",      role: "Order Fulfillment", fee: 10, blurb: "Fill eBay orders on Amazon — tracking, price jumps, cancellations, account health." },
    { key: "manager",          role: "VA Manager",       fee: 0,  locked: true, blurb: "Manage VAs + AI agents. Locked until the other four pass — then FREE." }
  ];

  window.TRV_QUESTIONS = {

    /* ==================== CUSTOMER SERVICE (30) ==================== */
    "customer-service": [
      { scenario: "Hi, I ordered this as a birthday gift and it arrived in an AMAZON box with a packing slip showing a LOWER price than I paid on eBay. This feels like a scam — refund the difference or I'm opening a case and leaving negative feedback.",
        q: "What is the BEST first response?",
        options: [
          "Apologize warmly, explain you use multiple fulfillment warehouses, reassure the item is new and genuine, and offer a small goodwill gesture before they open a case.",
          "Tell them the price gap is just eBay fees and they agreed to the price at checkout, so nothing is owed.",
          "Refund the full order immediately and block the buyer to protect your feedback.",
          "Ignore it for 24 hours — angry buyers cool off and a fast reply signals guilt."
        ], answer: 0 },

      { scenario: "Buyer: \"Where is my item?? It's been 5 days and tracking hasn't moved.\"",
        q: "Tracking shows the Amazon order is still 'preparing to ship.' Best action?",
        options: [
          "Reassure the buyer with the expected delivery date from the listing, confirm it's on the way, and check the Amazon order for any delay.",
          "Tell them to be patient and stop messaging.",
          "Immediately refund and cancel to avoid a case.",
          "Send them the raw Amazon tracking link so they can track it themselves."
        ], answer: 0 },

      { q: "A buyer opens an eBay 'Item Not Received' (INR) case while tracking still shows in-transit and not yet past the delivery date. What do you do?",
        options: [
          "Respond in the case with the tracking number and expected delivery date, and ask the buyer to wait until the estimated date before escalating.",
          "Refund in full right away to close the case fast.",
          "Ignore the case — eBay closes them automatically.",
          "Tell the buyer to contact the carrier themselves."
        ], answer: 0 },

      { scenario: "Buyer: \"This is DEFECTIVE. The zipper broke on day one. I want a refund.\"",
        q: "Most account-safe way to handle a defective-item claim?",
        options: [
          "Apologize, offer a replacement or full refund per policy, and process a no-cost return so eBay sees you resolving it.",
          "Argue that they broke it and refuse.",
          "Tell them to take it up with Amazon since that's the real source.",
          "Offer a 10% discount to keep it and hope they accept."
        ], answer: 0 },

      { q: "A buyer sends a message BEFORE buying: \"Is this authentic and in stock?\" The item is an Amazon-sourced dropship listing. Best reply?",
        options: [
          "Confirm it's brand new and available, give the handling/delivery estimate, and thank them for asking.",
          "Explain in detail that you dropship it from Amazon.",
          "Tell them to just buy it and find out.",
          "Say you're not sure and they should check with the brand."
        ], answer: 0 },

      { scenario: "Buyer left NEGATIVE feedback: \"Slow shipping, will not buy again.\" The order actually arrived on time per tracking.",
        q: "Best next step?",
        options: [
          "Politely message the buyer, acknowledge their frustration, and offer to make it right — many will revise feedback once satisfied.",
          "Reply publicly calling the feedback a lie.",
          "Report the buyer to eBay demanding automatic removal.",
          "Do nothing — feedback can never be changed."
        ], answer: 0 },

      { q: "An eBay message contains a request to complete the sale OFF eBay (buyer offers to pay by bank transfer for a discount). What do you do?",
        options: [
          "Decline politely and keep everything on eBay — off-platform deals violate policy and void protections.",
          "Accept — it saves eBay fees.",
          "Give them your personal PayPal to arrange it.",
          "Ask a manager but proceed with the transfer meanwhile."
        ], answer: 0 },

      { scenario: "Buyer: \"I need this by Friday for an event. Can you guarantee it?\"",
        q: "Best response when you can't control the carrier?",
        options: [
          "Share the realistic estimated delivery window honestly, note you can't guarantee a carrier date, and offer to check faster options if available.",
          "Promise Friday delivery to secure the sale.",
          "Tell them shipping is out of your hands and end the chat.",
          "Guarantee it and refund later if it's late."
        ], answer: 0 },

      { q: "A return request comes in for 'no longer needed' (buyer's remorse) on a listing marked 'Returns accepted, buyer pays return shipping.' Best handling?",
        options: [
          "Accept the return per your stated policy and have the buyer pay return shipping as listed.",
          "Deny it because it's the buyer's fault.",
          "Accept and pay for return shipping yourself to avoid conflict.",
          "Tell them to keep it and issue a full refund."
        ], answer: 0 },

      { scenario: "Buyer: \"Item is fine but the box was a bit dented.\" No refund requested — just a comment.",
        q: "Best reply to build goodwill?",
        options: [
          "Thank them, apologize for the packaging, and confirm you're glad the item itself is good — invite them to reach out if anything else comes up.",
          "Offer a full refund immediately.",
          "Ignore it since they didn't ask for anything.",
          "Explain that shipping damage is never your responsibility."
        ], answer: 0 },

      { q: "You notice a buyer's shipping address in the eBay order differs from what you'd send to Amazon. Correct action?",
        options: [
          "Always ship to the address on the eBay order; never change it based on a message alone.",
          "Ship to whichever the buyer messages you last.",
          "Ask the buyer to pay again for the new address.",
          "Cancel the order and tell them to re-buy."
        ], answer: 0 },

      { scenario: "Buyer: \"You sent the WRONG color. I ordered black, got blue.\"",
        q: "Best resolution path?",
        options: [
          "Apologize, confirm the correct item, and arrange a free replacement or return-and-refund — a wrong item is a seller error.",
          "Insist they ordered blue and refuse.",
          "Tell them to keep the blue at a 5% discount and move on.",
          "Blame Amazon's warehouse and close the message."
        ], answer: 0 },

      { q: "eBay's Money Back Guarantee: which statement is TRUE for dropshippers?",
        options: [
          "If the item doesn't arrive or isn't as described, the buyer is protected and the seller is responsible for resolving it.",
          "It only applies to items shipped by eBay itself.",
          "It never applies when the source is Amazon.",
          "It only covers electronics over $100."
        ], answer: 0 },

      { scenario: "Buyer opens a 'Significantly Not As Described' (SNAD) return, claiming lower quality than pictured.",
        q: "Most account-safe response?",
        options: [
          "Accept the return; SNAD returns are buyer-protected, and fighting them risks defects on your account.",
          "Refuse and tell them to keep it.",
          "Demand photo proof before doing anything, then stall.",
          "Escalate to eBay immediately to fight the buyer."
        ], answer: 0 },

      { q: "A buyer is polite but confused about tracking that shows a carrier they don't recognize. Best reply?",
        options: [
          "Reassure them, explain the carrier handling the delivery, and share the current status and expected date.",
          "Tell them the carrier doesn't matter and to wait.",
          "Admit you have no idea which carrier it is.",
          "Send them to eBay support instead of helping."
        ], answer: 0 },

      { scenario: "Buyer: \"Cancel my order, I changed my mind\" — sent 20 minutes after purchase, before you've placed the Amazon order.",
        q: "Best action?",
        options: [
          "Accept the cancellation promptly since it hasn't shipped, and confirm the refund to keep the buyer happy.",
          "Refuse — all sales are final.",
          "Ship it anyway to keep the sale.",
          "Charge a restocking fee before cancelling."
        ], answer: 0 },

      { q: "Which of these is the WORST habit for a customer-service VA managing feedback?",
        options: [
          "Leaving buyer messages unanswered for days until cases escalate.",
          "Replying within a few hours with a friendly tone.",
          "Offering solutions before the buyer has to ask twice.",
          "Keeping all communication inside eBay."
        ], answer: 0 },

      { scenario: "Buyer threatens: \"Refund me now or I'll leave 1-star and report you.\" The item was delivered and is as described.",
        q: "Best professional response?",
        options: [
          "Stay calm and polite, ask what specifically is wrong, and offer a fair resolution within policy rather than caving to threats.",
          "Refund instantly to avoid the threat.",
          "Warn them you'll report them first.",
          "Ignore the message entirely."
        ], answer: 0 },

      { q: "A buyer messages asking for the tracking number 1 hour after purchase. Best reply?",
        options: [
          "Thank them, explain the order is being processed and tracking will update within the handling window shown on the listing.",
          "Send a random tracking number to satisfy them.",
          "Tell them tracking is not available for dropship orders.",
          "Say you'll get to it eventually."
        ], answer: 0 },

      { scenario: "Buyer: \"The listing said 2-day shipping but it's taking longer.\"",
        q: "The listing's handling time was actually set to 3 business days. Best reply?",
        options: [
          "Politely clarify the stated handling and delivery window, apologize for the confusion, and give the current expected date.",
          "Tell them they misread and it's their fault.",
          "Refund shipping cost to avoid an argument you might lose.",
          "Blame eBay's display and end the conversation."
        ], answer: 0 },

      { q: "Best way to reduce 'Item Not Received' cases as a customer-service VA?",
        options: [
          "Upload valid tracking promptly and proactively message buyers with the delivery estimate.",
          "Set handling time to 1 day even if you can't meet it.",
          "Disable buyer messages so they can't complain.",
          "Only respond after a case is opened."
        ], answer: 0 },

      { scenario: "Buyer: \"Can you send me the Amazon invoice for warranty purposes?\"",
        q: "Best response?",
        options: [
          "Politely explain you can provide an eBay order receipt/invoice, and help them with any warranty question directly.",
          "Forward the raw Amazon invoice showing your cost.",
          "Tell them warranties don't exist on eBay.",
          "Ignore the request as unreasonable."
        ], answer: 0 },

      { q: "A buyer's message is in another language you don't speak. Best practice?",
        options: [
          "Use a translation tool to understand and reply clearly and courteously in their language.",
          "Reply 'I don't understand' and close it.",
          "Ignore it until they write in English.",
          "Copy-paste their message back to them."
        ], answer: 0 },

      { scenario: "An eBay case is auto-closing in your favor tomorrow, but the buyer just messaged apologizing and saying the item actually arrived.",
        q: "Best move?",
        options: [
          "Thank them warmly, confirm you're glad it arrived, and invite them to reach out anytime — protect the relationship and future feedback.",
          "Gloat that you were right all along.",
          "Ask them to remove any negative feedback as a condition.",
          "Say nothing and let the case close."
        ], answer: 0 },

      { q: "Which action best protects seller account health when resolving complaints?",
        options: [
          "Resolving issues directly with the buyer before eBay has to step in.",
          "Letting eBay force refunds via case rulings.",
          "Accumulating unresolved cases to batch them later.",
          "Telling buyers to open cases so there's a record."
        ], answer: 0 },

      { scenario: "Buyer: \"I received two of the same item but only ordered one.\"",
        q: "Best response?",
        options: [
          "Apologize for the mix-up, tell them to keep the extra or arrange a free return, and confirm you'll sort it out at no cost to them.",
          "Demand they pay for the second item.",
          "Accuse them of lying to get a freebie.",
          "Tell them it's Amazon's problem to solve."
        ], answer: 0 },

      { q: "A buyer leaves a neutral feedback mentioning slow replies. Going forward, the best fix is to:",
        options: [
          "Reply to all buyer messages within a set target time (e.g., a few business hours) consistently.",
          "Turn off notifications to reduce stress.",
          "Only reply to buyers who threaten cases.",
          "Reply once a week in a batch."
        ], answer: 0 },

      { scenario: "Buyer: \"I want to return it but the return window closed 2 days ago.\" Item is not defective.",
        q: "Best professional response?",
        options: [
          "Explain the return policy kindly, and — if it fits the store's goodwill approach — offer a reasonable one-time exception to protect the relationship.",
          "Flatly refuse and cite the rules coldly.",
          "Tell them to resell it themselves.",
          "Report them for a late request."
        ], answer: 0 },

      { q: "The single most important trait of a great customer-service VA in this niche is:",
        options: [
          "Fast, empathetic, policy-aware responses that resolve issues without hurting account health.",
          "Winning every argument with buyers.",
          "Never issuing refunds under any circumstances.",
          "Replying with long scripted paragraphs to every message."
        ], answer: 0 },

      { scenario: "Buyer messages you a link and says \"click here to confirm your seller details or your payout is frozen.\"",
        q: "Best action?",
        options: [
          "Do not click; treat it as a phishing attempt and verify account status only through eBay directly.",
          "Click quickly to avoid the payout freeze.",
          "Enter your login on the linked page to be safe.",
          "Forward the link to the store owner to click."
        ], answer: 0 }
    ],

    /* ==================== LISTING (10 · v1 starter) ==================== */
    "listing": [
      { q: "Which eBay title will rank and convert best for a specific product?",
        options: [
          "Brand + Model + Key Feature + Size/Color, using real keywords buyers search (e.g. 'Stanley 40oz Quencher Tumbler Insulated Straw Cup Charcoal').",
          "ALL CAPS SALE!! BEST PRICE CHEAP FAST SHIP L@@K.",
          "A short vague title like 'Nice cup'.",
          "Keyword-stuffed unrelated brands to catch more searches."
        ], answer: 0 },

      { scenario: "A supplier listing uses a trademarked brand name you're not authorized to resell (VERO risk).",
        q: "Best action when building the eBay listing?",
        options: [
          "Avoid listing VERO-protected/branded items you can't safely sell; choose a compliant product instead.",
          "List it anyway and remove it only if reported.",
          "Use the brand in the title but not the photos.",
          "Slightly misspell the brand to dodge filters."
        ], answer: 0 },

      { q: "For item specifics, the best practice is to:",
        options: [
          "Fill in all relevant specifics accurately (brand, size, color, MPN) to maximize search visibility.",
          "Leave them blank to save time.",
          "Copy specifics from an unrelated product.",
          "Only fill the title and skip specifics."
        ], answer: 0 },

      { q: "Which pricing approach fits the Amazon→eBay model best?",
        options: [
          "Price to cover the Amazon cost + eBay fees + a target margin, and keep it monitored by a repricer.",
          "Match the Amazon price exactly with no margin.",
          "Set the highest price possible and never change it.",
          "Price below your Amazon cost to win the sale."
        ], answer: 0 },

      { q: "Listing photos for a dropshipped item should:",
        options: [
          "Be clean, accurate images of the actual product on a clear background, matching what the buyer receives.",
          "Show a different but nicer-looking product.",
          "Include competitor watermarks.",
          "Be blurry phone photos to look 'authentic'."
        ], answer: 0 },

      { q: "Handling time on a dropship listing should be set to:",
        options: [
          "A realistic window you can consistently meet given Amazon processing (with buffer), not an unrealistic 1 day.",
          "Same-day, always, regardless of source speed.",
          "10+ days to be extra safe, hurting conversion.",
          "Whatever the competitor set."
        ], answer: 0 },

      { q: "What's the safest way to grow a new store's listing count with EcomSniper?",
        options: [
          "List quality, compliant, in-demand items steadily while respecting eBay selling limits.",
          "Bulk-upload thousands of random items on day one.",
          "Duplicate one listing 500 times.",
          "List every trending brand regardless of VERO."
        ], answer: 0 },

      { scenario: "Two candidate items: one high-demand but VERO-risky brand, one solid generic with steady demand.",
        q: "Which do you list?",
        options: [
          "The compliant generic with steady demand — account safety first.",
          "The VERO-risky brand for higher sales.",
          "Both, and deal with strikes later.",
          "Neither — new stores shouldn't list."
        ], answer: 0 },

      { q: "A good item description for a dropship listing:",
        options: [
          "Clearly states features, condition (new), and honest shipping/return expectations.",
          "Reveals the Amazon source and your cost.",
          "Promises guaranteed next-day delivery.",
          "Is left blank to move faster."
        ], answer: 0 },

      { q: "When a listed item goes out of stock at the Amazon source, the lister should:",
        options: [
          "Promptly mark it out of stock / end the listing so no unfulfillable orders come in.",
          "Leave it live and cancel any orders that arrive.",
          "Raise the price to discourage buyers but keep it live.",
          "Do nothing until a buyer complains."
        ], answer: 0 }
    ],

    /* ==================== SOURCING / SNIPING (10 · v1 starter) ==================== */
    "sourcing": [
      { scenario: "An eBay item sells for $34.99. The Amazon source is $31.50 with free Prime shipping; eBay fees run ~13.25%.",
        q: "Is this a viable item, and what's the repricer's job?",
        options: [
          "Margin is thin after fees — keep it only if a repricer maintains profit as the Amazon price moves; otherwise skip.",
          "List it — any sale is a good sale regardless of margin.",
          "List it and never reprice; the price is fixed.",
          "Reject it because eBay fees make all items unprofitable."
        ], answer: 0 },

      { q: "Which item profile is the BEST sniping target?",
        options: [
          "Steady demand, healthy margin after fees, low VERO/competition risk, reliable Amazon availability.",
          "Highest possible demand regardless of margin or VERO.",
          "Cheapest item with razor-thin margin.",
          "A trademarked brand with huge sales."
        ], answer: 0 },

      { q: "Why does answer 'reliable Amazon availability' matter when sourcing?",
        options: [
          "If the source frequently goes out of stock, you'll cancel eBay orders and hurt account health.",
          "It doesn't — you can always find another source instantly.",
          "eBay rewards out-of-stock listings.",
          "Availability only matters for electronics."
        ], answer: 0 },

      { q: "A candidate item has great margin but the Amazon price swings wildly day to day. Best call?",
        options: [
          "List only with an active repricer, or skip it — volatile source pricing can erase margin fast.",
          "List and set a fixed high price to be safe.",
          "List and manually check the price once a month.",
          "Avoid repricers; they overcomplicate things."
        ], answer: 0 },

      { q: "Four items with different velocity/margin/competition profiles are on your screen. Which do you list FIRST?",
        options: [
          "Solid velocity + healthy margin + low competition + compliant.",
          "Huge velocity + negative margin.",
          "Zero sales history + trademarked brand.",
          "High competition + razor-thin margin."
        ], answer: 0 },

      { q: "VERO (Verified Rights Owner) risk in sourcing means you should:",
        options: [
          "Screen out brands/items likely to trigger IP takedowns before listing them.",
          "List branded items first — they sell best.",
          "Ignore VERO; it only affects big sellers.",
          "Only worry about VERO after a strike."
        ], answer: 0 },

      { q: "A 'winner' with strong demand but only ~3% margin after fees is:",
        options: [
          "Usually not worth the account risk unless volume and reliability are excellent — margin cushions cancellations/returns.",
          "Always worth listing — volume fixes everything.",
          "Better than a 15% margin item.",
          "Ideal for a brand-new store."
        ], answer: 0 },

      { q: "Best way to estimate real profit before listing?",
        options: [
          "Subtract Amazon cost, eBay + payment fees, and a returns/refund buffer from the eBay sale price.",
          "Just compare eBay price to Amazon price.",
          "Assume fees are negligible.",
          "Use the competitor's price as your profit."
        ], answer: 0 },

      { q: "Competition analysis when sniping should focus on:",
        options: [
          "How many sellers offer it, their pricing, and whether you can compete profitably — not just raw demand.",
          "Only the number of watchers.",
          "Only the product photo quality.",
          "Whichever item has the longest title."
        ], answer: 0 },

      { q: "Which sourcing habit best protects a store long-term?",
        options: [
          "Curating a catalog of reliable, compliant, healthy-margin items and pruning poor performers.",
          "Listing everything trending as fast as possible.",
          "Chasing viral brands with VERO risk.",
          "Never removing dead or unprofitable listings."
        ], answer: 0 }
    ],

    /* ==================== ORDER FULFILLMENT (10 · v1 starter) ==================== */
    "fulfillment": [
      { scenario: "An eBay order came in at $42; the Amazon source jumped to $47 overnight. Ship-by is tomorrow.",
        q: "Best decision?",
        options: [
          "Fulfill the order (honor the sale) to protect account health, accept the small loss, and let the repricer prevent a repeat.",
          "Cancel the order to avoid the loss.",
          "Ship a cheaper different item instead.",
          "Message the buyer asking them to pay $5 more."
        ], answer: 0 },

      { q: "When fulfilling an eBay order on Amazon, the shipping address must:",
        options: [
          "Match the buyer's eBay order address exactly.",
          "Be your own address, then reship yourself.",
          "Be whatever the buyer messages you.",
          "Be left blank for Amazon to fill in."
        ], answer: 0 },

      { q: "To protect against 'Item Not Received' cases, fulfillment should ensure:",
        options: [
          "Valid tracking is uploaded to eBay promptly and updates as the package moves.",
          "No tracking is added so buyers can't complain.",
          "A fake tracking number is entered.",
          "Tracking is added a week after delivery."
        ], answer: 0 },

      { scenario: "The Amazon order will arrive in a branded Amazon box.",
        q: "Best practice to reduce buyer confusion?",
        options: [
          "Use gift options / plain packaging where available and set buyer expectations, so it doesn't look like a mistake.",
          "Nothing — buyers don't care about the box.",
          "Tell the buyer upfront that you dropship from Amazon.",
          "Cancel any order that can't ship in a plain box."
        ], answer: 0 },

      { q: "A source item is now OUT OF STOCK after the eBay sale. Best action?",
        options: [
          "Find an equivalent reliable source at acceptable cost, or if impossible, apologize and refund promptly to limit damage.",
          "Leave the order unshipped and hope it restocks.",
          "Ship a random substitute without telling the buyer.",
          "Ignore it until the buyer opens a case."
        ], answer: 0 },

      { q: "Account health as a fulfillment VA is best protected by:",
        options: [
          "On-time shipping, valid tracking, low cancellation rate, and low defect rate.",
          "Cancelling any unprofitable order.",
          "Delaying shipments to batch them weekly.",
          "Uploading tracking only when a case opens."
        ], answer: 0 },

      { q: "A buyer cancels within minutes, before you place the Amazon order. Best action?",
        options: [
          "Accept the cancellation and refund — nothing has shipped, so it's clean.",
          "Refuse and ship it anyway.",
          "Charge a restocking fee.",
          "Ship and then fight the return."
        ], answer: 0 },

      { q: "Gift receipts / hiding pricing on the Amazon order matters because:",
        options: [
          "It prevents the buyer from seeing a lower Amazon price and packing slip, reducing complaints.",
          "It makes the package arrive faster.",
          "eBay requires the Amazon price on every order.",
          "It has no effect at all."
        ], answer: 0 },

      { q: "If tracking shows 'delivered' but the buyer says it never arrived, the fulfillment VA should:",
        options: [
          "Check the tracking details, be empathetic, and follow eBay's process — delivered-scan disputes have a defined resolution path.",
          "Immediately accuse the buyer of lying.",
          "Refund instantly without checking.",
          "Ignore the buyer since tracking says delivered."
        ], answer: 0 },

      { q: "The best routine for a fulfillment VA each shift is to:",
        options: [
          "Process new orders promptly, verify addresses, source at correct cost, upload tracking, and flag any price-jump or stock issues.",
          "Only ship orders that are highly profitable that day.",
          "Wait for buyers to ask before shipping.",
          "Batch everything to the end of the week."
        ], answer: 0 }
    ],

    /* ==================== VA MANAGER (10 · v1 starter, unlocks free) ==================== */
    "manager": [
      { q: "The 'One VA + AI agents' store model means the VA Manager's core job is to:",
        options: [
          "Supervise specialist VAs and AI agents end-to-end, own outcomes (account health, profit, buyer satisfaction), and step in when the AI errs.",
          "Personally do every task manually with no automation.",
          "Only handle customer messages.",
          "Avoid touching sourcing or fulfillment."
        ], answer: 0 },

      { scenario: "Your AI customer-service agent auto-replied incorrectly to an INR case and the buyer opened an eBay case.",
        q: "What's the RIGHT order of your next actions?",
        options: [
          "Take over the case with a correct, empathetic response → resolve with the buyer → review/adjust the AI's rules → log it to prevent recurrence.",
          "Blame the AI publicly and refund everything.",
          "Ignore it — the AI will fix itself.",
          "Escalate to eBay before talking to the buyer."
        ], answer: 0 },

      { q: "A specialist VA's test scores are high but their live work quality is slipping. Best managerial move?",
        options: [
          "Coach with specific feedback and examples, set clear expectations, and monitor improvement before escalating.",
          "Fire them immediately.",
          "Ignore it since their scores are good.",
          "Publicly criticize them to motivate the team."
        ], answer: 0 },

      { q: "Which KPI set best reflects a healthy store for a manager to watch?",
        options: [
          "Account defect rate, late shipment rate, cancellation rate, profit margin, and buyer response time.",
          "Only total number of listings.",
          "Only follower count.",
          "Only the number of messages sent."
        ], answer: 0 },

      { q: "When an AI sourcing agent flags a high-margin but VERO-risky item, the manager should:",
        options: [
          "Override and reject it — protect the account over short-term margin.",
          "Approve it because margin is high.",
          "Let the AI decide unsupervised.",
          "Approve it but only on weekends."
        ], answer: 0 },

      { q: "Best way to keep specialist VAs and AI agents aligned?",
        options: [
          "Clear SOPs, defined escalation paths, and regular review of AI outputs against those standards.",
          "No documentation — rely on memory.",
          "Let everyone improvise independently.",
          "Only review work once a quarter."
        ], answer: 0 },

      { q: "A price-jump on a live order caused a loss. As manager, the systemic fix is to:",
        options: [
          "Ensure the repricer/rules and stock monitoring are tuned so it's caught automatically next time.",
          "Cancel future orders that look risky.",
          "Do nothing — losses happen.",
          "Manually check every price by hand forever."
        ], answer: 0 },

      { q: "Handling a buyer escalation the AI mishandled, the manager's priority is:",
        options: [
          "Resolve the buyer's issue first, then fix the process that let the AI fail.",
          "Fix the AI first and let the buyer wait.",
          "Refund and ban the buyer.",
          "Reassign it and forget about it."
        ], answer: 0 },

      { q: "Which describes good delegation for a one-VA-plus-AI store?",
        options: [
          "Route repeatable tasks to the right specialist/AI, keep judgment calls and exceptions for the manager.",
          "Do everything yourself to be safe.",
          "Delegate all judgment calls to the AI unsupervised.",
          "Never delegate anything."
        ], answer: 0 },

      { q: "The manager's north star across all decisions should be:",
        options: [
          "Long-term account health and profitability with satisfied buyers — not short-term shortcuts.",
          "Maximize listings at any cost.",
          "Win every buyer dispute.",
          "Minimize refunds even when the buyer is right."
        ], answer: 0 }
    ]
  };
})();
