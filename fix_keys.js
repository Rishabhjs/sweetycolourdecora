const fs = require('fs');

const filePath = 'C:\\Users\\SRUSHTI SHAH\\.gemini\\antigravity\\scratch\\sweety-colour-decora\\cost_engine.js';
let content = fs.readFileSync(filePath, 'utf8');

const oldAddItems = `  // 1. Flooring
  if (includesTrade('Flooring')) {
    addItem('flooring_vitrified', 'Vitrified Slab Flooring & Grouting', 'sqft', area, 'carpentry');
  }

  // 2. Wall finishes & paint
  if (includesTrade('Walls') || includesTrade('Painting')) {
    const wallArea = Math.round(area * 3.2); // Wall perimeter multiplier
    addItem('painting_royale', 'Wall Surface Prep & Luxury Emulsion', 'sqft', wallArea, 'carpentry');
  }

  // 3. Ceiling & POP
  if (includesTrade('Ceiling')) {
    addItem('false_ceiling_gypsum', 'Gypsum False Ceiling & Cove Framing', 'sqft', area, 'carpentry');
  }

  // 4. Lighting & Electrical
  if (includesTrade('Lighting') || includesTrade('Electrical')) {
    const pointsCount = Math.max(12, Math.round(area / 18));
    addItem('electrical_points', 'Architectural Concealed Lighting & Profiles', 'points', pointsCount, 'electrical');
  }

  // 5. Modular Kitchen
  if (includesTrade('Kitchen')) {
    const kitchenRft = Math.max(14, Math.round(area * 0.12));
    addItem('modular_kitchen_acrylic', 'Modular Kitchen Cabinets & Counter Dado', 'rft', kitchenRft, 'kitchen');
  }

  // 6. Wardrobes & Joinery
  if (includesTrade('Wardrobes') || includesTrade('Furniture')) {
    const wardrobeSqft = Math.max(65, Math.round(area * 0.35));
    addItem('wardrobes_pu', 'Bespoke Wardrobes & Architectural Joinery', 'sqft', wardrobeSqft, 'wardrobes');
  }`;

const newAddItems = `  // 1. Flooring
  if (includesTrade('Flooring')) {
    addItem('flooring', 'Flooring Systems', 'sqft', area, 'carpentry');
  }

  // 2. Wall finishes & paint
  if (includesTrade('Walls') || includesTrade('Painting')) {
    const wallArea = Math.round(area * 3.2);
    addItem('painting', 'Painting & Surface Coating', 'sqft', wallArea, 'carpentry');
  }

  // 3. Ceiling & POP
  if (includesTrade('Ceiling')) {
    addItem('false_ceiling', 'POP & False Ceilings', 'sqft', area, 'carpentry');
  }

  // 4. Lighting
  if (includesTrade('Lighting')) {
    addItem('lighting', 'Architectural Lighting', 'fixed', 1, 'electrical');
  }

  // 5. Electrical
  if (includesTrade('Electrical')) {
    addItem('electrical', 'Electrical & Automation', 'fixed', 1, 'electrical');
  }

  // 6. Modular Kitchen
  if (includesTrade('Kitchen')) {
    addItem('modular_kitchen', 'Modular Kitchen', 'fixed', 1, 'kitchen');
  }

  // 7. Wardrobes
  if (includesTrade('Wardrobes')) {
    const wardrobeSqft = Math.max(60, Math.round(area * 0.35));
    addItem('wardrobes', 'Wardrobes & Joinery', 'sqft', wardrobeSqft, 'wardrobes');
  }

  // 8. Furniture
  if (includesTrade('Furniture')) {
    addItem('furniture', 'Custom Architectural Furniture', 'fixed', 1, 'furniture');
  }`;

content = content.replace(oldAddItems, newAddItems);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed item keys in cost_engine.js');
