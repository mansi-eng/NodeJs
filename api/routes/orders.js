const express = require('express')

const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"orders data fetched"
    });
})

router.post('/',(req,res,next)=>{
    const order = {
        product : req.body.name
    }
    res.status(201).json({
        message:"orders created",
        orderplaced: order
    });
});



router.get('/:orderid',(req,res,next)=>{
    res.status(200).json({
        message:"details of  order",
        id:req.params.orderid
    });
});

router.delete('/:orderid',(req,res,next)=>{
    res.status(200).json({
        message:"deleted order",
        id:req.params.orderid
    });
});

module.exports =router;
