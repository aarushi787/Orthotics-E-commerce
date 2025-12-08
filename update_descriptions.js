const fs = require('fs');
const path = require('path');

// Read the products file
const filePath = path.join(__dirname, 'products-updated.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Define premium descriptions
const premiumDescriptions = {
  "MDL-104": "Universal neoprene abdominal binder delivering comprehensive support and pain relief across all body types. Durable elastic construction provides consistent compression therapy suitable for post-operative care, chronic pain management, and core stabilization. Use cases: post-surgical support, weight management, chronic pain, daily wear. Medical benefits: uniform compression reduces swelling, supports muscle recovery, improves core stability, alleviates pain. Sizing: Universal/S-XL. Care: Machine washable, air dry. Who should use: Post-operative patients, those with core instability. Caution: Consult physician if experiencing sharp pain.",
  
  "MDL-036": "Adjustable mesh cervical collar providing professional-grade neck support and stabilization for various cervical conditions. Featuring breathable mesh fabric construction, this collar restricts harmful neck movement while maintaining comfort during extended wear. Ideal for treating whiplash injuries, cervical strain, arthritis, and post-surgical recovery. The adjustable design allows for customized fit and pressure levels based on individual needs. Use cases: whiplash, cervical strain, arthritis, post-surgery. Medical benefits: restricts harmful movements, reduces inflammation, relieves pain, promotes healing. Care: Wipe clean, air dry. Who should use: Neck injury patients. Contraindication: Avoid if numbness occurs.",
  
  "MDL-045": "Cotton elastic ankle binder with figure-8 design delivering firm compression and targeted support to the ankle joint. Offers effective relief from sprains, strains, and chronic ankle instability. This binder delivers controlled compression therapy that stabilizes the ankle structure while maintaining flexibility for controlled movement. Excellent for preventing re-injury, managing pain, and accelerating recovery from ankle-related injuries. Use cases: ankle sprains, strains, athletic prevention, chronic instability. Medical benefits: reduces swelling, stabilizes joints, prevents re-injury, improves blood flow. Sizing: Universal/S-XL. Care: Hand wash, air dry. Who should use: Athletes and active individuals. Caution: Not recommended for acute fractures.",
  
  "MDL-121": "Advanced dryfit ankle brace combining superior comfort with professional-grade moisture management. Features advanced mesh fabric technology that wicks away sweat and moisture, keeping your feet dry and comfortable during extended wear or athletic activities. The enhanced breathability prevents skin irritation while maintaining strong ankle support and stability. Perfect for athletes, active individuals, and those requiring all-day ankle support. Use cases: athletic training, moisture-prone environments, prolonged activity, allergy-prone skin. Medical benefits: prevents moisture buildup, maintains strong support, enhances breathability, reduces irritation. Sizing: S-XL. Care: Machine washable. Who should use: Athletes and active people.",
  
  "MDL-074": "Premium neoprene ankle brace delivering therapeutic warmth, compression, and exceptional support to the ankle joint. The neoprene material provides natural heat retention that promotes blood circulation and reduces pain associated with arthritis, strains, and chronic ankle conditions. Its four-way stretch capability ensures unrestricted ankle movement while maintaining protective support throughout the day. Ideal for chronic conditions and winter weather use. Use cases: arthritis management, chronic conditions, winter support, recovery. Medical benefits: promotes circulation, reduces pain, provides warmth, supports healing. Sizing: Universal. Care: Hand wash, air dry. Caution: May overheat in warm climates.",
  
  "MDL-031": "Rigid plastic ankle brace engineered for maximum stability and protection in severe ankle injuries and post-surgical recovery scenarios. Features a medical-grade rigid exoskeleton that immobilizes the ankle while preventing harmful movements. The foam padding provides comfort against the rigid shell, and adjustable straps allow for customized compression and fit. Ideal for serious ankle injuries requiring maximum support and professional-grade immobilization. Use cases: severe sprains, fractures, post-surgical recovery, chronic instability. Medical benefits: prevents harmful movements, maximizes stability, protects tissues, supports complex injuries. Sizing: Universal. Note: Medical supervision recommended.",
  
  "MDL-126": "Specialized ankle traction brace designed to alleviate pain through gentle stretching and decompression of the ankle joint. The traction system works by providing controlled tension that reduces pressure on injured tissues, decreases inflammation, and promotes natural healing. Comfortable and easy to apply, making it an excellent choice for managing chronic ankle pain or aiding recovery from ankle injuries. Use cases: chronic ankle pain, traction therapy, recovery acceleration, pain management. Medical benefits: reduces joint pressure, decreases inflammation, promotes healing, alleviates pain. Sizing: Universal. Care: Hand wash, air dry. Suitable for chronic pain sufferers.",
};

// Update descriptions
let updated = 0;
for (const product of products) {
  const sku = product.sku;
  if (premiumDescriptions[sku]) {
    product.description = premiumDescriptions[sku];
    updated++;
  }
}

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`✓ Updated ${updated} product descriptions`);
