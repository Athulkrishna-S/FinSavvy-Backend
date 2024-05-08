import user from '../models/userModel.js';

async function getTransactions(req,res){

    const userId = req.userId;
    let condition = req.query.condition;
    if(condition === undefined){
        condition = 'all';
    }
    let month = req.query.month;
    try {
            const result = await user.getTransactions(userId,condition,month);
            res.status(200).json({status : 200, data : result});
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ status: 500, error: error.message });
    }
}

async function newPlanner(req,res){
    const userId =req.userId;
    try{
            const data = req.body;
            const result = await user.newPlanner(userId,data);
            res.status(200).json({status:200,message: result.message});
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).json({status:500,message:error.message});
    }
}

async function getPlanner(req,res){
    const userId = req.userId;
    const id =req.query.planner_id;
    try{

        if(id === undefined)
        {    

            const result = await user.getPlanner(userId);
            console.log("result :",result);
            res.status(200).json({status : 200, data : result});
        }
        else
        {
            const result = await user.getPlanner(userId,id);
            res.status(200).json({status : 200, data : result});
        }
    }
    catch(error)
    {
        res.status(500).json({status:500,message:error.message});
    }
}

async function deletePlanner(req , res){
    const userId = req.userId;
    const id = req.query.planner_id;
    try {

        const result = await user.deletePlanner(userId , id);

        res.status(200).json({status : 200, message : result});
        
    }
    catch(error){
        res.status(500).json({status:500,message:error.message});
    }
}

export { getTransactions , newPlanner , getPlanner ,deletePlanner };