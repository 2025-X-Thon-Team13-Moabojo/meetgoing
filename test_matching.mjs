import { users } from './src/data/users.js';
import { findBestMatch } from './src/utils/matchingSystem.js';

const targetUser = users[0]; // Kim Min-su (Seoul, Dev, Web, [React, TS, Tailwind])

console.log(`Target User: ${targetUser.name} (${targetUser.region})`);
console.log(`Category: ${targetUser.category}, Sub: ${targetUser.subCategory}`);
console.log(`Tech: ${targetUser.techStack.join(', ')}`);
console.log('------------------------------------------------');

const matches = findBestMatch(targetUser, users);

matches.forEach((match, index) => {
    console.log(`${index + 1}. ${match.name} (${match.region}) - Score: ${match.score}`);
    console.log(`   Category: ${match.category}, Sub: ${match.subCategory}`);
    console.log(`   Tech: ${match.techStack.join(', ')}`);
    console.log(`   Region Match: ${match.isRegionSame}`);
    console.log('');
});
