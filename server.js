const express= require('express');
const {Pool} = require('pg');
const cors = require('cors')
const app=express();
const port=3001;
app.use(express.json())
app.use(cors());
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
            if(results&&results.rows&&results.rows[0]&&email===results.rows[0].email && password===results.rows[0].password){
                res.json({success:true,message:'Login success'});
            }
                else{
                    res.json({success:false,message:'Invalid username or password'});
                }
            }
        })
    });

    app.post('/form',(req,res)=>{
        let {email,name,address,reason,phoneNumber,petId} = req.body;
        pool.query(`INSERT INTO adoption_details (name,email,address,reason,phoneNumber,petid) VALUES($1,$2,$3,$4,$5,$6) RETURNING * `,[name,email,address,reason,phoneNumber,petId],(error,results)=>{
            if(error){
                console.log('error',error);
                res.status(500).json({error:'internal server error'});
            }
            else {
                console.log("hello",results.rows);
                if(results&&results.rows&&results.rows[0]){
                    res.json({success:true,message:'form filled successfully',value:results.rows[0]});
                }
                    else{
                        res.json({success:false,message:'Application filled wrong'});
                    }
                }
            })
        });


        app.post('/signup',(req,res)=>{
            const {name,email,password} = req.body;
            console.log(name,email,password)
            // const res = pool.query(`SELECT * FROM user_s WHERE email=$1`,[email])
            pool.query(`INSERT INTO user_s (name,email,password) VALUES($1,$2,$3) RETURNING*`,[name,email,password],(error,results)=>{
                if(error){
                    console.log('error',error);
                    res.status(500).json({success:false, message:'error in signing up'});
                }
                    if(results.rows && results.rows[0]){
                    res.json({success:true, message:'SignUp successful'});
                    } else{
                    res.json({success:false, message:'error in signing up'})
                    }
                       
                })
            });


app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});

