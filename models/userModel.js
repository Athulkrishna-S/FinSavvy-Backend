import { transactions , planner , User, installments } from './database.js';
import { v4 as uuidv4 } from 'uuid';

async function getTransactions(userId,condition,month){

  //  var query = {"userId":userId,"date":{$regex :new RegExp('^' + month)}};

    
   // const result = await transactions.findOne({userId},{transactions : 1,income : 0,_id : 0});
 //  const result = await transactions.findOne({ userId });

 const result = await transactions.aggregate([
    { $match: { userId } }, // Filter documents by userId
    { $unwind: "$transactions" }, // Deconstruct transactions array
    {
        $addFields: {
            "transactions.dateTime": {
                $toDate: { $concat: ["$transactions.date", " ", "$transactions.time"] }
            }
        }
    }, // Combine date and time fields into a dateTime field
    { $sort: { "transactions.dateTime": -1 } } // Sort by dateTime in descending order
]).toArray();

    if(result.length==0){
        throw new Error('No transactions');
    }
   // const trans=[];
   // const regmonth = new RegExp('^'+month);
   // result.transactions.forEach(element => {
   //     if(regmonth.test(element.date)){
   //         trans.push(element);
   //     }
   // });
    const regmonth =new RegExp('^'+month);
    const tran = result.map(doc => doc.transactions);
    const trans = tran.filter(doc => regmonth.test(doc.date));

    if(condition != 'all')
    {
        return trans.slice(0,parseInt(condition));
    }
    return trans;
}



async function newPlanner(userId,data){
    const id = uuidv4()
    const result =await planner.updateOne({userId},{$push : {planners : {...data, id }}});
    if (result.modifiedCount === 0) {
        throw new Error("Cannot add planner");
    }
    const user = await User.findOne({userId});
    let installData ={
        userId,
        email:user.email,
        installment_day:data.installment_day,
        title : data.title,
        mature_date : data.mature_date
    };
    const ret = await installments.insertOne(installData);
    return {message : "succees"};
}

async function getPlanner(userId,id='default'){

    if(id === 'default') {
        const result = await planner.findOne({userId});
        if(!result){
            throw new Error("No planner found");
        }
        const names =[]
        result.planners.forEach(element => {
            let data = {"title":element.title,"value":element.current_value,"Maturity":element.mature_date,"id":element.id};
            names.push(data);
        });
        return names;
    }
    else
    {
        const result = await planner.findOne({userId});
        if(!result){
            throw new Error("No planner found");
        }
        const data = result.planners.find(doc => doc.id === id);
        return data;
    }    
}


async function transactionAnalysis(userId){
    const result = await transactions.findOne({userId});
    if(!result)
    {
        throw new Error("Error in fetching trnsactions");    
    }
    return result.transactions;
}

async function deletePlanner(userId,id)
{
    const result = await planner.findOne({userId});
    
    if(!result)
    {
        throw new Error("Error in deleting");
    }
    
    const newPlanners = result.planners.filter(element => element.id !== id);

    const res = await planner.updateOne({userId},{$set : {planners : newPlanners}});

    if(!res)
    {
        throw new Error("Error in deleting");
    }

    return "Planner Deleted";
}



const user = { getTransactions , newPlanner , getPlanner ,  transactionAnalysis , deletePlanner };
export default user;