// THERE ARE OTHER SMART & ROBUST WAY TO REGISTER ALL MODEL BUT I DO NOT KNOW FOR NOW

// models/index.ts
let modelsRegistered = false;

export default async function registerModels() {
  if (modelsRegistered) return;
  console.log('REGISTERING MODELS');

  // Dynamic import (better than require)
  await import('@/lib/models/HR/EmployeeData.model');
  // Add other models...

  modelsRegistered = true;
}

// Add this to your registerModels()
//   if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//     // Special handling for serverless
//     global._mongooseModelsRegistered ??= false;
//     if (global._mongooseModelsRegistered) return;
//     global._mongooseModelsRegistered = true;
//   }

// Add to your models/index.ts
// declare global {
//   var _mongooseModelsRegistered: boolean;
// }
