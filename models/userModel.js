import { transactions } from './database.js';

async function getTransactions(userId,condition,month){

    var query = {"userId":userId,"date":{$regex :new RegExp('^' + month)}};
  //  const result = transactions.aggregate([
  //      {$match:{userId}},
  //      {
  //          $projection :{
  //              userId : 1,
  //              income : 1,
  //              expense : 1,
  //              transactions : {
  //                  $filter :{
  //                      input : "$transactions",
  //                      as : "transaction",
  //                      cond : {
  //                          $eq : [{ $substr: ["$$transaction.date", 0, 7] }, month]
  //                      }
  //                  }
  //              }
  //          }
  //      },
  //      { $limit : condition}
  //  ]);

   // const result = await transactions.findOne({userId},{transactions : 1,income : 0,_id : 0});
   const result = await transactions.findOne({ userId }, { transactions: 1, income: 0, _id: 0 });


    if(!result){
        throw new Error('No transactions');
    }
    return result;
}

const user = {getTransactions};
export default user;