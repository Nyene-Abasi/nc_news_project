# Northcoders News API

1. In order to successfully work on this project, you have to create an environment variable with dotenv files (.env) and attach your database name to this. You should have two files, one for the test database and the other for the development database in order to interact with it as expected.
 Your .env.test file should look like this PGDATABASE=nc_news_test; while your .env.development file should have PGDATABASE=nc_news;

NOTE: A semi-colon is important at the end of your statement otherwise it will not work as expected and you should avoid white space between = and your database name. E.g PGDATABASE = nc_news; this example is wrong so take note.
