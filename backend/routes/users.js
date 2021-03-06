const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/all', async (req, res) => {
    console.log('running');

    try {
        let users = await db.any('SELECT * FROM users')
        res.json({
            payload: users,
            message: "Succcess, Retrieved all the users"
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error something went wrong. Could not retrieve all users.'
        })
    }
})

router.get('/:firstName/:lastName', async (req, res)=>{
    let firstName = req.params.firstName;
    let lastName = req.params.lastName;
    
try {
   let userQuery = `SELECT * FROM users WHERE firstname = $1 AND lastname = $2`;
   let user = await db.one(userQuery, [firstName, lastName]);
   console.log(user);
   if(user.length === 0){
    throw new Error;
   }

    res.json({
        payload: user,
        message: "One USER received"
    })

} 
 catch (error){
   console.log(error)
   res.json({"err": "This user does not exist"});
}
});

router.post('/register', async  (req, res) => {
    
    try {
 let insertstuff = 
        `INSERT INTO users (firstname,lastname,age, img_url)
         VALUES ($1, $2, $3)`

        await db.none(insertstuff, [req.body.firstname, req.body.lastname, req.body.age, req.body.img_url])
       
        res.json({
            payload: req.body,
            message: "POST request arrived"
        })
    } catch (error) {
        res.json({
            message: "there was an error registering user"
        })
    }
})

router.delete('/:user_id', async (req, res)=>{
let userId = req.params.user_id 

try{
    let deleteUser =   `DELETE FROM users where id = $1`
    await db.any(deleteUser, [userId])
    res.json({
        message: "This User  was Deleted"
    })
} catch (error) {
    res.json({
        message: "There was an error deleting user"
    })
}
})

module.exports = router;