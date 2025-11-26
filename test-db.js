const { JsonDB, Config } = require('node-json-db');

async function test() {
  const db = new JsonDB(new Config('testDB', true, false, '/'));

  try {
    await db.push('/boards', [], true);
    await db.push('/nextId', 1, true);

    const boards = await db.getData('/boards');
    console.log('Boards:', boards, typeof boards, Array.isArray(boards));

    const nextId = await db.getData('/nextId');
    console.log('NextId:', nextId, typeof nextId);

    boards.push({ id: 1, title: 'Test' });
    await db.push('/boards', boards, true);

    const updatedBoards = await db.getData('/boards');
    console.log('Updated boards:', updatedBoards);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
