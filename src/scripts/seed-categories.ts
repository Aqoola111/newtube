import {db} from "@/db";
import {categories} from "@/db/schema";


const categoryNames = [
    "Education",
    "Entertainment",
    "Music",
    "Sports",
    "Technology",
    "Travel",
    "Food",
    "Gaming",
    "Movies",
    "News",
    "Health",
    "Fashion",
    "Science",
    "History",
    "Art",
    "Literature",
    "Business",
    "Finance",
    "Photography",
    "DIY",
    "Parenting",
    "Comedy",
    "Nature",
    "Politics",
    "Automotive",
    "Real Estate",
    "Fitness",
    "Spirituality",
    "Relationships",
    "Pets"
];

async function main() {
    console.log("seeding categories...");
    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `Videos related to ${name}`,
        }))

        await db.insert(categories).values(values)

        console.log("Categories inserted successfully.")

    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
}

main()