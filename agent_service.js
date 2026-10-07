/**
 * SWEETY COLOUR DECORA — CONVERSATIONAL AI AGENT SERVICE
 * Bridges user chat with MindStudio/MindPal specs, pricing database,
 * and the client-side AI Design Studio.
 */

const fs = require('fs');
const path = require('path');
const { calculateProjectEstimate, loadPricingDatabase } = require('./cost_engine');

// Load environment variables from .env.local
function getApiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  try {
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('OPENAI_API_KEY=')) {
          const key = trimmed.replace('OPENAI_API_KEY=', '').trim().replace(/^["']|["']$/g, '');
          if (key && key !== 'your_actual_openai_api_key_here') return key;
        }
      }
    }
  } catch (e) {}
  return null;
}

// Load agent configuration
function loadAgentConfig() {
  const writableCfgPath = path.join('/tmp', 'agent_config.json');
  const cfgPath = process.env.VERCEL && fs.existsSync(writableCfgPath)
    ? writableCfgPath
    : path.join(__dirname, 'agent_config.json');
  try {
    if (fs.existsSync(cfgPath)) {
      return JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    }
  } catch (e) {}
  return { activeMode: 'native', modes: {} };
}

function saveAgentConfig(cfg) {
  const cfgPath = process.env.VERCEL
    ? path.join('/tmp', 'agent_config.json')
    : path.join(__dirname, 'agent_config.json');
  cfg.lastUpdated = new Date().toISOString();
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
  return cfg;
}

/**
 * Handle incoming conversational chat from the agent widget
 * @param {Object} payload { message, history, currentRoom, currentStyle, currentCity }
 */
