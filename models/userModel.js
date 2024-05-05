import { transactions } from './database.js';

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
    { $sort: { "transactions.dateTime": 1 } } // Sort by dateTime in ascending order
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

    const trans = result.map(doc => doc.transactions);
    


    return trans;
}

const user = {getTransactions};
export default user;