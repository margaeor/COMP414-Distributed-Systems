

let data = JSON.parse(cat('/run/secrets/mongodb_config'))
let databases = data['databases'];

for (let dbname in databases) {

    db = db.getSiblingDB(dbname);

    for (let user of databases[dbname]["users"]) {

      while(true)
      {
        try{
          db.createUser(user);
          break;
        } catch(e) {

        }
      }
      
    }

}