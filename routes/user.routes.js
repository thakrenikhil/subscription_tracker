import { Router } from "express";

const userRouter = Router();

userRouter.get('/',(req,res)=>{
res.json({
    "title":"GET all user"
})
});


userRouter.get('/:id',(req,res)=>{
res.json({
    "title":"GET user"
})
});

userRouter.post('/',(req,res)=>{
res.json({
    "title":"CREATE  user"
})
});

userRouter.put('/:id',(req,res)=>{
res.json({
    "title":"Update  user"
})
});

userRouter.delete('/:id',(req,res)=>{
res.json({
    "title":"DELETE user"
})
});

export default userRouter;