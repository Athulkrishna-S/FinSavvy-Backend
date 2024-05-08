import user from '../models/userModel.js';

async function getAnalysisData(req,res){
    const userId = req.userId;
    const category = req.query.category;
    try{
            const result = await user.transactionAnalysis(userId);
            const classes = {}
            result.forEach(element => {

                if(element.category === category){

                    let year_month = element.date.slice(0,7);
                    if(classes.hasOwnProperty(year_month)){
                        classes[year_month] += element.amount;
                        classes[year_month] = Math.round(classes[year_month]*100)/100;
                    }
                    else{
                        classes[year_month] = Math.round(element.amount*100)/100;
                    }
                }        
            });
            const sortedArray = Object.entries(classes)
            // Sort the array in descending order based on keys
            .sort(([key1], [key2]) => key2.localeCompare(key1))
            // Convert the sorted array back to an object
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

            res.status(200).json({status:200,data:sortedArray});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({status:500,message:error.message});
    }
}

async function getMonthlyData( req , res ){

    const userId = req.userId;
    const condition = 'all';
    const classes = {}
    let totalincome = 0;
    let totalexpense = 0;
    try{
    // generate current year-month
        let today = new Date();
        let year = today.getFullYear();
        let this_month = today.getMonth()+1; // adding 1 bcz month is zero indexed i.e for may it has 4 instead of 5 
        const month = `${year}-${this_month.toString().padStart(2,'0')}`; // format 2024-05
        const result = await user.getTransactions( userId , condition ,month);
        result.forEach(element => {
            if(classes.hasOwnProperty(element.category) && element.nature == "expense")
            {
                classes[element.category] += element.amount;
                totalexpense += element.amount;
            }
            else if(element.nature === "expense")
            {
                classes[element.category] = element.amount;
                totalexpense += element.amount;
            }
            else if(element.nature === "income")
            {
                totalincome += element.amount;
            }
        });
        res.status(200).json({status:200 , classes:classes , income : Math.round(totalincome*100)/100 ,expense : Math.round(totalexpense*100)/100});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({status:500,message:error.message});
    }
}


export { getAnalysisData , getMonthlyData };