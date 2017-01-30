const xdevapi = require('@mysql/xdevapi');

const main = async () => {
  const session = await xdevapi.getSession({
    host: 'localhost',
    port: 33060,
    dbUser: 'root',
    dbPassword: '1111aaaa',
  })

  const schema = await session.getSchema("test_shema");
  const collection = await schema.getCollection('myCollection');

  collection.add(
    {baz: {foo: "bar"}},
    {foo: {bar: "baz"}}
  );

  session.close();

}

console.log(main);

main().then(() => {
  console.log('complete');
})

