
async function verifyHistory() {
    const userId = 'test-user-' + Date.now();

    // 1. Save a session
    console.log('Saving session...');
    const saveRes = await fetch('http://localhost:3000/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            role: 'Software Engineer',
            score: 85,
            summary: 'Test summary',
            strengths: ['React'],
            weaknesses: ['CSS']
        })
    });

    if (!saveRes.ok) {
        console.error('❌ Failed to save session:', await saveRes.text());
        return;
    }
    console.log('✅ Session saved.');

    // 2. Fetch history
    console.log('Fetching history...');
    const fetchRes = await fetch(`http://localhost:3000/api/history?userId=${userId}`);
    const history = await fetchRes.json();

    console.log('History:', JSON.stringify(history, null, 2));

    if (Array.isArray(history) && history.length > 0 && history[0].userId === userId) {
        console.log('✅ Verification PASSED: History persisted and retrieved.');
    } else {
        console.log('❌ Verification FAILED: History not found.');
    }
}

verifyHistory().catch(console.error);
