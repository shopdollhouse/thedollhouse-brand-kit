export interface BrandIdentity {
  colours: { c: string; n: string; use: string; why: string }[];
  typo: string;
  typoWhy: string;
  logo: string;
  logo2: string;
  voice: string;
  voiceGuidelines: string[];
  moodboard: string;
  designDo: string[];
  designDont: string[];
  premiumNote: string;
}

export function getBrandIdentity(aesthetic: string, vibe: string, budget: string, customer: string, product: string): BrandIdentity {
  const isPremium = budget === '$200+';
  const isDigital = vibe === 'Digital products';
  const isService = vibe === 'Service / Events';
  const isHandmade = vibe === 'Handmade / Physical';
  const isMale = customer.toLowerCase().includes('men') || customer.toLowerCase().includes('business owner');
  const isYouth = customer.toLowerCase().includes('young');
  const prod = (product || 'your product').toLowerCase();
  let colours: BrandIdentity['colours'], typo: string, typoWhy: string, logo: string, logo2: string, voice: string, voiceGuidelines: string[], moodboard: string, designDo: string[], designDont: string[], premiumNote: string;

  if (aesthetic === 'Soft & feminine') {
    if (isDigital && isPremium) {
      colours = [
        { c: '#FAF0EC', n: 'Porcelain', use: 'Page backgrounds, section fills', why: `Creates a warm, inviting base that makes ${customer} feel comfortable and welcomed — not sterile or corporate.` },
        { c: '#D4A5A0', n: 'Dusty Rose', use: 'CTAs, highlights, key accents', why: 'A sophisticated take on pink — grown-up, editorial, and instantly recognisable as feminine without being juvenile.' },
        { c: '#8C5A58', n: 'Antique Mauve', use: 'Secondary text, hover states', why: 'Adds depth and richness. Works as a quiet counterpoint to the softness — grounded without being heavy.' },
        { c: '#2A1518', n: 'Plum Noir', use: 'Headlines, footer, strong contrast', why: 'Replaces harsh black. Provides all the contrast you need while staying true to the warm, feminine palette.' },
      ];
      typo = 'Playfair Display + DM Sans';
      typoWhy = `Playfair brings editorial elegance — ${customer} associate serif fonts with trust and expertise. DM Sans is clean and modern for body text, ensuring readability on screens where ${customer} will be buying.`;
      logo = 'Elegant italic serif wordmark with a thin crescent or arch motif above the name. Premium and editorial — unmistakably female-led.';
      logo2 = 'Monogram lettermark in a circle with hairline rules above and below.';
    } else if (isHandmade) {
      colours = [
        { c: '#FDF0EA', n: 'Cream Blush', use: 'Backgrounds, packaging base', why: `Warm off-white that feels handmade and artisanal — ${customer} associate this warmth with care and quality.` },
        { c: '#C4A89A', n: 'Rose Sand', use: 'Borders, secondary elements', why: `A muted, natural tone that echoes raw materials and craft — perfect for a ${prod} brand that values authenticity.` },
        { c: '#A07868', n: 'Dusty Terracotta', use: 'Accent details, price tags', why: 'Earthy warmth that grounds the palette. Creates visual anchors without competing with your product photography.' },
        { c: '#1e0f09', n: 'Espresso', use: 'All body text, primary contrast', why: 'Deep, warm dark that reads as sophisticated rather than harsh. Your text will feel handwritten, not printed.' },
      ];
      typo = 'Cormorant Garamond + Jost';
      typoWhy = `Cormorant Garamond has the intimacy of a handwritten letter — it tells ${customer} this brand has a story. Jost provides the clean structure needed for pricing, labels, and navigation.`;
      logo = 'Hand-drawn serif wordmark with a soft botanical — a single stem, pressed flower, or leaf. Should feel like it was stamped on tissue paper by hand.';
      logo2 = 'A minimal arch or oval wrapping the brand name. Clean enough for stickers, pretty enough to stand alone.';
    } else {
      colours = [
        { c: '#F9EBE7', n: 'Blush Petal', use: 'Backgrounds, email headers', why: `The first thing ${customer} see sets the tone. This warm blush says "you're in the right place" before they read a word.` },
        { c: '#C9A99B', n: 'Mauve Sand', use: 'Buttons, underlines, icons', why: 'Soft enough to feel approachable, strong enough to draw the eye to your CTAs. Converts without shouting.' },
        { c: '#9C6E64', n: 'Rose Umber', use: 'Subheadings, decorative rules', why: 'Adds hierarchy and depth. Helps the eye navigate without aggressive colour contrast.' },
        { c: '#1e0f09', n: 'Espresso', use: 'Body text, strong headlines', why: 'Warm alternative to black that maintains the soft aesthetic while ensuring complete readability.' },
      ];
      typo = 'Cormorant Garamond + DM Sans';
      typoWhy = `Cormorant Garamond makes ${prod} feel curated and intentional. DM Sans keeps everything readable and professional. Together they say: "beautiful and trustworthy."`;
      logo = `Delicate serif wordmark with soft rounded curves. Feels personal and warm — like a letter signed with love. Perfect for ${prod}.`;
      logo2 = 'Thin script initials inside a soft circle. Scales well on product labels and bio icons.';
    }
    voice = `Gentle, encouraging, and intimate. Write like a trusted friend — warm without being saccharine. ${customer} should feel seen and held, not sold to. Use "you" more than "I".`;
    voiceGuidelines = [
      'Tone: Nurturing and personal — like a handwritten note tucked into a package',
      'Sentence length: Medium. Let thoughts breathe. One idea per sentence.',
      'Words to use: "made for you", "with care", "just for", "because you deserve"',
      'Words to avoid: "SALE", "BUY NOW", "limited time" — urgency kills the softness',
      `Power phrase: "We made ${prod} because ${customer} deserve something beautiful."`,
    ];
    moodboard = `Soft morning light on linen, dried flowers in a ceramic vase, handwritten notes tucked into tissue paper. Every touchpoint for your ${prod} brand should feel considered and quiet. Think: a slow Sunday morning, not a busy Monday.`;
    designDo = ['Use generous white space — crowding kills the softness', 'Stick to one accent colour per layout', 'Always use real photography, never clip art or stock clichés', 'Round corners on cards and images (12–20px) for approachability'];
    designDont = ['Never use harsh black — use your darkest palette colour instead', 'Avoid bold chunky fonts — they fight the aesthetic', 'Never centre-align long paragraphs — it strains the eye', 'Don\'t use neon or saturated colours — they clash with softness'];
    premiumNote = isPremium
      ? `With your $200+ budget, invest in custom brand photography and a professional Canva template set. Your aesthetic demands visual consistency — and ${customer} will notice the difference between DIY and intentional. Consider commissioning a watercolour logo from a freelance illustrator ($80–$150).`
      : '';

  } else if (aesthetic === 'Bold & editorial') {
    if (isPremium) {
      colours = [
        { c: '#EDECE8', n: 'Parchment', use: 'Light backgrounds, breathing room', why: `Slightly warm white that gives editorial weight. ${customer} associate this tone with magazines and premium publications.` },
        { c: '#C4874A', n: 'Burnt Sienna', use: 'Key accents, CTA buttons', why: 'A bold, warm accent that commands attention without being aggressive. Converts because it stands out from the neutral palette.' },
        { c: '#8A5A28', n: 'Burnished Oak', use: 'Supporting type, hover states', why: 'Adds editorial depth. Works as a secondary accent that reinforces the premium, established feeling.' },
        { c: '#1C1814', n: 'Ink', use: 'All headlines and body copy', why: 'Near-black with warmth. Prints beautifully and reads as authoritative on screen — exactly how bold brands build trust.' },
      ];
      typo = 'Libre Baskerville + Plus Jakarta Sans';
      typoWhy = `Libre Baskerville is the font equivalent of walking into a room with confidence. ${customer} trust bold, established typography. Plus Jakarta Sans provides modern readability that doesn't compete with the headlines.`;
      logo = 'A strong editorial serif wordmark — uppercase, wide-tracked, confident. The kind of logo that prints on a matte black business card and turns heads.';
      logo2 = 'A horizontal logo lock-up with a thin rule separating the brand name from a short descriptor line below.';
    } else if (isMale) {
      colours = [
        { c: '#F2EDE8', n: 'Warm White', use: 'Page backgrounds, breathing room', why: 'Clean without being sterile. Gives masculine brands the space to breathe while staying warm.' },
        { c: '#B5956A', n: 'Bronze', use: 'Key accents, hover states', why: `Bronze signals quality and permanence — ${customer} associate metallic tones with tools, leather, and craftsmanship.` },
        { c: '#6B4A28', n: 'Dark Cognac', use: 'Secondary calls to action', why: 'Deep amber that adds richness. Works beautifully in dark mode and on business cards.' },
        { c: '#1A1008', n: 'Midnight Brown', use: 'All text and primary elements', why: 'Near-black with amber warmth. Reads as strong and grounded — never cold or corporate.' },
      ];
      typo = 'Bebas Neue + Plus Jakarta Sans';
      typoWhy = `Bebas Neue is unapologetically bold — it says "I'm here and I'm serious." ${customer} respect brands that don't apologise for taking up space. Plus Jakarta Sans balances this with clean, trustworthy body text.`;
      logo = 'Strong all-caps wordmark, tight letter-spacing, no decoration. Confidence in simplicity — the name is the brand.';
      logo2 = 'A bold monogram in a square or circle. Works as a stamp, favicon, or embossed detail.';
    } else {
      colours = [
        { c: '#EDECE8', n: 'Parchment', use: 'Backgrounds, light sections', why: `A warm editorial base that ${customer} subconsciously associate with quality publications and curated spaces.` },
        { c: '#C4874A', n: 'Terracotta', use: 'Primary accent, button colour', why: 'Bold enough to demand attention, warm enough to feel human. The perfect CTA colour for an editorial brand.' },
        { c: '#8A5A28', n: 'Burnished Oak', use: 'Secondary details, borders', why: 'Provides visual hierarchy without introducing new colour energy. Keeps the palette tight and intentional.' },
        { c: '#1C1814', n: 'Ink', use: 'All body text and headlines', why: 'Strong, authoritative, and warm. The backbone of every editorial brand.' },
      ];
      typo = 'Libre Baskerville + Plus Jakarta Sans';
      typoWhy = `Libre Baskerville says "I know what I'm doing." ${customer} trust brands that look established. Plus Jakarta Sans handles the detail work — pricing, descriptions, navigation — with effortless clarity.`;
      logo = 'A strong serif wordmark, all-caps or sentence case. No icon needed — the typography does all the work.';
      logo2 = 'A horizontal logo lock-up with a thin rule separating brand name from a short descriptor line below.';
    }
    voice = `Direct, confident, and a little provocative. Short sentences. No filler. ${customer} respect boldness — speak to them as equals, not as a salesperson. Make a point. Move on.`;
    voiceGuidelines = [
      'Tone: Confident and sharp — like a friend who always gives you the truth',
      'Sentence length: Short. Punchy. No wasted words.',
      'Words to use: "built for", "designed to", "without compromise", "the standard"',
      'Words to avoid: "please", "maybe", "just" — hedging kills authority',
      `Power phrase: "${prod} isn't for everyone. It's for ${customer} who demand better."`,
    ];
    moodboard = `Strong shadows, editorial photo crops, bold type treatments, raw paper and metal textures. Nothing about your ${prod} brand apologises for existing. Think: Kinfolk meets The Row.`;
    designDo = ['Use high contrast — light background, dark type, one bold accent', 'Let type do the heavy lifting — no need for excessive decoration', 'Crop product photos dramatically — close-ups, angles, unexpected perspectives', 'Use negative space aggressively — emptiness is a luxury signal'];
    designDont = ['Never use more than 2 fonts — editorial restraint is the whole point', 'Avoid pastel accents — they undermine the confidence of the aesthetic', 'Never use centred layouts for body copy — left-aligned reads as authoritative', 'Don\'t add emoji to marketing copy — it dilutes the editorial voice'];
    premiumNote = isPremium
      ? `With your $200+ budget, invest in professional product photography with dramatic lighting and editorial styling. Commission a typographer for a custom wordmark ($150–$300). Your brand should look like it's been running for years on day one. Consider matte black packaging with foil stamping.`
      : '';

  } else if (aesthetic === 'Clean & minimal') {
    if (isPremium && isService) {
      colours = [
        { c: '#F8F6F3', n: 'Warm White', use: 'Page backgrounds, spacious layouts', why: `Barely-there warmth that prevents the sterile feeling of pure white. ${customer} associate this restraint with luxury services.` },
        { c: '#C8BAA8', n: 'Warm Stone', use: 'Borders, subtle dividers', why: 'Structure without visual noise. Guides the eye without demanding attention — the hallmark of premium design.' },
        { c: '#A89880', n: 'Taupe', use: 'Secondary text, quiet accents', why: 'A sophisticated neutral that adds warmth to the minimal palette without introducing colour.' },
        { c: '#1A1410', n: 'Espresso', use: 'All primary text and headings', why: 'Warm near-black that reads as refined rather than corporate. Every word feels intentional.' },
      ];
      typo = 'Fraunces + Jost';
      typoWhy = `Fraunces is a "wonky" serif — minimal but with personality. It tells ${customer} your service is premium but approachable. Jost is geometric and clean, perfect for pricing and form fields.`;
      logo = 'A refined monogram or single-word logotype in a carefully spaced serif. Understated luxury — less is everything.';
      logo2 = 'Brand name in a thin serif with extended letter-spacing. No icon. The restraint is the luxury signal.';
    } else if (isDigital) {
      colours = [
        { c: '#F5F4F2', n: 'Cloud', use: 'All backgrounds and surfaces', why: `Digital products need breathing room. This warm off-white gives your ${prod} space to be the star without visual competition.` },
        { c: '#C8C8C0', n: 'Ash', use: 'Borders, dividers, quiet UI elements', why: 'Functional without being invisible. Creates structure in layouts where content density could overwhelm.' },
        { c: '#A0A098', n: 'Stone', use: 'Secondary text, muted icons', why: 'Establishes clear visual hierarchy. Helps users scan your product pages efficiently.' },
        { c: '#1C1C1A', n: 'Charcoal', use: 'All primary text, headlines', why: 'Maximum contrast for readability on screens. Your product descriptions need to be effortlessly legible.' },
      ];
      typo = 'Inter + Jost';
      typoWhy = `Inter was literally designed for screens — it's the most readable sans-serif available. For ${prod}, readability converts to sales. Jost adds geometric personality to headlines without sacrificing clarity.`;
      logo = `Clean sans-serif wordmark for ${prod} — works at 16px on screen and large format print. Scalability is the entire brief.`;
      logo2 = 'A geometric icon mark — a simple shape that represents your core concept — paired with the wordmark in a horizontal lock-up.';
    } else {
      colours = [
        { c: '#F7F5F2', n: 'Ivory', use: 'Backgrounds, packaging base', why: `Warm ivory says "considered" not "cheap." ${customer} notice when backgrounds feel intentional rather than default white.` },
        { c: '#D4CFC8', n: 'Linen', use: 'Subtle borders, card backgrounds', why: 'Barely-there texture that adds depth without pattern. Gives layouts dimension while maintaining simplicity.' },
        { c: '#B8B0A8', n: 'Warm Grey', use: 'Supporting text, quiet details', why: 'The invisible workhorse — guides users through your content without demanding attention.' },
        { c: '#1A1A18', n: 'Near Black', use: 'All type, primary contrast', why: 'Clean, professional, and unmistakable. Every word lands with clarity.' },
      ];
      typo = 'Fraunces + DM Sans';
      typoWhy = `Fraunces brings just enough personality to prevent your minimal brand from feeling cold. DM Sans handles body text with the kind of quiet efficiency that ${customer} appreciate without noticing.`;
      logo = 'A geometric wordmark with precise, generous spacing. Nothing decorative — the restraint is the aesthetic.';
      logo2 = 'Brand name with a thin horizontal rule underneath. Clean, intentional, and professional without being corporate.';
    }
    voice = `Clear, considered, and effortless. Concise copy that never tries too hard. Write one sentence where others write five. ${customer} will feel respected by brevity. Never over-explain.`;
    voiceGuidelines = [
      'Tone: Calm and precise — like an architect explaining their work',
      'Sentence length: Short to medium. Every word earns its place.',
      'Words to use: "designed", "intentional", "essential", "refined"',
      'Words to avoid: "amazing", "incredible", "game-changer" — superlatives feel noisy',
      `Power phrase: "${prod}. Nothing more, nothing less."`,
    ];
    moodboard = `Generous white space, single-product photography on plain backgrounds, muted tones with one intentional accent. Every element in your ${prod} brand earns its place or gets removed. Think: Aesop meets Muji.`;
    designDo = ['Let white space breathe — resist the urge to fill every corner', 'Use a single accent colour applied sparingly for maximum impact', 'Keep photography clean — plain backgrounds, natural light, no filters', 'Align everything to a grid — precision is the aesthetic'];
    designDont = ['Never use drop shadows or gradients — they break the minimal feel', 'Avoid decorative fonts — one clean serif and one clean sans is all you need', 'Never add texture or pattern for decoration — every element must serve a purpose', 'Don\'t use more than 3 colours in any single layout'];
    premiumNote = isPremium
      ? `With your $200+ budget, invest in a professional brand guidelines PDF that locks in your visual system. Commission product photography with a single background ($100–$200). Your aesthetic requires absolute consistency — every image, every font, every spacing decision should feel like the same hand designed it.`
      : '';

  } else if (aesthetic === 'Warm & earthy') {
    if (isPremium) {
      colours = [
        { c: '#EDE2D0', n: 'Warm Linen', use: 'Primary backgrounds, packaging', why: `This warm base immediately tells ${customer} your brand values naturalness and intention. It's the visual equivalent of "handmade with care."` },
        { c: '#C8A878', n: 'Golden Oat', use: 'Borders, dividers, warm accents', why: 'Golden warmth that feels like afternoon sun. Creates a cocooning effect that makes people want to stay and browse.' },
        { c: '#A07848', n: 'Amber', use: 'CTAs, highlights, buttons', why: `Earthy amber converts because it feels natural and trustworthy. ${customer} are more likely to click something that doesn't scream "ad."` },
        { c: '#2A1A08', n: 'Dark Soil', use: 'All text, strong contrast elements', why: 'Deep earth tone that grounds every page. Reads as wise, established, and rooted — exactly the trust signal your brand needs.' },
      ];
      typo = 'Cormorant Garamond + Jost';
      typoWhy = `Cormorant Garamond has the gravitas of a hand-printed book — ${customer} associate serif fonts with heritage and trust. Jost provides clean, modern structure for UI elements where readability matters most.`;
      logo = `A refined botanical badge or crest-style mark for your ${prod} brand — like it could be stamped in wax. Premium, handcrafted, irreplaceable.`;
      logo2 = 'A clean serif wordmark with a thin botanical element running beneath it — a branch or single leaf. Elegant and story-driven.';
    } else if (isHandmade) {
      colours = [
        { c: '#EAD8C0', n: 'Oat', use: 'Page backgrounds, product photography base', why: `Natural warmth that complements ${prod} photography without competing. ${customer} will feel like they're browsing a curated market stall.` },
        { c: '#C8A880', n: 'Honey', use: 'Warm accents, category dividers', why: 'Sweet, inviting accent that draws the eye gently. Works beautifully on packaging labels and social templates.' },
        { c: '#9A7048', n: 'Clay', use: 'CTAs, buttons, active states', why: 'Earthy and decisive — gives your buttons authority without breaking the warm palette. Converts because it feels trustworthy.' },
        { c: '#2A1A0A', n: 'Bark', use: 'All body text and headings', why: 'Deep, rich brown that reads as organic and handcrafted. Every line of text feels like it was written by hand.' },
      ];
      typo = 'Playfair Display + DM Sans';
      typoWhy = `Playfair Display tells ${customer} this is a brand with a story worth reading. DM Sans handles the practical details — pricing, descriptions, shipping info — with unobtrusive clarity.`;
      logo = `Hand-drawn or textured wordmark for ${prod} with a botanical element — leaf, branch, or organic shape. Should feel like it grew from the earth.`;
      logo2 = 'A circular badge with the brand name inside and a simple botanical ring. Works as a sticker, product label, and social avatar.';
    } else {
      colours = [
        { c: '#F2E8D8', n: 'Oat', use: 'Backgrounds, card fills', why: `Warm foundation that tells ${customer} they're in a space that values natural beauty and honest craft.` },
        { c: '#C4A87A', n: 'Warm Wheat', use: 'Subtle accents, icon fills', why: 'Golden mid-tone that bridges light and dark elements. Creates cohesion across your entire visual system.' },
        { c: '#9A7848', n: 'Toffee', use: 'Buttons, active states', why: 'Rich warmth that commands attention without aggression. The colour of action in an earthy palette.' },
        { c: '#2A1C08', n: 'Dark Earth', use: 'All text, primary contrast', why: 'Grounded and wise. The deepest tone in your palette provides all the contrast you need.' },
      ];
      typo = 'Cormorant Garamond + DM Sans';
      typoWhy = `Cormorant Garamond evokes the feeling of handwritten letters and artisan labels. ${customer} are drawn to brands that feel personal and rooted. DM Sans keeps the functional elements clean.`;
      logo = 'Textured badge-style logo with a hand-stamped or carved aesthetic. Earthy, roots-forward, and story-driven.';
      logo2 = 'A flowing script brand name with a small organic element — a seed, sprig, or fingerprint texture. Intimate and handmade in feeling.';
    }
    voice = `Slow, tactile, and story-led. Write like you are inviting someone into your home. Sensory language, values-forward, community-rooted. ${customer} buy the feeling and the story — not just the ${prod}.`;
    voiceGuidelines = [
      'Tone: Nurturing and grounded — like a conversation over herbal tea',
      'Sentence length: Flowing and unhurried. Let stories unfold naturally.',
      'Words to use: "rooted", "crafted", "gathered", "nourished", "with intention"',
      'Words to avoid: "disrupting", "scaling", "optimising" — tech-speak kills the warmth',
      `Power phrase: "Every ${prod} is made with the kind of care that ${customer} can feel."`,
    ];
    moodboard = `Golden-hour photography, raw linen, clay textures, beeswax candles, and a farmers market ease. Every touchpoint for your ${prod} brand should feel unhurried, intentional, and made with hands. Think: a cottage kitchen at sunset.`;
    designDo = ['Use warm, natural light in every photo — avoid studio flash or cool tones', 'Incorporate texture in layouts — paper grain, linen overlays, organic shapes', 'Show the making process — behind-the-scenes content builds enormous trust', 'Use rounded, organic shapes for frames and containers'];
    designDont = ['Never use cold greys or clinical white backgrounds — they kill the warmth', 'Avoid overly polished, plastic-looking product shots', 'Never use thin modern sans-serif fonts — they fight the handcrafted feel', 'Don\'t use stock photography — authenticity is everything'];
    premiumNote = isPremium
      ? `With your $200+ budget, invest in a golden-hour product photography session ($100–$200) and custom wax seals or kraft packaging ($50–$80). Commission a hand-drawn logo from a botanical illustrator. Your brand should look like it belongs in a curated boutique — because that's exactly how ${customer} will discover you.`
      : '';

  } else {
    // Playful & colourful
    if (isYouth) {
      colours = [
        { c: '#FFF0E8', n: 'Peach Fizz', use: 'Backgrounds, light sections', why: `Warm, energetic base that feels like a summer afternoon. ${customer} respond to warmth — it's inviting without being overwhelming.` },
        { c: '#FFB8A0', n: 'Melon', use: 'Soft accents, card backgrounds', why: 'Playful mid-tone that adds depth without heaviness. Works beautifully in Instagram grids and TikTok thumbnails.' },
        { c: '#FF8C6B', n: 'Coral', use: 'CTAs, buttons, active highlights', why: `Energetic and clickable — ${customer} are drawn to warm, vibrant CTAs. This colour says "fun" and "do it now" simultaneously.` },
        { c: '#2A1040', n: 'Deep Violet', use: 'All text, strong contrast', why: 'Unexpected dark that makes the warm palette pop. More interesting than black, more playful than grey.' },
      ];
      typo = 'Nunito + Plus Jakarta Sans';
      typoWhy = `Nunito is round, friendly, and approachable — it tells ${customer} your brand is fun before they read a single word. Plus Jakarta Sans adds just enough structure for credibility.`;
      logo = `Rounded wordmark for ${prod} with a bouncy companion icon — something that moves on the page. Energetic, joyful, and Gen-Z coded.`;
      logo2 = 'An abstract doodle-style icon mark — imperfect, hand-feeling, and immediately likeable as a profile picture.';
    } else if (isDigital) {
      colours = [
        { c: '#F0F4FF', n: 'Lavender Mist', use: 'Backgrounds, breathing room', why: `Cool lavender signals creativity and innovation. ${customer} associate this with digital-first brands that feel modern and fresh.` },
        { c: '#B8AEFF', n: 'Soft Violet', use: 'Borders, soft highlights', why: 'Gentle accent that adds visual interest without overwhelming. Perfect for card borders and subtle UI elements.' },
        { c: '#7B6BFF', n: 'Electric Violet', use: 'CTAs, key accents, hover', why: 'Bold and unmissable — the action colour in your palette. High contrast against the light background drives clicks.' },
        { c: '#1A1030', n: 'Deep Ink', use: 'All body text, headlines', why: 'Purple-tinted dark that ties the whole palette together. More cohesive than pure black.' },
      ];
      typo = 'Nunito + DM Sans';
      typoWhy = `Nunito's rounded forms make ${prod} feel friendly and approachable — essential for digital products where ${customer} need to trust before they buy. DM Sans handles the details with clean professionalism.`;
      logo = `A bold, playful wordmark for ${prod} with a pop of colour. Stands out in a grid feed and feels effortlessly fun and modern.`;
      logo2 = 'A simple geometric badge in the accent colour — single letter or abstract mark. Doubles as an app icon and product watermark.';
    } else {
      colours = [
        { c: '#FFFBE8', n: 'Buttercream', use: 'Backgrounds, light surface fills', why: `Warm, sunny base that makes ${customer} feel happy before they even start browsing. First impressions are emotional.` },
        { c: '#FFD97D', n: 'Lemon Drop', use: 'Soft accents, hover backgrounds', why: 'Joyful yellow that adds energy without overwhelming. Works as a secondary layer that keeps layouts dynamic.' },
        { c: '#FFB347', n: 'Mango', use: 'Buttons, CTAs, active elements', why: `Warm, appetising orange that drives action. ${customer} are statistically more likely to click warm-toned buttons.` },
        { c: '#1A2A10', n: 'Forest', use: 'All text, high contrast elements', why: 'Deep green that reads as natural and trustworthy. A refreshing alternative to black that supports the playful palette.' },
      ];
      typo = 'Nunito + Plus Jakarta Sans';
      typoWhy = `Nunito's friendly rounded letterforms match the playful energy of your ${prod} brand. ${customer} will feel welcomed and energised. Plus Jakarta Sans keeps navigation and pricing professional.`;
      logo = `Playful rounded wordmark or illustrated icon + wordmark combination for ${prod}. Approachable, fun, and impossible to forget.`;
      logo2 = 'A small illustrated character or object that represents your brand personality — works as a sticker, watermark, and social icon.';
    }
    voice = `Fun, warm, and unapologetically enthusiastic. Use humour to disarm, then charm. ${customer} want to feel good just reading your captions. Exclamation points are allowed. Emoji are earned.`;
    voiceGuidelines = [
      'Tone: Energetic and playful — like your most fun friend who also runs a business',
      'Sentence length: Short and punchy. Use line breaks for drama.',
      'Words to use: "obsessed", "you need this", "drop everything", "finally"',
      'Words to avoid: "bespoke", "artisanal", "curated" — too serious for this vibe',
      `Power phrase: "You know that feeling when you find exactly the right ${prod}? That's this."`,
    ];
    moodboard = `Bright studio photography, bold colour-blocking, oversized typography, and an energy that makes people smile before they even read the caption. Your ${prod} brand should feel like a good day. Think: Glossier meets Duolingo.`;
    designDo = ['Lead with colour — it should hit before words do', 'Use rounded corners and organic shapes — they feel approachable and friendly', 'Photograph products against coloured backgrounds that complement the palette', 'Use stickers, badges, and hand-drawn elements for personality'];
    designDont = ['Never use too many colours at once — pick 2 accent colours max per layout', 'Avoid serif fonts — they read as serious and fight the playful energy', 'Never use stock smiling-woman imagery — it kills the personality instantly', 'Don\'t overdo the fun — every layout needs one calm, resting area for the eye'];
    premiumNote = isPremium
      ? `With your $200+ budget, invest in a custom illustration set ($100–$200) and branded Canva templates. Commission an illustrated mascot or character that becomes your brand's personality on social. ${customer} remember characters — they share them, screenshot them, and tag their friends.`
      : '';
  }

  return { colours, typo, typoWhy, logo, logo2, voice, voiceGuidelines, moodboard, designDo, designDont, premiumNote };
}
