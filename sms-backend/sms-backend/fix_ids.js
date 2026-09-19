const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Add default function to _id: { type: String }
  // Only if it doesn't already have default
  if (content.includes('_id: { type: String }')) {
    content = content.replace(
      '_id: { type: String }', 
      '_id: { type: String, default: () => new mongoose.Types.ObjectId().toString() }'
    );
    
    // Some models might not require mongoose if they didn't have ObjectIds before,
    // let's ensure mongoose is required at the top if we are using it
    if (!content.includes('mongoose.Types.ObjectId')) {
       // Wait, mongoose is already required in all schemas to do new mongoose.Schema
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
