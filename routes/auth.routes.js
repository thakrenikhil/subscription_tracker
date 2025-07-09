import { Router } from "express";

const authRouter = Router();
authRouter.post('/sign-up',(req,res)=>{
res.json({
    "title" : "sign-up"
})
});


authRouter.post('/sign-in',(req,res)=>{
res.json({
    "title" : "sign-in"
})
});

authRouter.post('/sign-out',(req,res)=>{
res.json({
    "title" : "sign-out"
})
});

export default authRouter;