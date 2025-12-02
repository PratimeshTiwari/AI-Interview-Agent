
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

import { generateEmbedding } from "./src/lib/embeddings";
import Memory from "./src/models/Memory";
import dbConnect from "./src/lib/db";

async function verifyRAG() {
    await dbConnect();
    const userId = "test-rag-user-" + Date.now();

    console.log("1. Creating a memory...");
    const text = "My favorite programming language is Python.";
    const embedding = await generateEmbedding(text);

    const memory = await Memory.create({
        userId,
        text,
        type: "fact",
        embedding
    });
    console.log("✅ Memory created with embedding.");

    // Verify it was saved correctly
    const savedMemory = await Memory.findById(memory._id);
    if (savedMemory && savedMemory.embedding && savedMemory.embedding.length === 1536) {
        console.log("✅ Verified: Memory saved with 1536-dim embedding.");
    } else {
        console.error("❌ Error: Memory not saved correctly or missing embedding.");
        return;
    }

    console.log("Waiting 10 seconds for indexing...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("2. Performing Vector Search...");
    const query = "What is my favorite language?";
    const queryEmbedding = await generateEmbedding(query);

    const results = await Memory.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: 1,
                filter: { userId: userId }
            }
        },
        // {
        //     $match: { userId }
        // },
        {
            $project: {
                text: 1,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ]);

    console.log("Search Results:", results);

    if (results.length > 0 && results[0].text.includes("Python")) {
        console.log("✅ RAG Verification PASSED: Retrieved relevant memory.");
    } else {
        console.log("❌ RAG Verification FAILED: Did not retrieve memory. (Did you create the Atlas Index?)");
    }
}

verifyRAG().catch(console.error);
