const express= require('express');
const {Pool} = require('pg');

const app=express();
const port=3001;
app.use(express.json())
const pool= new Pool ({
    host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'Krpkabp2@',
      database : 'pet_adoption'
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with the specific origin(s) you want to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.get('/pets',(req,res)=>{
    pool.query('SELECT * FROM pet',(error,results)=>{
        if(error){
            console.log('error',error);
            res.status(500).json({error:'internal server error'});
        }
        else {
            // console.log('hello',results.rows);
            res.json(results.rows);
        }
    });
});

app.post('/login/check',(req,res)=>{
    const {email,password} = req.body;
    pool.query(`SELECT email,password FROM user_s where email = $1`,[email],(error,results)=>{
        if(error){
            console.log('error',error);
            res.status(500).json({error:'internal server error'});
        }
        else {
            console.log("hello",results.rows);
            if(email===results.rows[0].email && password===results.rows[0].password){
                res.json({success:true,message:'Login success'});
            }
                else{
                    res.json({success:false,message:'Invalid username or password'});
                }
            }
        })
    });

    app.post('/login/check',(req,res)=>{
        const {email,password} = req.body;
        pool.query(`SELECT email,password FROM user_s where email = $1`,[email],(error,results)=>{
            if(error){
                console.log('error',error);
                res.status(500).json({error:'internal server error'});
            }
            else {
                console.log("hello",results.rows);
                if(email===results.rows[0].email && password===results.rows[0].password){
                    res.json({success:true,message:'Login success'});
                }
                    else{
                        res.json({success:false,message:'Invalid username or password'});
                    }
                }
            })
        });

        app.post('/signup',(req,res)=>{
            const {name,email,password} = req.body;
            pool.query(`INSERT INTO user_s (name,email,password) VALUES($1,$2,$3)`,[name,email,password],(error,results)=>{
                if(error){
                    console.log('error',error);
                    res.status(500).json({success:false, message:'error in signing up'});
                }
                    res.json({success:true, message:'SignUp successful'});
                       
                })
            });


app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});

