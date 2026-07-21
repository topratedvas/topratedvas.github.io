/* ============================================================
   TopRatedVAs.com — Certification question banks (Phase 6 · v1 DRAFT)
   Scenario-based, EcomSniper Amazon→eBay dropshipping model.

   The engine draws 20 scored multiple-choice questions per attempt
   (shuffling question AND answer order), then 3 typed "in your own
   words" questions (not scored — saved for employers to read).
   `answer` is the 0-based index of the correct MC option before shuffle.

   DESIGN GOALS (per Dan's feedback):
   • DISCRIMINATE skilled VAs from lucky guessers — not "avoid the rude
     option." Many questions make all four choices plausible; the best
     answer needs real EcomSniper knowledge or judgment.
   • Question types: best-of-4-good, tool timing (Track Taco / repricer /
     auto-order), the 24-hour reply rule + buying time, margin/fee math,
     step-sequencing, and firm-not-just-nice judgment calls.
   • Every option is a SIMILAR LENGTH so the correct answer can't be
     guessed by picking the longest.

   v1 DRAFT CONTENT — Dan refines the "best" answers + grows the banks.
   Some tool practices (e.g. uploading a tracking number to buy time)
   reflect common dropshipping workflows and should be reviewed by Dan.
   ============================================================ */
(function () {
  "use strict";

  window.TRV_CERTS = [
    { key: "customer-service", role: "Customer Service", fee: 15, blurb: "eBay messages, returns, cases, feedback — handled the dropship-safe way." },
    { key: "listing",          role: "Listing",          fee: 15, blurb: "Create & optimize eBay listings with EcomSniper — titles, specifics, VERO safety." },
    { key: "sourcing",         role: "Sourcing / Sniping", fee: 10, blurb: "Find winning Amazon items with EcomSniper sniping tools; velocity, margin, competition." },
    { key: "fulfillment",      role: "Order Fulfillment", fee: 10, blurb: "Fill eBay orders on Amazon — tracking, price jumps, cancellations, account health." },
    { key: "manager",          role: "VA Manager",       fee: 0,  locked: true, blurb: "Manage VAs + AI agents. Locked until the other four pass — then FREE." }
  ];

  window.TRV_QUESTIONS = {

    /* ==================== CUSTOMER SERVICE ==================== */
    "customer-service": [
      { scenario: "Hi, I ordered this as a birthday gift and it arrived in an AMAZON box with a packing slip showing a LOWER price than I paid on eBay. This feels like a scam — refund the difference or I'm opening a case and leaving negative feedback.",
        q: "What is the BEST first response?",
        options: [
          "Apologize, reassure them the item is new and genuine, note that orders ship from multiple warehouses, and offer a small goodwill gesture.",
          "Explain that the price difference is simply eBay's selling fees and that they accepted the listed price at checkout, so no refund is owed.",
          "Refund the full order right away and then block the buyer so they cannot leave the negative feedback that they are threatening you with.",
          "Wait about a day before replying, since angry buyers usually cool off and answering too quickly can look like an admission of guilt."
        ], answer: 0 },

      { q: "A buyer opens an eBay 'Item Not Received' (INR) case while tracking still shows in-transit and not yet past the delivery date. What do you do?",
        options: [
          "Reply inside the case with the tracking number and delivery estimate, and ask the buyer to wait until the expected date.",
          "Refund the order in full right away so that the open case is closed quickly and does not end up counting against you.",
          "Ignore the case completely, since eBay closes these on its own once the tracking finally marks the item as delivered.",
          "Tell the buyer that shipping is out of your hands and that they should contact the carrier about the delay themselves."
        ], answer: 0 },

      { q: "A buyer sends a message BEFORE buying: \"Is this authentic and in stock?\" The item is an Amazon-sourced dropship listing. Best reply?",
        options: [
          "Confirm it is brand new and available, give the handling and delivery estimate, and thank them for reaching out first.",
          "Explain in detail that the item is dropshipped from Amazon and then shipped onward to them once their order comes in.",
          "Tell the buyer to simply place the order now and they will find out soon enough whether it is authentic and in stock.",
          "Say that you are not completely sure and that they should probably check directly with the brand before they buy it."
        ], answer: 0 },

      { scenario: "Buyer left NEGATIVE feedback: \"Slow shipping, will not buy again.\" The order actually arrived on time per tracking.",
        q: "Best next step?",
        options: [
          "Politely message the buyer, acknowledge the frustration, and offer to make it right — many revise feedback once happy.",
          "Reply to the feedback publicly and point out that it is simply a lie, since the tracking clearly shows on-time delivery.",
          "Report the buyer to eBay and demand that the unfair feedback be removed from your account automatically right away.",
          "Do nothing at all about it, since the feedback that a buyer leaves on an order can never actually be changed anyway."
        ], answer: 0 },

      { q: "An eBay message asks to complete the sale OFF eBay (buyer offers to pay by bank transfer for a discount). What do you do?",
        options: [
          "Politely decline and keep everything on eBay, since off-platform deals break the rules and void both parties' protections.",
          "Accept the offer, because handling the deal off of eBay is a smart way to avoid paying the selling fees on the order.",
          "Give the buyer your personal PayPal address so the two of you can quietly arrange the discounted payment off-platform.",
          "Check with a manager first but go ahead and start the transfer while you wait so the buyer does not lose interest."
        ], answer: 0 },

      { scenario: "Buyer: \"I need this by Friday for an event. Can you guarantee it?\"",
        q: "Best response when you can't control the carrier?",
        options: [
          "Share the realistic delivery window honestly, note you can't guarantee a carrier date, and offer to check faster options.",
          "Promise the buyer firm Friday delivery in order to secure the sale, and simply deal with any problems if it runs late.",
          "Tell them that shipping speed is completely out of your hands and then end the conversation without offering options.",
          "Guarantee that it will arrive on Friday and plan to just refund the order afterward if the package happens to be late."
        ], answer: 0 },

      { q: "eBay's Money Back Guarantee: which statement is TRUE for dropshippers?",
        options: [
          "If the item doesn't arrive or isn't as described, the buyer is protected and the seller must resolve the problem.",
          "The guarantee only applies to items that are shipped directly by eBay itself rather than by a third-party seller.",
          "It never applies to any order whenever the original source of the product happens to be Amazon and not a wholesaler.",
          "It only covers electronic items that are priced above one hundred dollars and does not apply to cheaper products."
        ], answer: 0 },

      { scenario: "Buyer opens a 'Significantly Not As Described' (SNAD) return, claiming lower quality than pictured.",
        q: "Most account-safe response?",
        options: [
          "Accept the return, since not-as-described claims are buyer-protected and fighting them risks defects on your account.",
          "Refuse the return and simply tell the buyer that they are welcome to keep the item that they have already received.",
          "Demand photo proof of the problem before you do anything, and then stall the buyer for as long as you possibly can.",
          "Escalate the case to eBay right away so you can fight the buyer's claim before they get a chance to return anything."
        ], answer: 0 },

      { scenario: "Buyer threatens: \"Refund me now or I'll leave 1-star and report you.\" The item was delivered and is as described.",
        q: "Best professional response?",
        options: [
          "Stay calm and polite, ask what exactly is wrong, and offer a fair resolution within policy rather than caving.",
          "Refund the order instantly just to make the threat go away, even though the item arrived and was as described.",
          "Warn the buyer that you are going to report them to eBay first before they get the chance to report you first.",
          "Ignore the message entirely and hope that the upset buyer simply forgets about it and never follows through."
        ], answer: 0 },

      { q: "Best way to reduce 'Item Not Received' cases as a customer-service VA?",
        options: [
          "Upload valid tracking promptly and proactively message buyers with the delivery estimate for their order.",
          "Set the listing's handling time to a single day even in cases where you know you cannot actually meet it.",
          "Turn off buyer messaging on the account so that upset buyers have no easy way to complain about a late order.",
          "Only respond to a buyer once they have already gone ahead and opened an item-not-received case against you."
        ], answer: 0 },

      { scenario: "Buyer: \"Can you send me the Amazon invoice for warranty purposes?\"",
        q: "Best response?",
        options: [
          "Politely explain you can provide an eBay order receipt or invoice, and help them with any warranty question directly.",
          "Forward the buyer the raw Amazon invoice, even though it plainly shows your true cost and the source of the item.",
          "Tell the buyer that warranties are simply something that does not exist for any of the items that are sold on eBay.",
          "Ignore the request completely and treat it as an unreasonable thing for the buyer to be asking you for right now."
        ], answer: 0 },

      { scenario: "An eBay case is auto-closing in your favor tomorrow, but the buyer just messaged apologizing and saying the item actually arrived.",
        q: "Best move?",
        options: [
          "Thank them warmly, confirm you're glad it arrived, and invite them to reach out anytime to protect the relationship.",
          "Gloat a little that you turned out to be right all along and that the buyer's original complaint was never valid.",
          "Ask the buyer to remove any negative feedback first as a condition before you agree to consider the matter settled.",
          "Say nothing to the buyer at all and simply let the open case close automatically in your favor the following day."
        ], answer: 0 },

      { scenario: "Buyer messages you a link and says \"click here to confirm your seller details or your payout is frozen.\"",
        q: "Best action?",
        options: [
          "Do not click the link, treat it as a phishing attempt, and check your account status only through eBay directly.",
          "Click the link quickly, because you want to avoid having your seller payout frozen the way the message warns about.",
          "Go ahead and enter your login details on the linked page just to be safe and make sure your account stays active.",
          "Forward the suspicious link on to the store owner and suggest that they be the one to click it and confirm instead."
        ], answer: 0 },

      /* ---- tougher discriminators ---- */
      { scenario: "A buyer asks a detailed question you can't answer yet — you need to check the Amazon order and the supplier, which will take a few hours.",
        q: "The store rule is every message gets a reply within 24 hours. What's the best move right now?",
        options: [
          "Send a short holding reply that you've got it and are looking into it, give a time you'll follow up, then follow up.",
          "Wait until you have the complete answer before replying at all, even if that ends up taking most of the day today.",
          "Reply that you don't know yet and that the buyer should message again tomorrow if they still need help with it.",
          "Mark the message as read for now and set it aside, since a partial answer annoys buyers more than a bit of silence."
        ], answer: 0 },

      { q: "Which holding reply best buys you time while keeping the buyer calm?",
        options: [
          "Thanks for reaching out — I'm checking on this now and will get back to you with a full update by end of day today.",
          "Your message has been received and has now been added to our support queue for review at the next opportunity.",
          "I can't really help with that right now, but you're welcome to try contacting us again a little later when we're free.",
          "Please hold on, this one may take a while, and honestly there is not very much that I am able to do about it now."
        ], answer: 0 },

      { scenario: "An order's ship-by is tomorrow, but your auto-order tool hasn't produced tracking yet and the Amazon order still shows 'preparing.'",
        q: "Best action to avoid a late-shipment defect?",
        options: [
          "Upload a valid tracking number now (e.g., via Track Taco) to mark it shipped on time, then swap in the real one later.",
          "Leave the order without tracking until Amazon generates the real number, even if that lands after the ship-by date.",
          "Cancel the eBay order and ask the buyer to purchase it again, so the ship-by clock resets and starts over from zero.",
          "Message eBay support and ask them to remove the ship-by deadline on this one order because your supplier is slow."
        ], answer: 0 },

      { scenario: "Your auto-order tool already uploaded valid tracking to the eBay order on the same day it sold.",
        q: "What should you do about tracking now?",
        options: [
          "Nothing extra — valid tracking is already on the order on time, so there is no reason to add another number to it.",
          "Add a second Track Taco number on top of it so the order shows even more movement to eBay's shipping metrics.",
          "Replace the tool's tracking with a fresh number every day so the buyer keeps seeing the status update repeatedly.",
          "Remove the tracking the tool added and then re-upload it by hand so that you can be sure it was entered correctly."
        ], answer: 0 },

      { scenario: "A buyer is upset that delivery is a day later than the estimate. The item is genuinely in transit and arrives tomorrow. All four replies are polite.",
        q: "Which reply is BEST?",
        options: [
          "Apologize for the wait, confirm it's out for delivery and expected tomorrow, and share the live tracking link.",
          "Apologize sincerely for the delay and promise that this kind of late delivery will absolutely never happen again.",
          "Apologize and immediately offer a partial refund for the delay so the buyer feels compensated for the extra wait.",
          "Apologize and explain in detail how dropshipping logistics work so the buyer understands why it took a bit longer."
        ], answer: 0 },

      { q: "A buyer left negative feedback that contains profanity and a personal insult. What's the correct step?",
        options: [
          "Report it to eBay for removal, since feedback with profanity or personal attacks violates the feedback policy.",
          "Reply publicly with your own strongly worded response so that other buyers can clearly see your side of the story.",
          "Offer the buyer a full refund in exchange for them agreeing to take down the negative feedback that they left.",
          "Accept it and move on, since eBay basically never removes negative feedback once a buyer has actually posted it."
        ], answer: 0 },

      { scenario: "Tracking has shown 'in transit, no movement' for 9 days. The buyer opened an INR case and the estimated delivery date has now passed.",
        q: "Best action now?",
        options: [
          "Apologize and refund or send a replacement, since the item is late, unmoving, and past its estimated delivery date.",
          "Keep asking the buyer to wait a few more days, because slow packages sometimes start moving again on their own.",
          "Upload a new tracking number to the case to reset the delivery estimate and give the package more time to arrive.",
          "Let the case go to eBay so that eBay can be the one to decide whether the buyer deserves a refund on the order."
        ], answer: 0 },

      { scenario: "A buyer messages that the item arrived damaged and includes a photo.",
        q: "Put these first steps in the best order: (1) apologize, (2) offer replacement or refund, (3) confirm the damage from the photo, (4) log it for the supplier.",
        options: [
          "Apologize, confirm the damage from the photo, offer a replacement or refund, then log the issue for the supplier.",
          "Log the issue for the supplier, apologize, offer a replacement or refund, and confirm the damage from the photo.",
          "Offer a replacement or refund, apologize, log the issue for the supplier, then confirm the damage from the photo.",
          "Confirm the damage from the photo, log the issue for the supplier, offer a replacement or refund, then apologize."
        ], answer: 0 },

      { scenario: "A buyer who already received a full refund now demands a second refund for the same delivered order, threatening a chargeback.",
        q: "Best response?",
        options: [
          "Politely decline the second refund, note the order was already fully refunded, and keep records for the chargeback.",
          "Refund them a second time right away to avoid the chargeback and any negative feedback the buyer might leave you.",
          "Warn the buyer firmly that a chargeback after a refund is fraud and that you will be reporting them for doing it.",
          "Stop replying to the buyer entirely, since engaging with a double-refund attempt like this only encourages them."
        ], answer: 0 },

      { scenario: "You finish your shift Friday and won't work until Monday. Three non-urgent buyer questions came in near the end of the day.",
        q: "Best practice for the 24-hour reply standard?",
        options: [
          "Send each a brief acknowledgment before you log off, with a realistic follow-up time, then answer fully on Monday.",
          "Leave them until Monday and answer fully then, since they are non-urgent and the weekend does not really count.",
          "Send all three the exact same copied message so you can clear them quickly before you finish for the weekend.",
          "Forward the three messages to the store owner's inbox and let them decide whether to answer over the weekend."
        ], answer: 0 },

      { scenario: "A buyer found the same item cheaper on Amazon and demands you match the price after they've already bought from you.",
        q: "Best reply?",
        options: [
          "Thank them, note the order price was agreed at checkout, and offer a small goodwill gesture if you can spare margin.",
          "Immediately refund the full price difference between eBay and Amazon so that the buyer feels they got a fair deal.",
          "Explain that the store buys from Amazon, so naturally the Amazon price is going to be the cheaper of the two.",
          "Tell the buyer that price matching is against eBay policy and that you are not permitted to adjust the order at all."
        ], answer: 0 },

      { scenario: "A buyer asks to cancel, but your auto-order tool already placed the Amazon order and it's on its way.",
        q: "Best response?",
        options: [
          "Explain it has already shipped, offer a return once it arrives, and help them start that process to keep them happy.",
          "Cancel and refund the eBay order right away, even though the Amazon package is already on its way to the buyer.",
          "Tell the buyer that cancellation is impossible now and that there is honestly nothing further you can do for them.",
          "Ignore the cancellation request and simply let the package arrive, since the buyer will probably just keep it anyway."
        ], answer: 0 },

      { q: "A buyer says the item 'stopped working after two days.' Your listing offers 30-day returns. Best handling?",
        options: [
          "Treat it as a defective-item return, offer a replacement or refund, and provide a prepaid label to keep it smooth.",
          "Treat it as buyer's remorse and make the buyer pay the return shipping, since the item did technically work at first.",
          "Refuse the return and tell the buyer that a two-day-old item breaking is really the manufacturer's problem, not yours.",
          "Ask the buyer to repair it themselves and offer a small partial refund to cover the cost of any parts they might need."
        ], answer: 0 },

      { scenario: "A buyer messages: \"Give me a 50% refund or I'll leave 1-star feedback,\" on an order that arrived perfectly fine.",
        q: "Best response?",
        options: [
          "Politely decline, offer to fix any genuine problem, and report the message, since feedback extortion breaks policy.",
          "Give the fifty percent refund right away, since half a refund is cheaper than the damage one-star feedback would do.",
          "Reply that you will report them and that their threat means they have now lost any chance of getting any help at all.",
          "Ignore the message and simply hope the buyer is only bluffing and doesn't actually go through with the feedback."
        ], answer: 0 },

      { scenario: "A buyer ordered three items in one order; one arrived damaged, the other two are fine.",
        q: "Best resolution?",
        options: [
          "Apologize, arrange a replacement or partial refund for just the damaged item, and confirm the other two are okay.",
          "Refund the entire three-item order in full, since it is simplest to just refund everything and start over cleanly.",
          "Tell the buyer to return all three items together before you are able to issue any refund or send any replacement.",
          "Refund nothing until the buyer ships the damaged item back at their own expense and you inspect it in person first."
        ], answer: 0 },

      { scenario: "A buyer's issue needs the store owner's decision, and the owner is offline until tomorrow.",
        q: "Best reply within the 24-hour standard?",
        options: [
          "Acknowledge the message, say you're getting the right person to review it, and give a clear time you'll follow up.",
          "Tell the buyer that the owner is offline and that nothing at all can happen until the owner is back tomorrow.",
          "Guess at an answer yourself and commit the store to it, rather than waiting for the owner's decision on the issue.",
          "Leave the message unanswered until the owner is back, so the buyer gets one complete and correct reply tomorrow."
        ], answer: 0 },

      { scenario: "A buyer is verbally abusive in messages but has a legitimate underlying complaint about a late item.",
        q: "Best approach?",
        options: [
          "Stay professional, don't engage the insults, address the real issue, and resolve the late-item complaint fairly.",
          "Match the buyer's tone so that they understand you will not simply be a pushover for anyone who is rude to you.",
          "Refuse to help until the buyer apologizes for the language, since a rude buyer does not deserve any help at all.",
          "Block the buyer immediately so that you no longer have to read the abusive messages they keep on sending you."
        ], answer: 0 },

      { scenario: "An item arrived with a minor cosmetic scuff. The buyer is mildly annoyed but wants to keep it.",
        q: "Best resolution?",
        options: [
          "Apologize and offer a small partial refund to keep it, which fits the minor issue and keeps the buyer happy.",
          "Insist on a full return and refund, even though the buyer has clearly said they would rather just keep the item.",
          "Tell the buyer that a minor scuff is normal and that there is really nothing that needs to be done about it here.",
          "Offer a full refund and let them keep the item for free, giving away far more than the small problem calls for."
        ], answer: 0 },

      { scenario: "A happy buyer asks if you can regularly source a different product for their own small shop.",
        q: "Best response?",
        options: [
          "Thank them, say you'd be glad to help, and take the details so you can check whether you can source it reliably.",
          "Tell them the store only sells its current listings and that special requests are not something you can handle.",
          "Agree instantly to source anything they ever want at any price, before checking whether you can actually get it.",
          "Redirect them to buy from Amazon directly themselves, since that is really where all the products come from anyway."
        ], answer: 0 }
    ],

    /* ==================== LISTING ==================== */
    "listing": [
      { q: "Which eBay title will rank and convert best for a specific product?",
        options: [
          "Brand, model, key feature, and size or color using the real keywords buyers search, as a full descriptive title.",
          "An all-caps promotional title packed with words like SALE, BEST PRICE, CHEAP, FAST SHIP, and L@@K to grab attention.",
          "A short and vague title such as 'Nice cup' that does not really include any of the important searchable details.",
          "A title stuffed with unrelated popular brand names so that the listing shows up in far more buyer searches online."
        ], answer: 0 },

      { scenario: "A supplier listing uses a trademarked brand name you're not authorized to resell (VERO risk).",
        q: "Best action when building the eBay listing?",
        options: [
          "Avoid listing VERO-protected branded items you can't safely sell and choose a compliant product to list instead.",
          "List the branded item anyway and only take it down later if the brand actually reports it and gets it removed.",
          "Use the protected brand name in the title but carefully leave it out of the photos so the listing looks a bit safer.",
          "Slightly misspell the trademarked brand name in the listing in the hope of slipping past eBay's automated filters."
        ], answer: 0 },

      { q: "Which pricing approach fits the Amazon→eBay model best?",
        options: [
          "Price to cover the Amazon cost plus the eBay fees plus a target margin, and keep it monitored by a repricer.",
          "Match the Amazon price exactly with no margin at all so that your listing always looks like the cheapest option.",
          "Set the highest price that you possibly can and then simply never change it again no matter what the source does.",
          "Deliberately price the item below your own Amazon cost just to win the sale and beat out the competing sellers."
        ], answer: 0 },

      { q: "Handling time on a dropship listing should be set to:",
        options: [
          "A realistic window you can consistently meet given Amazon's processing, with a small buffer, not an unrealistic day.",
          "Same-day handling on every single order, no matter how quickly or slowly the Amazon source actually tends to ship.",
          "A very long window of ten or more days just to be extra safe, even though it badly hurts the listing's conversion.",
          "Whatever handling time the closest competing seller happens to have set on their own version of the same listing."
        ], answer: 0 },

      { q: "What's the safest way to grow a new store's listing count with EcomSniper?",
        options: [
          "List quality, compliant, in-demand items steadily while carefully respecting eBay's selling limits for a new account.",
          "Bulk-upload several thousand random items all at once on the very first day the brand-new store account is opened.",
          "Duplicate one single listing five hundred times over so that the store looks much larger than it really is to buyers.",
          "List every trending brand you can find as fast as possible without worrying about whether they carry any VERO risk."
        ], answer: 0 },

      { scenario: "Two candidate items: one high-demand but VERO-risky brand, one solid generic with steady demand.",
        q: "Which do you list?",
        options: [
          "The compliant generic item with steady demand, because keeping the account safe comes before chasing extra sales.",
          "The high-demand but VERO-risky branded item, since the larger number of sales it brings is clearly worth the risk.",
          "Both of the items at the same time, and then simply deal with any VERO strikes on the account later if they happen.",
          "Neither of the two items, because a brand-new store really should not be listing any products at all just yet."
        ], answer: 0 },

      { q: "When a listed item goes out of stock at the Amazon source, the lister should:",
        options: [
          "Promptly mark the item out of stock or end the listing so that no orders you cannot actually fulfill come in.",
          "Leave the listing live as it is and then simply cancel any orders that happen to come in for the missing item.",
          "Raise the price on the listing a lot to discourage buyers but still keep the out-of-stock item live on the store.",
          "Do nothing about it at all and just wait until an actual buyer complains before dealing with the stock problem."
        ], answer: 0 },

      /* ---- tougher discriminators ---- */
      { q: "An item costs $18 on Amazon. eBay + payment fees are about 15% of the sale price. To net roughly $6 profit, price it near:",
        options: [
          "$28 — the ~15% fees are about $4.20, which after the $18 cost leaves roughly $5.80, close to the $6 you targeted.",
          "$24 — after the ~15% fees of about $3.60 and the $18 cost, this leaves only around $2.40, well short of $6.",
          "$21 — after the ~15% fees of about $3.15 and the $18 cost, this leaves you with almost no real profit at all.",
          "$33 — this clears the target easily but prices the item far above the competition and will likely kill sales."
        ], answer: 0 },

      { q: "When setting up a repricer for a dropship listing, the most important safeguard is:",
        options: [
          "A minimum price (floor) below which it won't sell, so a source price jump can never push the order into a loss.",
          "A maximum price ceiling set as high as it will possibly go, so the listing can capture the very largest gains.",
          "Turning the repricer off overnight so the price stays perfectly stable while you are not there to watch it.",
          "Matching the lowest competitor exactly at all times, since being the cheapest is what wins nearly every sale."
        ], answer: 0 },

      { scenario: "Your repricer shows an item's Amazon source price jumped 40% overnight.",
        q: "What should the repricer (or you) do?",
        options: [
          "Raise the eBay price to keep the margin, or pause the listing if the new price makes the item uncompetitive.",
          "Keep the eBay price the same to stay competitive and simply accept the smaller margin on any orders that arrive.",
          "Lower the eBay price further so the item still sells quickly before the source price climbs any higher again.",
          "Delete the listing permanently, since a source price that moves that much can never be worth listing at all."
        ], answer: 0 },

      { scenario: "You want a phone case that fits an iPhone. Using 'iPhone' helps search, but the case is a generic brand.",
        q: "Safest compliant approach?",
        options: [
          "List it as a generic case and use 'compatible with iPhone' phrasing rather than implying it is an Apple product.",
          "Put 'Apple iPhone' prominently in the title and photos so that the listing captures the maximum search traffic.",
          "Avoid mentioning iPhone anywhere at all, even though buyers search that term, to be completely safe from risk.",
          "Use the Apple logo in the listing images so buyers can instantly see which phone the generic case is made for."
        ], answer: 0 },

      { q: "For eBay search visibility, which item specific is usually MOST important to fill in accurately?",
        options: [
          "Brand and the key specifics buyers filter by — size, color, or model — which drive the listing's search matches.",
          "The country of manufacture field, since buyers almost always filter their searches by where an item was made.",
          "The seller's own custom label or SKU field, because eBay uses that internal code to rank the listing in results.",
          "The 'unit quantity' field, which is the single specific that most strongly affects where a listing shows in search."
        ], answer: 0 },

      { scenario: "A live listing has had zero sales and few views for weeks, but the item is still solid and in stock.",
        q: "Best first move?",
        options: [
          "Revise the title and item specifics with better keywords and refresh the price before giving up on the listing.",
          "End the listing immediately and never relist that item, since no early sales means it will clearly never sell.",
          "Leave it exactly as it is for several more months to give eBay's algorithm more time to discover it on its own.",
          "Duplicate the same listing several times so that at least one of the identical copies eventually gets some views."
        ], answer: 0 },

      { q: "You can reliably get tracking uploaded within 2 business days. What handling time should the listing show?",
        options: [
          "About 2 business days, matching what you can actually deliver, so on-time shipping metrics stay healthy.",
          "One business day, since a faster handling time always wins more buyers even if you can't quite always meet it.",
          "Five business days, for a huge safety buffer, even though it makes the listing far less competitive on search.",
          "Same-day handling, because eBay heavily favors same-day listings and buyers rarely check the handling time."
        ], answer: 0 },

      { scenario: "Your target margin needs a $30 price, but the lowest competitor is at $27 with strong sales.",
        q: "Best approach?",
        options: [
          "Test a price at or just below the competition if the thinner margin still works; otherwise pick a better item.",
          "Always undercut to $26 to win the buy, since being the very cheapest listing is the only thing that matters.",
          "Hold firm at $30 no matter what, because dropping the price at all sets a bad precedent for the whole store.",
          "Copy the competitor's exact listing, photos, and price so that buyers see no real difference between you two."
        ], answer: 0 },

      { scenario: "An item is temporarily out of stock at the source but you expect it back within a week.",
        q: "Best way to handle the listing?",
        options: [
          "Set the available quantity to zero (out of stock) so it pauses but keeps its sales history, then restore it later.",
          "Leave it live at full quantity and just cancel any orders that come in until the item is back in stock again.",
          "Raise the price so high that nobody will realistically buy it, while keeping the quantity available on the listing.",
          "End the listing completely and build a brand-new one from scratch once the item finally comes back into stock."
        ], answer: 0 },

      { q: "The sniping tool surfaces a high-demand item that falls in an eBay restricted category. Best move?",
        options: [
          "Skip it and check eBay's restricted and prohibited list, since a restricted-category slip can suspend the account.",
          "List it quickly before other sellers do and simply remove it later if eBay happens to flag it as a problem.",
          "List it under a different, unrelated category so that eBay's category-based restriction filters do not catch it.",
          "List it but keep the price very high so that it rarely sells and therefore rarely draws attention from eBay."
        ], answer: 0 },

      { q: "You have one product in five colors. On eBay, the best listing approach is usually to:",
        options: [
          "Use a single multi-variation listing for the five colors, which concentrates sales history and is easier to manage.",
          "Create five completely separate listings so each color can have its own totally independent title and price point.",
          "List only the single best-selling color and simply leave the other four colors off of the store altogether.",
          "Make five listings but point them all at the same photos so the whole set looks consistent across the store."
        ], answer: 0 },

      { scenario: "Before your repricer updated, an item sold at $22 but the source is now $25 — a guaranteed loss on this order.",
        q: "Best handling?",
        options: [
          "Fulfill the order to protect account health, take the small loss, and confirm the repricer floor is set correctly.",
          "Cancel the order and cite out of stock, since taking a loss on even one order should always be avoided entirely.",
          "Message the buyer to ask for $3 more before shipping, explaining that the source price changed after they bought.",
          "Ship a cheaper look-alike item instead so the order still goes out without the store having to absorb any loss."
        ], answer: 0 },

      { q: "An item costs $12 on Amazon; fees are ~15%. To net about $5 profit, price it near:",
        options: [
          "$20 — the ~15% fees are about $3, which after the $12 cost leaves roughly $5, right around the profit you targeted.",
          "$17 — after the ~15% fees of about $2.55 and the $12 cost, this leaves only about $2.45, short of the $5 target.",
          "$14 — after the ~15% fees of about $2.10 and the $12 cost, this leaves essentially no real profit on the sale.",
          "$27 — this beats the target easily but prices the item well above competitors and will badly hurt your sales."
        ], answer: 0 },

      { q: "For a dropship listing's photos, the best practice is to:",
        options: [
          "Use clear, accurate images of the real product that match exactly what the buyer is actually going to receive.",
          "Use the most flattering stock images you can find, even if the real item looks a little different in person.",
          "Reuse a competitor's existing photos directly, since making your own images just slows the listing process down.",
          "Use a single small thumbnail image, since extra photos mostly just clutter up the listing and confuse the buyer."
        ], answer: 0 },

      { q: "You have room for a longer title. The best use of the extra characters is to:",
        options: [
          "Add real secondary keywords buyers search — extra size, color, or use terms — rather than filler or repeated words.",
          "Repeat the main keyword several times so eBay's search clearly understands what the listing is really about.",
          "Add promotional phrases like 'top quality' and 'best deal' to make the listing sound more appealing to buyers.",
          "Leave the extra space empty, since a shorter title always looks cleaner and more trustworthy to most buyers."
        ], answer: 0 },

      { q: "You're in a hurry listing an item. Which corner is safest to cut?",
        options: [
          "None of the key ones — brand, size, and color specifics drive search, so skip only the truly irrelevant fields.",
          "Leave the brand field blank, since buyers usually search by the product type rather than by the brand name.",
          "Skip the item condition, because eBay just assumes every dropshipped listing is for a brand-new item anyway.",
          "Leave out the color, since a buyer can always just check the color for themselves in the listing's photos."
        ], answer: 0 },

      { q: "Which title phrasing is SAFEST for a generic charging cable that works with Samsung phones?",
        options: [
          "'USB-C Fast Charging Cable Compatible with Samsung Galaxy' — describes the fit without claiming to be the brand.",
          "'Samsung USB-C Fast Charging Cable Original Genuine' — uses the brand name to pull in the most search traffic.",
          "'Genuine Samsung Galaxy Charger Cable OEM' — implies it is an official Samsung part to reassure the buyer fully.",
          "'Charging Cable' — leaves the brand out entirely to be safe, even though buyers won't find it when they search."
        ], answer: 0 },

      { q: "An item will be restocked in a few days. Compared to ending the listing, setting quantity to zero is better because:",
        options: [
          "The listing keeps its sales history and ranking, so it recovers faster than a brand-new listing would later on.",
          "It hides the listing from eBay entirely, which is the only way to make sure that no orders can possibly come in.",
          "It automatically emails a buyer waitlist the moment the item is restocked and the quantity goes back up again.",
          "It lowers eBay's fees on the listing while it is paused, saving the store some money during the out-of-stock gap."
        ], answer: 0 },

      { scenario: "A new account has a low monthly selling limit. You can list only a handful of items.",
        q: "Best use of those few slots?",
        options: [
          "A few reliable, compliant, healthy-margin items with steady demand, to build sales and earn a limit increase.",
          "The single most expensive high-ticket item you can find, to make the most possible money from each limited slot.",
          "As many ultra-cheap items as the slots allow, since more listings always means more chances at a sale coming in.",
          "One viral trending item listed at the maximum quantity, betting the whole limit on that one product taking off."
        ], answer: 0 }
    ],

    /* ==================== SOURCING / SNIPING ==================== */
    "sourcing": [
      { scenario: "An eBay item sells for $34.99. The Amazon source is $31.50 with free Prime shipping; eBay fees run ~13.25%.",
        q: "Is this a viable item, and what's the repricer's job?",
        options: [
          "The margin is thin after fees, so keep it only if a repricer holds profit as the Amazon price moves, or else skip it.",
          "List the item no matter what, since making any sale at all is a good thing regardless of how thin the margin is.",
          "List it and then never reprice it again, because the price you set at the start should simply be treated as fixed.",
          "Reject the item outright, since eBay's selling fees really make every single dropshipping item unprofitable anyway."
        ], answer: 0 },

      { q: "Which item profile is the BEST sniping target?",
        options: [
          "Steady demand, a healthy margin after fees, low VERO and competition risk, and reliable availability at the source.",
          "The highest possible demand you can find, regardless of how thin the margin is or how much VERO risk it carries.",
          "The cheapest item you can possibly source, even though it comes with an extremely thin and fragile profit margin.",
          "A heavily trademarked brand-name product that carries VERO risk but happens to have very large sales numbers."
        ], answer: 0 },

      { q: "Why does reliable Amazon availability matter when sourcing?",
        options: [
          "If the source often goes out of stock, you will keep cancelling eBay orders and steadily damage your account health.",
          "It does not really matter at all, because you can always instantly find another supplier for any item that sells.",
          "It matters because eBay actually rewards listings whose source items frequently go out of stock with better ranking.",
          "Availability only really matters for electronics and does not make any difference for other categories of products."
        ], answer: 0 },

      { q: "A candidate item has great margin but the Amazon price swings wildly day to day. Best call?",
        options: [
          "List it only with an active repricer running, or skip it, since volatile source pricing can erase the margin fast.",
          "List it and set a fixed high price to be safe, and then just leave that price alone no matter what the source does.",
          "List it and plan to manually check the source price only about once a month to see whether anything has changed.",
          "Avoid using repricers on the item entirely, since automated repricing tools tend to overcomplicate a simple listing."
        ], answer: 0 },

      { q: "Four items with different velocity/margin/competition profiles are on your screen. Which do you list FIRST?",
        options: [
          "The one with solid sales velocity, a healthy margin, low competition, and no compliance or VERO problems at all.",
          "The one with huge sales velocity even though its margin after all of the fees actually works out to be negative.",
          "The one that has zero sales history to speak of and also happens to carry a trademarked, VERO-risky brand name.",
          "The one with very high competition from other sellers combined with an extremely thin, razor-tight profit margin."
        ], answer: 0 },

      { q: "VERO (Verified Rights Owner) risk in sourcing means you should:",
        options: [
          "Screen out the brands and items that are likely to trigger an IP takedown before you ever add them to the store.",
          "List all of the branded items first, since well-known brand names are usually the products that sell the best.",
          "Ignore VERO risk completely, since takedowns really only ever affect the very largest and highest-volume sellers.",
          "Only start worrying about VERO risk after your account has already received its first strike for an infringing item."
        ], answer: 0 },

      { q: "Best way to estimate real profit before listing?",
        options: [
          "Subtract the Amazon cost, the eBay and payment fees, and a returns buffer from the item's eBay sale price.",
          "Simply compare the eBay selling price against the Amazon price and treat whatever gap is left as your real profit.",
          "Assume that the various selling and payment fees are basically negligible and can be safely ignored when pricing.",
          "Use whatever price the closest competing seller is charging as a rough stand-in for your own expected profit."
        ], answer: 0 },

      { q: "Competition analysis when sniping should focus on:",
        options: [
          "How many sellers offer it, their pricing, and whether you can still compete profitably, not just the raw demand.",
          "Only the total number of watchers that a listing has managed to attract, without looking at anything else at all.",
          "Only the quality of the main product photo, since a nicer image is really all that it takes to win the sale.",
          "Whichever competing item happens to have the single longest and most detailed title out of all of the options."
        ], answer: 0 },

      /* ---- tougher discriminators ---- */
      { q: "An item sells for $40 on eBay, costs $32 on Amazon, and eBay + payment fees run about 14%. Roughly what's the profit?",
        options: [
          "About $2.40 — fees near $5.60 plus the $32 cost leave only a couple of dollars, a very thin margin to work with.",
          "About $8.00 — the profit is simply the $40 sale price minus the $32 source cost, before worrying about any fees.",
          "About $5.60 — the profit is just whatever the eBay and payment fees happen to add up to on the forty-dollar sale.",
          "About zero — the fees on an item like this always end up cancelling out the entire gap between the two prices."
        ], answer: 0 },

      { scenario: "Two similar-margin items: one has a stable source price, the other swings a lot day to day.",
        q: "Which is the safer snipe, and why?",
        options: [
          "The stable-priced one — a predictable cost protects margin, while the swinging one needs constant repricer babysitting.",
          "The swinging one, because a price that moves a lot gives more chances to catch it low and make a bigger profit.",
          "They are equally safe, since the repricer handles all of the price changes and the source price never really matters.",
          "The swinging one, as long as you remember to check its source price manually about once a week or so to be safe."
        ], answer: 0 },

      { q: "When sourcing an item to fulfill later on Amazon, a strong positive signal is:",
        options: [
          "Consistent Prime availability from a reliable seller, so you can reorder quickly whenever the item sells on eBay.",
          "A single third-party seller with very low stock, since scarcity like that usually means the item is in high demand.",
          "A listing that frequently goes in and out of stock, because that churn is a clear sign of very strong ongoing sales.",
          "The lowest price you can find anywhere, even from a brand-new seller with no feedback and no shipping history yet."
        ], answer: 0 },

      { scenario: "An item has huge demand but 40 other sellers already list it near your cost.",
        q: "Best call?",
        options: [
          "Usually skip it — heavy competition at your cost leaves no room to profit without racing everyone to the bottom.",
          "List it anyway at the same price, since an item with that much demand is guaranteed to sell for someone eventually.",
          "List it well below everyone else to win the sales, even though that means selling each one at a small real loss.",
          "List it far above everyone else, because a higher price signals higher quality and buyers will happily pay for it."
        ], answer: 0 },

      { q: "Before listing a branded-looking item, the best way to gauge VERO risk is to:",
        options: [
          "Check eBay's VERO participant list and whether the brand actively enforces, then avoid it if enforcement is likely.",
          "Assume it is fine unless you personally have already received a takedown for that exact brand at some point before.",
          "List a test unit and simply wait to see whether the brand issues a takedown within the first few days or so.",
          "Judge purely by how expensive the brand is, since only luxury and high-end brands ever really bother with VERO."
        ], answer: 0 },

      { q: "You must choose one item to list. Which profile is usually best for a healthy store?",
        options: [
          "Moderate demand with a solid margin and reliable stock — steady, repeatable profit beats one risky home run.",
          "Very high demand with a razor-thin margin, since the sheer sales volume will more than make up for the thin profit.",
          "Low demand with a huge margin, because the big profit on each rare sale is worth the long waits in between them.",
          "Very high demand with an unreliable source, betting that you can find stock somewhere each time the item sells."
        ], answer: 0 },

      { scenario: "Two Amazon sources for the same item: one is Amazon/Prime at $21, the other a third-party seller at $19 with slow shipping.",
        q: "Which do you build the eBay listing around?",
        options: [
          "The $21 Prime source — the extra $2 buys reliable fast shipping and stock, which protects your eBay metrics.",
          "The $19 third-party source, since the lower cost gives you more margin, and cost is what matters most of all here.",
          "Whichever one is cheaper on the day each order comes in, switching back and forth between the two of them each time.",
          "The $19 source, and simply set a very long handling time on the listing to cover the slower third-party shipping."
        ], answer: 0 },

      { q: "Order these steps for vetting a new item: (1) source reliability, (2) demand, (3) margin after fees, (4) VERO/restricted status.",
        options: [
          "Check demand, then VERO and restricted status, then source reliability, and calculate the margin after fees last.",
          "Calculate margin after fees, then demand, then source reliability, and check VERO and restricted status at the end.",
          "Check source reliability, calculate margin after fees, check demand, and check VERO and restricted status last.",
          "Check VERO and restricted status, calculate margin after fees, check source reliability, then check demand last."
        ], answer: 0 },

      { q: "A short-lived viral fad item vs. an evergreen everyday item with steady demand — for a stable store, prioritize:",
        options: [
          "The evergreen item, for reliable repeat sales, while treating fad items as small, quick, optional side bets only.",
          "The fad item only, since chasing whatever happens to be viral right now is the fastest way to grow a new store.",
          "Neither — a store should only ever list high-ticket items, because small everyday items are not worth the effort.",
          "The fad item, and order a very large amount of stock up front to be ready for the huge wave of demand that's coming."
        ], answer: 0 },

      { scenario: "Item A: $6 margin, rock-solid Prime source. Item B: $12 margin, flaky source that stocks out often.",
        q: "For steady account health, which do you prioritize?",
        options: [
          "Item A — the smaller margin is more than worth it for a source that won't force cancellations and defects on you.",
          "Item B — the margin is double, and the occasional stockout and cancellation is a fair price to pay for more profit.",
          "Item B, and simply cancel any orders you can't fill with 'out of stock' as the reason each time that it happens.",
          "Whichever one happens to be trending higher this week, switching between the two of them as the trends move around."
        ], answer: 0 },

      { q: "An item sells for $25, costs $19 on Amazon, and fees run about 14%. Roughly what's the profit?",
        options: [
          "About $2.50 — fees near $3.50 plus the $19 cost leave only a couple of dollars, a thin margin to work with here.",
          "About $6.00 — the profit is just the $25 sale price minus the $19 Amazon cost, before counting any of the fees.",
          "About $3.50 — the profit is basically whatever the eBay and payment fees come to on a twenty-five-dollar sale.",
          "About $5.00 — fees on a low-priced item like this are small enough that they barely change the profit at all."
        ], answer: 0 },

      { q: "When picking a source seller on Amazon to fulfill from, the best sign of reliability is:",
        options: [
          "A Prime, in-stock listing from Amazon itself or a top-rated seller with a record of consistent fast shipping.",
          "The single lowest-priced offer on the page, whoever it happens to be from, since cost is what matters most.",
          "A seller with almost no feedback but a very low price, since new sellers often price low to win their early sales.",
          "Any seller at all, since which specific source you order from never really affects your eBay order in practice."
        ], answer: 0 },

      { q: "Which is the strongest sign that an item has real, listable demand?",
        options: [
          "A steady history of recent sales across several sellers, rather than just watchers or a single one-off spike.",
          "A large number of watchers on one listing, since watchers are buyers who are about to make a purchase very soon.",
          "One seller who sold a lot of units in a single day, which proves the item is about to go viral just about everywhere.",
          "A high search volume for the keyword, regardless of whether anyone is actually buying the item at all right now."
        ], answer: 0 },

      { scenario: "A trending item looks exciting but you can't find a reliable source under your break-even cost.",
        q: "Best call?",
        options: [
          "Skip it — without a reliable source below break-even, there is simply no way to list it profitably and safely.",
          "List it now at a loss to ride the trend, and count on finding a cheaper source before too many orders come in.",
          "List it at your break-even price so at least you don't lose money, even though there is no profit in it either.",
          "List it above break-even and hope a cheaper source appears later so the orders eventually become profitable."
        ], answer: 0 },

      { q: "You have seconds to reject bad items fast. What's the quickest, highest-value first filter?",
        options: [
          "VERO and restricted status — if it's likely to get taken down, nothing else about the item matters at all.",
          "The exact profit to the penny, since you should always calculate precise margin before checking anything else.",
          "The product photo quality, since an item with weak photos is never worth spending any more time looking at.",
          "The competitor's title length, since that is the fastest single thing to glance at when you're screening an item."
        ], answer: 0 },

      { q: "Why include a small 'returns buffer' when calculating an item's profit?",
        options: [
          "Some orders get refunded or returned, so a buffer keeps the item profitable across many sales, not just one.",
          "eBay charges an extra hidden returns fee on every order that you must set aside money to cover in advance.",
          "Buyers expect a discount on their next order, so the buffer pre-funds the loyalty coupon you'll send them later.",
          "Amazon adds a surcharge to all dropship orders, and the buffer is what covers that extra per-order charge for you."
        ], answer: 0 },

      { scenario: "Two items: one evergreen with modest steady sales, one that sold huge for two days then went quiet.",
        q: "Which is the better catalog addition?",
        options: [
          "The evergreen one — steady repeat sales are worth far more to a store than a spike that has already faded out.",
          "The two-day spike item, since an item that sold that hard once is very likely to spike big like that again soon.",
          "Neither, because a store should only ever add items that have sold consistently for several years or even longer.",
          "The spike item, listed in a huge quantity right now, to capture the next burst of demand whenever it comes back."
        ], answer: 0 }
    ],

    /* ==================== ORDER FULFILLMENT ==================== */
    "fulfillment": [
      { scenario: "An eBay order came in at $42; the Amazon source jumped to $47 overnight. Ship-by is tomorrow.",
        q: "Best decision?",
        options: [
          "Fulfill the order to protect account health, accept the small loss, and let the repricer prevent it next time.",
          "Cancel the order right away so that the store does not have to absorb the five-dollar loss on this particular sale.",
          "Ship a cheaper, different item instead of the one that was ordered so that the store can still profit on the sale.",
          "Message the buyer and politely ask them to please pay an extra five dollars before you are willing to ship it out."
        ], answer: 0 },

      { q: "When fulfilling an eBay order on Amazon, the shipping address must:",
        options: [
          "Match the buyer's eBay order address exactly when you place the fulfilling order over on the Amazon side of things.",
          "Be your own home address first, and then you personally repackage and reship each order onward to the actual buyer.",
          "Be whichever address the buyer happens to send you in a message rather than the one that is on the eBay order.",
          "Be left completely blank so that Amazon can automatically fill in wherever it thinks the order ought to be sent."
        ], answer: 0 },

      { scenario: "The Amazon order will arrive in a branded Amazon box.",
        q: "Best practice to reduce buyer confusion?",
        options: [
          "Use gift options or plain packaging where available and set expectations, so it does not look like a mistake.",
          "Do nothing about it at all, based on the assumption that buyers really do not care what the shipping box looks like.",
          "Proactively tell the buyer up front that the store dropships every one of its orders directly from Amazon to them.",
          "Cancel any order that you are not able to ship inside a completely plain, unbranded box for whatever the reason."
        ], answer: 0 },

      { scenario: "The Amazon source went out of stock right after an eBay order came in.",
        q: "Best action?",
        options: [
          "Find an equivalent reliable source at an acceptable cost, or if that's impossible, apologize and refund promptly.",
          "Leave the order sitting there unshipped and simply hope that the item eventually comes back into stock on its own.",
          "Ship some random substitute item to the buyer instead without telling them that it is not the product they ordered.",
          "Ignore the whole situation completely until the buyer opens an item-not-received case against the store's account."
        ], answer: 0 },

      { q: "Gift receipts / hiding pricing on the Amazon order matters because:",
        options: [
          "It prevents the buyer from seeing a lower Amazon price and packing slip, which cuts down on confusion and complaints.",
          "It makes the package end up arriving to the buyer noticeably faster than it otherwise would have without the option.",
          "It is required because eBay's own rules say the Amazon price has to be printed on every single dropshipped order.",
          "It really has no effect on anything at all and is simply an extra optional step that wastes the fulfiller's time."
        ], answer: 0 },

      { q: "If tracking shows 'delivered' but the buyer says it never arrived, the fulfillment VA should:",
        options: [
          "Check the tracking details, stay empathetic, and follow eBay's process, since delivered-scan disputes have a path.",
          "Immediately accuse the buyer of lying about the package, since the tracking clearly shows that it was delivered.",
          "Refund the order in full right away without checking any of the tracking details or the delivery scan first at all.",
          "Ignore the buyer's message entirely, based on the fact that the tracking already says the package was delivered."
        ], answer: 0 },

      /* ---- tougher discriminators ---- */
      { scenario: "Ship-by is in 12 hours. Your auto-order tool placed the Amazon order but tracking hasn't generated yet.",
        q: "Best action to protect the on-time metric?",
        options: [
          "Upload a valid tracking number now (e.g., via Track Taco) to mark it shipped on time, then swap in the real one later.",
          "Wait for Amazon's real tracking even if it arrives after the ship-by deadline, since only the real number ever counts.",
          "Mark the order shipped with no tracking number at all, which stops the late clock without needing any number to do it.",
          "Extend the handling time on the original listing so that this specific order's ship-by deadline moves back a day."
        ], answer: 0 },

      { scenario: "An item is genuinely out of stock at every source and cannot be fulfilled.",
        q: "Should you upload a Track Taco number to buy time?",
        options: [
          "No — uploading tracking for an item you can't ship just delays an inevitable INR; refund or replace it instead.",
          "Yes — upload a tracking number to reset the clock, then keep searching for stock for as long as you possibly can.",
          "Yes — a tracking number always prevents an item-not-received case, whether or not the item ever actually ships.",
          "Yes — upload several tracking numbers over a few days so the buyer believes the package is on its way to them."
        ], answer: 0 },

      { scenario: "A buyer messages right after ordering: \"Please ship to my work address instead,\" giving a new address.",
        q: "Best action?",
        options: [
          "Ship to the eBay order address; if it truly must change, cancel and have them reorder with the correct address.",
          "Ship to the new work address they messaged, since honoring the buyer's latest request is the friendliest option.",
          "Ship to both of the addresses to be safe, so the buyer is guaranteed to receive the item at one place or the other.",
          "Ask the buyer to pay a small address-change fee first, and then update the shipping address on the eBay order."
        ], answer: 0 },

      { q: "When placing the Amazon order via your fulfillment tool, enabling the gift-receipt / hide-price option mainly:",
        options: [
          "Keeps the Amazon price and packing slip off the parcel, reducing buyer confusion and price-difference complaints.",
          "Makes the package qualify for faster Prime shipping than it otherwise would have without the option selected.",
          "Is required by eBay, whose rules state the source price must never appear on any dropshipped parcel at all.",
          "Lowers the Amazon cost of the order, since gift orders are charged at a small discount versus the normal price."
        ], answer: 0 },

      { q: "Order these steps for fulfilling a new eBay order: (1) verify address, (2) place the Amazon order, (3) enable gift/hide-price, (4) upload tracking.",
        options: [
          "Verify the address, enable gift/hide-price, place the Amazon order, then upload tracking once it has been issued.",
          "Place the Amazon order, verify the address, upload the tracking, and enable gift/hide-price only at the very end.",
          "Upload the tracking, place the Amazon order, verify the address, then enable gift/hide-price after all of that.",
          "Enable gift/hide-price, upload the tracking, place the Amazon order, and verify the address only at the very end."
        ], answer: 0 },

      { scenario: "A buyer opens an INR case. Tracking shows the package moving normally and it's still before the estimated delivery date.",
        q: "Best response?",
        options: [
          "Reply in the case with the tracking and delivery estimate, and ask the buyer to wait until the expected date.",
          "Refund the order in full right away so the case closes fast, even though the package is clearly still on its way.",
          "Upload a fresh tracking number to the case so the estimated delivery date pushes back and buys the package time.",
          "Ignore the case, since eBay will automatically rule in your favor because the tracking shows normal movement."
        ], answer: 0 },

      { q: "Which of these most directly hurts an eBay seller's account health?",
        options: [
          "A high rate of cancellations and late shipments, which eBay counts as defects against the selling account.",
          "Uploading tracking a little earlier than the handling time technically requires on some of the store's orders.",
          "Answering buyer messages quickly, which can occasionally lead to more back-and-forth on a single order thread.",
          "Offering buyers a free return now and then, which eBay actually treats as a positive signal for the account."
        ], answer: 0 },

      { q: "Your auto-order tool places Amazon orders automatically. The most important thing to still check by hand is:",
        options: [
          "That each order's shipping address, item, and variation match the eBay order before the parcel actually goes out.",
          "Nothing at all — the entire point of the automation is that you never have to review any of its orders again.",
          "Only the order total, since as long as the price is right the address and the item will always be correct too.",
          "Only whether the item arrived, since there is no way to catch a wrong-address order until the buyer complains."
        ], answer: 0 },

      { scenario: "You know an order will ship a day late because of a source delay. The buyer hasn't messaged yet.",
        q: "Best practice?",
        options: [
          "Proactively message the buyer with a brief, honest heads-up and a realistic delivery date before they have to ask.",
          "Say nothing unless the buyer messages first, since telling them about a delay only invites complaints you'd avoid.",
          "Message the buyer a long, detailed explanation of the Amazon supply chain so they fully grasp the whole delay.",
          "Cancel the order to avoid being late, then suggest the buyer repurchase it once the item is back and shipping again."
        ], answer: 0 },

      { q: "You must cancel an order you truly can't fulfill. Which cancellation reason best protects the account?",
        options: [
          "There's no fully 'safe' reason — cancellations count as defects, so avoid them; if forced, be honest and refund fast.",
          "Always use 'buyer requested cancellation,' since that particular reason never counts as a defect against the account.",
          "Use 'out of stock,' which eBay treats as a completely neutral reason with no effect on the seller's account health.",
          "Use 'problem with the buyer's address,' which shifts the blame to the buyer so the cancellation won't count at all."
        ], answer: 0 },

      { q: "For healthy metrics, tracking should be uploaded to the eBay order:",
        options: [
          "Within the listing's handling time, as soon as a valid number is available, and kept updated as the parcel moves.",
          "Only once the package has actually been delivered, so the buyer sees the full journey all at once at the very end.",
          "About a week after the sale, which gives the auto-order tool plenty of time to sort out the real number first.",
          "Whenever the buyer first asks for it, since uploading tracking before they request it is really just wasted effort."
        ], answer: 0 },

      { scenario: "Your auto-order tool is down for maintenance and you must fulfill 10 orders by hand before their ship-by dates.",
        q: "Best approach to tracking?",
        options: [
          "Place each Amazon order by hand, then upload each real tracking number to eBay as soon as it is generated.",
          "Upload Track Taco numbers to all 10 orders and skip actually placing the Amazon orders until the tool is back.",
          "Wait for the auto-order tool to come back before doing anything, even if some orders pass their ship-by dates.",
          "Cancel all 10 orders and ask the buyers to repurchase once the auto-order tool is fully working again for you."
        ], answer: 0 },

      { scenario: "The auto-order tool flags that a buyer's eBay address is a freight-forwarder / reshipper address.",
        q: "Best action?",
        options: [
          "Ship to the eBay address as recorded, since that is what keeps seller protection; just fulfill the order normally.",
          "Refuse to ship the order entirely, since a freight-forwarder address is always a clear sign of a fraudulent buyer.",
          "Message the buyer to demand their 'real' home address before you agree to ship the order out to them at all.",
          "Ship it to a random nearby address instead, since forwarders lose packages and this avoids a lost-item claim."
        ], answer: 0 },

      { scenario: "One buyer placed three separate eBay orders in an hour for the same item.",
        q: "Best fulfillment approach?",
        options: [
          "Fulfill each eBay order separately with its own tracking, so every order stays properly matched and protected.",
          "Combine them into one Amazon order with one tracking number, and put that same number on all three eBay orders.",
          "Cancel two of the three orders and refund them, since a buyer only really needs one of the identical items.",
          "Message the buyer to ask which of the three orders they actually meant to place before shipping any of them."
        ], answer: 0 },

      { scenario: "Of 20 orders to fulfill, 2 items just went out of stock at your primary source.",
        q: "Best move?",
        options: [
          "Fulfill the 18 in-stock orders now, then find an alternate source for the 2, and refund only if none exists.",
          "Hold all 20 orders until the 2 out-of-stock items restock, so the whole batch can ship together at one time.",
          "Cancel all 20 orders as out of stock, since a partly-out-of-stock batch is too messy to try to fulfill cleanly.",
          "Fulfill the 18, then upload Track Taco numbers to the 2 out-of-stock orders to keep buying time on them forever."
        ], answer: 0 },

      { scenario: "An order will arrive two days later than estimated but is genuinely on the way. You've decided to message the buyer.",
        q: "Which message is best?",
        options: [
          "A short, honest note: it's on the way, here's the new estimated date, and the tracking link to follow along with.",
          "A long apology promising it will never happen again and offering a full refund on top of them keeping the item.",
          "A message blaming the carrier and Amazon in detail, so the buyer knows the delay is not the store's fault at all.",
          "A vague note saying 'there may be a slight delay' with no new date, to avoid committing to anything too specific."
        ], answer: 0 },

      { q: "eBay's 'late shipment rate' is best kept low by:",
        options: [
          "Uploading valid tracking within the handling time on every order, and shipping promptly once the orders come in.",
          "Setting every listing to a same-day handling time, which tells eBay the store is always extremely fast to ship.",
          "Only shipping orders on the specific days when you know the carrier scans packages fastest in your local area.",
          "Asking buyers in a message not to worry about shipping speed, so they don't report an order as having shipped late."
        ], answer: 0 },

      { q: "Order the steps for a 'delivered but not received' claim: (1) check the delivery scan, (2) reply empathetically, (3) advise eBay's process, (4) decide on refund/replacement.",
        options: [
          "Check the delivery scan, reply empathetically, advise eBay's process, then decide on the refund or replacement.",
          "Decide on the refund or replacement first, reply empathetically, check the delivery scan, then advise eBay's process.",
          "Advise eBay's process, decide on the refund or replacement, reply empathetically, then check the delivery scan last.",
          "Reply empathetically, decide on the refund or replacement, advise eBay's process, then check the delivery scan last."
        ], answer: 0 }
    ],

    /* ==================== VA MANAGER ==================== */
    "manager": [
      { q: "The 'One VA + AI agents' store model means the VA Manager's core job is to:",
        options: [
          "Supervise specialist VAs and AI agents end to end, own the outcomes, and step in whenever the AI makes a mistake.",
          "Personally do every single task in the store by hand, with no automation and no help from any AI agents at all.",
          "Only ever handle the incoming customer messages and leave all of the store's other work entirely to other people.",
          "Stay away from touching the sourcing or the fulfillment side of the store and focus on something else instead."
        ], answer: 0 },

      { scenario: "Your AI customer-service agent auto-replied incorrectly to an INR case and the buyer opened an eBay case.",
        q: "What's the RIGHT order of your next actions?",
        options: [
          "Take over the case with a correct, empathetic reply, resolve it with the buyer, then adjust the AI's rules and log it.",
          "Publicly blame the AI agent for the whole mistake and then simply refund everything to make the problem go away.",
          "Ignore the situation entirely, based on the assumption that the AI agent will somehow end up fixing its own error.",
          "Escalate the whole thing straight to eBay before you have even talked to the buyer or looked at what went wrong."
        ], answer: 0 },

      { q: "A specialist VA's test scores are high but their live work quality is slipping. Best managerial move?",
        options: [
          "Coach them with specific feedback and examples, set clear expectations, and monitor for improvement before escalating.",
          "Fire the specialist VA immediately, without any warning or coaching, the moment their live work quality starts to slip.",
          "Ignore the slipping work quality completely, based only on the fact that the VA's original test scores were high.",
          "Publicly criticize the VA in front of the rest of the team in the hope that the embarrassment will motivate them."
        ], answer: 0 },

      { q: "Which KPI set best reflects a healthy store for a manager to watch?",
        options: [
          "Account defect rate, late shipment rate, cancellation rate, profit margin, and the store's buyer response time.",
          "Only the total number of active listings that the store currently has published, without tracking anything else.",
          "Only the store's social media follower count, treated as the single most important measure of how healthy it is.",
          "Only the raw number of messages that the store's team has sent out to buyers over the course of the week."
        ], answer: 0 },

      { q: "When an AI sourcing agent flags a high-margin but VERO-risky item, the manager should:",
        options: [
          "Override the AI and reject the item, since protecting the account matters more than a short-term jump in margin.",
          "Approve the item for listing right away simply because the profit margin that the AI is showing on it is very high.",
          "Let the AI make the final decision completely on its own without any human review of the VERO risk involved at all.",
          "Approve the risky item but only allow it to be listed on weekends when eBay's enforcement is assumed to be lighter."
        ], answer: 0 },

      { q: "Best way to keep specialist VAs and AI agents aligned?",
        options: [
          "Clear written SOPs, defined escalation paths, and a regular review of the AI's outputs against those same standards.",
          "No documentation at all, with the whole team simply relying on their own memory of how each task should be done.",
          "Letting every person and agent on the team improvise their own approach to each task completely independently.",
          "Only reviewing the work that the team and the AI agents produce about once every three months or so at the most."
        ], answer: 0 },

      { q: "A price-jump on a live order caused a loss. As manager, the systemic fix is to:",
        options: [
          "Make sure the repricer rules and stock monitoring are tuned so the same problem is caught automatically next time.",
          "Simply cancel any future orders that happen to look even slightly risky before they have a chance to cost money.",
          "Do nothing about it and treat the occasional loss on an order as a completely normal and unavoidable cost anyway.",
          "Go back to manually checking the price on every single order by hand, forever, instead of trusting any automation."
        ], answer: 0 },

      { q: "Which describes good delegation for a one-VA-plus-AI store?",
        options: [
          "Route the repeatable tasks to the right specialist or AI and keep the real judgment calls for the manager to handle.",
          "Do absolutely everything yourself just to be safe, rather than ever trusting a specialist or an AI with any of it.",
          "Delegate all of the difficult judgment calls straight to the AI and let it make those decisions without oversight.",
          "Never delegate a single task to anyone or anything, and instead keep the entire workload on the manager alone."
        ], answer: 0 },

      /* ---- tougher discriminators ---- */
      { q: "The best way to supervise an AI customer-service agent handling buyer messages is to:",
        options: [
          "Spot-check its replies regularly and review every escalation, tightening its rules whenever it gets one wrong.",
          "Let it run fully unsupervised, since the whole point of the AI is that a human never has to look at its work.",
          "Read and rewrite every single reply it drafts before it sends, which removes any real time savings from using it.",
          "Only look at its work if a buyer complains, since no complaint must mean the AI is handling everything correctly."
        ], answer: 0 },

      { scenario: "Your store's defect rate is climbing while total sales stay flat.",
        q: "As manager, what do you dig into first?",
        options: [
          "The sources of the defects — late shipments, cancellations, INR cases — since defects threaten the account itself.",
          "Ways to increase the total sales number, since more sales will naturally dilute the rising defect rate over time.",
          "The store's social presence, since a stronger brand image is the best long-term fix for account health problems.",
          "Nothing just yet — a rising defect rate usually corrects itself, so it is better to wait and watch it for a while."
        ], answer: 0 },

      { scenario: "Your AI sourcing agent recommends a high-margin item, but you recognize the brand as VERO-enforced.",
        q: "Best decision?",
        options: [
          "Override the AI and reject it — protecting the account from a takedown outweighs the margin on any single item.",
          "Approve it, since the AI's margin analysis is data-driven and should be trusted over a human hunch about a brand.",
          "Approve it but list only a small quantity, on the theory that a low volume will stay under the brand's radar.",
          "Ask the AI to re-run its analysis and go with whatever it recommends the second time, without overriding it at all."
        ], answer: 0 },

      { q: "An AI reply mishandled a case and the buyer escalated. Order your steps: (1) fix the AI's rule, (2) resolve the buyer's issue, (3) log the failure, (4) check for other affected orders.",
        options: [
          "Resolve the buyer's issue, check for other affected orders, fix the AI's rule, then log the failure for later review.",
          "Fix the AI's rule, log the failure, resolve the buyer's issue, and check for other affected orders only at the end.",
          "Log the failure, fix the AI's rule, check for other affected orders, and resolve the buyer's issue last of all.",
          "Check for other affected orders, fix the AI's rule, log the failure, then resolve the buyer's issue at the very end."
        ], answer: 0 },

      { q: "Which pattern should most make a manager pause and investigate?",
        options: [
          "A sudden spike in 'item not received' claims on orders that all shipped through the same source or the same method.",
          "A steady, ordinary flow of routine buyer questions spread fairly evenly across the store's active listings this week.",
          "A day with slightly higher sales than usual on the store's best-selling and most established evergreen everyday item.",
          "A specialist VA taking their normal scheduled break at the same time that they take it every single day of the week."
        ], answer: 0 },

      { q: "The main reason to document SOPs for VAs and AI agents is to:",
        options: [
          "Make the work consistent and reviewable, so any person or agent handles each task the same correct way every time.",
          "Create paperwork that looks professional to outside investors, even if nobody on the team actually follows any of it.",
          "Slow the team down on purpose, on the theory that carefully reading a procedure before each task prevents mistakes.",
          "Replace the need for any review at all, because once an SOP exists the work no longer has to be checked by anyone."
        ], answer: 0 },

      { scenario: "Your AI agent is confidently drafting a reply to a nuanced VERO-related buyer dispute.",
        q: "Best move?",
        options: [
          "Step in and handle it yourself — high-stakes, nuanced disputes are exactly where AI confidence can be misplaced.",
          "Let the AI send it, since its confidence is a strong indication that it has correctly understood the whole situation.",
          "Let the AI send it, but apologize to the buyer afterward if the reply happens to turn out to be the wrong one.",
          "Forward the dispute to a junior specialist VA to handle, since a manager's time is too valuable for a single case."
        ], answer: 0 },

      { scenario: "Order volume doubled and your one specialist VA can't keep up within the 24-hour standard.",
        q: "Best managerial response?",
        options: [
          "Shift routine work to the AI or add help, and reprioritize so the time-sensitive orders and messages come first.",
          "Demand the VA simply work faster and put in much longer hours until the entire backlog is completely cleared out.",
          "Lower the store's standards for now so that a 48-hour reply time becomes acceptable during the busy stretch.",
          "Pause new listings and turn off buyer messaging entirely until the specialist manages to catch up on everything."
        ], answer: 0 },

      { q: "Your AI repricer suggests dropping a price below your floor to win a sale. You should:",
        options: [
          "Keep the floor — selling below it loses money, and the floor exists precisely to overrule that kind of suggestion.",
          "Drop below the floor this once, since the AI has the latest competitor data and winning the sale is what matters.",
          "Remove the floor entirely so the repricer is free to always match the lowest competitor across every single listing.",
          "Drop the price to exactly the floor, then lower the floor a little more so the next drop is able to go even further."
        ], answer: 0 },

      { scenario: "A shortcut would boost this month's sales but slightly raises the risk of an account suspension.",
        q: "Best managerial choice?",
        options: [
          "Protect the account — long-term store health outweighs a one-month sales bump that risks the whole business.",
          "Take the shortcut, since strong sales this month are what matter and the suspension risk is only slight anyway.",
          "Take the shortcut but keep it quiet from the store owner, so that only the good sales numbers are what they see.",
          "Split the difference by using the shortcut on just half of the listings, to get some of the boost at a lower risk."
        ], answer: 0 },

      { q: "Your AI agent handles 95% of messages well but occasionally sends a confidently wrong reply. Best setup?",
        options: [
          "Let it handle routine replies but route anything high-stakes or uncertain to a human, and spot-check the rest.",
          "Let it handle everything unsupervised, since a 95% success rate is more than good enough to stop reviewing it.",
          "Turn the AI off entirely, since any wrong reply at all means it cannot be trusted with buyer messages at all.",
          "Keep the AI but have it send every reply twice, on the theory that a second attempt corrects the first mistake."
        ], answer: 0 },

      { scenario: "You have a pile of tasks: 2 INR cases near deadline, 10 routine messages, and a listing-optimization project.",
        q: "What comes first?",
        options: [
          "The 2 deadline-driven INR cases, since missing those hurts the account, then the messages, then the project.",
          "The listing-optimization project, since growing the store's sales is the most valuable use of a manager's time.",
          "The 10 routine messages first, since clearing the largest number of small tasks feels the most productive early.",
          "Whatever task is quickest to finish first, regardless of any deadlines, just to build some momentum for the day."
        ], answer: 0 },

      { scenario: "A specialist VA made one genuine mistake after months of strong, reliable work.",
        q: "Best managerial response?",
        options: [
          "Point out the mistake calmly, confirm they understand the fix, and move on — one slip after strong work is normal.",
          "Issue a formal warning and cut their hours, so that they clearly understand mistakes have real consequences.",
          "Start quietly looking for a replacement, since even one mistake is a sign the VA's quality is about to decline.",
          "Say nothing at all and just fix the mistake yourself, so that the VA never has to know anything went wrong."
        ], answer: 0 },

      { q: "The store's cancellation rate spiked this week. The most likely root cause to check first is:",
        options: [
          "Source stockouts or price jumps forcing orders to be cancelled — a sourcing or repricer problem you can fix.",
          "Buyers changing their minds more often this week, which is random and not really something a manager can address.",
          "The listing photos, since unappealing images make buyers cancel their orders shortly after they place them.",
          "eBay's algorithm, which sometimes cancels perfectly healthy orders on its own for reasons outside your control."
        ], answer: 0 },

      { q: "Which mix of automation and human judgment is soundest?",
        options: [
          "Automate routine order placement and tracking uploads; keep the VERO calls and tricky disputes for a human.",
          "Automate everything, including the VERO decisions and disputes, since AI is more consistent than any human.",
          "Automate nothing at all, since any automation eventually makes a mistake that ends up costing the store money.",
          "Automate only the buyer messages and keep routine order placement manual, since orders are far too important."
        ], answer: 0 },

      { q: "You've written clear SOPs for the team. What still needs to happen?",
        options: [
          "Regular spot-checks and reviews, since SOPs guide the work but do not on their own guarantee it's followed right.",
          "Nothing more — once good SOPs exist, the work is guaranteed correct and no further review is ever really needed.",
          "Rewriting the SOPs every week, since any procedure that is more than a few days old is already out of date anyway.",
          "Hiding the SOPs from the team, so that they have to think for themselves instead of just following a checklist."
        ], answer: 0 },

      { scenario: "A supplier offers a big discount to list a large batch of a VERO-risky brand this month.",
        q: "Best managerial decision?",
        options: [
          "Pass — the discount is not worth risking a takedown or suspension that could cost the whole store far more.",
          "Take the deal and list the whole batch, since a discount that large clearly outweighs a small takedown risk.",
          "Take the deal but list under a different category, so the batch stays hidden from the brand's VERO enforcement.",
          "Take the deal and list just enough of the batch to use the discount, betting a partial listing avoids attention."
        ], answer: 0 }
    ]
  };

  /* ============================================================
     TYPED "in your own words" prompts (5 per section).
     NOT scored — the engine shows 3 per attempt, paste disabled,
     and saves the answers so employers can read how the VA thinks.
     ============================================================ */
  window.TRV_FILLINS = {
    "customer-service": [
      "A buyer messages: \"This arrived late and I'm furious. I want my money back right now.\" Write the exact reply you would send.",
      "You don't yet know the answer to a buyer's question and need a few hours to check. Write a holding reply that buys you time without upsetting them.",
      "Reply to a buyer asking \"Is this item genuine, and where does it ship from?\" — in a way that reassures them WITHOUT revealing that you dropship from Amazon.",
      "A buyer received the wrong item. In your own words, describe the exact steps you'd take to fix it and keep the buyer happy.",
      "Describe your routine for handling 50+ buyer messages in a shift while still replying to every one within 24 hours."
    ],
    "listing": [
      "Write the eBay title you'd use for a 32oz stainless steel insulated water bottle in navy blue, and briefly explain your choices.",
      "In your own words, explain how you decide whether an item is worth listing (think margin, demand, competition, and VERO risk).",
      "A listing has plenty of views but no sales after two weeks. Describe, step by step, what you'd change and why.",
      "Explain how you'd set a repricer's floor price for an item that costs $20 on Amazon, and why that floor matters.",
      "Describe how you decide the right handling time to put on a listing."
    ],
    "sourcing": [
      "You found an item selling well on eBay at $34 that costs $30 on Amazon. Walk through whether you'd list it and how you'd decide.",
      "In your own words, explain what VERO risk is and how you screen for it before listing an item.",
      "Describe the difference between a good sniping target and a bad one, using your own examples.",
      "Explain how you factor eBay and payment fees into deciding whether an item is actually profitable. Show your rough math.",
      "The source price for an item swings a lot day to day. Explain how you'd decide whether to list it, and how you'd manage it."
    ],
    "fulfillment": [
      "An order's ship-by deadline is tomorrow but there's still no tracking number. Explain exactly what you'd do, and why.",
      "In your own words, describe your step-by-step routine for fulfilling a batch of new eBay orders on Amazon accurately.",
      "The Amazon source went out of stock after an eBay order came in. Walk through how you'd handle it.",
      "Explain why matching the buyer's exact eBay address and hiding the price on the Amazon order both matter.",
      "Tracking says 'delivered' but the buyer says they never received it. Describe the steps you'd take."
    ],
    "manager": [
      "One of your specialist VAs has great test scores but their live work is slipping. Describe how you'd coach them.",
      "In your own words, explain how you'd supervise an AI customer-service agent so its mistakes get caught early.",
      "Which handful of store metrics would you watch daily as a manager, and why those specific ones?",
      "An AI sourcing agent recommends a high-margin item that carries VERO risk. Explain your decision and your reasoning.",
      "Describe how you decide what to delegate to specialists or AI versus what to handle yourself."
    ]
  };
})();
