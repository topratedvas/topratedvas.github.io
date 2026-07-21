/* ============================================================
   TopRatedVAs.com — Certification question banks (Phase 6 · v1 DRAFT)
   Scenario-based, EcomSniper Amazon→eBay dropshipping model.
   The engine draws min(20, bank length), shuffles question order
   AND answer order, and speed-scores each answer.

   `answer` is the 0-based index of the correct option BEFORE shuffle.

   TEST INTEGRITY: every option in a question is written to a SIMILAR
   LENGTH so the correct answer can't be guessed by picking the longest.
   Distractors are fleshed out with plausible-but-wrong reasoning.

   v1 DRAFT CONTENT — Dan refines + grows each bank to 30+ in Phase 9.
   Customer Service is a complete 30-question bank; the other four are
   ~10-question starters (engine draws what's available).
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

    /* ==================== CUSTOMER SERVICE (30) ==================== */
    "customer-service": [
      { scenario: "Hi, I ordered this as a birthday gift and it arrived in an AMAZON box with a packing slip showing a LOWER price than I paid on eBay. This feels like a scam — refund the difference or I'm opening a case and leaving negative feedback.",
        q: "What is the BEST first response?",
        options: [
          "Apologize, reassure them the item is new and genuine, note that orders ship from multiple warehouses, and offer a small goodwill gesture.",
          "Explain that the price difference is simply eBay's selling fees and that they accepted the listed price at checkout, so no refund is owed.",
          "Refund the full order right away and then block the buyer so they cannot leave the negative feedback that they are threatening you with.",
          "Wait about a day before replying, since angry buyers usually cool off and answering too quickly can look like an admission of guilt."
        ], answer: 0 },

      { scenario: "Buyer: \"Where is my item?? It's been 5 days and tracking hasn't moved.\"",
        q: "Tracking shows the Amazon order is still 'preparing to ship.' Best action?",
        options: [
          "Reassure the buyer with the delivery date from the listing, confirm it is on the way, and check the Amazon order for any delay.",
          "Tell the buyer to please be patient and to stop sending messages until the tracking number actually starts moving on its own.",
          "Cancel and refund the order immediately so that the buyer cannot open an item-not-received case against your seller account.",
          "Send them the raw Amazon tracking link and let them follow the package themselves from the original seller's side of things."
        ], answer: 0 },

      { q: "A buyer opens an eBay 'Item Not Received' (INR) case while tracking still shows in-transit and not yet past the delivery date. What do you do?",
        options: [
          "Reply inside the case with the tracking number and delivery estimate, and ask the buyer to wait until the expected date.",
          "Refund the order in full right away so that the open case is closed quickly and does not end up counting against you.",
          "Ignore the case completely, since eBay closes these on its own once the tracking finally marks the item as delivered.",
          "Tell the buyer that shipping is out of your hands and that they should contact the carrier about the delay themselves."
        ], answer: 0 },

      { scenario: "Buyer: \"This is DEFECTIVE. The zipper broke on day one. I want a refund.\"",
        q: "Most account-safe way to handle a defective-item claim?",
        options: [
          "Apologize, offer a replacement or full refund per policy, and process a no-cost return so that eBay sees it resolved.",
          "Explain that the buyer most likely broke the item themselves, so a refund or a replacement is not something you can offer.",
          "Tell them the item came from Amazon, so any defect claim is really Amazon's responsibility rather than the store's problem.",
          "Offer a small five percent discount to keep the broken item and hope that the buyer decides to accept it and move on."
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

      { q: "An eBay message contains a request to complete the sale OFF eBay (buyer offers to pay by bank transfer for a discount). What do you do?",
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

      { q: "A return request comes in for 'no longer needed' (buyer's remorse) on a listing marked 'Returns accepted, buyer pays return shipping.' Best handling?",
        options: [
          "Accept the return under your stated policy and have the buyer pay the return shipping exactly as the listing says.",
          "Deny the return outright, since changing their mind is entirely the buyer's fault and not the store's responsibility.",
          "Accept it but pay the return shipping yourself, even though the listing clearly states the buyer covers those costs.",
          "Tell the buyer to simply keep the unwanted item and go ahead and issue them a full refund to avoid any argument."
        ], answer: 0 },

      { scenario: "Buyer: \"Item is fine but the box was a bit dented.\" No refund requested — just a comment.",
        q: "Best reply to build goodwill?",
        options: [
          "Thank them, apologize for the packaging, confirm you're glad the item is good, and invite them to reach out anytime.",
          "Offer the buyer a full refund on the order immediately, even though all they did was mention that the box was dented.",
          "Ignore the message entirely since the buyer did not actually ask for anything and the item itself was perfectly fine.",
          "Explain to them that any damage that happens during shipping is never something the store can be held responsible for."
        ], answer: 0 },

      { q: "You notice a buyer's shipping address in the eBay order differs from what they message you. Correct action?",
        options: [
          "Always ship to the address on the eBay order and never change it based only on a message from the buyer.",
          "Ship the order to whichever address the buyer happens to message you with most recently before it goes out.",
          "Ask the buyer to pay for the item a second time before you agree to send it to the new address they gave you.",
          "Cancel the whole order and simply tell the buyer to purchase it again using the correct shipping address."
        ], answer: 0 },

      { scenario: "Buyer: \"You sent the WRONG color. I ordered black, got blue.\"",
        q: "Best resolution path?",
        options: [
          "Apologize, confirm the correct item, and arrange a free replacement or a return and refund, since this is a store error.",
          "Insist that the buyer actually ordered the blue one and then refuse to replace it or offer any refund on the order.",
          "Tell them to keep the blue item at a small five percent discount so that everyone can just move on from the mistake.",
          "Blame the Amazon warehouse for sending the wrong color and close the message without offering the buyer a solution."
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

      { q: "A buyer is polite but confused about tracking that shows a carrier they don't recognize. Best reply?",
        options: [
          "Reassure them, explain which carrier is handling delivery, and share the current status and expected arrival date.",
          "Tell the buyer that the carrier does not really matter and that all they need to do is wait for the item to show up.",
          "Admit honestly that you have no idea which carrier is actually handling their package or where it currently is now.",
          "Send the buyer over to eBay's support team instead of answering the question about the carrier yourself directly."
        ], answer: 0 },

      { scenario: "Buyer: \"Cancel my order, I changed my mind\" — sent 20 minutes after purchase, before you've placed the Amazon order.",
        q: "Best action?",
        options: [
          "Accept the cancellation promptly since nothing has shipped yet, and confirm the refund to keep the buyer happy.",
          "Refuse the cancellation and explain to the buyer that on this store absolutely all of the sales are final ones.",
          "Go ahead and ship the order out anyway, because keeping the completed sale matters more than the buyer's request.",
          "Charge the buyer a restocking fee first and only then agree to cancel the order and send their refund back to them."
        ], answer: 0 },

      { q: "Which of these is the WORST habit for a customer-service VA managing feedback?",
        options: [
          "Leaving buyer messages unanswered for days at a time until the cases escalate and hurt the account's standing.",
          "Replying to buyer messages within a few hours and keeping a friendly, professional tone in every single reply.",
          "Offering the buyer a fair solution early, before they are forced to ask about the same problem a second time.",
          "Keeping every part of the conversation inside eBay's messaging rather than moving it over to email or chat apps."
        ], answer: 0 },

      { scenario: "Buyer threatens: \"Refund me now or I'll leave 1-star and report you.\" The item was delivered and is as described.",
        q: "Best professional response?",
        options: [
          "Stay calm and polite, ask what exactly is wrong, and offer a fair resolution within policy rather than caving.",
          "Refund the order instantly just to make the threat go away, even though the item arrived and was as described.",
          "Warn the buyer that you are going to report them to eBay first before they get the chance to report you first.",
          "Ignore the message entirely and hope that the upset buyer simply forgets about it and never follows through."
        ], answer: 0 },

      { q: "A buyer messages asking for the tracking number 1 hour after purchase. Best reply?",
        options: [
          "Thank them and note the order is processing and that tracking will update within the listing's handling time.",
          "Send the buyer any random tracking number right away just so that they feel satisfied and stop asking about it.",
          "Tell the buyer that tracking numbers are simply never available for dropshipped orders on this particular store.",
          "Reply that you will get around to sorting out their tracking details at some point later whenever you have time."
        ], answer: 0 },

      { scenario: "Buyer: \"The listing said 2-day shipping but it's taking longer.\"",
        q: "The listing's handling time was actually set to 3 business days. Best reply?",
        options: [
          "Politely clarify the stated handling and delivery window, apologize for the confusion, and give the expected date.",
          "Tell the buyer plainly that they misread the listing and that the slower delivery is therefore their own fault.",
          "Refund the shipping cost right away just to avoid an argument that you are worried you might end up losing anyway.",
          "Blame eBay's display for showing the wrong shipping time and then end the conversation without helping them more."
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

      { q: "A buyer's message is in another language you don't speak. Best practice?",
        options: [
          "Use a translation tool to understand the message and reply clearly and courteously in the buyer's own language.",
          "Simply reply that you do not understand the message and then close the conversation without helping any further.",
          "Ignore the buyer's message entirely until they decide to rewrite the whole thing and send it back to you in English.",
          "Copy the buyer's original message and paste it straight back to them without translating or answering anything."
        ], answer: 0 },

      { scenario: "An eBay case is auto-closing in your favor tomorrow, but the buyer just messaged apologizing and saying the item actually arrived.",
        q: "Best move?",
        options: [
          "Thank them warmly, confirm you're glad it arrived, and invite them to reach out anytime to protect the relationship.",
          "Gloat a little that you turned out to be right all along and that the buyer's original complaint was never valid.",
          "Ask the buyer to remove any negative feedback first as a condition before you agree to consider the matter settled.",
          "Say nothing to the buyer at all and simply let the open case close automatically in your favor the following day."
        ], answer: 0 },

      { q: "Which action best protects seller account health when resolving complaints?",
        options: [
          "Resolving problems directly with the buyer before eBay ever has to step in and rule on the case for either side.",
          "Letting eBay force the refunds through by way of case rulings instead of handling the issue with the buyer first.",
          "Allowing unresolved cases to pile up over time so that you can batch them together and deal with them all later.",
          "Telling buyers to open a case for every issue so that there is always an official record of the problem on file."
        ], answer: 0 },

      { scenario: "Buyer: \"I received two of the same item but only ordered one.\"",
        q: "Best response?",
        options: [
          "Apologize for the mix-up, tell them to keep the extra or arrange a free return, and confirm it's sorted at no cost.",
          "Demand that the buyer pay you the full price for the second item, since they ended up receiving and keeping it.",
          "Accuse the buyer of lying about the duplicate simply because they are hoping to get a free extra item out of you.",
          "Tell the buyer that the duplicate shipment is really Amazon's mistake and therefore Amazon's problem to sort out."
        ], answer: 0 },

      { q: "A buyer leaves a neutral feedback mentioning slow replies. Going forward, the best fix is to:",
        options: [
          "Reply to every buyer message within a set target time, such as a few business hours, consistently from now on.",
          "Turn off your notifications entirely so that the constant stream of buyer messages does not stress you out as much.",
          "Only bother replying to the buyers who actually threaten to open a case or to leave you some negative feedback.",
          "Reply to all of the accumulated buyer messages just once a week in a single big batch to save yourself some time."
        ], answer: 0 },

      { scenario: "Buyer: \"I want to return it but the return window closed 2 days ago.\" Item is not defective.",
        q: "Best professional response?",
        options: [
          "Explain the return policy kindly and, if it fits the store's goodwill approach, offer a one-time exception.",
          "Flatly refuse the late return and simply quote the return policy rules back to the buyer in a cold and robotic way.",
          "Tell the buyer that the item is now their problem and that they are welcome to try to resell it themselves online.",
          "Report the buyer to eBay for daring to ask about a return a couple of days after the return window had closed."
        ], answer: 0 },

      { q: "The single most important trait of a great customer-service VA in this niche is:",
        options: [
          "Fast, empathetic, policy-aware replies that resolve issues without ever hurting the store's overall account health.",
          "The ability to win every argument with buyers so that the store almost never has to issue any refunds at all.",
          "A firm refusal to ever issue a refund to a buyer under any circumstances, no matter what the situation happens to be.",
          "Replying to every buyer message with the same long, heavily scripted paragraphs regardless of what they asked about."
        ], answer: 0 },

      { scenario: "Buyer messages you a link and says \"click here to confirm your seller details or your payout is frozen.\"",
        q: "Best action?",
        options: [
          "Do not click the link, treat it as a phishing attempt, and check your account status only through eBay directly.",
          "Click the link quickly, because you want to avoid having your seller payout frozen the way the message warns about.",
          "Go ahead and enter your login details on the linked page just to be safe and make sure your account stays active.",
          "Forward the suspicious link on to the store owner and suggest that they be the one to click it and confirm instead."
        ], answer: 0 }
    ],

    /* ==================== LISTING (10 · v1 starter) ==================== */
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

      { q: "For item specifics, the best practice is to:",
        options: [
          "Fill in every relevant specific accurately, such as brand, size, color, and MPN, to maximize your search visibility.",
          "Leave the item specifics section completely blank in order to save yourself some time while creating the listing.",
          "Copy the item specifics over from a totally unrelated product just so that the fields are not left empty at all.",
          "Only fill in the listing title carefully and skip the item specifics, since buyers rarely ever look at those anyway."
        ], answer: 0 },

      { q: "Which pricing approach fits the Amazon→eBay model best?",
        options: [
          "Price to cover the Amazon cost plus the eBay fees plus a target margin, and keep it monitored by a repricer.",
          "Match the Amazon price exactly with no margin at all so that your listing always looks like the cheapest option.",
          "Set the highest price that you possibly can and then simply never change it again no matter what the source does.",
          "Deliberately price the item below your own Amazon cost just to win the sale and beat out the competing sellers."
        ], answer: 0 },

      { q: "Listing photos for a dropshipped item should:",
        options: [
          "Be clean, accurate images of the actual product on a clear background that match what the buyer will receive.",
          "Show a different but noticeably nicer-looking product than the one that the buyer is actually going to receive.",
          "Include the watermarks of competing sellers, since reusing their existing product photos is faster than your own.",
          "Be intentionally blurry phone photos so that the listing comes across as more authentic and less corporate to buyers."
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

      { q: "A good item description for a dropship listing:",
        options: [
          "Clearly states the features, the new condition, and honest, realistic shipping and return expectations for the buyer.",
          "Openly reveals the Amazon source of the product along with the exact cost that the store paid to acquire the item.",
          "Promises the buyer guaranteed next-day delivery even though the dropship source cannot actually ship that quickly.",
          "Is simply left completely blank so that the person creating the listing can move on to the next item much faster."
        ], answer: 0 },

      { q: "When a listed item goes out of stock at the Amazon source, the lister should:",
        options: [
          "Promptly mark the item out of stock or end the listing so that no orders you cannot actually fulfill come in.",
          "Leave the listing live as it is and then simply cancel any orders that happen to come in for the missing item.",
          "Raise the price on the listing a lot to discourage buyers but still keep the out-of-stock item live on the store.",
          "Do nothing about it at all and just wait until an actual buyer complains before dealing with the stock problem."
        ], answer: 0 }
    ],

    /* ==================== SOURCING / SNIPING (10 · v1 starter) ==================== */
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

      { q: "A 'winner' with strong demand but only ~3% margin after fees is:",
        options: [
          "Usually not worth the account risk unless volume and reliability are excellent, since margin cushions the returns.",
          "Always worth listing right away, because a high enough sales volume ends up fixing just about every other problem.",
          "A clearly better item to list than one that offers you a much more comfortable fifteen percent profit margin.",
          "The ideal kind of product for a brand-new store to build its entire early catalog and reputation around from day one."
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

      { q: "Which sourcing habit best protects a store long-term?",
        options: [
          "Curating a catalog of reliable, compliant, healthy-margin items and steadily pruning the poor performers over time.",
          "Listing absolutely everything that is trending as quickly as you possibly can before any other sellers can do it.",
          "Chasing after viral brand-name products that carry real VERO risk because they tend to sell in very large numbers.",
          "Never removing any dead or unprofitable listings, so the store's total item count only ever grows and never shrinks."
        ], answer: 0 }
    ],

    /* ==================== ORDER FULFILLMENT (10 · v1 starter) ==================== */
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

      { q: "To protect against 'Item Not Received' cases, fulfillment should ensure:",
        options: [
          "Valid tracking is uploaded to eBay promptly and continues to update as the package moves toward the buyer.",
          "No tracking is ever added to the order, based on the idea that buyers then have no clear way to complain later.",
          "A completely fake tracking number is entered on the order just so that the tracking field does not sit empty.",
          "Tracking is only added about a week after the package has already been delivered to the buyer's shipping address."
        ], answer: 0 },

      { scenario: "The Amazon order will arrive in a branded Amazon box.",
        q: "Best practice to reduce buyer confusion?",
        options: [
          "Use gift options or plain packaging where available and set expectations, so it does not look like a mistake.",
          "Do nothing about it at all, based on the assumption that buyers really do not care what the shipping box looks like.",
          "Proactively tell the buyer up front that the store dropships every one of its orders directly from Amazon to them.",
          "Cancel any order that you are not able to ship inside a completely plain, unbranded box for whatever the reason."
        ], answer: 0 },

      { q: "A source item is now OUT OF STOCK after the eBay sale. Best action?",
        options: [
          "Find an equivalent reliable source at an acceptable cost, or if that's impossible, apologize and refund promptly.",
          "Leave the order sitting there unshipped and simply hope that the item eventually comes back into stock on its own.",
          "Ship some random substitute item to the buyer instead without telling them that it is not the product they ordered.",
          "Ignore the whole situation completely until the buyer opens an item-not-received case against the store's account."
        ], answer: 0 },

      { q: "Account health as a fulfillment VA is best protected by:",
        options: [
          "On-time shipping, valid tracking, a low cancellation rate, and a low defect rate across all of the store's orders.",
          "Cancelling any order at all that turns out to be unprofitable, regardless of how it affects the account's metrics.",
          "Deliberately delaying shipments so that you can batch all of the store's orders together and ship them once a week.",
          "Only ever uploading the tracking information after a buyer has already gone ahead and opened a case on the order."
        ], answer: 0 },

      { q: "A buyer cancels within minutes, before you place the Amazon order. Best action?",
        options: [
          "Accept the cancellation and refund the buyer, since nothing has shipped yet and the whole thing is still clean.",
          "Refuse the cancellation request and simply go ahead and ship the order out to the buyer anyway despite the message.",
          "Charge the buyer a restocking fee first and only then agree to actually cancel the order and process their refund.",
          "Ship the order out regardless and then plan to fight the buyer later if they decide to open a return on the item."
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

      { q: "The best routine for a fulfillment VA each shift is to:",
        options: [
          "Process new orders promptly, verify addresses, source at the right cost, upload tracking, and flag any problems.",
          "Only ship out the orders that happen to be highly profitable on that particular day and set the rest aside for later.",
          "Wait for each buyer to message and ask about their order first before actually going ahead and shipping anything.",
          "Batch every one of the store's orders together and only deal with all of them at the very end of the week at once."
        ], answer: 0 }
    ],

    /* ==================== VA MANAGER (10 · v1 starter, unlocks free) ==================== */
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

      { q: "Handling a buyer escalation the AI mishandled, the manager's priority is:",
        options: [
          "Resolve the buyer's problem first, and then fix the process that allowed the AI to fail in the first place.",
          "Fix the underlying AI problem first and simply let the frustrated buyer keep waiting until that work is finished.",
          "Refund the buyer in full and then ban them from the store so that they are unable to cause any more trouble later.",
          "Reassign the whole escalation to someone else on the team and then simply forget about the issue entirely after."
        ], answer: 0 },

      { q: "Which describes good delegation for a one-VA-plus-AI store?",
        options: [
          "Route the repeatable tasks to the right specialist or AI and keep the real judgment calls for the manager to handle.",
          "Do absolutely everything yourself just to be safe, rather than ever trusting a specialist or an AI with any of it.",
          "Delegate all of the difficult judgment calls straight to the AI and let it make those decisions without oversight.",
          "Never delegate a single task to anyone or anything, and instead keep the entire workload on the manager alone."
        ], answer: 0 },

      { q: "The manager's north star across all decisions should be:",
        options: [
          "Long-term account health and profitability with satisfied buyers, rather than reaching for any short-term shortcuts.",
          "Maximizing the total number of listings on the store at any cost, even when doing so puts the account at real risk.",
          "Winning every single buyer dispute that comes up, regardless of whether the buyer actually happens to be right.",
          "Minimizing refunds as much as possible even in the many cases where the buyer clearly deserves to get one."
        ], answer: 0 }
    ]
  };
})();