async function processAgentChat(payload) {
  const userMsg = (payload.message || '').trim();
  const history = payload.history || [];
  const currentCity = payload.currentCity || 'Bengaluru';
  const currentRoom = payload.currentRoom || 'Living Room';
  const currentStyle = payload.currentStyle || 'Warm Minimalist';

  const pricingDb = loadPricingDatabase();
  const apiKey = getApiKey();

  // Check if user is asking for an estimate or mentioning area / square footage
  const areaMatch = userMsg.match(/(\d{2,4})\s*(sq\.?ft|sqft|square\s*feet|feet|sft)/i) ||
                    userMsg.match(/area\s*(?:of|is)?\s*(\d{2,4})/i) ||
                    userMsg.match(/(\d{2,4})\s*area/i);
  
  // Check if user mentions a city
  let detectedCity = currentCity;
  for (const city of Object.keys(pricingDb.cities)) {
    if (new RegExp('\\b' + city + '\\b', 'i').test(userMsg)) {
      detectedCity = city;
      break;
    }
  }

  // Check if user mentions a room
  let detectedRoom = currentRoom;
  const rooms = ['Living Room', 'Master Bedroom', 'Kitchen', 'Dining Area', 'Bathroom', 'Home Office'];
  for (const r of rooms) {
    if (new RegExp(r.replace('/', '|'), 'i').test(userMsg)) {
      detectedRoom = r;
      break;
    }
  }

  // Check if user mentions a style
  let detectedStyle = currentStyle;
  const styles = ['Warm Minimalist', 'Japandi', 'Modern Contemporary', 'Italian Neo-Classical', 'Industrial Loft', 'Scandinavian'];
  for (const s of styles) {
    if (new RegExp(s, 'i').test(userMsg)) {
      detectedStyle = s;
      break;
    }
  }

  let calculatedEstimate = null;
  let studioAction = null;

  if (areaMatch || /estimate|cost|quote|budget|how much|price/i.test(userMsg)) {
    const area = areaMatch ? parseInt(areaMatch[1], 10) : (pricingDb.defaultRoomSizes[detectedRoom] || 250);
    calculatedEstimate = calculateProjectEstimate({
      roomType: detectedRoom,
      areaSqFt: area,
      budgetRange: /luxury|premium|high-end/i.test(userMsg) ? 'Luxury' : (/economy|basic|refresh/i.test(userMsg) ? 'Economy' : 'Mid-Range'),
      city: detectedCity,
      changeScope: ['Flooring Systems', 'Painting & Surface Coating', 'POP & False Ceiling', 'Architectural Lighting']
    });

    studioAction = {
      type: 'APPLY_AND_SCROLL_STUDIO',
      label: 'Open Concept in AI Design Studio',
      params: {
        roomType: detectedRoom,
        style: detectedStyle,
        areaSqFt: area,
        city: detectedCity,
        expectedCost: calculatedEstimate.summary.expectedFormatted,
        range: calculatedEstimate.summary.rangeFormatted
      }
    };
  }

  // If OpenAI API key is available, generate dynamic response
  if (apiKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are the Senior Architectural Estimator & AI Consultant for Sweety Colour Decora, an Indian finishing contractor established in 2003 with ~100 daily tradespeople across 6 core trades (Painting, Flooring, POP, Putty, Granite, Italian Marble, Modular Joinery). GSTIN: 24AAAAA0000A1Z5.
Be concise, engineering-minded, courteous, and authoritative.
Reference real trade details (Asian Paints Royale, Saint-Gobain Gypsum, Italian Botticino/Statuario marble, Blum modular hardware).
${calculatedEstimate ? `Calculated Estimate details: Expected: ${calculatedEstimate.summary.expectedFormatted}, Range: ${calculatedEstimate.summary.rangeFormatted}, City: ${calculatedEstimate.city} (${pricingDb.cities[calculatedEstimate.city]}x index). Area: ${calculatedEstimate.areaSqFt} sq.ft.` : ''}
Mandatory Disclaimer to include if costs are mentioned: "This is an AI-generated preliminary estimate based on standard rate tables; final pricing requires physical laser measurement."`
        }
      ];

      // Add recent history
      for (const h of history.slice(-4)) {
        messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
      }
      messages.push({ role: 'user', content: userMsg });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          temperature: 0.35,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content;
        if (replyText) {
          return {
            success: true,
            reply: replyText,
            estimate: calculatedEstimate,
            action: studioAction
          };
        }
      }
    } catch (e) {
      console.warn('OpenAI agent call failed, falling back to calibrated architectural engine:', e.message);
    }
  }

  // Calibrated Architectural Fallback Engine
  return generateCalibratedAgentResponse(userMsg, detectedRoom, detectedStyle, detectedCity, calculatedEstimate, studioAction);
}

function generateCalibratedAgentResponse(userMsg, room, style, city, estimate, studioAction) {
  const lower = userMsg.toLowerCase();

  // 1. Cost & Estimation Questions
  if (estimate) {
    return {
      success: true,
      reply: `Based on Sweety Colour Decora's verified contractor rate schedule, a **${estimate.areaSqFt} sq.ft ${room}** in **${city}** (${style} specification) is estimated at **${estimate.summary.expectedFormatted}** (approximate range **${estimate.summary.rangeFormatted}**).

**Itemized Scope Included:**
• **Flooring Systems**: Vitrified / natural stone overlay (~${estimate.itemizedBreakdown.find(b=>b.key==='flooring')?.costFormatted || '₹60,000'})
• **Painting & Texture**: 2-coat primer, acrylic putty, luxury washable emulsion (~${estimate.itemizedBreakdown.find(b=>b.key==='painting')?.costFormatted || '₹37,000'})
• **POP False Ceiling**: Gypsum board framing with concealed ambient LED coves (~${estimate.itemizedBreakdown.find(b=>b.key==='false_ceiling')?.costFormatted || '₹43,000'})
• **Architectural Lighting**: Magnetic track profiles & COB spotlights (~${estimate.itemizedBreakdown.find(b=>b.key==='lighting')?.costFormatted || '₹65,000'})
• **Contingency Buffer**: 10% substrate prep & site variance buffer included.

*Note: ${estimate.disclaimer}*

Would you like to review the Before/After visualization in our AI Studio or schedule an on-site physical laser survey?`,
      estimate,
      action: studioAction
    };
  }

  // 2. Marble vs Tile
  if (/marble|tile|vitrified|granite|flooring/i.test(lower)) {
    return {
      success: true,
      reply: `In architectural finishing, the choice between **Italian Marble** and **Vitrified Tiles** depends on maintenance and spatial grandeur:

• **Italian Marble (e.g. Statuario, Botticino)**: Offers timeless continuous book-matched veining and a mirror-like diamond polish. Requires skilled zero-lippage epoxy laying and periodic crystallizer maintenance. Contractor cost: ₹380–₹650/sq.ft inclusive of diamond polishing.
• **Large-Format Vitrified Tiles (e.g. 4x2 ft or 6x4 ft GVT)**: Virtually zero porosity, stain-proof, and high scratch resistance. Ideal for high-traffic modern spaces at ₹140–₹220/sq.ft.

Sweety Colour Decora has executed over 500,000 sq.ft of Italian marble laying since 2003 with specialized Italian wet cutters.`,
      action: {
        type: 'SCROLL_SERVICES',
        label: 'View Flooring Trade Details'
      }
    };
  }

  // 3. False Ceiling & POP
  if (/false ceiling|pop|gypsum|cove|led/i.test(lower)) {
    return {
      success: true,
      reply: `For false ceilings, we strictly deploy **Saint-Gobain Gypsteel Ultra / Gyproc** framing systems:

• **Structural Stability**: 12.5mm moisture-resistant gypsum boards with anti-rust perimeter channels.
• **Lighting Channels**: Recessed magnetic architectural tracks and 3000K warm white continuous perimeter coves.
• **Contractor Costing**: Standard false ceiling runs at ₹110–₹160/sq.ft inclusive of GI framing, joint taping, and primer prep.

Would you like to model a false ceiling package for your room in the AI Studio?`,
      action: {
        type: 'APPLY_AND_SCROLL_STUDIO',
        label: 'Configure False Ceiling in Studio'
      }
    };
  }

  // 4. Booking Survey
  if (/survey|visit|inspect|meeting|contact|call|phone|book|appointment/i.test(lower)) {
    return {
      success: true,
      reply: `You can schedule a physical site visit with our senior site engineers directly! 

During the visit, our team conducts:
1. Precision laser perimeter and ceiling height measurement.
2. Substrate moisture, plumb-line, and crack assessment.
3. Formal Bill of Quantities (BOQ) with guaranteed contractor timelines.

Click below to confirm your site appointment:`,
      action: {
        type: 'OPEN_CONSULTATION_MODAL',
        label: 'Schedule Site Laser Survey'
      }
    };
  }

  // 5. General Overview & Help
  return {
    success: true,
    reply: `Sweety Colour Decora is a premier finishing and construction contracting firm established in 2003, deploying ~100 daily tradespeople across painting, flooring, POP false ceilings, putty skim coating, granite, and marble.

How can I help you today?
• **Calculate an indicative cost** for your room (e.g. *"Estimate 300 sq.ft living room in Bengaluru"*)
• **Compare finishes** (e.g. *"Italian marble vs vitrified tiles"*)
• **Explore design aesthetics** (*Warm Minimalist*, *Japandi*, *Italian Neo-Classical*)
• **Book an on-site physical laser survey** with a senior engineer.`,
    action: {
      type: 'APPLY_AND_SCROLL_STUDIO',
      label: 'Launch AI Design Studio'
    }
  };
}

module.exports = {
  processAgentChat,
  loadAgentConfig,
  saveAgentConfig
};
