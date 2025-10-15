// Fake data generators
const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Avery",
  "Quinn",
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "Ethan",
  "Sophia",
  "Mason",
  "Isabella",
  "William",
  "Mia",
  "James",
  "Charlotte",
  "Benjamin",
  "Amelia",
  "Lucas",
  "Harper",
  "Henry",
  "Evelyn",
  "Alexander",
  "Abigail",
  "Michael",
  "Emily",
  "Daniel",
  "Elizabeth",
  "Jacob",
  "Sofia",
  "Logan",
  "Avery",
  "Jackson",
  "Ella",
  "Sebastian",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
];

const actions = [
  "created a new project",
  "deleted a file",
  "shared a document",
  "commented on a task",
  "completed a milestone",
  "invited a team member",
  "updated project settings",
  "exported data report",
  "created a new team",
  "archived old project",
  "updated billing information",
  "changed password",
  "enabled two-factor authentication",
  "uploaded a new file",
  "created a backup",
  "merged a pull request",
  "deployed to production",
  "ran automated tests",
  "reviewed code changes",
  "created a new API key",
  "updated integration settings",
  "scheduled a meeting",
  "published a blog post",
  "updated documentation",
  "created a new workflow",
  "optimized database queries",
  "configured monitoring alerts",
  "updated security policies",
];

function generateRandomActivity() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];

  // Generate timestamp within the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime = new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
  );

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${firstName} ${lastName}`,
    action: action,
    timestamp: randomTime.toISOString(),
  };
}

export default defineEventHandler((event) => {
  const activities = Array.from({ length: 20 }, () => generateRandomActivity());
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return {
    activities,
    total: activities.length,
    generated_at: new Date().toISOString(),
  };
});
