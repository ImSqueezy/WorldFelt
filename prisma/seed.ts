import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleFeelings = [
  { longitude: -74.006, latitude: 40.7128, feeling: "hopeful", comment: "new year, new beginnings" },
  { longitude: -0.1276, latitude: 51.5074, feeling: "peaceful", comment: "quiet evening walk" },
  { longitude: 139.6917, latitude: 35.6895, feeling: "grateful", comment: "cherry blossoms blooming" },
  { longitude: 151.2093, latitude: -33.8688, feeling: "calm", comment: "waves at bondi beach" },
  { longitude: -43.1729, latitude: -22.9068, feeling: "reflective", comment: "sunset over the mountains" },
  { longitude: 2.3522, latitude: 48.8566, feeling: "tender", comment: "café in the rain" },
  { longitude: -123.1207, latitude: 49.2827, feeling: "anxious", comment: "job interview tomorrow" },
  { longitude: 18.0686, latitude: 59.3293, feeling: "peaceful", comment: "walking through gamla stan" },
  { longitude: -99.1332, latitude: 19.4326, feeling: "hopeful", comment: "new beginnings" },
  { longitude: 37.6173, latitude: 55.7558, feeling: "calm", comment: "snow falling softly" },
  { longitude: 116.4074, latitude: 39.9042, feeling: "tired", comment: "long day, longer night" },
  { longitude: 103.8198, latitude: 1.3521, feeling: "grateful", comment: "gardens by the bay at night" },
  { longitude: -58.3816, latitude: -34.6037, feeling: "reflective", comment: "tango in the streets" },
  { longitude: 12.4964, latitude: 41.9028, feeling: "peaceful", comment: "wandering through history" },
  { longitude: -3.7038, latitude: 40.4168, feeling: "hopeful", comment: "plaza mayor sunset" },
  { longitude: 72.8777, latitude: 19.076, feeling: "anxious", comment: "monsoon season" },
  { longitude: -122.4194, latitude: 37.7749, feeling: "tender", comment: "golden gate in the fog" },
  { longitude: 13.405, latitude: 52.52, feeling: "calm", comment: "biking through the city" },
  { longitude: 121.4737, latitude: 31.2304, feeling: "grateful", comment: "skyline lights" },
  { longitude: -46.6333, latitude: -23.5505, feeling: "hopeful", comment: "city that never sleeps" },
  { longitude: 28.0339, latitude: -26.2041, feeling: "peaceful", comment: "jacaranda trees in bloom" },
  { longitude: 144.9631, latitude: -37.8136, feeling: "reflective", comment: "coffee culture" },
  { longitude: 126.978, latitude: 37.5665, feeling: "tired", comment: "late night at the office" },
  { longitude: -77.0369, latitude: 38.9072, feeling: "anxious", comment: "cherry blossoms and decisions" },
  { longitude: 10.7522, latitude: 59.9139, feeling: "peaceful", comment: "fjords in the distance" },
  { longitude: 25.2797, latitude: 54.6872, feeling: "calm", comment: "old town quiet" },
  { longitude: -79.3832, latitude: 43.6532, feeling: "hopeful", comment: "cn tower at dawn" },
  { longitude: 174.7633, latitude: -36.8485, feeling: "grateful", comment: "harbour bridge views" },
  { longitude: 35.2137, latitude: 31.7683, feeling: "reflective", comment: "ancient stones, modern heart" },
  { longitude: 55.2708, latitude: 25.2048, feeling: "tender", comment: "desert stars above" },
  { longitude: 30.5234, latitude: 50.4501, feeling: "peaceful", comment: "golden domes at sunset" },
  { longitude: -9.1393, latitude: 38.7223, feeling: "calm", comment: "fado music in the night" },
  { longitude: 14.4378, latitude: 50.0755, feeling: "hopeful", comment: "bridges over vltava" },
  { longitude: 19.0402, latitude: 47.4979, feeling: "grateful", comment: "thermal baths at night" },
  { longitude: 21.0122, latitude: 52.2297, feeling: "tired", comment: "old town rebuilding" },
  { longitude: -47.9292, latitude: -15.7942, feeling: "reflective", comment: "planned city, wild heart" },
  { longitude: 106.8456, latitude: -6.2088, feeling: "anxious", comment: "traffic never ends" },
  { longitude: 114.1095, latitude: 22.3964, feeling: "peaceful", comment: "victoria peak view" },
  { longitude: 100.5018, latitude: 13.7563, feeling: "calm", comment: "temples at dawn" },
  { longitude: -70.6693, latitude: -33.4489, feeling: "hopeful", comment: "andes in the distance" },
  { longitude: 31.2357, latitude: 30.0444, feeling: "grateful", comment: "pyramids under moonlight" },
  { longitude: 44.5155, latitude: 40.1872, feeling: "tender", comment: "mount ararat in view" },
  { longitude: -1.5536, latitude: 53.8008, feeling: "peaceful", comment: "yorkshire moors quiet" },
  { longitude: 24.7536, latitude: 59.437, feeling: "calm", comment: "medieval streets empty" },
  { longitude: 23.7275, latitude: 37.9838, feeling: "reflective", comment: "acropolis lights" },
  { longitude: -80.1918, latitude: 25.7617, feeling: "hopeful", comment: "ocean breeze at night" },
  { longitude: -112.074, latitude: 33.4484, feeling: "tired", comment: "desert heat fading" },
  { longitude: -95.3698, latitude: 29.7604, feeling: "anxious", comment: "storm approaching" },
  { longitude: -104.9903, latitude: 39.7392, feeling: "peaceful", comment: "mountain air fresh" },
];

async function main() {
  console.log('🌍 Seeding database with sample feelings...');

  for (const feeling of sampleFeelings) {
    await prisma.feeling.create({
      data: feeling,
    });
  }

  console.log(`✅ Successfully added ${sampleFeelings.length} feelings to the database!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
