const express = require('express');
const http = require('http');
const port = 3000;
var app = express();
var bodyParser = require('body-parser')
app.use(express.json())
app.use(bodyParser.json())
const Joi = require('joi')


const middlewareValidation = async (req,res,next)=>{

    const schema = Joi.object().keys({
        name:Joi.string().required(),
        password:Joi.string().required(),
        search:Joi.string().optional(),
        category:Joi.string().optional().valid("a","b","c"),
        amount:Joi.number().min(1).max(20).required(),
        age:Joi.number().when('name',{is:'test' ,then:Joi.required(),otherwise:Joi.optional()}),
        item:Joi.object().keys({
            id:Joi.number().required(),
            name:Joi.string().optional()
        }).unknown(true),
        items:Joi.array().items(Joi.object().keys({
            id:Joi.number().required(),
            name:Joi.string().optional()
        })),
        confirm_password:Joi.string().valid(Joi.ref('password')).required(),
        limit:Joi.number().required(),
        numbers:Joi.array().min(Joi.ref('limit')).required(),
        email:Joi.string().email({
            minDomainSegments:2,
            tlds:{allow:["com","in"]}
        }),
        fullname:Joi.string(),
        lastname:Joi.string(),  
        custom_name:Joi.string().custom((value,msg)=>{
            if(value == 'test'){
                return msg.message('not allowed test name')
            }
            return true
        }) 
    }).xor("fullname","lastname").unknown(true)

    const {error} = schema.validate(req.body,{abortEarly:false})
    if(error){
        const {details} = error
        res.status(500).json({error:details})
    }else{
        next();
    }
}


app.post('/add_data', middlewareValidation,async(req,res)=>{
   res.status(200).json(req.body);
})

const server = http.createServer(app);
server.listen(port,()=>console.log('listening port...!!',port))