const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        isAdmin: true,
      },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists:", existingAdmin.email);
      return existingAdmin;
    }

    // Check if there's a user with admin email
    const adminEmail = "admin@example.com";
    let adminUser = await prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (adminUser) {
      // Update existing user to admin
      adminUser = await prisma.user.update({
        where: {
          email: adminEmail,
        },
        data: {
          isAdmin: true,
        },
      });
      console.log("✅ Updated existing user to admin:", adminUser.email);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash("admin123", 12);

      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: "Admin User",
          password: hashedPassword,
          isAdmin: true,
        },
      });
      console.log("✅ Created new admin user:", adminUser.email);
    }

    console.log("🔑 Admin credentials:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");

    return adminUser;
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Check all users and their admin status
async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    console.log("\n📋 Current users in database:");
    if (users.length === 0) {
      console.log("   No users found");
    } else {
      users.forEach((user, index) => {
        console.log(
          `   ${index + 1}. ${user.email} ${
            user.isAdmin ? "(ADMIN)" : "(USER)"
          }`
        );
        console.log(`      Name: ${user.name || "N/A"}`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Created: ${user.createdAt.toISOString()}`);
        console.log("");
      });
    }
  } catch (error) {
    console.error("❌ Error listing users:", error);
  }
}

async function main() {
  console.log("🚀 Admin User Setup Script");
  console.log("==========================");

  await listUsers();
  await createAdminUser();

  console.log("\n✅ Setup completed!");
  console.log(
    "\n🔗 You can now access admin panel at: http://localhost:3000/en/admin"
  );
}

main().catch(console.error);
