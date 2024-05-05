async function getTransactions(req,res){

    const userId = req.userId;
    let condition = req.query.condition;
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
