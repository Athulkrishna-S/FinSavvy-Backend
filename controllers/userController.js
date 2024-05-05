async function getTransactions(req,res){

    const userId = req.userId;
    try {
            const result = await userId.getTransactions(userId);

    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ status: 500, error: error.message });
    }
}
