const { sequelize, User, Profile, Article, Like, Follow } = require('../models');

const seedDatabase = async () => {
    try {
        // Sync all models
        await sequelize.sync({ force: true }); // Warning: This will drop existing tables and recreate them!

        console.log('Database synced.');

        // Seed Users
        const users = await User.bulkCreate([
            { username: 'adminUser', email: 'admin@example.com', password: 'securepassword', role: 'administrator' },
            { username: 'authorUser1', email: 'author1@example.com', password: 'password123', role: 'author' },
            { username: 'authorUser2', email: 'author2@example.com', password: 'password123', role: 'author' },
        ]);

        console.log('Users seeded.');

        // Seed Profiles
        const profiles = await Profile.bulkCreate([
            { bio: 'Admin of the platform', avatar: 'admin-avatar.png', userId: users[0].id },
            { bio: 'Tech enthusiast and writer', avatar: 'author1-avatar.png', userId: users[1].id },
            { bio: 'Loves writing about lifestyle', avatar: 'author2-avatar.png', userId: users[2].id },
        ]);

        console.log('Profiles seeded.');

        // Seed Articles
        const articles = await Article.bulkCreate([
            { title: 'Introduction to Sequelize', content: 'Sequelize is a Node.js ORM...', category: 'Tech', userId: users[1].id },
            { title: 'Top 10 JavaScript Frameworks', content: 'JavaScript has many frameworks...', category: 'Tech', userId: users[1].id },
            { title: 'Healthy Living Tips', content: 'Here are some tips for a healthy life...', category: 'Lifestyle', userId: users[2].id },
        ]);

        console.log('Articles seeded.');

        // Seed Likes
        await Like.bulkCreate([
            { userId: users[0].id, articleId: articles[0].id },
            { userId: users[2].id, articleId: articles[0].id },
            { userId: users[1].id, articleId: articles[2].id },
        ]);

        console.log('Likes seeded.');

        // Seed Followers (many-to-many relationship)
        await users[0].addFollowers([users[1], users[2]]); // Admin is followed by Author1 and Author2
        await users[1].addFollowers([users[0]]); // Author1 follows Admin
        await users[2].addFollowers([users[1]]); // Author2 follows Author1

        console.log('Followers seeded.');

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await sequelize.close();
        console.log('Connection closed.');
    }
};

// Run the seeder
seedDatabase();

module.exports = seedDatabase;
