import { supabase } from './supabase';

export const sampleServices = [
  {
    title: "Level Boost (1-50)",
    description: "Complete level progression from 1 to 50 with professional helldivers. Fast, safe, and efficient leveling service.",
    price: 29.99,
    original_price: 39.99,
    duration: "24-48 hours",
    difficulty: "Beginner",
    features: [
      "Full level 1-50 progression",
      "All experience gained on your account",
      "Safe boosting methods",
      "24/7 progress tracking",
      "Professional helldivers team"
    ],
    active: true,
    popular: true,
    orders_count: 127
  },
  {
    title: "Ship Module Unlock",
    description: "Unlock all available ship modules and upgrades. Get access to powerful ship enhancements quickly.",
    price: 19.99,
    duration: "12-24 hours",
    difficulty: "Intermediate",
    features: [
      "All ship modules unlocked",
      "Strategic facility upgrades",
      "Resource farming included",
      "Quick completion guarantee",
      "Expert strategem selection"
    ],
    active: true,
    popular: false,
    orders_count: 89
  },
  {
    title: "Weapon Mastery Pack",
    description: "Master all weapons in Helldivers 2. Unlock weapon upgrades, attachments, and specializations.",
    price: 34.99,
    duration: "2-3 days",
    difficulty: "Advanced",
    features: [
      "All weapons mastered",
      "Unlock all attachments",
      "Weapon specialization training",
      "Combat efficiency optimization",
      "Personal weapon recommendations"
    ],
    active: true,
    popular: true,
    orders_count: 203
  },
  {
    title: "Stratagem Collection",
    description: "Unlock the complete stratagem library. Get access to all offensive, defensive, and support stratagems.",
    price: 24.99,
    duration: "1-2 days",
    difficulty: "Intermediate",
    features: [
      "Complete stratagem collection",
      "Tactical combinations guide",
      "Mission-specific loadouts",
      "Advanced deployment training",
      "Pro team coordination tips"
    ],
    active: true,
    popular: false,
    orders_count: 156
  },
  {
    title: "Super Credits Farm",
    description: "Earn Super Credits efficiently through optimized mission runs and resource management.",
    price: 15.99,
    duration: "6-12 hours",
    difficulty: "Beginner",
    features: [
      "500+ Super Credits guaranteed",
      "Optimal farming routes",
      "Resource maximization",
      "Time-efficient methods",
      "Bonus credit opportunities"
    ],
    active: true,
    popular: true,
    orders_count: 341
  },
  {
    title: "Hellpod Customization",
    description: "Unlock all hellpod designs, colors, and customization options. Stand out on the battlefield.",
    price: 12.99,
    duration: "4-8 hours",
    difficulty: "Beginner",
    features: [
      "All hellpod designs unlocked",
      "Complete color palette",
      "Special effect unlocks",
      "Exclusive patterns access",
      "Premium customization guide"
    ],
    active: true,
    popular: false,
    orders_count: 78
  }
];

export async function seedServices() {
  try {
    console.log('Checking existing services...');
    
    // Check if services already exist
    const { data: existingServices, error: checkError } = await supabase
      .from('services')
      .select('id');

    if (checkError) {
      console.error('Error checking existing services:', checkError);
      return false;
    }

    if (existingServices && existingServices.length > 0) {
      console.log('Services already exist, skipping seed');
      return true;
    }

    console.log('Seeding services...');
    
    const { data, error } = await supabase
      .from('services')
      .insert(sampleServices)
      .select();

    if (error) {
      console.error('Error seeding services:', error);
      return false;
    }

    console.log(`Successfully seeded ${data?.length || 0} services`);
    return true;
  } catch (error) {
    console.error('Error in seedServices:', error);
    return false;
  }
}
