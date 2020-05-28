

let data = JSON.parse(cat('/run/secrets/mongodb_config'))
let databases = data['databases'];

let db2;
for (let dbname in databases) {

    while(true)
    {
      try{
        db2 = db.getSiblingDB(dbname);
        
        break;
      } catch(e) {
        print(e);
      }
      print('Retrying to get database');
    }

    for (let user of databases[dbname]["users"]) {

      while(true)
      {
        try{
          db2.createUser(user);
          
          break;
        } catch(e) {
          //print(e);
        }
        //print('Retrying create user');
      }
      
    }

}